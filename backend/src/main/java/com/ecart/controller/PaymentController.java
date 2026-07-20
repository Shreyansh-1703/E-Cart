package com.ecart.controller;

import com.ecart.entity.Order;
import com.ecart.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    @Value("${razorpay.key.id:rzp_test_TDktDNxSZR3gZC}")
    private String keyId;

    @Value("${razorpay.key.secret:kRf471U8R6DZ46vvc430Hv4l}")
    private String keySecret;

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            Long orderId = Long.parseLong(data.get("orderId").toString());
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            org.json.JSONObject orderRequest = new org.json.JSONObject();
            orderRequest.put("amount", order.getTotalAmount().multiply(new BigDecimal("100")).intValue());
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + orderId);

            com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("paymentOrderId", razorpayOrder.get("id"));
            response.put("amount", razorpayOrder.get("amount"));
            response.put("currency", razorpayOrder.get("currency"));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", e.getMessage(),
                            "type",  e.getClass().getName()
                    )
            );
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            String razorpayOrderId = data.get("razorpay_order_id");
            String razorpayPaymentId = data.get("razorpay_payment_id");
            String razorpaySignature = data.get("razorpay_signature");
            Long appOrderId = Long.parseLong(data.get("app_order_id"));

            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            boolean isValid = Utils.verifySignature(payload, razorpaySignature, keySecret);

            Order order = orderRepository.findById(appOrderId).orElseThrow(() -> new RuntimeException("Order not found"));

            if (isValid) {
                order.setPaymentId(razorpayPaymentId);
                order.setPaymentStatus(Order.PaymentStatus.SUCCESS);
                order.setPaymentMethod(Order.PaymentMethod.RAZORPAY);
                order.setStatus(Order.OrderStatus.PROCESSING);
                orderRepository.save(order);
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully", "orderId", order.getId()));
            } else {
                order.setPaymentStatus(Order.PaymentStatus.FAILED);
                orderRepository.save(order);
                return ResponseEntity.badRequest().body(Map.of("status", "failed", "message", "Invalid signature"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(
                    Map.of(
                            "error", e.getMessage(),
                            "type",  e.getClass().getName()
                    )
            );
        }
    }
}
