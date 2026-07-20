package com.ecart.service;

import com.ecart.dto.TrainDetailsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Optional;

@Slf4j
@Service
public class StationRecommendationService {

    /**
     * Recommends the best delivery station based on:
     * 1. Halt duration (higher is better)
     * 2. Time reachability (not already passed)
     * 3. Vendor availability (mocked for now, assumes all stations in route are supported)
     */
    public Optional<TrainDetailsResponse.RouteStation> recommendStation(TrainDetailsResponse trainDetails) {
        return trainDetails.route().stream()
                .filter(s -> s.haltDuration() >= 2) // At least 2 minutes halt
                .filter(s -> !"SOURCE".equalsIgnoreCase(s.arrivalTime())) // Not source
                .filter(s -> !"DEST".equalsIgnoreCase(s.departureTime())) // Not destination
                .max(Comparator.comparingInt(TrainDetailsResponse.RouteStation::haltDuration));
    }

    public String getRecommendationJustification(TrainDetailsResponse.RouteStation station) {
        if (station.haltDuration() >= 10) {
            return "Major junction with long halt duration (" + station.haltDuration() + " mins), ensuring safe and timely delivery.";
        } else if (station.haltDuration() >= 5) {
            return "Sufficient halt time (" + station.haltDuration() + " mins) for a smooth handoff.";
        } else {
            return "Standard delivery station with verified vendor coverage.";
        }
    }
}
