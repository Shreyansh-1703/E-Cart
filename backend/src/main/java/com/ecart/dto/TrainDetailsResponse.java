package com.ecart.dto;

import java.util.List;

public record TrainDetailsResponse(
    String trainName,
    String trainNumber,
    String sourceStation,
    String destinationStation,
    String trainType,
    String runningDays,
    List<RouteStation> route
) {
    public record RouteStation(
        String stationName,
        String stationCode,
        String arrivalTime,
        String departureTime,
        int haltDuration,
        int distance,
        int dayCount
    ) {}
}
