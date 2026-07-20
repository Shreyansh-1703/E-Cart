package com.ecart.service;

import com.ecart.entity.*;
import com.ecart.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReturnRequestService {

    private final ReturnRequestRepository returnRequestRepository;
    private final OrderRepository         orderRepository;
    private final ProductRepository       productRepository;
    private final UserRepository          userRepository;

    public List<ReturnRequest> getMyReturns(String email) {
        User user = findUser(email);
        return returnRequestRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public ReturnRequest createReturn(String email, Long orderId, Long productId,
                                      String reason, String returnType) {
        User user   = findUser(email);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied: not your order");
        }

        // Find the order item to calculate refund
        OrderItem orderItem = order.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in order"));

        ReturnRequest ret = new ReturnRequest();
        ret.setUser(user);
        ret.setOrder(order);
        ret.setProduct(orderItem.getProduct());
        ret.setQuantity(orderItem.getQuantity());
        ret.setRefundAmount(orderItem.getUnitPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
        ret.setReason(reason);
        ret.setReturnType(returnType != null && returnType.equalsIgnoreCase("REPLACEMENT")
                ? ReturnRequest.ReturnType.REPLACEMENT : ReturnRequest.ReturnType.REFUND);
        ret.setStatus(ReturnRequest.ReturnStatus.REQUESTED);
        ret.setRefundMethod(ReturnRequest.RefundMethod.ORIGINAL_PAYMENT);

        log.info("Return requested for order {} product {} by {}", orderId, productId, email);
        return returnRequestRepository.save(ret);
    }

    /** Admin: update return status */
    @Transactional
    public ReturnRequest updateStatus(Long returnId, String status) {
        ReturnRequest ret = returnRequestRepository.findById(returnId)
                .orElseThrow(() -> new RuntimeException("Return request not found: " + returnId));

        ReturnRequest.ReturnStatus newStatus = ReturnRequest.ReturnStatus.valueOf(status.toUpperCase());
        ret.setStatus(newStatus);

        if (newStatus == ReturnRequest.ReturnStatus.PICKUP_SCHEDULED) {
            ret.setPickupScheduled(true);
            ret.setPickupDate(LocalDateTime.now().plusDays(1));
        }
        return returnRequestRepository.save(ret);
    }

    /** Demo: get return policy for a product */
    public Map<String, Object> getReturnPolicy(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        boolean eligible = product.getStatus() != Product.ProductStatus.INACTIVE;
        return Map.of(
                "returnWindow",    "7 Days",
                "returnType",      "Replacement or Refund",
                "refundMethod",    "Original Payment Method",
                "pickupAvailable", true,
                "noQuestionsAsked", true,
                "eligible",        eligible,
                "productName",     product.getName()
        );
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
