package com.ecart.repository;

import com.ecart.entity.RailwayDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RailwayDeliveryRepository extends JpaRepository<RailwayDelivery, Long> {
    Optional<RailwayDelivery> findByOrderId(Long orderId);
    Optional<RailwayDelivery> findByOrderOrderNumber(String orderNumber);
}
