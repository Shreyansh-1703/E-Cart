package com.ecart.controller;

import com.ecart.entity.Vendor;
import com.ecart.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    public ResponseEntity<List<Vendor>> getVendors(@RequestParam(required = false) String category) {
        if (category != null) {
            return ResponseEntity.ok(vendorService.getVendorsByCategory(category));
        }
        return ResponseEntity.ok(vendorService.getAllApprovedVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendor(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @PostMapping("/register")
    public ResponseEntity<Vendor> register(@RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.registerVendor(vendor));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Vendor>> getPending() {
        return ResponseEntity.ok(vendorService.getPendingApplications());
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> approve(@PathVariable Long id) {
        vendorService.approveVendor(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> reject(@PathVariable Long id) {
        vendorService.rejectVendor(id);
        return ResponseEntity.ok().build();
    }
}
