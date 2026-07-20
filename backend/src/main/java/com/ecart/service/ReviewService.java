package com.ecart.service;

import com.ecart.entity.Product;
import com.ecart.entity.Review;
import com.ecart.repository.ProductRepository;
import com.ecart.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository  reviewRepository;
    private final ProductRepository productRepository;

    /** Get paginated reviews for a product */
    public Page<Review> getReviews(Long productId, int page, int size) {
        return reviewRepository.findByProductIdOrderByReviewDateDesc(
                productId, PageRequest.of(page, size, Sort.by("reviewDate").descending()));
    }

    /** Get rating summary for a product */
    public Map<String, Object> getRatingSummary(Long productId) {
        List<Object[]> dist = reviewRepository.findRatingDistributionByProductId(productId);
        long total = reviewRepository.countByProductId(productId);
        Double avg  = reviewRepository.findAverageRatingByProductId(productId);

        Map<Integer, Long> breakdown = new HashMap<>();
        for (int i = 1; i <= 5; i++) breakdown.put(i, 0L);
        for (Object[] row : dist) {
            breakdown.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
        }

        return Map.of(
                "average",   avg == null ? 0.0 : BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP),
                "total",     total,
                "breakdown", breakdown
        );
    }

    /** Add a new review */
    @Transactional
    public Review addReview(Long productId, Review review) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        review.setProduct(product);
        Review saved = reviewRepository.save(review);

        // Recalculate product's average rating
        Double newAvg = reviewRepository.findAverageRatingByProductId(productId);
        long count    = reviewRepository.countByProductId(productId);
        if (newAvg != null) {
            product.setRating(BigDecimal.valueOf(newAvg).setScale(2, RoundingMode.HALF_UP));
            product.setReviewCount((int) count);
            productRepository.save(product);
        }
        return saved;
    }

    /** Seed reviews for a product if none exist */
    @Transactional
    public void seedReviewsIfAbsent(Long productId, List<Review> reviews) {
        if (!reviewRepository.existsByProductId(productId)) {
            reviews.forEach(r -> {
                r.setProduct(productRepository.findById(productId).orElse(null));
                if (r.getProduct() != null) reviewRepository.save(r);
            });
        }
    }
}
