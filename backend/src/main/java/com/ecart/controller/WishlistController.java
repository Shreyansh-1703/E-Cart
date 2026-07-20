package com.ecart.controller;

import com.ecart.entity.Wishlist;
import com.ecart.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    /** GET /api/wishlist — get all wishlist items */
    @GetMapping
    public ResponseEntity<List<Wishlist>> getWishlist(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(wishlistService.getWishlist(user.getUsername()));
    }

    /** POST /api/wishlist/{productId} — add product */
    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> add(@AuthenticationPrincipal UserDetails user,
                                                    @PathVariable Long productId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(user.getUsername(), productId));
    }

    /** DELETE /api/wishlist/{productId} — remove product */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, String>> remove(@AuthenticationPrincipal UserDetails user,
                                                       @PathVariable Long productId) {
        wishlistService.removeFromWishlist(user.getUsername(), productId);
        return ResponseEntity.ok(Map.of("message", "Removed from wishlist"));
    }

    /** GET /api/wishlist/count */
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> count(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(Map.of("count", wishlistService.getCount(user.getUsername())));
    }

    /** GET /api/wishlist/check/{productId} */
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> check(@AuthenticationPrincipal UserDetails user,
                                                       @PathVariable Long productId) {
        return ResponseEntity.ok(Map.of("inWishlist",
                wishlistService.isInWishlist(user.getUsername(), productId)));
    }
}
