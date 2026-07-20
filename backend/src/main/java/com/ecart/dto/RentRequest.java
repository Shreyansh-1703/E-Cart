package com.ecart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RentRequest(
    @NotNull(message = "Number of days is required")
    @Min(value = 1, message = "Minimum rental period is 1 day")
    Integer days
) {}
