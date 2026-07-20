package com.ecart.controller;

import com.ecart.entity.ReturnRequest;
import com.ecart.service.ReturnRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnRequestService returnRequestService;

    /** GET /api/returns — customer's returns */
    @GetMapping
    public ResponseEntity<List<ReturnRequest>> getMyReturns(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(returnRequestService.getMyReturns(user.getUsername()));
    }

    /** POST /api/returns — initiate a return */
    @PostMapping
    public ResponseEntity<ReturnRequest> createReturn(@AuthenticationPrincipal UserDetails user,
                                                       @RequestBody Map<String, Object> body) {
        Long orderId   = Long.valueOf(body.get("orderId").toString());
        Long productId = Long.valueOf(body.get("productId").toString());
        String reason  = body.getOrDefault("reason", "No reason provided").toString();
        String type    = body.getOrDefault("returnType", "REFUND").toString();

        ReturnRequest ret = returnRequestService.createReturn(
                user.getUsername(), orderId, productId, reason, type);
        return ResponseEntity.status(HttpStatus.CREATED).body(ret);
    }

    /** GET /api/returns/policy/{productId} */
    @GetMapping("/policy/{productId}")
    public ResponseEntity<Map<String, Object>> getPolicy(@PathVariable Long productId) {
        return ResponseEntity.ok(returnRequestService.getReturnPolicy(productId));
    }

    /** PUT /api/returns/{id}/status — ADMIN only */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReturnRequest> updateStatus(@PathVariable Long id,
                                                       @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(returnRequestService.updateStatus(id, body.get("status")));
    }

    /** GET /api/delivery/pin/{pincode} — delivery estimate by PIN code */
    @GetMapping("/delivery/pin/{pincode}")
    public ResponseEntity<Map<String, Object>> checkDelivery(@PathVariable String pincode) {
        // Demo logic: PIN codes 1xxxxx-8xxxxx are serviceable
        boolean valid = pincode.matches("\\d{6}") && pincode.charAt(0) != '9';
        if (!valid) {
            return ResponseEntity.ok(Map.of("available", false, "pincode", pincode,
                    "message", "Delivery not available to this PIN code"));
        }
        return ResponseEntity.ok(Map.of(
                "available",        true,
                "pincode",          pincode,
                "standardDelivery", "4-5 Business Days",
                "standardFee",      "FREE",
                "expressDelivery",  "Tomorrow",
                "expressFee",       "₹200",
                "primeDelivery",    "Today by 10 PM",
                "primeFee",         "FREE",
                "codAvailable",     true,
                "returnEligible",   true
        ));
    }
}
