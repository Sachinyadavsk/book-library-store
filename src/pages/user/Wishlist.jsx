import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart,
    faTrash,
    faCartShopping,
    faEye,
} from "@fortawesome/free-solid-svg-icons";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
    const {
        wishlist,
        toggleWishlist,
    } = useWishlist();

    const {
        cart,
        addToCart,
        increaseQuantity,
    } = useCart();

    const wishlistItems = Array.isArray(wishlist)
        ? wishlist
        : [];

    const isInCart = (bookId) => {
        return cart.some((item) => item.id === bookId);
    };

    const handleCart = (book) => {
        if (isInCart(book.id)) {
            increaseQuantity(book.id);
        } else {
            addToCart(book);
        }
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-10">

                <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8 sm:p-10 text-center">

                    <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center">

                        <FontAwesomeIcon
                            icon={faHeart}
                            className="text-3xl text-red-500"
                        />

                    </div>

                    <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-800">
                        Your Wishlist is Empty
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Save your favorite books here and find them later.
                    </p>

                    <Link
                        to="/books"
                        className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        <FontAwesomeIcon icon={faHeart} />
                        Explore Books
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 sm:py-8">

            <div className="max-w-7xl mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            My Wishlist
                        </h1>

                        <p className="mt-1 text-gray-500">
                            {wishlistItems.length}{" "}
                            {wishlistItems.length === 1 ? "book" : "books"} saved
                        </p>
                    </div>

                    <div className="hidden sm:flex w-12 h-12 rounded-full bg-red-50 items-center justify-center">
                        <FontAwesomeIcon
                            icon={faHeart}
                            className="text-red-500 text-xl"
                        />
                    </div>

                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                    {wishlistItems.map((book) => {

                        const inCart = isInCart(book.id);

                        return (
                            <div
                                key={book.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
                            >

                                {/* Image */}
                                <div className="relative bg-gray-100">

                                    <Link to={`/books/${book.id}`}>
                                        <img
                                            src={book.image}
                                            alt={book.title}
                                            className="w-full h-64 object-cover hover:scale-105 transition duration-500"
                                        />
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => toggleWishlist(book)}
                                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500 text-white shadow flex items-center justify-center hover:bg-red-600"
                                        title="Remove from wishlist"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>

                                    <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                                        {book.category}
                                    </span>

                                </div>

                                {/* Content */}
                                <div className="p-4">

                                    <p className="text-xs text-gray-500">
                                        {book.author}
                                    </p>

                                    <Link to={`/books/${book.id}`}>
                                        <h2 className="mt-1 text-lg font-semibold text-gray-800 line-clamp-1 hover:text-blue-600">
                                            {book.title}
                                        </h2>
                                    </Link>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-yellow-500">
                                            ★
                                        </span>

                                        <span className="text-sm font-medium text-gray-700">
                                            {book.rating}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mt-3">

                                        <span className="text-xl font-bold text-blue-600">
                                            ₹{book.price}
                                        </span>

                                        {book.oldPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                ₹{book.oldPrice}
                                            </span>
                                        )}

                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4">

                                        <Link
                                            to={`/books/${book.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                            View
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => handleCart(book)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${inCart
                                                    ? "bg-green-600 text-white hover:bg-green-700"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={faCartShopping} />

                                            {inCart
                                                ? "Add More"
                                                : "Add to Cart"}
                                        </button>

                                    </div>

                                </div>
                            </div>
                        );
                    })}

                </div>

            </div>
        </div>
    );
};

export default Wishlist;