package com.ecart.controller;

import com.ecart.dto.CartRequest;
import com.ecart.entity.Cart;
import com.ecart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /**
     * GET /api/cart
     * Returns current user's cart with all items + totals
     */
    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getCartByEmail(user.getUsername()));
    }

    /**
     * POST /api/cart
     * Body: { productId, quantity }
     * Adds item (or increments existing)
     */
    @PostMapping
    public ResponseEntity<Cart> addItem(@AuthenticationPrincipal UserDetails user,
                                         @Valid @RequestBody CartRequest req) {
        return ResponseEntity.ok(cartService.addItem(user.getUsername(), req));
    }

    /**
     * PUT /api/cart/{itemId}
     * Body: { quantity }  — set quantity to 0 to remove
     */
    @PutMapping("/{itemId}")
    public ResponseEntity<Cart> updateItem(@AuthenticationPrincipal UserDetails user,
                                            @PathVariable Long itemId,
                                            @RequestBody Map<String, Integer> body) {
        int qty = body.getOrDefault("quantity", 0);
        return ResponseEntity.ok(cartService.updateQuantity(user.getUsername(), itemId, qty));
    }

    /**
     * DELETE /api/cart/{itemId}
     * Removes a specific item from the cart
     */
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Cart> removeItem(@AuthenticationPrincipal UserDetails user,
                                            @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(user.getUsername(), itemId));
    }

    /**
     * DELETE /api/cart
     * Clears the entire cart
     */
    @DeleteMapping
    public ResponseEntity<Map<String, String>> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}
