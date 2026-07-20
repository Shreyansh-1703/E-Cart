package com.ecart.service;

import com.ecart.entity.*;
import com.ecart.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public Seller getSellerById(Long id) {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller profile not found"));
    }

    public Seller getSellerByEmail(String email) {
        return sellerRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("No seller profile associated with this account"));
    }

    @Transactional
    public Seller registerSeller(Seller seller, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<Seller> existing = sellerRepository.findByUserId(user.getId());
        if (existing.isPresent()) {
            throw new RuntimeException("A seller registration already exists for this account");
        }

        seller.setUser(user);
        seller.setApproved(false);
        return sellerRepository.save(seller);
    }

    public List<Seller> getPendingSellers() {
        return sellerRepository.findByIsApprovedFalse();
    }

    public List<Seller> getApprovedSellers() {
        return sellerRepository.findByIsApprovedTrue();
    }

    @Transactional
    public void approveSeller(Long sellerId) {
        Seller seller = getSellerById(sellerId);
        seller.setApproved(true);
        sellerRepository.save(seller);

        User user = seller.getUser();
        user.setRole(User.Role.SELLER);
        userRepository.save(user);
    }

    @Transactional
    public void rejectSeller(Long sellerId) {
        Seller seller = getSellerById(sellerId);
        sellerRepository.delete(seller);
    }

    public Map<String, Object> getSellerDashboardStats(String email) {
        Seller seller = getSellerByEmail(email);

        // Fetch products
        List<Product> products = productRepository.findBySellerId(seller.getId());
        int totalProducts = products.size();

        int totalInventory = products.stream()
                .mapToInt(Product::getStock)
                .sum();

        // Fetch order items containing this seller's products
        List<Order> allOrders = orderRepository.findAll();
        int totalOrdersCount = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        List<Map<String, Object>> recentOrdersList = new ArrayList<>();

        for (Order order : allOrders) {
            boolean hasSellerProduct = false;
            BigDecimal sellerOrderTotal = BigDecimal.ZERO;
            int sellerItemCount = 0;

            for (OrderItem item : order.getItems()) {
                if (item.getProduct().getSeller() != null && item.getProduct().getSeller().getId().equals(seller.getId())) {
                    hasSellerProduct = true;
                    sellerItemCount += item.getQuantity();
                    sellerOrderTotal = sellerOrderTotal.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                }
            }

            if (hasSellerProduct) {
                totalOrdersCount++;
                if (order.getPaymentStatus() == Order.PaymentStatus.SUCCESS || order.getStatus() != Order.OrderStatus.CANCELLED) {
                    totalRevenue = totalRevenue.add(sellerOrderTotal);
                }

                recentOrdersList.add(Map.of(
                    "id", order.getId(),
                    "orderNumber", order.getOrderNumber(),
                    "customerName", order.getUser().getFullName(),
                    "date", order.getCreatedAt(),
                    "status", order.getStatus().toString(),
                    "itemCount", sellerItemCount,
                    "sellerAmount", sellerOrderTotal
                ));
            }
        }

        // Mock monthly sales trends for analytics chart (last 6 months)
        List<Map<String, Object>> monthlySales = Arrays.asList(
            Map.of("month", "Jan", "sales", totalRevenue.multiply(BigDecimal.valueOf(0.12)).setScale(0, java.math.RoundingMode.HALF_UP)),
            Map.of("month", "Feb", "sales", totalRevenue.multiply(BigDecimal.valueOf(0.15)).setScale(0, java.math.RoundingMode.HALF_UP)),
            Map.of("month", "Mar", "sales", totalRevenue.multiply(BigDecimal.valueOf(0.18)).setScale(0, java.math.RoundingMode.HALF_UP)),
            Map.of("month", "Apr", "sales", totalRevenue.multiply(BigDecimal.valueOf(0.22)).setScale(0, java.math.RoundingMode.HALF_UP)),
            Map.of("month", "May", "sales", totalRevenue.multiply(BigDecimal.valueOf(0.15)).setScale(0, java.math.RoundingMode.HALF_UP)),
            Map.of("month", "Jun", "sales", totalRevenue.multiply(BigDecimal.valueOf(0.18)).setScale(0, java.math.RoundingMode.HALF_UP))
        );

        Map<String, Object> stats = new HashMap<>();
        stats.put("businessName", seller.getBusinessName());
        stats.put("ownerName", seller.getOwnerName());
        stats.put("totalProducts", totalProducts);
        stats.put("totalInventory", totalInventory);
        stats.put("totalOrders", totalOrdersCount);
        stats.put("revenue", totalRevenue);
        stats.put("recentOrders", recentOrdersList);
        stats.put("monthlySales", monthlySales);

        return stats;
    }
}
