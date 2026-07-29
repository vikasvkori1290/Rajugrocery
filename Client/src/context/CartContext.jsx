import React, { createContext, useState, useEffect } from 'react';
import tomatoesImg from '../assets/product_tomatoes.png';
import baguetteImg from '../assets/product_baguette.png';
import almondMilkImg from '../assets/product_almond_milk.png';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [
      // Pre-seed cart with 3 items matching the screenshots
      {
        id: 1, // Cherry Tomatoes (Heirloom Heritage Tomatoes in mock)
        name: 'Vine-Ripened Cherry Tomatoes',
        badge: 'Organic',
        badgeClass: 'organic',
        description: 'Approx. 1lb • Farm-to-table fresh',
        price: 4.99,
        qty: 1,
        image: tomatoesImg,
        selectedWeight: '4 lb Bag'
      },
      {
        id: 14, // Almond Milk (Golden Valley Whole Milk in mock)
        name: 'Unsweetened Almond Milk',
        badge: 'Dairy',
        badgeClass: 'organic',
        description: '1 Gallon • Glass Bottle',
        price: 6.50,
        qty: 2,
        image: almondMilkImg,
        selectedWeight: '1L Carton'
      },
      {
        id: 13, // Baguette (Artisan Wild Yeast Sourdough in mock)
        name: 'Artisan Sourdough Baguette',
        badge: 'Fresh Bakery',
        badgeClass: 'freshly-baked',
        description: 'Baked daily • 24oz Loaf',
        price: 8.25,
        qty: 1,
        image: baguetteImg,
        selectedWeight: '1 Baguette'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedWeight = '') => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === product.id && item.selectedWeight === selectedWeight);
      if (exists) {
        return prev.map(item => (item.id === product.id && item.selectedWeight === selectedWeight)
          ? { ...item, qty: item.qty + quantity }
          : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          badge: product.badge,
          badgeClass: product.badgeClass,
          description: product.description,
          price: product.price,
          qty: quantity,
          image: product.image,
          selectedWeight: selectedWeight || product.weightOptions?.[0] || 'Each'
        }];
      }
    });
  };

  const removeFromCart = (id, selectedWeight = '') => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedWeight === selectedWeight)));
  };

  const updateQuantity = (id, quantity, selectedWeight = '') => {
    if (quantity <= 0) {
      removeFromCart(id, selectedWeight);
      return;
    }
    setCartItems(prev => prev.map(item => (item.id === id && item.selectedWeight === selectedWeight)
      ? { ...item, qty: quantity }
      : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartSubtotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
