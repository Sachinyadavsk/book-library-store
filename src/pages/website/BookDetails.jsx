import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCartShopping,
  faCheck,
  faHeart,
  faMinus,
  faPlus,
  faStar,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import bookService from "../../services/bookService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // BOOK STATE
  // ==========================================

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // ==========================================
  // AUTH
  // ==========================================

  const { user } = useAuth();

  // ==========================================
  // CART
  // ==========================================

  const {
    cart = [],
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  // ==========================================
  // WISHLIST
  // ==========================================

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  // ==========================================
  // GET SINGLE BOOK
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");
        setBook(null);

        let response;

        // Preferred API
        if (typeof bookService.getBookById === "function") {
          response = await bookService.getBookById(id);
        } else {
          // Fallback
          response = await bookService.getBooks();
        }

        console.log("Book API Response:", response);

        // ======================================
        // NORMALIZE RESPONSE
        // ======================================

        let bookData =
          response?.data ??
          response?.book ??
          response?.result ??
          response?.books ??
          response;

        // API may return:
        // { data: { book: {...} } }

        if (bookData?.book) {
          bookData = bookData.book;
        }

        // API may return:
        // { data: [...] }

        if (Array.isArray(bookData)) {
          bookData = bookData.find(
            (item) =>
              String(item?.id) === String(id) ||
              String(item?._id) === String(id)
          );
        }

        if (!mounted) return;

        if (bookData) {
          setBook(bookData);
        } else {
          setBook(null);
          setError("Book not found.");
        }
      } catch (err) {
        console.error("Get book error:", err);

        if (!mounted) return;

        setBook(null);
        setError(
          err?.message ||
          "Unable to load book. Please try again."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchBook();
    } else {
      setLoading(false);
      setBook(null);
      setError("Invalid book ID.");
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-4xl text-blue-600"
          />

          <p className="mt-4 text-gray-600">
            Loading book...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // BOOK NOT FOUND
  // ==========================================

  if (!book) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">
            📚
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Book Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            {error ||
              "The book you are looking for does not exist."}
          </p>

          <Link
            to="/books"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // BOOK ID
  // ==========================================

  const bookId = book.id ?? book._id;

  // ==========================================
  // CART ITEM
  // ==========================================

  const cartItem = Array.isArray(cart)
    ? cart.find(
      (item) =>
        String(item?.id ?? item?.bookId ?? item?._id) ===
        String(bookId)
    )
    : null;

  const inCart = Boolean(cartItem);

  const quantity = Number(
    cartItem?.quantity || 0
  );

  // ==========================================
  // WISHLIST
  // ==========================================

  const inWishlist =
    typeof isInWishlist === "function"
      ? isInWishlist(bookId)
      : false;

  // ==========================================
  // LOGIN REDIRECT
  // ==========================================

  const requireLogin = (message) => {
    navigate("/login", {
      state: {
        from: `/books/${bookId}`,
        message,
      },
    });
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = async () => {
    if (!user) {
      requireLogin(
        "Please login to add books to your cart."
      );
      return;
    }

    try {
      setActionLoading(true);

      if (inCart) {
        await increaseQuantity(bookId);
      } else {
        await addToCart(book);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const handleIncrease = async () => {
    if (!user) {
      requireLogin(
        "Please login to update your cart."
      );
      return;
    }

    try {
      setActionLoading(true);
      await increaseQuantity(bookId);
    } catch (err) {
      console.error(
        "Increase quantity error:",
        err
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const handleDecrease = async () => {
    if (!user) {
      requireLogin(
        "Please login to update your cart."
      );
      return;
    }

    if (quantity <= 1) {
      return;
    }

    try {
      setActionLoading(true);
      await decreaseQuantity(bookId);
    } catch (err) {
      console.error(
        "Decrease quantity error:",
        err
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // BUY NOW
  // ==========================================

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/checkout",
          message:
            "Please login to continue checkout.",
        },
      });

      return;
    }

    try {
      setActionLoading(true);

      // Add book if it isn't already in cart
      if (!inCart) {
        await addToCart(book);
      }

      // Go to checkout after cart operation
      navigate("/checkout");
    } catch (err) {
      console.error(
        "Buy now error:",
        err
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // WISHLIST
  // ==========================================

  const handleWishlist = async () => {
    if (!user) {
      requireLogin(
        "Please login to manage your wishlist."
      );
      return;
    }

    try {
      setActionLoading(true);

      await toggleWishlist(book);
    } catch (err) {
      console.error(
        "Wishlist error:",
        err
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // RATING
  // ==========================================

  const rating = Number(book.rating || 0);

  // ==========================================
  // IMAGE
  // ==========================================

  const image =
    book.image ||
    book.coverImage ||
    book.cover ||
    book.imageUrl ||
    "/images/book-placeholder.jpg";

  // ==========================================
  // AUTHOR
  // ==========================================

  const author =
    typeof book.author === "object"
      ? book.author?.name
      : book.author;

  // ==========================================
  // CATEGORY
  // ==========================================

  const category =
    typeof book.category === "object"
      ? book.category?.name
      : book.category;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================================
          BREADCRUMB
      ====================================== */}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">

          <div className="flex items-center gap-2 text-sm">

            <Link
              to="/"
              className="text-gray-500 hover:text-blue-600"
            >
              Home
            </Link>

            <span className="text-gray-400">
              /
            </span>

            <Link
              to="/books"
              className="text-gray-500 hover:text-blue-600"
            >
              Books
            </Link>

            <span className="text-gray-400">
              /
            </span>

            <span className="text-gray-800 font-medium truncate">
              {book.title}
            </span>

          </div>

        </div>
      </div>

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ==================================
              IMAGE
          ================================== */}

          <div>

            <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">

              <img
                src={image}
                alt={book.title || "Book"}
                className="w-full h-[450px] sm:h-[550px] object-contain p-6"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "/images/book-placeholder.jpg";
                }}
              />

              {/* CATEGORY */}

              {category && (
                <span className="absolute top-4 left-4 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full">
                  {category}
                </span>
              )}

              {/* WISHLIST */}

              <button
                type="button"
                onClick={handleWishlist}
                disabled={actionLoading}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full shadow flex items-center justify-center transition ${inWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-500 hover:text-red-500"
                  } disabled:opacity-60`}
                title={
                  inWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                <FontAwesomeIcon
                  icon={faHeart}
                />
              </button>

            </div>

          </div>

          {/* ==================================
              BOOK INFORMATION
          ================================== */}

          <div className="flex flex-col justify-center">

            {/* AUTHOR */}

            {author && (
              <p className="text-blue-600 font-medium">
                {author}
              </p>
            )}

            {/* TITLE */}

            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800">
              {book.title}
            </h1>

            {/* RATING */}

            <div className="flex items-center gap-3 mt-4">

              <div className="flex items-center gap-1 text-yellow-500">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={
                        star <=
                          Math.round(rating)
                          ? ""
                          : "text-gray-300"
                      }
                    />
                  )
                )}

              </div>

              <span className="font-semibold text-gray-700">
                {rating > 0
                  ? rating.toFixed(1)
                  : "No rating"}
              </span>

            </div>

            {/* PRICE */}

            <div className="flex items-center gap-3 mt-6">

              <span className="text-3xl font-bold text-blue-600">
                ₹
                {Number(
                  book.price || 0
                ).toFixed(2)}
              </span>

              {book.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹
                  {Number(
                    book.oldPrice
                  ).toFixed(2)}
                </span>
              )}

            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">

              <h2 className="text-lg font-bold text-gray-800">
                About this book
              </h2>

              <p className="mt-2 text-gray-600 leading-7">
                {book.description ||
                  "Discover this wonderful book and explore an engaging reading experience from the author."}
              </p>

            </div>

            {/* ==================================
                CART QUANTITY
            ================================== */}

            {inCart && (
              <div className="mt-6">

                <p className="text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </p>

                <div className="flex items-center w-fit border border-gray-300 rounded-xl overflow-hidden">

                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={
                      actionLoading ||
                      quantity <= 1
                    }
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <FontAwesomeIcon
                      icon={faMinus}
                    />
                  </button>

                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrease}
                    disabled={actionLoading}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                    />
                  </button>

                </div>

              </div>
            )}

            {/* ==================================
                ACTIONS
            ================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

              {/* ADD CART */}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={actionLoading}
                className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition ${inCart
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
              >

                {actionLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={
                      inCart
                        ? faCheck
                        : faCartShopping
                    }
                  />
                )}

                {actionLoading
                  ? "Processing..."
                  : inCart
                    ? "Added to Cart"
                    : "Add to Cart"}

              </button>

              {/* BUY NOW */}

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 px-5 py-3.5 border border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition disabled:opacity-60"
              >

                {actionLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  <>
                    Buy Now
                    <FontAwesomeIcon
                      icon={faArrowRight}
                    />
                  </>
                )}

              </button>

            </div>

            {/* ==================================
                WISHLIST
            ================================== */}

            <button
              type="button"
              onClick={handleWishlist}
              disabled={actionLoading}
              className={`mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition ${inWishlist
                ? "bg-red-50 text-red-600 border border-red-200"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-60`}
            >

              <FontAwesomeIcon
                icon={faHeart}
              />

              {inWishlist
                ? "Remove from Wishlist"
                : "Add to Wishlist"}

            </button>

            {/* ==================================
                GUEST MESSAGE
            ================================== */}

            {!user && (
              <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">

                <p className="text-sm text-blue-700">
                  Please login to add books to your
                  cart or wishlist and continue with
                  checkout.
                </p>

              </div>
            )}

            {/* ==================================
                CART STATUS
            ================================== */}

            {inCart && (
              <Link
                to="/cart"
                className="mt-5 flex items-center justify-center gap-2 text-blue-600 font-medium hover:text-blue-700"
              >

                <FontAwesomeIcon
                  icon={faCartShopping}
                />

                View Cart

              </Link>
            )}

          </div>

        </div>

      </main>

    </div>
  );
};

export default BookDetails;