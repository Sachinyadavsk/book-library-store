import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState("");

  // ==========================================
  // GET CART
  // ==========================================

  const loadCart = async () => {
    if (!user) {
      setCart([]);
      setCartCount(0);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await cartService.getCart();

      console.log("Cart API Response:", response);

      const data =
        response?.data ??
        response?.cart ??
        response?.items ??
        response ??
        [];

      const cartData = Array.isArray(data)
        ? data
        : [];

      setCart(cartData);

      const total = cartData.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 1),
        0
      );

      setCartCount(total);
    } catch (error) {
      console.error("Get cart error:", error);

      setCart([]);
      setCartCount(0);

      setError(
        error?.message ||
        "Unable to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN USER CHANGES
  // ==========================================

  useEffect(() => {
    loadCart();
  }, [user]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (book) => {
    if (!user) {
      return {
        success: false,
        requiresLogin: true,
      };
    }

    try {
      setError("");

      const response =
        await cartService.addToCart({
          book_id: book.id ?? book._id,
          quantity: 1,
        });

      console.log(
        "Add Cart Response:",
        response
      );

      await loadCart();

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      return response;
    } catch (error) {
      console.error(
        "Add cart error:",
        error
      );

      setError(
        error?.message ||
        "Unable to add book to cart."
      );

      throw error;
    }
  };

  // ==========================================
  // INCREASE
  // ==========================================

  const increaseQuantity = async (bookId) => {
    const item = cart.find(
      (item) =>
        String(item.book_id ?? item.book?.id) ===
        String(bookId)
    );

    if (!item) return;

    try {
      await cartService.updateCart(
        item.id,
        {
          quantity:
            Number(item.quantity || 1) + 1,
        }
      );

      await loadCart();

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );
    }
  };

  // ==========================================
  // DECREASE
  // ==========================================

  const decreaseQuantity = async (bookId) => {
    const item = cart.find(
      (item) =>
        String(item.book_id ?? item.book?.id) ===
        String(bookId)
    );

    if (!item) return;

    const quantity = Number(
      item.quantity || 1
    );

    // Remove when quantity becomes zero
    if (quantity <= 1) {
      await removeFromCart(item.id);
      return;
    }

    try {
      await cartService.updateCart(
        item.id,
        {
          quantity: quantity - 1,
        }
      );

      await loadCart();

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );
    }
  };

  // ==========================================
  // REMOVE
  // ==========================================

  const removeFromCart = async (cartId) => {
    try {
      await cartService.removeFromCart(
        cartId
      );

      await loadCart();

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Remove cart error:",
        error
      );
    }
  };

  // ==========================================
  // CLEAR
  // ==========================================

  const clearCart = async () => {
    try {
      await cartService.clearCart();

      setCart([]);
      setCartCount(0);

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        error,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};