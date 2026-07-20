package com.ecart.controller;

import com.ecart.dto.LoginRequest;
import com.ecart.dto.LoginResponse;
import com.ecart.dto.RegisterRequest;
import com.ecart.entity.User;
import com.ecart.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Authentication endpoints — public (no JWT required).
 * Validation errors and exceptions are handled by GlobalExceptionHandler.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/register
     * Body: { firstName, lastName, email, phone, password }
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest req) {
        User user = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Registration successful",
                "userId",  user.getId(),
                "email",   user.getEmail(),
                "name",    user.getFullName()
        ));
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     * Returns: { token, email, fullName, role, userId }
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        LoginResponse response = authService.login(req);
        return ResponseEntity.ok(response);
    }
}
