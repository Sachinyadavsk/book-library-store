
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import wishlistService from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET WISHLIST
  // ==========================================

  const loadWishlist = async () => {
    // User is not logged in
    if (!user) {
      setWishlist([]);
      setWishlistCount(0);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await wishlistService.getWishlist();

      console.log("Wishlist API Response:", response);

      // Handle different API response formats
      const data =
        response?.data ??
        response?.wishlist ??
        response?.items ??
        response ??
        [];

      const wishlistData = Array.isArray(data)
        ? data
        : [];

      setWishlist(wishlistData);
      setWishlistCount(wishlistData.length);
    } catch (err) {
      console.error("Get wishlist error:", err);

      setWishlist([]);
      setWishlistCount(0);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WISHLIST WHEN USER CHANGES
  // ==========================================

  useEffect(() => {
    loadWishlist();
  }, [user]);

  // ==========================================
  // GET BOOK ID
  // ==========================================

  const getBookId = (book) => {
    if (!book) {
      return null;
    }

    return (
      book.id ??
      book._id ??
      book.book_id ??
      book.book?.id ??
      book.book?._id ??
      null
    );
  };

  // ==========================================
  // GET WISHLIST BOOK ID
  // ==========================================

  const getWishlistBookId = (item) => {
    if (!item) {
      return null;
    }

    return (
      item.book_id ??
      item.book?.id ??
      item.book?._id ??
      item.id
    );
  };

  // ==========================================
  // CHECK IF BOOK IS IN WISHLIST
  // ==========================================

  const isInWishlist = (bookId) => {
    if (!bookId) {
      return false;
    }

    return wishlist.some((item) => {
      const wishlistBookId = getWishlistBookId(item);

      return (
        wishlistBookId !== null &&
        String(wishlistBookId) === String(bookId)
      );
    });
  };

  // ==========================================
  // ADD TO WISHLIST
  // ==========================================

  const addToWishlist = async (book) => {
    if (!user) {
      return {
        success: false,
        requiresLogin: true,
      };
    }

    const bookId = getBookId(book);

    if (!bookId) {
      const error = new Error(
        "Book ID is required to add to wishlist."
      );

      setError(error.message);

      throw error;
    }

    try {
      setLoading(true);
      setError("");

      await wishlistService.addToWishlist({
        book_id: bookId,
      });

      // Reload wishlist from server
      await loadWishlist();

      // Notify other components
      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

      return {
        success: true,
      };
    } catch (err) {
      console.error("Add wishlist error:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to add item to wishlist.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  const removeFromWishlist = async (
    wishlistItemId
  ) => {
    if (!user) {
      return {
        success: false,
        requiresLogin: true,
      };
    }

    if (!wishlistItemId) {
      const error = new Error(
        "Wishlist item ID is required."
      );

      setError(error.message);

      throw error;
    }

    try {
      setLoading(true);
      setError("");

      await wishlistService.removeFromWishlist(
        wishlistItemId
      );

      // Reload wishlist from server
      await loadWishlist();

      // Notify other components
      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

      return {
        success: true,
      };
    } catch (err) {
      console.error(
        "Remove wishlist error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to remove item from wishlist.";

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // TOGGLE WISHLIST
  // ==========================================

  const toggleWishlist = async (book) => {
    if (!user) {
      return {
        success: false,
        requiresLogin: true,
      };
    }

    const bookId = getBookId(book);

    if (!bookId) {
      const error = new Error(
        "Book ID is required."
      );

      setError(error.message);

      throw error;
    }

    // Find existing wishlist item
    const existingItem = wishlist.find(
      (item) => {
        const wishlistBookId =
          getWishlistBookId(item);

        return (
          wishlistBookId !== null &&
          String(wishlistBookId) ===
          String(bookId)
        );
      }
    );

    // ========================================
    // REMOVE
    // ========================================

    if (existingItem) {
      // IMPORTANT:
      // Remove using the wishlist item's ID,
      // NOT the book ID.
      const wishlistItemId =
        existingItem.id ??
        existingItem._id;

      return removeFromWishlist(
        wishlistItemId
      );
    }

    // ========================================
    // ADD
    // ========================================

    return addToWishlist(book);
  };

  // ==========================================
  // CLEAR ERROR
  // ==========================================

  const clearWishlistError = () => {
    setError("");
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    wishlist,
    wishlistCount,
    loading,
    error,

    // Checking
    isInWishlist,

    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,

    // Reload
    loadWishlist,

    // Error
    clearWishlistError,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// ==========================================
// USE WISHLIST HOOK
// ==========================================

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside a WishlistProvider"
    );
  }

  return context;
};

