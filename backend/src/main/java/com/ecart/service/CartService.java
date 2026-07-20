package com.ecart.service;

import com.ecart.dto.CartRequest;
import com.ecart.entity.Cart;
import com.ecart.entity.CartItem;
import com.ecart.entity.Product;
import com.ecart.entity.User;
import com.ecart.repository.CartRepository;
import com.ecart.repository.ProductRepository;
import com.ecart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository    cartRepository;
    private final UserRepository    userRepository;
    private final ProductRepository productRepository;

    /** Get or lazily create cart for user */
    public Cart getCartByEmail(String email) {
        User user = findUser(email);
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    /** Add or increment item */
    @Transactional
    public Cart addItem(String email, CartRequest req) {
        if (req.productId() == null || req.quantity() == null) {
            throw new IllegalArgumentException("Product ID and Quantity are required");
        }
        
        Cart cart = getCartByEmail(email);

        // Check if product already in cart → increment
        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(req.productId()))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + req.quantity()),
                        () -> {
                            Product product = productRepository.findByIdWithLock(req.productId())
                                    .orElseThrow(() -> new RuntimeException("Product not found: " + req.productId()));
                            CartItem item = new CartItem();
                            item.setCart(cart);
                            item.setProduct(product);
                            item.setQuantity(req.quantity());
                            cart.getItems().add(item);
                        }
                );

        return cartRepository.save(cart);
    }

    /** Update quantity of a cart item */
    @Transactional
    public Cart updateQuantity(String email, Long itemId, int quantity) {
        Cart cart = getCartByEmail(email);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    /** Remove a specific item */
    @Transactional
    public Cart removeItem(String email, Long itemId) {
        return updateQuantity(email, itemId, 0);
    }

    /** Clear entire cart (used after order placed) */
    @Transactional
    public void clearCart(String email) {
        Cart cart = getCartByEmail(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}
