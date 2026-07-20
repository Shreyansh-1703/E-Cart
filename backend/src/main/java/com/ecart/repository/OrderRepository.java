package com.ecart.repository;

import com.ecart.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Order> findByStatus(Order.OrderStatus status);

    Optional<Order> findByOrderNumber(String orderNumber);

    long countByStatus(Order.OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.status <> 'CANCELLED' AND o.status <> 'RETURNED'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.status <> 'CANCELLED' AND o.status <> 'RETURNED' " +
           "AND CAST(o.createdAt AS date) = CURRENT_DATE")
    BigDecimal sumTodayRevenue();
}
