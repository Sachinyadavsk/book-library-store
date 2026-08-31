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
  // GET BOOK ID
  // ==========================================
  const getBookId = (book) => {
    if (!book) return null;

    return (
      book.book_id ??
      book.bookId ??
      book.book?.id ??
      book.book?._id ??
      book.id ??
      book._id ??
      null
    );
  };


  // ==========================================
  // NORMALIZE ID
  // ==========================================
  const normalizeId = (id) => {
    if (
      id === null ||
      id === undefined
    ) {
      return "";
    }

    return String(id);
  };


  // ==========================================
  // FIND CART ITEM BY BOOK ID
  // ==========================================
  const findCartItem = (bookId) => {
    const normalizedBookId =
      normalizeId(bookId);

    if (!normalizedBookId) {
      return null;
    }

    return (
      cart.find((item) => {

        const itemBookId =
          getBookId(item);

        return (
          normalizeId(itemBookId) ===
          normalizedBookId
        );

      }) || null
    );
  };


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

      const response =
        await cartService.getCart();

      console.log(
        "Cart API Response:",
        response
      );


      // ----------------------------------------
      // SUPPORT MULTIPLE API RESPONSE FORMATS
      // ----------------------------------------

      let cartData = [];

      if (Array.isArray(response)) {

        cartData = response;

      } else if (
        Array.isArray(response?.data)
      ) {

        cartData = response.data;

      } else if (
        Array.isArray(response?.cart)
      ) {

        cartData = response.cart;

      } else if (
        Array.isArray(response?.items)
      ) {

        cartData = response.items;

      } else if (
        Array.isArray(response?.data?.cart)
      ) {

        cartData =
          response.data.cart;

      } else if (
        Array.isArray(response?.data?.items)
      ) {

        cartData =
          response.data.items;

      }


      setCart(cartData);


      // ----------------------------------------
      // CART COUNT
      // ----------------------------------------

      const total =
        cartData.reduce(
          (sum, item) =>
            sum +
            Number(
              item?.quantity || 1
            ),
          0
        );

      setCartCount(total);

    } catch (error) {

      console.error(
        "Get cart error:",
        error
      );

      setCart([]);
      setCartCount(0);

      setError(
        error?.response?.data?.message ||
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


    const bookId =
      getBookId(book);


    if (!bookId) {

      const error =
        new Error(
          "Book ID is missing."
        );

      console.error(
        "Add to cart error:",
        error
      );

      setError(
        "Unable to add book to cart. Book ID is missing."
      );

      throw error;
    }


    try {

      setError("");


      const response =
        await cartService.addToCart({
          book_id: bookId,
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
        error?.response?.data?.message ||
        error?.message ||
        "Unable to add book to cart."
      );


      throw error;

    }
  };


  // ==========================================
  // INCREASE QUANTITY
  // ==========================================
  const increaseQuantity = async (
    bookId
  ) => {

    const item =
      findCartItem(bookId);


    if (!item) {

      console.warn(
        "Cart item not found for book:",
        bookId
      );

      return;

    }


    const cartId =
      item.id ??
      item.cart_id ??
      item.cartId ??
      item._id;


    if (!cartId) {

      console.error(
        "Cart item ID missing:",
        item
      );

      return;

    }


    const quantity =
      Number(
        item.quantity || 1
      );


    try {

      await cartService.updateCart(
        cartId,
        {
          quantity:
            quantity + 1,
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

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to increase quantity."
      );

    }
  };


  // ==========================================
  // DECREASE QUANTITY
  // ==========================================
  const decreaseQuantity = async (
    bookId
  ) => {

    const item =
      findCartItem(bookId);


    if (!item) {

      console.warn(
        "Cart item not found for book:",
        bookId
      );

      return;

    }


    const cartId =
      item.id ??
      item.cart_id ??
      item.cartId ??
      item._id;


    if (!cartId) {

      console.error(
        "Cart item ID missing:",
        item
      );

      return;

    }


    const quantity =
      Number(
        item.quantity || 1
      );


    // ----------------------------------------
    // REMOVE WHEN QUANTITY REACHES ZERO
    // ----------------------------------------

    if (quantity <= 1) {

      await removeFromCart(
        cartId
      );

      return;

    }


    try {

      await cartService.updateCart(
        cartId,
        {
          quantity:
            quantity - 1,
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

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to decrease quantity."
      );

    }
  };


  // ==========================================
  // REMOVE FROM CART
  // ==========================================
  const removeFromCart = async (
    cartId
  ) => {

    if (!cartId) {
      return;
    }


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


      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to remove item from cart."
      );

    }
  };


  // ==========================================
  // CLEAR CART
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


      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to clear cart."
      );

    }
  };


  // ==========================================
  // CONTEXT
  // ==========================================
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

        findCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


// ==========================================
// USE CART
// ==========================================
export const useCart = () => {

  const context =
    useContext(CartContext);


  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    );

  }


  return context;
};