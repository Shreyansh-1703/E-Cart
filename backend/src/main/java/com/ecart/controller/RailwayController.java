package com.ecart.controller;

import com.ecart.dto.RailwayDeliveryRequest;
import com.ecart.entity.RailwayDelivery;
import com.ecart.service.RailwayDeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Railway delivery endpoints.
 *
 * GET  /api/railway/trains              — list all supported trains (public)
 * GET  /api/railway/route/{trainNumber} — get station list for a train (public)
 * POST /api/railway/deliver             — initiate railway delivery (auth)
 * POST /api/railway/verify-otp          — verify OTP (auth)
 * GET  /api/railway/my-deliveries       — user's railway deliveries (auth)
 */
@Slf4j
@RestController
@RequestMapping("/api/railway")
@RequiredArgsConstructor
public class RailwayController {

    private final RailwayDeliveryService railwayService;

    /** List all supported trains */
    @GetMapping("/trains")
    public ResponseEntity<List<Map<String, String>>> getTrains() {
        return ResponseEntity.ok(railwayService.getAllTrains());
    }

    /** Get comprehensive train details and route */
    @GetMapping("/details/{trainNumber}")
    public ResponseEntity<com.ecart.dto.TrainDetailsResponse> getTrainDetails(@PathVariable String trainNumber) {
        return ResponseEntity.ok(railwayService.getTrainDetails(trainNumber));
    }

    /** Get real-time running status */
    @GetMapping("/status/{trainNumber}")
    public ResponseEntity<com.ecart.dto.TrainStatusResponse> getTrainStatus(
            @PathVariable String trainNumber,
            @RequestParam(defaultValue = "TODAY") String date) {
        return ResponseEntity.ok(railwayService.getTrainStatus(trainNumber, date));
    }

    /** Get recommended delivery station */
    @GetMapping("/recommend/{trainNumber}")
    public ResponseEntity<Map<String, Object>> getRecommendation(@PathVariable String trainNumber) {
        return ResponseEntity.ok(railwayService.getRecommendedStation(trainNumber));
    }

    /** Get route (legacy support) */
    @GetMapping("/route/{trainNumber}")
    public ResponseEntity<List<com.ecart.dto.TrainDetailsResponse.RouteStation>> getRoute(@PathVariable String trainNumber) {
        return ResponseEntity.ok(railwayService.getTrainDetails(trainNumber).route());
    }

    /**
     * Initiate railway delivery for an existing order.
     * Body: { orderNumber, trainNumber, pnrNumber, stationCode }
     */
    @PostMapping("/deliver")
    public ResponseEntity<RailwayDelivery> initiateDelivery(
            @Valid @RequestBody RailwayDeliveryRequest req,
            @AuthenticationPrincipal UserDetails user) {
        RailwayDelivery delivery = railwayService.initiateDelivery(req, user.getUsername());
        log.info("Railway delivery initiated: order={} station={} by {}",
                req.orderNumber(), req.stationCode(), user.getUsername());
        return ResponseEntity.ok(delivery);
    }

    /**
     * Verify OTP for railway delivery.
     * Body: { deliveryId, otp }
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<RailwayDelivery> verifyOtp(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails user) {
        Long deliveryId = Long.parseLong(body.get("deliveryId"));
        String otp      = body.get("otp");
        return ResponseEntity.ok(railwayService.verifyOtp(deliveryId, otp));
    }

    /** Get all railway deliveries for the logged-in user */
    @GetMapping("/my-deliveries")
    public ResponseEntity<List<RailwayDelivery>> myDeliveries(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(railwayService.getMyDeliveries(user.getUsername()));
    }
}
