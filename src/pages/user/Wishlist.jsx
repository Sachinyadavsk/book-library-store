
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
    const {
        wishlist = [],
        removeFromWishlist,
        wishlistCount,
        getBookById,
    } = useWishlist();

    const { addToCart } = useCart();
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch complete book details

    useEffect(() => {
        let mounted = true;
        const fetchWishlistBooks = async () => {
            if (!wishlist || wishlist.length === 0) {
                if (mounted) {
                    setWishlistBooks([]);
                    setLoading(false);
                }
                return;
            }

            try {
                setLoading(true);
                const result = await Promise.all(
                    wishlist.map(async (item) => {
                        const bookId = item?.book;
                        if (!bookId) {
                            return null;
                        }
                        const book = await getBookById(bookId);
                        if (!book) {
                            return null;
                        }
                        return {
                            wishlistId: item?._id,
                            userId: item?.user,
                            bookId: book?._id,
                            book: book,
                        };
                    })
                );

                if (mounted) {
                    setWishlistBooks(result.filter(Boolean));
                }
            } catch (error) {
                console.error("Fetch Wishlist Books Error:", error);
                if (mounted) {
                    setWishlistBooks([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchWishlistBooks();
        return () => {
            mounted = false;
        };
    }, [wishlist, getBookById]);


    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <p className="text-gray-500">Loading wishlist...</p>
                </div>
            </div>
        );
    }

    // Empty Wishlist
    if (wishlist.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">❤️</div>
                    <h1 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty</h1>
                    <p className="mt-2 text-gray-500">Save your favorite books here.</p>
                    <Link
                        to="/books"
                        className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                    >
                        Browse Books
                    </Link>
                </div>
            </div>
        );
    }

    // Wishlist exists but book details not found
    if (wishlistBooks.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h1 className="text-2xl font-bold text-gray-800">Books Not Found</h1>
                    <p className="mt-2 text-gray-500">
                        We couldn't load the books in your wishlist.
                    </p>
                    <Link
                        to="/books"
                        className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
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
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Wishlist</h1>
                        <p className="text-sm text-gray-500 mt-1">{wishlistCount} saved books</p>
                    </div>
                    <span className="text-2xl">❤️</span>
                </div>

                {/* BOOK GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {wishlistBooks.map((item) => {
                        const book = item?.book;
                        const wishlistId = item?.wishlistId;
                        const bookId = item?.bookId;
                        if (!book) {
                            return null;
                        }

                        return (
                            <div key={wishlistId || bookId}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                            >

                                {/* BOOK IMAGE */}
                                <div className="h-64 bg-gray-100">
                                    <img src={book?.images?.[0] || "/images/book-placeholder.jpg"}
                                        alt={book?.title || "Book"}
                                        className="w-full h-full object-cover" />
                                </div>

                                {/* BOOK DETAILS */}
                                <div className="p-4">
                                    {/* TITLE */}
                                    <h2 className="font-semibold text-gray-800 line-clamp-2">
                                        {book?.title ||
                                            "Untitled Book"}
                                    </h2>

                                    {/* AUTHOR */}
                                    {book?.author && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            By{" "}
                                            {typeof book.author ===
                                                "object"
                                                ? book.author?.name
                                                : book.author}
                                        </p>
                                    )}

                                    {/* PRICE */}
                                    <p className="mt-3 text-lg font-bold text-blue-600">
                                        ₹
                                        {Number(
                                            book?.discountPrice >
                                                0
                                                ? book.discountPrice
                                                : book?.price || 0
                                        ).toFixed(2)}
                                    </p>

                                    {/* STOCK */}
                                    {Number(book?.stock) > 0 ? (
                                        <p className="text-sm text-green-600 mt-1">
                                            In Stock
                                        </p>
                                    ) : (
                                        <p className="text-sm text-red-500 mt-1">
                                            Out of Stock
                                        </p>
                                    )}

                                    {/* ADD TO CART */}
                                    <button
                                        type="button"
                                        disabled={
                                            Number(
                                                book?.stock || 0
                                            ) <= 0
                                        }
                                        onClick={() =>
                                            addToCart(book)
                                        }
                                        className={`mt-4 w-full py-2.5 rounded-xl font-semibold transition ${Number(
                                            book?.stock || 0
                                        ) > 0
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        {Number(
                                            book?.stock || 0
                                        ) > 0
                                            ? "Add to Cart"
                                            : "Out of Stock"}
                                    </button>

                                    {/* REMOVE FROM WISHLIST */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeFromWishlist(
                                                wishlistId
                                            )
                                        }
                                        className="mt-2 w-full py-2.5 border border-red-300 text-red-500 rounded-xl font-medium hover:bg-red-50 transition"
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

