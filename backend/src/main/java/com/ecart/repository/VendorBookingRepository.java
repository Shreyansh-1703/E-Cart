package com.ecart.repository;

import com.ecart.entity.VendorBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VendorBookingRepository extends JpaRepository<VendorBooking, Long> {
    List<VendorBooking> findByVendorId(Long vendorId);
    List<VendorBooking> findByUserId(Long userId);
    long countByVendorIdAndBookingDateAndStatus(Long vendorId, LocalDate bookingDate, VendorBooking.BookingStatus status);
}
