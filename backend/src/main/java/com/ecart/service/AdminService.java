package com.ecart.service;

import com.ecart.dto.DashboardStats;
import com.ecart.entity.Order;
import com.ecart.entity.User;
import com.ecart.repository.OrderRepository;
import com.ecart.repository.ProductRepository;
import com.ecart.repository.UserRepository;
import com.ecart.repository.SellerRepository;
import com.ecart.repository.VendorRepository;
import com.ecart.repository.RailwayDeliveryRepository;
import com.ecart.repository.VendorBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository    userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository   orderRepository;
    private final SellerRepository   sellerRepository;
    private final VendorRepository   vendorRepository;
    private final RailwayDeliveryRepository railwayDeliveryRepository;
    private final VendorBookingRepository vendorBookingRepository;

    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        long totalUsers    = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders   = orderRepository.count();

        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        BigDecimal todayRevenue = orderRepository.sumTodayRevenue();
        if (todayRevenue == null) todayRevenue = BigDecimal.ZERO;

        long pending    = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        long processing = orderRepository.countByStatus(Order.OrderStatus.PROCESSING);
        long delivered  = orderRepository.countByStatus(Order.OrderStatus.DELIVERED);
        long cancelled  = orderRepository.countByStatus(Order.OrderStatus.CANCELLED);
        long lowStock   = productRepository.findByStockLessThan(10).size();

        long totalSellers = sellerRepository.count();
        long totalVendors = vendorRepository.count();
        long totalRailwayOrders = railwayDeliveryRepository.count();
        long totalWeddingBookings = vendorBookingRepository.count();

        return new DashboardStats(
                totalUsers, totalProducts, totalOrders,
                totalRevenue, todayRevenue,
                pending, processing, delivered, cancelled,
                lowStock,
                totalSellers, totalVendors, totalRailwayOrders, totalWeddingBookings
        );
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    @Transactional
    public void toggleUser(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        userRepository.save(user);
    }
}
