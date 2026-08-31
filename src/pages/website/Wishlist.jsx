import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
    const { wishlist, removeFromWishlist, wishlistCount, } = useWishlist();
    const { addToCart } = useCart();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">❤️</div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Your Wishlist is Empty
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Save your favorite books here.
                    </p>
                    <Link to="/books"
                        className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
                    >
                        Browse Books
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            My Wishlist
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {wishlistCount} saved books
                        </p>
                    </div>
                    <span className="text-2xl">
                        ❤️
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {wishlist.map((item) => {

                        console.log(
                            "FULL WISHLIST ITEM:",
                            item
                        );

                        console.log(
                            "WISHLIST ID:",
                            item?._id
                        );

                        console.log(
                            "BOOK:",
                            item?.book
                        );

                        const book =
                            item?.book || item;

                        const bookId =
                            book?._id ||
                            book?.id;

                        const wishlistId =
                            item?._id ||
                            item?.id;

                        return (
                            <div
                                key={wishlistId || bookId}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                            >

                                <div className="h-64 bg-gray-100">

                                    <img
                                        src={
                                            book?.image ||
                                            book?.images?.[0] ||
                                            "/images/book-placeholder.jpg"
                                        }
                                        alt={book?.title || "Book"}
                                        className="w-full h-full object-cover"
                                    />

                                </div>


                                <div className="p-4">

                                    <h2 className="font-semibold text-gray-800 line-clamp-2">
                                        {book?.title}
                                    </h2>


                                    {book?.author && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            By {book.author}
                                        </p>
                                    )}


                                    <p className="mt-3 text-lg font-bold text-blue-600">
                                        ₹{Number(book?.price || 0).toFixed(2)}
                                    </p>


                                    {/* ADD TO CART */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            addToCart(book)
                                        }
                                        className="mt-4 w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                                    >
                                        Add to Cart
                                    </button>


                                    {/* REMOVE FROM WISHLIST */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFromWishlist(
                                                wishlistId
                                            )
                                        }
                                        className="mt-2 w-full py-2.5 border border-red-300 text-red-500 rounded-xl font-medium hover:bg-red-50"
                                    >
                                        Remove
                                    </button>

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