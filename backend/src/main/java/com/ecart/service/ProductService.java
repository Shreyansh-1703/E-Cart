package com.ecart.service;

import com.ecart.dto.RentRequest;
import com.ecart.dto.RentResponse;
import com.ecart.entity.Product;
import com.ecart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository  productRepository;

    public List<Product> getAllActive() {
        return productRepository.findByStatus(Product.ProductStatus.ACTIVE);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public Page<Product> search(String query, Long categoryId, int page, int size, String sortBy) {
        Sort sort = switch (sortBy) {
            case "price_asc"  -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating"     -> Sort.by("rating").descending();
            case "newest"     -> Sort.by("createdAt").descending();
            default           -> Sort.by("name").ascending();
        };
        PageRequest pr = PageRequest.of(page, size, sort);
        return productRepository.findFiltered(
                (query != null && !query.isBlank()) ? query : null,
                categoryId, pr);
    }

    @Transactional
    public Product create(Product product) {
        product.applyFeatureFlags();
        return productRepository.save(product);
    }

    @Transactional
    public Product update(Long id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setOriginalPrice(updated.getOriginalPrice());
        existing.setCategory(updated.getCategory());
        existing.setImageEmoji(updated.getImageEmoji());
        existing.setImageUrl(updated.getImageUrl());
        existing.setBrand(updated.getBrand());
        existing.setStock(updated.getStock());
        existing.setStatus(updated.getStatus());
        existing.setBadge(updated.getBadge());
        // Preserve explicit overrides; re-apply flags only if category changed
        existing.applyFeatureFlags();
        return productRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        productRepository.deleteById(id);
    }

    public List<Product> getLowStock(int threshold) {
        return productRepository.findByStockLessThan(threshold);
    }

    /** Recommendations: same-category products, similar price range */
    public List<Product> getRecommendations(Long productId, String type, int limit) {
        Product product = getById(productId);
        Long categoryId = product.getCategory() != null ? product.getCategory().getId() : null;

        List<Product> candidates = categoryId != null
                ? productRepository.findByCategoryId(categoryId)
                : productRepository.findByStatus(Product.ProductStatus.ACTIVE);

        // Exclude current product
        candidates = candidates.stream()
                .filter(p -> !p.getId().equals(productId)
                          && p.getStatus() != Product.ProductStatus.INACTIVE)
                .collect(java.util.stream.Collectors.toList());

        if ("also_bought".equals(type)) {
            // Shuffle for "customers also bought" randomness
            java.util.Collections.shuffle(candidates);
        } else {
            // Sort by price proximity for "frequently bought together"
            java.math.BigDecimal basePrice = product.getPrice();
            candidates.sort((a, b) -> {
                java.math.BigDecimal diffA = a.getPrice().subtract(basePrice).abs();
                java.math.BigDecimal diffB = b.getPrice().subtract(basePrice).abs();
                return diffA.compareTo(diffB);
            });
        }

        return candidates.stream().limit(limit).collect(java.util.stream.Collectors.toList());
    }

    // ── Renting ───────────────────────────────────────────────────────

    /**
     * Process a rental request for a product.
     * Validates that the product is rentable, then calculates total cost.
     * In demo mode this always succeeds.
     */
    public RentResponse rentProduct(Long productId, RentRequest req, String userEmail) {
        Product product = getById(productId);

        if (!product.isRentable()) {
            throw new IllegalArgumentException(
                    "'" + product.getName() + "' is not available for rent. "
                    + "Only Clothing and Home items can be rented.");
        }

        BigDecimal dailyRate = product.getRentPricePerDay();
        BigDecimal total = dailyRate.multiply(BigDecimal.valueOf(req.days()))
                .setScale(2, java.math.RoundingMode.HALF_UP);

        String rentalId = "RENT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        log.info("Rental {} — product '{}' rented by {} for {} days @ Rs.{}/day = Rs.{}",
                rentalId, product.getName(), userEmail, req.days(), dailyRate, total);

        return new RentResponse(
                product.getId(),
                product.getName(),
                product.getCategory() != null ? product.getCategory().getName() : "",
                req.days(),
                dailyRate,
                total,
                "CONFIRMED",
                "Product rented successfully! Rental ID: " + rentalId,
                rentalId
        );
    }
}
