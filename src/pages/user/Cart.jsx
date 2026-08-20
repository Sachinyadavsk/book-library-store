import React from "react";
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
    faIndianRupeeSign,
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
    } = useCart();

    // ============================================
    // TOTAL ITEMS
    // ============================================
    const totalItems = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 1),
        0
    );

    // ============================================
    // SUBTOTAL
    // ============================================
    const subtotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) *
            Number(item.quantity || 1),
        0
    );

    // ============================================
    // SHIPPING
    // Free shipping above ₹500
    // ============================================
    const shipping =
        subtotal === 0
            ? 0
            : subtotal >= 500
                ? 0
                : 50;

    // ============================================
    // GRAND TOTAL
    // ============================================
    const grandTotal = subtotal + shipping;

    // ============================================
    // CHECKOUT
    // ============================================
    const handleCheckout = () => {
        if (!cart.length) {
            return;
        }

        navigate("/checkout");
    };

    // ============================================
    // EMPTY CART
    // ============================================
    if (!cart || cart.length === 0) {
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
                        onClick={clearCart}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                    >
                        <FontAwesomeIcon icon={faTrash} />
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

                    {cart.map((item) => {

                        const quantity =
                            Number(item.quantity || 1);

                        const price =
                            Number(item.price || 0);

                        const itemTotal =
                            price * quantity;

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-sm p-4 sm:p-5"
                            >

                                <div className="flex flex-col sm:flex-row gap-4">

                                    {/* IMAGE */}
                                    <Link
                                        to={`/books/${item.id}`}
                                        className="w-full sm:w-28 h-52 sm:h-36 shrink-0 bg-gray-100 rounded-xl overflow-hidden"
                                    >

                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
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
                                                    to={`/books/${item.id}`}
                                                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2"
                                                >
                                                    {item.title ||
                                                        item.name ||
                                                        "Book"}
                                                </Link>

                                                {item.author && (
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.author}
                                                    </p>
                                                )}

                                                {item.category && (
                                                    <span className="inline-block mt-2 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                                                        {item.category}
                                                    </span>
                                                )}

                                            </div>


                                            {/* REMOVE */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                                className="w-9 h-9 shrink-0 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
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

                                                {item.oldPrice && (
                                                    <span className="ml-2 text-sm text-gray-400 line-through">
                                                        ₹
                                                        {Number(
                                                            item.oldPrice
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
                                                        onClick={() => {
                                                            if (quantity > 1) {
                                                                decreaseQuantity(
                                                                    item.id
                                                                );
                                                            } else {
                                                                removeFromCart(
                                                                    item.id
                                                                );
                                                            }
                                                        }}
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
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
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100"
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
                                <span>
                                    Items ({totalItems})
                                </span>

                                <span>
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>


                            {/* SHIPPING */}
                            <div className="flex justify-between text-gray-600">

                                <span>Shipping</span>

                                <span>
                                    {shipping === 0
                                        ? "FREE"
                                        : `₹${shipping}`}
                                </span>

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
                        {subtotal > 0 && subtotal < 500 && (
                            <div className="mt-5 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                                Add ₹
                                {(500 - subtotal).toLocaleString(
                                    "en-IN"
                                )}{" "}
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
                            className="w-full mt-6 py-3.5 px-5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
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