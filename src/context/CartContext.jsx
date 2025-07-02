import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { createApiUrl, API_ENDPOINTS } from '../config/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = user?.id;

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(createApiUrl(API_ENDPOINTS.CART(userId)));
      setCart(data || []);
    } catch (err) {
      console.error('🔴 Fetch cart failed:', err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodItem, quantity = 1) => {
    if (!userId) {
      alert('You must be logged in to add to cart.');
      return;
    }
  
    try {
      const payload = { foodItemId: foodItem.id, quantity };
      await axios.post(createApiUrl(API_ENDPOINTS.CART(userId)), payload);
  
      // ✅ Refresh cart to get proper backend-generated IDs
      await fetchCart();
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };
  

  const removeFromCart = async (cartItemId) => {
    if (!userId) return;

    try {
      await axios.delete(createApiUrl(API_ENDPOINTS.CART_ITEM(userId, cartItemId)));
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      console.error('🔴 Remove from cart failed:', err);
    }
  };

  const clearCart = async () => {
    if (!userId) return;

    try {
      // Clear all items from cart
      for (const item of cart) {
        await axios.delete(createApiUrl(API_ENDPOINTS.CART_ITEM(userId, item.id)));
      }
      setCart([]);
    } catch (err) {
      console.error('🔴 Clear cart failed:', err);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!userId || newQuantity < 1) return;

    try {
      await axios.put(createApiUrl(API_ENDPOINTS.CART_ITEM(userId, cartItemId)), {
        quantity: newQuantity,
      });
      
      setCart((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('🔴 Update quantity failed:', err);
    }
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = item.foodItem?.price || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
