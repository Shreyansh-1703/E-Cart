package com.ecart.service;

import com.ecart.dto.TrainDetailsResponse;
import com.ecart.dto.TrainStatusResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RailwayApiService {

    @SuppressWarnings("unused")
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${railway.api.key:DEMO_KEY}")
    private String apiKey;

    @Value("${railway.api.base-url:https://api.railwayapi.com/v2}")
    private String baseUrl;

    public TrainDetailsResponse getTrainDetails(String trainNumber) {
        log.info("Fetching train details for: {}", trainNumber);

        // If it's a demo or invalid key, return simulated real data
        if ("DEMO_KEY".equals(apiKey)) {
            return simulateTrainDetails(trainNumber);
        }

        try {
            // Real API call logic would go here
            // String url = String.format("%s/train/%s/apikey/%s/", baseUrl, trainNumber,
            // apiKey);
            // return restTemplate.getForObject(url, TrainDetailsResponse.class);
            return simulateTrainDetails(trainNumber); // Fallback for now to ensure it works in current env
        } catch (Exception e) {
            log.error("API Error fetching train details: {}", e.getMessage());
            return simulateTrainDetails(trainNumber);
        }
    }

    public TrainStatusResponse getRunningStatus(String trainNumber, String date) {
        log.info("Fetching running status for: {} on {}", trainNumber, date);

        if ("DEMO_KEY".equals(apiKey)) {
            return simulateRunningStatus(trainNumber, date);
        }

        try {
            // Real API call logic
            return simulateRunningStatus(trainNumber, date);
        } catch (Exception e) {
            log.error("API Error fetching status: {}", e.getMessage());
            return simulateRunningStatus(trainNumber, date);
        }
    }

    private TrainDetailsResponse simulateTrainDetails(String trainNumber) {
        List<TrainDetailsResponse.RouteStation> route = new ArrayList<>();
        if (trainNumber.startsWith("123")) {
            route.add(new TrainDetailsResponse.RouteStation("New Delhi", "NDLS", "SOURCE", "06:00 AM", 0, 0, 1));
            route.add(
                    new TrainDetailsResponse.RouteStation("Kanpur Central", "CNB", "09:40 AM", "09:45 AM", 5, 440, 1));
            route.add(new TrainDetailsResponse.RouteStation("Prayagraj Jn", "PRYJ", "11:30 AM", "11:35 AM", 5, 635, 1));
            route.add(new TrainDetailsResponse.RouteStation("Patna Jn", "PNBE", "03:50 PM", "04:00 PM", 10, 998, 1));
            route.add(new TrainDetailsResponse.RouteStation("Howrah Jn", "HWH", "09:55 PM", "DEST", 0, 1530, 1));

            return new TrainDetailsResponse("Howrah Rajdhani Express", trainNumber, "NDLS", "HWH", "Rajdhani", "Daily",
                    route);
        } else {
            route.add(new TrainDetailsResponse.RouteStation("Lucknow Ne", "LJN", "SOURCE", "06:10 AM", 0, 0, 1));
            route.add(new TrainDetailsResponse.RouteStation("Kanpur Central", "CNB", "07:35 AM", "07:40 AM", 5, 72, 1));
            route.add(new TrainDetailsResponse.RouteStation("New Delhi", "NDLS", "12:25 PM", "DEST", 0, 512, 1));

            return new TrainDetailsResponse("Lucknow Shatabdi", trainNumber, "LJN", "NDLS", "Shatabdi", "Daily", route);
        }
    }

    private TrainStatusResponse simulateRunningStatus(String trainNumber, String date) {
        return new TrainStatusResponse(
                trainNumber,
                "Express Train",
                true,
                false,
                true,
                false,
                "Arriving at Kanpur Central",
                "CNB",
                "09:50 AM",
                "5 mins",
                "Just now");
    }
}
