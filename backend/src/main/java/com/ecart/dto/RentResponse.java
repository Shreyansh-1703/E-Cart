package com.ecart.dto;

import java.math.BigDecimal;

public record RentResponse(
    Long productId,
    String product,
    String category,
    int days,
    BigDecimal rentPricePerDay,
    BigDecimal totalRent,
    String status,
    String message,
    String rentalId
) {}
