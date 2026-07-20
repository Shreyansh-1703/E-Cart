package com.ecart.repository;

import com.ecart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithLock(@Param("id") Long id);

    List<Product> findByIsWeddingItemTrue();

    List<Product> findByStatus(Product.ProductStatus status);

    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByStockLessThan(int threshold);

    List<Product> findBySellerId(Long sellerId);

    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "   OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           " AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
           " AND (p.status <> 'INACTIVE')")
    Page<Product> findFiltered(@Param("search") String search,
                               @Param("categoryId") Long categoryId,
                               Pageable pageable);

    long countByStatus(Product.ProductStatus status);

    boolean existsByName(String name);
}
