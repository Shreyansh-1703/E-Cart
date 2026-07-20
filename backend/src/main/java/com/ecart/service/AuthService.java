package com.ecart.service;

import com.ecart.dto.LoginRequest;
import com.ecart.dto.LoginResponse;
import com.ecart.dto.RegisterRequest;
import com.ecart.entity.Cart;
import com.ecart.entity.User;
import com.ecart.repository.CartRepository;
import com.ecart.repository.UserRepository;
import com.ecart.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles registration, login, and Spring Security's UserDetailsService.
 *
 * Role note: UserDetails is built with .roles(role) which auto-prefixes ROLE_.
 * SecurityConfig uses hasRole("ADMIN") → matches ROLE_ADMIN. Consistent.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository      userRepository;
    private final CartRepository      cartRepository;
    private final PasswordEncoder     passwordEncoder;
    private final JwtTokenProvider    tokenProvider;
    private final AuthenticationManager authenticationManager;

    /** When true, any credentials succeed (demo/presentation mode only). */
    @Value("${app.demo-mode:false}")
    private boolean demoMode;


    // ── Register ──────────────────────────────────────────────────────
    @Transactional
    public User register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email already registered: " + req.email());
        }

        User user = new User();
        user.setFirstName(req.firstName().trim());
        user.setLastName(req.lastName().trim());
        user.setEmail(req.email().toLowerCase().trim());
        user.setPhone(req.phone() != null ? req.phone().trim() : null);
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(User.Role.CUSTOMER);

        User saved = userRepository.save(user);
        log.info("New user registered: {} (id={})", saved.getEmail(), saved.getId());

        // Auto-create empty cart
        Cart cart = new Cart();
        cart.setUser(saved);
        cartRepository.save(cart);

        return saved;
    }

    // ── Login ─────────────────────────────────────────────────────────
    /**
     * DEMO MODE: Any email/password combination succeeds.
     * - email contains "admin" → ADMIN role
     * - anything else         → CUSTOMER role
     * If the user exists in DB, their real data is used.
     * If not, a synthetic session is returned (no DB write needed).
     */
    public LoginResponse login(LoginRequest req) {
        String email = req.email().toLowerCase().trim();

        // Try real authentication first
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, req.password()));

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            String token = tokenProvider.generateToken(user.getEmail());
            log.info("User logged in (real): {} role={}", user.getEmail(), user.getRole());

            return new LoginResponse(token, user.getEmail(),
                    user.getFullName(), user.getRole().name(), user.getId());

        } catch (Exception e) {
            // ── DEMO FALLBACK: only active when app.demo-mode=true ─────
            if (!demoMode) {
                throw new org.springframework.security.authentication.BadCredentialsException(
                        "Invalid email or password");
            }
            log.info("Demo login for: {}", email);

            // Determine role from email - ONLY if it matches our demo admin email
            String role = "admin@ecart.com".equalsIgnoreCase(email) ? "ADMIN" : "CUSTOMER";

            // Generate a valid JWT for this email
            String token = tokenProvider.generateToken(email);

            // Try to find or create a lightweight user record
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                // Create a demo user on the fly
                User demo = new User();
                demo.setFirstName(role.equals("ADMIN") ? "Demo" : "Guest");
                demo.setLastName("User");
                demo.setEmail(email);
                demo.setPassword(passwordEncoder.encode(req.password() + "_demo"));
                demo.setRole(User.Role.valueOf(role));
                demo.setPhone("0000000000");
                try {
                    User saved = userRepository.save(demo);
                    // Create cart for new demo user
                    Cart cart = new Cart();
                    cart.setUser(saved);
                    cartRepository.save(cart);
                    return saved;
                } catch (Exception ex) {
                    // If save fails (e.g. duplicate), return unsaved object
                    return demo;
                }
            });

            String fullName = user.getFirstName() + " " + user.getLastName();
            Long userId = user.getId() != null ? user.getId() : -1L;

            return new LoginResponse(token, email, fullName, role, userId);
        }
    }
}
