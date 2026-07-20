package com.ecart.controller;

import com.ecart.entity.Review;
import com.ecart.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** GET /api/products/{productId}/reviews?page=0&size=10 */
    @GetMapping
    public ResponseEntity<?> getReviews(@PathVariable Long productId,
                                         @RequestParam(defaultValue = "0")  int page,
                                         @RequestParam(defaultValue = "10") int size) {
        Page<Review> result = reviewService.getReviews(productId, page, size);
        return ResponseEntity.ok(Map.of(
                "reviews",     result.getContent(),
                "totalItems",  result.getTotalElements(),
                "totalPages",  result.getTotalPages(),
                "currentPage", result.getNumber()
        ));
    }

    /** GET /api/products/{productId}/reviews/summary */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(productId));
    }

    /** POST /api/products/{productId}/reviews */
    @PostMapping
    public ResponseEntity<Review> addReview(@PathVariable Long productId,
                                             @Valid @RequestBody Review review) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.addReview(productId, review));
    }
}
