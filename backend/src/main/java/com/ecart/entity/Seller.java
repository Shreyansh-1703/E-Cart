package com.ecart.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "sellers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String businessName;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String gstNumber;

    @Column(nullable = false)
    private String panNumber;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String businessAddress;

    @Column(nullable = false)
    private String bankAccountNumber;

    @Column(nullable = false)
    private String bankIfsc;

    @Column(nullable = false)
    private String bankName;

    @Column(nullable = false)
    private boolean isApproved = false;

    private LocalDateTime createdAt = LocalDateTime.now();
}
