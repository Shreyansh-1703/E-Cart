import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
const WISHLIST_KEY = 'ecart_wishlist';

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; } catch { return []; }
  });

  const wishlistIds = new Set(wishlist.map(p => p.id));

  const addToWishlist = useCallback((product) => {
    if (!isAuthenticated) throw new Error('Please login');
    setWishlist(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      const next = [...prev, product];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, [isAuthenticated]);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist(prev => {
      const next = prev.filter(p => p.id !== productId);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isInWishlist = (productId) => wishlistIds.has(productId);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistIds,
      wishlistCount: wishlist.length,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      fetchWishlist: () => {},
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
