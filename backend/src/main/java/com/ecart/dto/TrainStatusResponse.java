package com.ecart.dto;

public record TrainStatusResponse(
    String trainNumber,
    String trainName,
    boolean isRunning,
    boolean isCancelled,
    boolean isDelayed,
    boolean isDiverted,
    String currentPosition,
    String nextStation,
    String eta,
    String delayMinutes,
    String lastUpdated
) {}
