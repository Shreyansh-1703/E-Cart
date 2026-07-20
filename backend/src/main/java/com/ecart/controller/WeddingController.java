package com.ecart.controller;

import com.ecart.entity.Product;
import com.ecart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * GET /api/wedding-items
 * Returns all products flagged as weddingItem = true.
 * Public endpoint — no auth required.
 */
@RestController
@RequestMapping("/api/wedding-items")
@RequiredArgsConstructor
public class WeddingController {

    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getWeddingItems() {
        List<Product> items = productRepository.findByIsWeddingItemTrue();
        return ResponseEntity.ok(items);
    }
}
