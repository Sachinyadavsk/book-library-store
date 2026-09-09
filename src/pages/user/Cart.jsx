
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faPlus,
    faMinus,
    faTrash,
    faArrowLeft,
    faArrowRight,
    faBagShopping,
    faSpinner,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/CartContext";

const Cart = () => {
    const navigate = useNavigate();
    const {
        cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        loading: cartLoading,
    } = useCart();
    const [actionLoading, setActionLoading] = useState(false);

    // NORMALIZE CART API DATA
    const cartItems = useMemo(() => {
        if (!Array.isArray(cart)) {
            return [];
        }

        const hasCartDocuments = cart.some((item) =>
            Array.isArray(item?.items)
        );

        if (hasCartDocuments) {
            return cart.flatMap((cartData) =>
                Array.isArray(cartData?.items)
                    ? cartData.items
                    : []
            );
        }
        return cart;
    }, [cart]);


    // GET BOOK OBJECT
    const getBook = (item) => {
        if (item?.book && typeof item.book === "object") {
            return item.book;
        }

        return null;
    };

    // GET BOOK ID
    const getBookId = (item) => {
        const book = getBook(item);
        return (
            book?._id || book?.id ||
            (typeof item?.book === "string"
                ? item.book
                : null) ||
            item?.book_id ||
            item?.bookId ||
            item?.id ||
            item?._id ||
            ""
        );
    };


    // GET CART ITEM ID
    const getCartItemId = (item) => {
        return (item?._id || item?.cartItemId || item?.cart_id || item?.id || "");
    };


    // GET TITLE
    const getTitle = (item) => {
        const book = getBook(item);
        return (item?.title || item?.name || book?.title || "Book");
    };

    // GET IMAGE
    const getImage = (item) => {
        const book = getBook(item);
        return (item?.images || book?.images?.[0] || ""
        );
    };

    // GET AUTHOR
    const getAuthor = (item) => {
        const book = getBook(item);
        return (item?.author || book?.author || "");
    };

    // GET CATEGORY
    const getCategory = (item) => {
        const book = getBook(item);
        return (item?.category || book?.category || "");
    };

    // GET PRICE
    const getPrice = (item) => {
        const book = getBook(item);
        return Number(item?.price ?? book?.price ?? 0);
    };

    // GET OLD PRICE
    const getOldPrice = (item) => {
        const book = getBook(item);
        return (item?.oldPrice ?? book?.oldPrice ?? book?.originalPrice ?? null);
    };

    // GET QUANTITY
    const getQuantity = (item) => {
        const quantity = Number(item?.quantity ?? 1);
        return quantity > 0 ? quantity : 1;
    };

    // TOTAL ITEMS
    const totalItems = cartItems.reduce(
        (total, item) => total + getQuantity(item),
        0
    );

    // SUBTOTAL
    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            getPrice(item) *
            getQuantity(item),
        0
    );


    // SHIPPING
    // Free shipping above ₹500
    const shipping = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 50;

    // GRAND TOTAL
    const grandTotal = subtotal + shipping;

    // CHECKOUT
    const handleCheckout = () => {
        if (actionLoading || cartLoading) {
            return;
        }

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return;
        }

        if (subtotal <= 0 || grandTotal <= 0) {
            return;
        }
        navigate("/checkout");
    };


    // REMOVE ITEM
    const handleRemove = async (item) => {
        const bookId = getBookId(item);
        const cartItemId = getCartItemId(item);
        if (!bookId && !cartItemId) {
            console.error("Cannot remove cart item. Missing ID:", item);
            return;
        }

        try {
            setActionLoading(true);
            await removeFromCart(bookId || cartItemId);
        } catch (error) {
            console.error("Remove cart item error:", error);
        } finally {
            setActionLoading(false);
        }
    };


    // INCREASE QUANTITY
    const handleIncrease = async (item) => {
        const bookId = getBookId(item);
        if (!bookId) {
            console.error("Cannot increase quantity. Missing book ID:", item);
            return;
        }

        try {
            setActionLoading(true);
            await increaseQuantity(bookId);
        } catch (error) {
            console.error("Increase quantity error:", error);
        } finally {
            setActionLoading(false);
        }
    };


    // DECREASE QUANTITY
    const handleDecrease = async (item) => {
        const bookId = getBookId(item);
        const quantity = getQuantity(item);
        if (!bookId) {
            console.error("Cannot decrease quantity. Missing book ID:", item);
            return;
        }

        try {
            setActionLoading(true);
            if (quantity > 1) {
                await decreaseQuantity(bookId);
            } else {
                await removeFromCart(bookId);
            }
        } catch (error) {
            console.error("Decrease quantity error:", error);
        } finally {
            setActionLoading(false);
        }
    };

    // DEBUG CART API DATA
    useEffect(() => {
        console.log("Cart API / Context Data:", cart);
        console.log("Normalized Cart Items:", cartItems);
    }, [cart, cartItems]);


    // EMPTY CART
    if (!cartLoading && (!cartItems || cartItems.length === 0)) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            className="text-3xl"
                        />
                    </div>
                    <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-800">
                        Your Cart is Empty
                    </h1>
                    <p className="mt-3 text-gray-500">
                        Looks like you haven't added any books
                        to your cart yet.
                    </p>
                    <Link
                        to="/books"
                        className="inline-flex items-center gap-2 mt-7 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        <FontAwesomeIcon icon={faBagShopping} />
                        Browse Books
                    </Link>
                </div>
            </div>
        );
    }


    // LOADING
    if (cartLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="text-4xl text-blue-600"
                    />
                    <p className="mt-4 text-gray-500">
                        Loading your cart...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ============================================
              HEADER
          ============================================ */}
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FontAwesomeIcon icon={faCartShopping} />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                    My Cart
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {totalItems} item
                                    {totalItems !== 1 ? "s" : ""} in your
                                    cart
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                setActionLoading(true);
                                await clearCart();
                            } catch (error) {
                                console.error("Clear cart error:", error);
                            } finally {
                                setActionLoading(false);
                            }
                        }}
                        disabled={actionLoading}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon
                            icon={actionLoading ? faSpinner : faTrash}
                            spin={actionLoading}
                        />
                        Clear Cart
                    </button>
                </div>
            </div>


            {/* ============================================
              MAIN
          ============================================ */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* ==========================================
                CART ITEMS
            ========================================== */}
                <div className="xl:col-span-2 space-y-4">
                    {cartItems.map((item, index) => {
                        const bookId = getBookId(item);
                        const quantity = getQuantity(item);
                        const price = getPrice(item);
                        const itemTotal = price * quantity;
                        const title = getTitle(item);
                        const image = getImage(item);
                        const author = getAuthor(item);
                        const category = getCategory(item);
                        const oldPrice = getOldPrice(item);
                        const itemKey = getCartItemId(item) || bookId || index;
                        return (
                            <div key={itemKey} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* IMAGE */}
                                    <Link to={bookId ? `/books/${bookId}` : "/books"}
                                        className="w-full sm:w-28 h-52 sm:h-36 shrink-0 bg-gray-100 rounded-xl overflow-hidden"
                                    >
                                        {image ? (
                                            <img src={image} alt={title}
                                                className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl">
                                                📚
                                            </div>
                                        )}
                                    </Link>


                                    {/* CONTENT */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between gap-3">
                                            <div>
                                                <Link
                                                    to={
                                                        bookId
                                                            ? `/books/${bookId}`
                                                            : "/books"
                                                    }
                                                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2"
                                                >
                                                    {title}
                                                </Link>
                                                {author && (
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {author}
                                                    </p>
                                                )}
                                                {category && (
                                                    <span className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                                                        {category}
                                                    </span>
                                                )}
                                            </div>

                                            {/* REMOVE */}
                                            <button
                                                type="button"
                                                disabled={actionLoading}
                                                onClick={() =>
                                                    handleRemove(item)
                                                }
                                                className="w-9 h-9 shrink-0 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                                                title="Remove"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </button>
                                        </div>


                                        {/* PRICE + QUANTITY */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
                                            {/* PRICE */}
                                            <div>
                                                <span className="text-xl font-bold text-blue-600">
                                                    ₹
                                                    {price.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>
                                                {oldPrice && (
                                                    <span className="ml-2 text-sm text-gray-400 line-through">
                                                        ₹
                                                        {Number(
                                                            oldPrice
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </span>
                                                )}
                                            </div>


                                            {/* QUANTITY */}
                                            <div className="flex items-center justify-between sm:justify-end gap-4">
                                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                    <button
                                                        type="button"
                                                        disabled={actionLoading}
                                                        onClick={() =>
                                                            handleDecrease(item)
                                                        }
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faMinus}
                                                        />
                                                    </button>
                                                    <span className="w-10 text-center font-semibold text-gray-800">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        disabled={actionLoading}
                                                        onClick={() =>
                                                            handleIncrease(item)
                                                        }
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPlus}
                                                        />
                                                    </button>
                                                </div>

                                                <div className="text-right min-w-20">
                                                    <p className="text-xs text-gray-400">
                                                        Total
                                                    </p>
                                                    <p className="font-bold text-gray-800">
                                                        ₹
                                                        {itemTotal.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}


                    {/* CONTINUE SHOPPING */}
                    <Link
                        to="/books"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Continue Shopping
                    </Link>
                </div>


                {/* ==========================================
                SUMMARY
            ========================================== */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 xl:sticky xl:top-24">
                        <h2 className="text-xl font-bold text-gray-800">
                            Order Summary
                        </h2>

                        {/* ITEMS */}
                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Items ({totalItems})</span>
                                <span>₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>

                            {/* SHIPPING */}
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ₹
                                        {grandTotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* FREE SHIPPING MESSAGE */}
                        {subtotal > 0 &&
                            subtotal < 500 && (
                                <div className="mt-5 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                                    Add ₹{(500 - subtotal).toLocaleString("en-IN")}{" "}
                                    more to get free shipping.
                                </div>
                            )}
                        {subtotal >= 500 && (
                            <div className="mt-5 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                                🎉 You qualify for free shipping!
                            </div>
                        )}


                        {/* CHECKOUT */}
                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={
                                actionLoading ||
                                cartLoading ||
                                cartItems.length === 0
                            }
                            className="w-full mt-6 py-3.5 px-5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Proceed to Checkout
                            <FontAwesomeIcon
                                icon={faArrowRight}
                            />
                        </button>
                        {/* SECURE MESSAGE */}
                        <p className="mt-4 text-center text-xs text-gray-400">
                            🔒 Secure checkout • Your cart is saved
                            automatically
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
