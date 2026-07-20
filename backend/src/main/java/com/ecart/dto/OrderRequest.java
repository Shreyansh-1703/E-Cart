package com.ecart.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderRequest(
    @NotBlank(message = "Address line is required") String addressLine,
    @NotBlank(message = "City is required")         String city,
    @NotBlank(message = "State is required")        String state,
    @NotBlank(message = "Pincode is required")      String pincode,
    String paymentMethod,

    /** If true, request 6-hour fast delivery (only honoured for eligible products) */
    boolean fastDelivery,

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    List<OrderItemRequest> items
) {
    public record OrderItemRequest(
        @NotNull(message = "Product ID is required") Long productId,
        @Min(value = 1, message = "Quantity must be at least 1") Integer quantity
    ) {}
}
