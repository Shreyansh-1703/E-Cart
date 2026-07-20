package com.ecart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request body for POST /api/railway/deliver
 */
public record RailwayDeliveryRequest(
    @NotBlank(message = "Order number is required")
    String orderNumber,

    @NotBlank(message = "Train number is required")
    String trainNumber,

    @NotBlank(message = "PNR number is required")
    @Pattern(regexp = "\\d{10}", message = "PNR must be exactly 10 digits")
    String pnrNumber,

    @NotBlank(message = "Station code is required")
    String stationCode
) {}
