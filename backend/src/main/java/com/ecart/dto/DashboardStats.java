package com.ecart.dto;

import java.math.BigDecimal;

public record DashboardStats(
    long totalUsers,
    long totalProducts,
    long totalOrders,
    BigDecimal totalRevenue,
    BigDecimal todayRevenue,
    long pendingOrders,
    long processingOrders,
    long deliveredOrders,
    long cancelledOrders,
    long lowStockProducts,
    long totalSellers,
    long totalVendors,
    long totalRailwayOrders,
    long totalWeddingBookings
) {}
