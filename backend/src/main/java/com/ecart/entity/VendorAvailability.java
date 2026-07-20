package com.ecart.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "vendor_availability")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(nullable = false)
    private String dayOfWeek; // e.g., "MONDAY", "TUESDAY" or "ALL"

    private LocalTime startTime;
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer maxBookingsPerDay = 5;
}
