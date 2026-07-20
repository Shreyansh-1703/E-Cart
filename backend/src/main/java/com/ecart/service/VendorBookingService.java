package com.ecart.service;

import com.ecart.entity.VendorAvailability;
import com.ecart.entity.VendorBooking;
import com.ecart.repository.VendorAvailabilityRepository;
import com.ecart.repository.VendorBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorBookingService {

    private final VendorBookingRepository bookingRepository;
    private final VendorAvailabilityRepository availabilityRepository;

    @Transactional
    public VendorBooking createBooking(VendorBooking booking) {
        // Dynamic Availability Check
        if (!isVendorAvailable(booking.getVendor().getId(), booking.getBookingDate())) {
            throw new RuntimeException("Vendor is fully booked for this date");
        }
        return bookingRepository.save(booking);
    }

    public boolean isVendorAvailable(Long vendorId, LocalDate date) {
        List<VendorAvailability> availabilities = availabilityRepository.findByVendorId(vendorId);
        
        // Find availability for the day of week
        String dayOfWeek = date.getDayOfWeek().name();
        VendorAvailability dayAvail = availabilities.stream()
                .filter(a -> a.getDayOfWeek().equals(dayOfWeek) || a.getDayOfWeek().equals("ALL"))
                .findFirst()
                .orElse(null);

        if (dayAvail == null) return false;

        long currentBookings = bookingRepository.countByVendorIdAndBookingDateAndStatus(
                vendorId, date, VendorBooking.BookingStatus.CONFIRMED);
        
        return currentBookings < dayAvail.getMaxBookingsPerDay();
    }

    public List<VendorBooking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<VendorBooking> getVendorBookings(Long vendorId) {
        return bookingRepository.findByVendorId(vendorId);
    }

    @Transactional
    public void updateBookingStatus(Long bookingId, String status) {
        VendorBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(VendorBooking.BookingStatus.valueOf(status.toUpperCase()));
        bookingRepository.save(booking);
    }
}
