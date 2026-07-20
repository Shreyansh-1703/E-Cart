package com.ecart.service;

import com.ecart.dto.OrderRequest;
import com.ecart.entity.*;
import com.ecart.repository.OrderRepository;
import com.ecart.repository.ProductRepository;
import com.ecart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order business logic.
 *
 * Stock reduction is done inside a @Transactional method so any failure
 * rolls back the entire order — preventing partial stock deductions.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository   orderRepository;
    private final UserRepository    userRepository;
    private final ProductRepository productRepository;
    private final CartService       cartService;

    /** Customer's own orders */
    public List<Order> getOrdersByEmail(String email) {
        User user = findUser(email);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    /** All orders — paginated (admin) */
    public Page<Order> getAllOrdersPaged(int page, int size) {
        return orderRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    /** Single order by ID */
    public Order getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Order ID cannot be null");
        }
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    /**
     * Place a new order.
     * Wrapped in @Transactional — stock deductions roll back on any failure.
     */
    @Transactional
    public Order placeOrder(String email, OrderRequest req) {
        User user = findUser(email);

        Order order = new Order();
        order.setUser(user);
        order.setAddressLine(req.addressLine());
        order.setCity(req.city());
        order.setState(req.state());
        order.setPincode(req.pincode());
        order.setEstimatedDelivery(LocalDateTime.now().plusDays(5));

        order.setPaymentMethod(parsePaymentMethod(req.paymentMethod()));

        // Fast delivery: check if ALL items support it
        boolean requestedFast = req.fastDelivery();
        boolean allFastEligible = true;

        BigDecimal total = BigDecimal.ZERO;
        BigDecimal fastDeliveryExtra = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : req.items()) {
            if (itemReq.quantity() == null || itemReq.quantity() < 1) {
                throw new IllegalArgumentException("Invalid quantity for product: " + itemReq.productId());
            }

            // Lock the product row to prevent race conditions on concurrent orders
            Product product = productRepository.findByIdWithLock(itemReq.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.productId()));

            if (product.getStatus() == Product.ProductStatus.OUT_OF_STOCK
                    || product.getStock() < itemReq.quantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for: " + product.getName()
                        + " (available: " + product.getStock() + ")");
            }

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(product);
            oi.setQuantity(itemReq.quantity());
            oi.setUnitPrice(product.getPrice());
            order.getItems().add(oi);

            // Track fast delivery eligibility
            if (!product.isFastDeliveryAvailable()) allFastEligible = false;
            if (requestedFast && product.isFastDeliveryAvailable()
                    && product.getFastDeliveryCharge() != null) {
                fastDeliveryExtra = fastDeliveryExtra.add(product.getFastDeliveryCharge());
            }

            // Deduct stock
            int newStock = product.getStock() - itemReq.quantity();
            product.setStock(newStock);
            if (newStock == 0) product.setStatus(Product.ProductStatus.OUT_OF_STOCK);
            productRepository.save(product);

            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }

        order.setTotalAmount(total.add(fastDeliveryExtra));

        // Tag fast delivery on the order notes field if applicable
        if (requestedFast && allFastEligible) {
            order.setDeliveryNote("⚡ Fast Delivery — arrives in 6 hours");
            log.info("Fast delivery requested and confirmed for order by {}", email);
        } else if (requestedFast) {
            order.setDeliveryNote("Standard delivery (some items not eligible for fast delivery)");
        }

        Order saved = orderRepository.save(order);

        // Clear cart after successful order
        try {
            cartService.clearCart(email);
        } catch (Exception e) {
            log.warn("Could not clear cart for {} after order {}", email, saved.getOrderNumber());
        }

        return saved;
    }

    /** Admin: update order status */
    @Transactional
    public Order updateStatus(Long id, String status) {
        Order order = getById(id);
        try {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status
                    + ". Valid values: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED");
        }
        return orderRepository.save(order);
    }

    /** Customer: cancel their own PENDING order */
    @Transactional
    public Order cancelOrder(Long id, String email) {
        Order order = getById(id);

        if (!order.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("You can only cancel your own orders");
        }
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only PENDING orders can be cancelled (current: " + order.getStatus() + ")");
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            Product p = item.getProduct();
            p.setStock(p.getStock() + item.getQuantity());
            if (p.getStatus() == Product.ProductStatus.OUT_OF_STOCK) {
                p.setStatus(Product.ProductStatus.ACTIVE);
            }
            productRepository.save(p);
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        log.info("Order {} cancelled by {}", order.getOrderNumber(), email);
        return orderRepository.save(order);
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    private Order.PaymentMethod parsePaymentMethod(String raw) {
        if (raw == null || raw.isBlank()) return Order.PaymentMethod.CARD;
        try {
            return Order.PaymentMethod.valueOf(raw.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Order.PaymentMethod.CARD;
        }
    }
}
