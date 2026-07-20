package com.ecart.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

/**
 * CORS configuration.
 * Allowed origins are read from app.cors.allowed-origins (application.properties).
 * Override via CORS_ORIGINS env var in production.
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:5500,http://127.0.0.1:5500}")
    private String allowedOriginsRaw;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        List<String> patterns = new ArrayList<>();
        if (allowedOriginsRaw != null) {
            Arrays.stream(allowedOriginsRaw.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .forEach(patterns::add);
        }
        // Allow null origin so HTML files opened via file:// work in development
        patterns.add("null");
        if (patterns.isEmpty()) patterns.add("http://localhost:3000");

        CorsConfiguration config = new CorsConfiguration();
        // setAllowedOriginPatterns (not setAllowedOrigins) is required when
        // allowCredentials = true and you need wildcard / null support.
        config.setAllowedOriginPatterns(patterns);
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "X-Requested-With"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // Explicit CorsFilter bean removed to avoid "Double CORS" issues 
    // when using both Spring Security's .cors() and a global CorsFilter.
    // Spring Security is already configured to use the corsConfigurationSource bean.
}
