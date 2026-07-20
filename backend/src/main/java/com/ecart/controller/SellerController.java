package com.ecart.controller;

import com.ecart.entity.Seller;
import com.ecart.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SellerController {

    private final SellerService sellerService;

    @PostMapping("/register")
    public ResponseEntity<Seller> register(@RequestBody Seller seller,
                                           @AuthenticationPrincipal UserDetails occupant) {
        return ResponseEntity.ok(sellerService.registerSeller(seller, occupant.getUsername()));
    }

    @GetMapping("/me")
    public ResponseEntity<Seller> getMyProfile(@AuthenticationPrincipal UserDetails occupant) {
        return ResponseEntity.ok(sellerService.getSellerByEmail(occupant.getUsername()));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getMyStats(@AuthenticationPrincipal UserDetails occupant) {
        return ResponseEntity.ok(sellerService.getSellerDashboardStats(occupant.getUsername()));
    }

    // ── Admin Endpoints ──────────────────────────────────────────────
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Seller>> getPending() {
        return ResponseEntity.ok(sellerService.getPendingSellers());
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        sellerService.approveSeller(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> reject(@PathVariable Long id) {
        sellerService.rejectSeller(id);
        return ResponseEntity.ok().build();
    }
}
