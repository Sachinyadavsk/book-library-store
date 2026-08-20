import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faRightToBracket,
    faArrowRight,
    faTrash,
    faMinus,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Cart = () => {

    const user = JSON.parse(localStorage.getItem("user"));
    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem("cart")) || [];
    });

    // Save cart whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        // Update navbar cart count
        window.dispatchEvent(new Event("cartUpdated"));
    }, [cart]);

    // ============================================
    // NOT LOGGED IN
    // ============================================
    if (!user) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">

                    <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            className="text-3xl"
                        />
                    </div>

                    <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-800">
                        Your Cart
                    </h1>

                    <p className="mt-3 text-gray-500 text-sm sm:text-base leading-6">
                        Please login to your account to view your cart and
                        continue shopping.
                    </p>

                    <Link
                        to="/login"
                        className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        <FontAwesomeIcon icon={faRightToBracket} />
                        Login to Continue
                    </Link>

                    <Link
                        to="/books"
                        className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                    >
                        Continue Shopping
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>
            </div>
        );
    }

    // ============================================
    // CART TOTALS
    // ============================================
    const totalItems = cart.reduce(
        (total, item) => total + (item.quantity || 1),
        0
    );

    const subtotal = cart.reduce(
        (total, item) =>
            total + Number(item.price || 0) * (item.quantity || 1),
        0
    );

    // ============================================
    // REMOVE ITEM
    // ============================================
    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
    };

    // ============================================
    // UPDATE QUANTITY
    // ============================================
    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            removeItem(id);
            return;
        }

        setCart(
            cart.map((item) =>
                item.id === id
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // ============================================
    // EMPTY CART
    // ============================================
    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Shopping Cart
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Welcome back, {user.name || "User"}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">

                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faCartShopping}
                                className="text-3xl text-gray-400"
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-gray-800">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Add some books to your cart and they will appear here.
                        </p>

                        <Link
                            to="/books"
                            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                        >
                            Browse Books
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    // CART WITH DATA
    // ============================================
    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Shopping Cart
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                        </p>
                    </div>

                    <FontAwesomeIcon
                        icon={faCartShopping}
                        className="text-2xl text-blue-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ============================================
                        CART ITEMS
                    ============================================ */}
                    <div className="lg:col-span-2 space-y-4">

                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-sm p-4 sm:p-5"
                            >
                                <div className="flex gap-4">

                                    {/* Book Image */}
                                    <div className="w-24 h-32 sm:w-28 sm:h-36 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={
                                                item.image ||
                                                "/images/book-placeholder.jpg"
                                            }
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Book Details */}
                                    <div className="flex-1 min-w-0">

                                        <div className="flex justify-between gap-3">

                                            <div>
                                                <h2 className="font-semibold text-gray-800 text-base sm:text-lg">
                                                    {item.title}
                                                </h2>

                                                {item.author && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        By {item.author}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Delete */}
                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700 p-2"
                                                title="Remove"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <p className="mt-3 text-lg font-bold text-blue-600">
                                            ₹{Number(item.price || 0).toFixed(2)}
                                        </p>

                                        {/* Quantity */}
                                        <div className="flex items-center justify-between mt-4">

                                            <div className="flex items-center border border-gray-300 rounded-lg">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            (item.quantity || 1) - 1
                                                        )
                                                    }
                                                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                                >
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>

                                                <span className="w-10 text-center font-semibold">
                                                    {item.quantity || 1}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            (item.quantity || 1) + 1
                                                        )
                                                    }
                                                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>

                                            </div>

                                            {/* Item Total */}
                                            <p className="font-bold text-gray-800">
                                                ₹
                                                {(
                                                    Number(item.price || 0) *
                                                    (item.quantity || 1)
                                                ).toFixed(2)}
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ============================================
                        ORDER SUMMARY
                    ============================================ */}
                    <div className="lg:col-span-1">

                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 sticky top-24">

                            <h2 className="text-xl font-bold text-gray-800">
                                Order Summary
                            </h2>

                            <div className="mt-5 space-y-3">

                                <div className="flex justify-between text-gray-600">
                                    <span>Items</span>
                                    <span>{totalItems}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>
                                        ₹{subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-800">
                                    <span>Total</span>
                                    <span>
                                        ₹{subtotal.toFixed(2)}
                                    </span>
                                </div>

                            </div>

                            <Link
                                to="/checkout"
                                className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                            >
                                Proceed to Checkout
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>

                            <Link
                                to="/books"
                                className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                            >
                                Continue Shopping
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;