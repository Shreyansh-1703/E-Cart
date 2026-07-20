package com.ecart.controller;

import com.ecart.entity.VendorBooking;
import com.ecart.service.VendorBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor-bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VendorBookingController {

    private final VendorBookingService bookingService;

    @PostMapping
    public ResponseEntity<VendorBooking> create(@RequestBody VendorBooking booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VendorBooking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<VendorBooking>> getVendorBookings(@PathVariable Long vendorId) {
        return ResponseEntity.ok(bookingService.getVendorBookings(vendorId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
