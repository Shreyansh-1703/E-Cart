package com.ecart.controller;

import com.ecart.dto.OrderRequest;
import com.ecart.entity.Order;
import com.ecart.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Order management endpoints.
 * Exceptions bubble up to GlobalExceptionHandler.
 */
@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * GET /api/orders?page=0&size=10
     * Customer → their own orders (paginated)
     * Admin + ?all=true → all orders
     */
    @GetMapping
    public ResponseEntity<?> getOrders(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "false") boolean all,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (all && isAdmin) {
            Page<Order> result = orderService.getAllOrdersPaged(page, size);
            return ResponseEntity.ok(Map.of(
                    "orders",      result.getContent(),
                    "totalItems",  result.getTotalElements(),
                    "totalPages",  result.getTotalPages(),
                    "currentPage", result.getNumber()
            ));
        }

        return ResponseEntity.ok(orderService.getOrdersByEmail(user.getUsername()));
    }

    /**
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id,
                                      @AuthenticationPrincipal UserDetails user) {
        Order order = orderService.getById(id);
        
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        if (!isAdmin && !order.getUser().getEmail().equals(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied: this is not your order"));
        }
        
        return ResponseEntity.ok(order);
    }

    /**
     * POST /api/orders — place a new order
     */
    @PostMapping
    public ResponseEntity<Order> placeOrder(@AuthenticationPrincipal UserDetails user,
                                             @Valid @RequestBody OrderRequest req) {
        Order order = orderService.placeOrder(user.getUsername(), req);
        log.info("Order placed: {} by {}", order.getOrderNumber(), user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    /**
     * PUT /api/orders/{id}/status — ADMIN only
     * Body: { "status": "SHIPPED" }
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> body) {
        Order updated = orderService.updateStatus(id, body.get("status"));
        log.info("Order {} status updated to {}", id, body.get("status"));
        return ResponseEntity.ok(updated);
    }

    /**
     * PUT /api/orders/{id}/cancel — Customer cancels their own order
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long id,
                                              @AuthenticationPrincipal UserDetails user) {
        Order cancelled = orderService.cancelOrder(id, user.getUsername());
        return ResponseEntity.ok(cancelled);
    }
}
