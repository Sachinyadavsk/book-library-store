import React from "react";
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
} from "@fortawesome/free-solid-svg-icons";

import books from "../../staticValue/bookData";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ============================================
  // AUTH
  // ============================================
  const { user } = useAuth();

  // ============================================
  // CART
  // ============================================
  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  // ============================================
  // WISHLIST
  // ============================================
  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  // ============================================
  // FIND BOOK
  // ============================================
  const book = books.find(
    (item) => String(item.id) === String(id)
  );

  // ============================================
  // BOOK NOT FOUND
  // ============================================
  if (!book) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-6xl mb-4">
            📚
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Book Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            The book you are looking for does not exist.
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

  // ============================================
  // CART ITEM
  // ============================================
  const cartItem = cart.find(
    (item) => item.id === book.id
  );

  const inCart = !!cartItem;

  const quantity = cartItem?.quantity || 0;

  // ============================================
  // WISHLIST
  // ============================================
  const inWishlist = isInWishlist(book.id);

  // ============================================
  // ADD / UPDATE CART
  // ============================================
  const handleAddToCart = () => {
    if (inCart) {
      increaseQuantity(book.id);
    } else {
      addToCart(book);
    }
  };

  // ============================================
  // BUY NOW
  // ============================================
  const handleBuyNow = () => {

    // Guest can add to cart
    if (!inCart) {
      addToCart(book);
    }

    // Checkout requires login
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

    // Logged in → checkout
    navigate("/checkout");
  };

  // ============================================
  // WISHLIST
  // ============================================
  const handleWishlist = () => {
    toggleWishlist(book);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ============================================
                BREADCRUMB
            ============================================ */}
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

      {/* ============================================
                MAIN
            ============================================ */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ====================================
                        BOOK IMAGE
                    ==================================== */}
          <div>

            <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">

              <img
                src={book.image}
                alt={book.title}
                className="w-full h-[450px] sm:h-[550px] object-contain p-6"
              />

              {/* Category */}
              <span className="absolute top-4 left-4 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full">
                {book.category}
              </span>

              {/* Wishlist */}
              <button
                type="button"
                onClick={handleWishlist}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full shadow flex items-center justify-center transition ${inWishlist
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-500 hover:text-red-500"
                  }`}
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

          {/* ====================================
                        BOOK INFORMATION
                    ==================================== */}
          <div className="flex flex-col justify-center">

            {/* Author */}
            <p className="text-blue-600 font-medium">
              {book.author}
            </p>

            {/* Title */}
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800">
              {book.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-4">

              <div className="flex items-center gap-1 text-yellow-500">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                      className={
                        star <=
                          Math.round(
                            book.rating
                          )
                          ? ""
                          : "text-gray-300"
                      }
                    />
                  )
                )}

              </div>

              <span className="font-semibold text-gray-700">
                {book.rating}
              </span>

              <span className="text-gray-400">
                Excellent
              </span>

            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-6">

              <span className="text-3xl font-bold text-blue-600">
                ₹{book.price}
              </span>

              {book.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{book.oldPrice}
                </span>
              )}

            </div>

            {/* Description */}
            <div className="mt-6">

              <h2 className="text-lg font-bold text-gray-800">
                About this book
              </h2>

              <p className="mt-2 text-gray-600 leading-7">
                {book.description ||
                  "Discover this wonderful book and explore an engaging reading experience from the author."}
              </p>

            </div>

            {/* ====================================
                            CART QUANTITY
                        ==================================== */}
            {inCart && (
              <div className="mt-6">

                <p className="text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </p>

                <div className="flex items-center w-fit border border-gray-300 rounded-xl overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(
                        book.id
                      )
                    }
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100"
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
                    onClick={() =>
                      increaseQuantity(
                        book.id
                      )
                    }
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                    />
                  </button>

                </div>

              </div>
            )}

            {/* ====================================
                            ACTIONS
                        ==================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">

              {/* Add Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition ${inCart
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >

                <FontAwesomeIcon
                  icon={
                    inCart
                      ? faCheck
                      : faCartShopping
                  }
                />

                {inCart
                  ? "Added to Cart"
                  : "Add to Cart"}

              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 px-5 py-3.5 border border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                Buy Now
                <FontAwesomeIcon
                  icon={faArrowRight}
                />
              </button>

            </div>

            {/* Wishlist */}
            <button
              type="button"
              onClick={handleWishlist}
              className={`mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium transition ${inWishlist
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <FontAwesomeIcon
                icon={faHeart}
              />

              {inWishlist
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>

            {/* ====================================
                            LOGIN INFORMATION
                        ==================================== */}
            {!user && (
              <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl">

                <p className="text-sm text-blue-700">
                  You can add books to your cart and
                  wishlist without logging in.
                  Login is required only when you
                  proceed to checkout.
                </p>

              </div>
            )}

            {/* ====================================
                            CART STATUS
                        ==================================== */}
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