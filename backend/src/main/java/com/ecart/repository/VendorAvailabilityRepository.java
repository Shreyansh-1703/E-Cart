package com.ecart.repository;

import com.ecart.entity.VendorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorAvailabilityRepository extends JpaRepository<VendorAvailability, Long> {
    List<VendorAvailability> findByVendorId(Long vendorId);
}
