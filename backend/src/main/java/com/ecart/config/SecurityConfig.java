package com.ecart.config;

import com.ecart.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

/**
 * Spring Security configuration.
 *
 * Key decisions:
 * - CSRF disabled: stateless JWT API, no session cookies
 * - CORS handled by CorsConfig bean (proper CorsConfigurationSource)
 * - Role check uses ROLE_ prefix via hasRole() — AuthService builds
 *   UserDetails with .roles(user.getRole().name()) which auto-prefixes ROLE_
 * - H2 console allowed only in dev (frameOptions sameOrigin)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter       jwtAuthFilter;
    private final UserDetailsService  userDetailsService;
    private final CorsConfig          corsConfig;
    private final PasswordEncoder     passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ── Disable CSRF: stateless JWT API ──────────────────────────
            .csrf(AbstractHttpConfigurer::disable)

            // ── CORS: use our CorsConfigurationSource bean ────────────────
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))

            // ── Stateless sessions ────────────────────────────────────────
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ── Security headers ──────────────────────────────────────────
            .headers(headers -> headers
                    .frameOptions(fo -> fo.sameOrigin())           // H2 console
                    .referrerPolicy(rp -> rp.policy(
                            ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )

            // ── Endpoint authorization ────────────────────────────────────
            .authorizeHttpRequests(auth -> auth

                // Public — no token required
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/returns/policy/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/returns/delivery/pin/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/wedding-items/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/railway/trains").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/railway/details/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/railway/status/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/railway/recommend/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/railway/route/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()

                // Admin & Seller endpoints
                .requestMatchers(HttpMethod.POST,   "/api/products/**").hasAnyRole("ADMIN", "SELLER")
                .requestMatchers(HttpMethod.PUT,    "/api/products/**").hasAnyRole("ADMIN", "SELLER")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyRole("ADMIN", "SELLER")
                .requestMatchers(HttpMethod.POST,   "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,  "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,  "/api/users/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/users/*/toggle").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/orders/*/status").hasRole("ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            )

            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

}
