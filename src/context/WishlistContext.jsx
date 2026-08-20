import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ============================================
// CREATE CONTEXT
// ============================================
const WishlistContext = createContext(null);

// ============================================
// WISHLIST PROVIDER
// ============================================
export const WishlistProvider = ({ children }) => {

  // ============================================
  // WISHLIST STATE
  // ============================================
  const [wishlist, setWishlist] = useState(() => {
    try {
      const storedWishlist =
        localStorage.getItem("wishlist");

      return storedWishlist
        ? JSON.parse(storedWishlist)
        : [];
    } catch (error) {
      console.error(
        "Failed to load wishlist:",
        error
      );

      return [];
    }
  });

  // ============================================
  // SAVE TO LOCAL STORAGE
  // ============================================
  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );

    // Notify other components
    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  }, [wishlist]);

  // ============================================
  // ADD TO WISHLIST
  // ============================================
  const addToWishlist = (book) => {
    setWishlist((prevWishlist) => {

      const exists = prevWishlist.some(
        (item) => item.id === book.id
      );

      // Don't add duplicate
      if (exists) {
        return prevWishlist;
      }

      return [
        ...prevWishlist,
        {
          id: book.id,
          title: book.title,
          author: book.author || "",
          price: Number(book.price || 0),
          image: book.image || "",
        },
      ];
    });
  };

  // ============================================
  // REMOVE FROM WISHLIST
  // ============================================
  const removeFromWishlist = (id) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter(
        (item) => item.id !== id
      )
    );
  };

  // ============================================
  // TOGGLE WISHLIST
  // ============================================
  const toggleWishlist = (book) => {
    setWishlist((prevWishlist) => {

      const exists = prevWishlist.some(
        (item) => item.id === book.id
      );

      if (exists) {
        return prevWishlist.filter(
          (item) => item.id !== book.id
        );
      }

      return [
        ...prevWishlist,
        {
          id: book.id,
          title: book.title,
          author: book.author || "",
          price: Number(book.price || 0),
          image: book.image || "",
        },
      ];
    });
  };

  // ============================================
  // CHECK IF BOOK IS IN WISHLIST
  // ============================================
  const isInWishlist = (id) => {
    return wishlist.some(
      (item) => item.id === id
    );
  };

  // ============================================
  // CLEAR WISHLIST
  // ============================================
  const clearWishlist = () => {
    setWishlist([]);
  };

  // ============================================
  // WISHLIST COUNT
  // ============================================
  const wishlistCount = useMemo(() => {
    return wishlist.length;
  }, [wishlist]);

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value = {
    wishlist,

    setWishlist,

    addToWishlist,
    removeFromWishlist,
    toggleWishlist,

    isInWishlist,

    clearWishlist,

    wishlistCount,

    isWishlistEmpty: wishlist.length === 0,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
};

export default WishlistContext;