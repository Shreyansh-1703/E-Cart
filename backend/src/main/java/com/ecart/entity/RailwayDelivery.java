package com.ecart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Stores railway-station delivery details for an order.
 * One-to-one with Order.
 */
@Entity
@Table(name = "railway_deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RailwayDelivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false)
    private String trainNumber;

    private String trainName;

    @Column(nullable = false)
    private String pnrNumber;

    private String journeyDate;

    /** Station selected for delivery */
    @Column(nullable = false)
    private String stationCode;

    private String stationName;

    /** Expected train arrival at the selected station */
    private LocalDateTime trainArrival;

    /** Real-time status update */
    private String runningStatus;
    private String currentStation;
    private String nextStation;
    private String eta;
    private String delayMinutes;

    /** Snapshot of the route at the time of booking */
    @Column(columnDefinition = "TEXT")
    private String routeMetadata;

    /** OTP sent to user for delivery verification */
    @JsonIgnore
    private String otp;

    @Column(nullable = false)
    private boolean otpVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus deliveryStatus = DeliveryStatus.OTP_PENDING;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public enum DeliveryStatus {
        OTP_PENDING, OTP_VERIFIED, OUT_FOR_DELIVERY, DELIVERED, FAILED, CANCELLED, DIVERTED
    }
}
