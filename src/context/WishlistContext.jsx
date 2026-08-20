import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import wishlistService from "../services/wishlistService";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({
  children,
}) => {
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // GET WISHLIST
  // ==========================================

  const loadWishlist = async () => {
    if (!user) {
      setWishlist([]);
      setWishlistCount(0);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await wishlistService.getWishlist();

      console.log(
        "Wishlist API Response:",
        response
      );

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
      setWishlistCount(
        wishlistData.length
      );
    } catch (error) {
      console.error(
        "Get wishlist error:",
        error
      );

      setWishlist([]);
      setWishlistCount(0);

      setError(
        error?.message ||
        "Unable to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN USER CHANGES
  // ==========================================

  useEffect(() => {
    loadWishlist();
  }, [user]);

  // ==========================================
  // CHECK WISHLIST
  // ==========================================

  const isInWishlist = (bookId) => {
    return wishlist.some(
      (item) =>
        String(
          item.book_id ?? item.book?.id
        ) === String(bookId)
    );
  };

  // ==========================================
  // ADD / REMOVE
  // ==========================================

  const toggleWishlist = async (book) => {
    if (!user) {
      return {
        success: false,
        requiresLogin: true,
      };
    }

    const bookId =
      book.id ?? book._id;

    const existingItem = wishlist.find(
      (item) =>
        String(
          item.book_id ?? item.book?.id
        ) === String(bookId)
    );

    try {
      setError("");

      // ======================================
      // REMOVE
      // ======================================

      if (existingItem) {
        await wishlistService.removeFromWishlist(
          existingItem.id
        );
      }

      // ======================================
      // ADD
      // ======================================

      else {
        await wishlistService.addToWishlist({
          book_id: bookId,
        });
      }

      await loadWishlist();

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "Wishlist error:",
        error
      );

      setError(
        error?.message ||
        "Unable to update wishlist."
      );

      throw error;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        error,
        isInWishlist,
        toggleWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};