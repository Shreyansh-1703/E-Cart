package com.ecart.repository;

import com.ecart.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    Optional<Seller> findByUserId(Long userId);
    Optional<Seller> findByUserEmail(String email);
    List<Seller> findByIsApprovedFalse();
    List<Seller> findByIsApprovedTrue();
}
