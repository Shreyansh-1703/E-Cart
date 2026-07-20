package com.ecart.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vendors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String fullName;

    @NotBlank
    private String businessName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VendorCategory category;

    @NotBlank
    private String phone;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String city;

    private Integer experienceYears;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(precision = 12, scale = 2)
    private BigDecimal startingPrice;

    private String profilePictureUrl;

    @ElementCollection
    @CollectionTable(name = "vendor_portfolio_images", joinColumns = @JoinColumn(name = "vendor_id"))
    @Column(name = "image_url")
    private List<String> portfolioImages;

    private Double rating = 0.0;
    private Integer reviewCount = 0;

    @Column(nullable = false)
    private boolean isApproved = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum VendorCategory {
        PHOTOGRAPHER, MAKEUP_ARTIST, MEHNDI_ARTIST,
        CATERER, DECORATOR, DJ, VENUE, EVENT_PLANNER, BAND, FLORIST
    }
}
