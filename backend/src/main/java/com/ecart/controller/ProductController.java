package com.ecart.controller;

import com.ecart.dto.RentRequest;
import com.ecart.dto.RentResponse;
import com.ecart.entity.Product;
import com.ecart.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final com.ecart.service.SellerService sellerService;

    /**
     * GET /api/products
     * Params: search, categoryId, page, size, sort
     * Public endpoint — no auth required
     */
    @GetMapping
    public ResponseEntity<?> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sort) {
        
        Page<Product> result = productService.search(search, categoryId, page, size, sort);
        
        return ResponseEntity.ok(Map.of(
                "content",     result.getContent(),
                "totalItems",  result.getTotalElements(),
                "totalPages",  result.getTotalPages(),
                "currentPage", result.getNumber()
        ));
    }

    /**
     * GET /api/products/all — admin use: includes inactive
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllAdmin() {
        return ResponseEntity.ok(productService.getAllActive());
    }

    /**
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/products — ADMIN and SELLER
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<Product> create(@Valid @RequestBody Product product,
                                           @AuthenticationPrincipal UserDetails occupant) {
        if (occupant.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"))) {
            com.ecart.entity.Seller seller = sellerService.getSellerByEmail(occupant.getUsername());
            product.setSeller(seller);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.create(product));
    }

    /**
     * PUT /api/products/{id} — ADMIN and SELLER (enforcing owner check for sellers)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Product product,
                                    @AuthenticationPrincipal UserDetails occupant) {
        try {
            if (occupant.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"))) {
                Product existing = productService.getById(id);
                com.ecart.entity.Seller seller = sellerService.getSellerByEmail(occupant.getUsername());
                if (existing.getSeller() == null || !existing.getSeller().getId().equals(seller.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("error", "Access denied: you do not own this product"));
                }
                product.setSeller(seller);
            }
            return ResponseEntity.ok(productService.update(id, product));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/products/{id} — ADMIN and SELLER (enforcing owner check for sellers)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @AuthenticationPrincipal UserDetails occupant) {
        try {
            if (occupant.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"))) {
                Product existing = productService.getById(id);
                com.ecart.entity.Seller seller = sellerService.getSellerByEmail(occupant.getUsername());
                if (existing.getSeller() == null || !existing.getSeller().getId().equals(seller.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(Map.of("error", "Access denied: you do not own this product"));
                }
            }
            productService.delete(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── Renting ───────────────────────────────────────────────────────

    /**
     * GET /api/products/{id}/recommendations?type=frequently_bought|also_bought
     */
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<?> getRecommendations(
            @PathVariable Long id,
            @RequestParam(defaultValue = "frequently_bought") String type,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(productService.getRecommendations(id, type, limit));
    }

    /**
     * POST /api/products/{id}/rent
     * Body: { "days": 3 }
     * Requires authentication. Only works for rentable products.
     */
    @PostMapping("/{id}/rent")
    public ResponseEntity<RentResponse> rentProduct(
            @PathVariable Long id,
            @Valid @RequestBody RentRequest req,
            @AuthenticationPrincipal UserDetails user) {
        RentResponse response = productService.rentProduct(id, req,
                user != null ? user.getUsername() : "guest");
        return ResponseEntity.ok(response);
    }
}
