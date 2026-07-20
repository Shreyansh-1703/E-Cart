package com.ecart.repository;

import com.ecart.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByIsApprovedTrue();
    List<Vendor> findByIsApprovedFalse();
    List<Vendor> findByCategoryAndIsApprovedTrue(Vendor.VendorCategory category);
}
