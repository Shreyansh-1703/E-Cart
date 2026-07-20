package com.ecart.service;

import com.ecart.entity.Vendor;
import com.ecart.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    public List<Vendor> getAllApprovedVendors() {
        return vendorRepository.findByIsApprovedTrue();
    }

    public List<Vendor> getVendorsByCategory(String category) {
        try {
            return vendorRepository.findByCategoryAndIsApprovedTrue(Vendor.VendorCategory.valueOf(category.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return getAllApprovedVendors();
        }
    }

    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id).orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    @Transactional
    public Vendor registerVendor(Vendor vendor) {
        vendor.setApproved(false); // Must be approved by admin
        return vendorRepository.save(vendor);
    }

    public List<Vendor> getPendingApplications() {
        return vendorRepository.findByIsApprovedFalse();
    }

    @Transactional
    public void approveVendor(Long id) {
        Vendor vendor = getVendorById(id);
        vendor.setApproved(true);
        vendorRepository.save(vendor);
    }

    @Transactional
    public void rejectVendor(Long id) {
        vendorRepository.deleteById(id);
    }
}
