import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  STORAGE_KEYS,
  MAX_CART_QUANTITY,
} from "../utils/constants";

// ============================================
// CREATE CONTEXT
// ============================================
const CartContext = createContext(null);

// ============================================
// CART PROVIDER
// ============================================
export const CartProvider = ({ children }) => {

  // ============================================
  // CART STATE
  // ============================================
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");

      return storedCart
        ? JSON.parse(storedCart)
        : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  // ============================================
  // SAVE CART TO LOCAL STORAGE
  // ============================================
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));

    // Notify Navbar / other components
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // ============================================
  // ADD TO CART
  // ============================================
  const addToCart = (book) => {
    setCart((prevCart) => {

      const existingItem = prevCart.find(
        (item) => item.id === book.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id
            ? {
              ...item,
              quantity:
                Number(item.quantity || 1) + 1,
            }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: book.id,
          title: book.title,
          author: book.author || "",
          price: Number(book.price || 0),
          image: book.image || "",
          quantity: 1,
        },
      ];
    });
  };

  // ============================================
  // REMOVE FROM CART
  // ============================================
  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  // ============================================
  // UPDATE QUANTITY
  // ============================================
  const updateQuantity = (id, quantity) => {

    const newQuantity = Number(quantity);

    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: newQuantity,
          }
          : item
      )
    );
  };

  // ============================================
  // INCREASE QUANTITY
  // ============================================
  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity:
              Number(item.quantity || 1) + 1,
          }
          : item
      )
    );
  };

  // ============================================
  // DECREASE QUANTITY
  // ============================================
  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? {
              ...item,
              quantity:
                Number(item.quantity || 1) - 1,
            }
            : item
        )
        .filter(
          (item) => Number(item.quantity) > 0
        )
    );
  };

  // ============================================
  // CLEAR CART
  // ============================================
  const clearCart = () => {
    setCart([]);
  };

  // ============================================
  // CART COUNT
  // ============================================
  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.quantity || 1),
      0
    );
  }, [cart]);

  // ============================================
  // SUBTOTAL
  // ============================================
  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
        Number(item.quantity || 1),
      0
    );
  }, [cart]);

  // ============================================
  // CART VALUE
  // ============================================
  const value = {
    cart,

    setCart,

    addToCart,
    removeFromCart,

    updateQuantity,
    increaseQuantity,
    decreaseQuantity,

    clearCart,

    cartCount,
    cartSubtotal,

    isCartEmpty: cart.length === 0,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};

export default CartContext;