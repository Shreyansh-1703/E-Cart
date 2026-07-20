package com.ecart.dto;

public record LoginResponse(
    String token,
    String email,
    String fullName,
    String role,
    Long userId
) {}
