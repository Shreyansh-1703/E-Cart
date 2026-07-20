import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const CART_KEY = 'ecart_cart';

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer, isAdmin, user } = useAuth();
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || { items: [] }; } catch { return { items: [] }; }
  });

  // Reset cart on user change
  useEffect(() => {
    if (!isAuthenticated) {
      setCart({ items: [] });
    }
  }, [isAuthenticated, user?.userId]);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const cartCount = cart.items?.length || 0;

  const cartTotal = cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const cartSubtotal = cartTotal;
  const cartTax = Math.round(cartSubtotal * 0.18);
  const cartDelivery = cartSubtotal > 999 ? 0 : 79;
  const cartGrandTotal = cartSubtotal + cartTax + cartDelivery;

  const addToCart = useCallback((product, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }
    setCart(prev => {
      const existingIdx = prev.items.findIndex(i => i.productId === (product.id || product.productId));
      let newItems;
      if (existingIdx >= 0) {
        newItems = prev.items.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newItems = [...prev.items, {
          id: Date.now(),
          productId: product.id || product.productId,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
          stock: product.stock,
        }];
      }
      const newCart = { ...prev, items: newItems };
      localStorage.setItem(CART_KEY, JSON.stringify(newCart));
      return newCart;
    });
  }, [isAuthenticated]);

  const updateQuantity = useCallback((itemId, quantity) => {
    setCart(prev => {
      const newItems = quantity <= 0
        ? prev.items.filter(i => i.id !== itemId)
        : prev.items.map(i => i.id === itemId ? { ...i, quantity } : i);
      const newCart = { ...prev, items: newItems };
      localStorage.setItem(CART_KEY, JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const newCart = { ...prev, items: prev.items.filter(i => i.id !== itemId) };
      localStorage.setItem(CART_KEY, JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    const empty = { items: [] };
    setCart(empty);
    localStorage.setItem(CART_KEY, JSON.stringify(empty));
  }, []);

  const fetchCart = useCallback(() => {
    // no-op for demo mode (data already in state)
  }, []);

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartSubtotal, cartTax, cartDelivery, cartGrandTotal,
      addToCart, updateQuantity, removeFromCart, clearCart, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
