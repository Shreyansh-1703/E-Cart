package com.ecart.service;

import com.ecart.entity.Product;
import com.ecart.entity.User;
import com.ecart.entity.Wishlist;
import com.ecart.repository.ProductRepository;
import com.ecart.repository.UserRepository;
import com.ecart.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository     userRepository;
    private final ProductRepository  productRepository;

    public List<Wishlist> getWishlist(String email) {
        User user = findUser(email);
        return wishlistRepository.findByUserId(user.getId());
    }

    @Transactional
    public Map<String, Object> addToWishlist(String email, Long productId) {
        User user = findUser(email);
        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            return Map.of("message", "Already in wishlist", "added", false);
        }
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
        Wishlist item = new Wishlist();
        item.setUser(user);
        item.setProduct(product);
        wishlistRepository.save(item);
        return Map.of("message", "Added to wishlist", "added", true);
    }

    @Transactional
    public void removeFromWishlist(String email, Long productId) {
        User user = findUser(email);
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    public long getCount(String email) {
        User user = findUser(email);
        return wishlistRepository.countByUserId(user.getId());
    }

    public boolean isInWishlist(String email, Long productId) {
        User user = findUser(email);
        return wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
