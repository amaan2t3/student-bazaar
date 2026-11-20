import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sb_wishlist');
      return saved ? JSON.parse(saved) : ['proj-1'];
    } catch {
      return ['proj-1'];
    }
  });

  useEffect(() => {
    localStorage.setItem('sb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (project) => {
    if (!cart.some(item => item.id === project.id)) {
      setCart(prev => [...prev, project]);
      return true;
    }
    return false;
  };

  const removeFromCart = (projectId) => {
    setCart(prev => prev.filter(item => item.id !== projectId));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (projectId) => {
    setWishlist(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId) 
        : [...prev, projectId]
    );
  };

  const isInWishlist = (projectId) => wishlist.includes(projectId);
  const isInCart = (projectId) => cart.some(item => item.id === projectId);

  const cartTotalPKR = cart.reduce((acc, curr) => acc + (curr.pricePKR || 0), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      isInWishlist,
      isInCart,
      cartCount: cart.length,
      cartTotalPKR
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
