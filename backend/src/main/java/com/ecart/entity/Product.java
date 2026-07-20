package com.ecart.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    // ── Categories eligible for renting ──────────────────────────────
    private static final Set<String> RENTABLE_CATEGORIES =
            Set.of("fashion", "clothing", "home", "furniture",
                   "home decoration", "home-decoration", "womens-dresses",
                   "mens-shirts", "tops", "womens-tops", "womens-bags",
                   "mens-shoes", "womens-shoes", "womens-jewellery",
                   "sunglasses", "home-appliances");

    // ── Categories eligible for fast (6-hour) delivery ───────────────
    private static final Set<String> FAST_DELIVERY_CATEGORIES =
            Set.of("medicine", "medicines", "grocery", "groceries",
                   "health", "health-beauty", "beauty", "skincare",
                   "fragrances", "sports-accessories");

    // ── Wedding / express delivery categories ─────────────────────────
    private static final Set<String> WEDDING_CATEGORIES =
            Set.of("lastminutewedding", "wedding", "bridal", "wedding essentials");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private String imageEmoji;
    private String imageUrl;
    private String brand;

    @Column(nullable = false)
    private Integer stock = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.ACTIVE;

    private String badge;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    private Integer reviewCount = 0;

    // ── Renting ───────────────────────────────────────────────────────
    /** Whether this product can be rented (auto-set by category) */
    @Column(name = "is_rentable")
    private boolean isRentable;

    /** Daily rent price in INR (auto-set to ~2% of sale price if rentable) */
    @Column(precision = 10, scale = 2)
    private BigDecimal rentPricePerDay;

    // ── Fast Delivery ─────────────────────────────────────────────────
    /** Whether 6-hour fast delivery is available (auto-set by category) */
    @Column(name = "fast_delivery_available")
    private boolean fastDeliveryAvailable;

    /** Extra charge for fast delivery in INR */
    @Column(precision = 8, scale = 2)
    private BigDecimal fastDeliveryCharge = BigDecimal.valueOf(49);

    // ── Wedding / Express Delivery ────────────────────────────────────
    /** Whether this is a last-minute wedding item */
    @Column(name = "is_wedding_item")
    private boolean isWeddingItem;

    /** Whether express (4-6 hour) delivery is available */
    @Column(nullable = false)
    private boolean expressDeliveryAvailable = false;

    /** Human-readable delivery time e.g. "4-6 hours" */
    private String deliveryTime;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id")
    private Seller seller;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Called after category is set — auto-configures rentable and
     * fastDeliveryAvailable based on category name.
     */
    public void applyFeatureFlags() {
        if (category == null) return;
        String cat = category.getName().toLowerCase().trim();

        // Check rentable
        boolean isRentable = RENTABLE_CATEGORIES.stream()
                .anyMatch(cat::contains);
        // Also match broad keywords
        if (!isRentable) {
            isRentable = cat.contains("cloth") || cat.contains("fashion")
                    || cat.contains("home") || cat.contains("furniture")
                    || cat.contains("dress") || cat.contains("shirt")
                    || cat.contains("top") || cat.contains("shoe")
                    || cat.contains("apparel") || cat.contains("wear");
        }
        this.isRentable = isRentable;
        if (isRentable && (rentPricePerDay == null || rentPricePerDay.compareTo(BigDecimal.ZERO) == 0)) {
            // Default rent = 2% of sale price per day, minimum Rs.29
            BigDecimal computed = price.multiply(BigDecimal.valueOf(0.02))
                    .setScale(0, java.math.RoundingMode.HALF_UP);
            this.rentPricePerDay = computed.compareTo(BigDecimal.valueOf(29)) < 0
                    ? BigDecimal.valueOf(29) : computed;
        }

        // Check fast delivery
        boolean isFast = FAST_DELIVERY_CATEGORIES.stream()
                .anyMatch(cat::contains);
        if (!isFast) {
            isFast = cat.contains("medic") || cat.contains("grocery")
                    || cat.contains("pharma") || cat.contains("health")
                    || cat.contains("food") || cat.contains("fruit")
                    || cat.contains("vegetable") || cat.contains("dairy");
        }
        this.fastDeliveryAvailable = isFast;

        // Check wedding / express delivery
        boolean isWedding = WEDDING_CATEGORIES.stream().anyMatch(cat::contains);
        if (!isWedding) {
            isWedding = cat.contains("wedding") || cat.contains("bridal")
                    || cat.contains("lastminute");
        }
        this.isWeddingItem = isWedding;
        this.expressDeliveryAvailable = isWedding;
        if (isWedding && (this.deliveryTime == null || this.deliveryTime.isBlank())) {
            this.deliveryTime = "4-6 hours";
        }
    }

    public enum ProductStatus {
        ACTIVE, INACTIVE, OUT_OF_STOCK
    }

    @Transient
    public Integer getDiscountPercent() {
        if (originalPrice != null && originalPrice.compareTo(BigDecimal.ZERO) > 0
                && price.compareTo(originalPrice) < 0) {
            return originalPrice.subtract(price)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(originalPrice, 0, java.math.RoundingMode.HALF_UP)
                    .intValue();
        }
        return null;
    }
}
