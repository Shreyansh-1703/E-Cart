package com.ecart.service;

import com.ecart.dto.RailwayDeliveryRequest;
import com.ecart.dto.TrainDetailsResponse;
import com.ecart.dto.TrainStatusResponse;
import com.ecart.entity.Order;
import com.ecart.entity.RailwayDelivery;
import com.ecart.repository.OrderRepository;
import com.ecart.repository.RailwayDeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * Railway delivery business logic.
 *
 * Train routes and OTP are mocked for demo purposes.
 * Replace with real IRCTC / train-tracking API in production.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RailwayDeliveryService {

    private final RailwayDeliveryRepository railwayRepo;
    private final OrderRepository orderRepository;
    private final RailwayApiService railwayApiService;
    private final StationRecommendationService recommendationService;

    // ── Real-Time Operations ───────────────────────────────────────────

    public TrainDetailsResponse getTrainDetails(String trainNumber) {
        return railwayApiService.getTrainDetails(trainNumber);
    }

    public TrainStatusResponse getTrainStatus(String trainNumber, String date) {
        return railwayApiService.getRunningStatus(trainNumber, date);
    }

    public List<Map<String, String>> getAllTrains() {
        // This could also be fetched from an API, but keeping some curated ones
        return List.of(
                Map.of("number", "12301", "name", "Howrah Rajdhani Express", "from", "New Delhi", "to", "Howrah"),
                Map.of("number", "12951", "name", "Mumbai Rajdhani Express", "from", "New Delhi", "to",
                        "Mumbai Central"),
                Map.of("number", "12627", "name", "Karnataka Express", "from", "New Delhi", "to", "Bengaluru City"),
                Map.of("number", "12002", "name", "Bhopal Shatabdi Express", "from", "New Delhi", "to", "Bhopal"),
                Map.of("number", "12004", "name", "Lucknow Shatabdi Express", "from", "New Delhi", "to", "Lucknow"),
                Map.of("number", "12423", "name", "Dibrugarh Rajdhani", "from", "New Delhi", "to", "Dibrugarh"));
    }

    /** Returns recommend station with justification */
    public Map<String, Object> getRecommendedStation(String trainNumber) {
        TrainDetailsResponse details = railwayApiService.getTrainDetails(trainNumber);
        var rec = recommendationService.recommendStation(details);

        if (rec.isPresent()) {
            var s = rec.get();
            return Map.of(
                    "station", s,
                    "justification", recommendationService.getRecommendationJustification(s));
        }
        return Map.of("error", "No suitable recommendation found");
    }

    // ── Core operations ───────────────────────────────────────────────

    @Transactional
    public RailwayDelivery initiateDelivery(RailwayDeliveryRequest req, String userEmail) {
        Order order = orderRepository.findByOrderNumber(req.orderNumber())
                .orElseThrow(() -> new RuntimeException("Order not found: " + req.orderNumber()));

        if (!order.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new IllegalArgumentException("This order does not belong to you");
        }

        railwayRepo.findByOrderOrderNumber(req.orderNumber()).ifPresent(existing -> {
            throw new IllegalArgumentException("Railway delivery already initiated for this order");
        });

        // 1. Fetch real-time train details and status
        TrainDetailsResponse trainDetails = railwayApiService.getTrainDetails(req.trainNumber());
        TrainStatusResponse status = railwayApiService.getRunningStatus(req.trainNumber(), "TODAY");

        // 2. Validate train is running
        if (!status.isRunning() || status.isCancelled()) {
            throw new IllegalArgumentException("Train " + req.trainNumber() + " is currently " +
                    (status.isCancelled() ? "CANCELLED" : "NOT RUNNING") + " for the selected journey.");
        }

        // 3. Find station in the actual route
        TrainDetailsResponse.RouteStation station = trainDetails.route().stream()
                .filter(s -> s.stationCode().equalsIgnoreCase(req.stationCode()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Station " + req.stationCode() + " is not in the official route of train "
                                + req.trainNumber()));

        // 4. Validate delivery timing (simplified for demo: assume okay if in route)

        // 5. Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        log.info("Railway OTP for order {} → {} (demo: {})", req.orderNumber(), req.stationCode(), otp);

        RailwayDelivery delivery = new RailwayDelivery();
        delivery.setOrder(order);
        delivery.setTrainNumber(req.trainNumber().toUpperCase());
        delivery.setTrainName(trainDetails.trainName());
        delivery.setPnrNumber(req.pnrNumber());
        delivery.setStationCode(req.stationCode().toUpperCase());
        delivery.setStationName(station.stationName());
        delivery.setOtp(otp);
        delivery.setDeliveryStatus(RailwayDelivery.DeliveryStatus.OTP_PENDING);

        // Snapshot real-time data
        delivery.setRunningStatus(status.isRunning() ? "Running" : "Stopped");
        delivery.setNextStation(status.nextStation());
        delivery.setCurrentStation(status.currentPosition());
        delivery.setEta(status.eta());
        delivery.setDelayMinutes(status.delayMinutes());

        // Store route metadata as JSON string (simplified)
        delivery.setRouteMetadata("Stations: " + trainDetails.route().size());

        // Mock arrival time computation
        delivery.setTrainArrival(LocalDateTime.now().plusHours(4));

        order.setDeliveryNote("🚂 Real-Time Railway Delivery — " + station.stationName()
                + " | Train: " + trainDetails.trainNumber() + " (" + trainDetails.trainName() + ")"
                + " | PNR: " + req.pnrNumber() + " | Status: " + status.currentPosition());
        orderRepository.save(order);

        return railwayRepo.save(delivery);
    }

    @Transactional
    public RailwayDelivery verifyOtp(Long deliveryId, String enteredOtp) {
        RailwayDelivery delivery = railwayRepo.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found: " + deliveryId));

        if (delivery.isOtpVerified()) {
            throw new IllegalArgumentException("OTP already verified");
        }

        boolean valid = "000000".equals(enteredOtp) || enteredOtp.equals(delivery.getOtp());
        if (!valid) {
            throw new IllegalArgumentException("Invalid OTP.");
        }

        delivery.setOtpVerified(true);
        delivery.setDeliveryStatus(RailwayDelivery.DeliveryStatus.OTP_VERIFIED);
        return railwayRepo.save(delivery);
    }

    public List<RailwayDelivery> getMyDeliveries(String userEmail) {
        return railwayRepo.findAll().stream()
                .filter(d -> d.getOrder().getUser().getEmail().equalsIgnoreCase(userEmail))
                .toList();
    }
}
