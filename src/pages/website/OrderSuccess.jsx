import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faBoxOpen,
    faReceipt,
    faArrowRight,
    faHouse,
    faSpinner,
    faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const OrderSuccess = () => {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================
    // GET LOGGED-IN USER
    // ============================================
    const user = JSON.parse(localStorage.getItem("user"));

    // ============================================
    // LOAD ORDER
    // ============================================
    useEffect(() => {
        const loadOrder = () => {
            try {
                setLoading(true);
                setError("");

                // ----------------------------------------
                // ORDER ID REQUIRED
                // ----------------------------------------
                if (!orderId) {
                    setError("Order ID is missing.");
                    return;
                }

                // ----------------------------------------
                // GET ORDERS
                // ----------------------------------------
                const orders =
                    JSON.parse(localStorage.getItem("orders")) || [];

                // ----------------------------------------
                // FIND ORDER
                // ----------------------------------------
                const foundOrder = orders.find(
                    (item) =>
                        String(item.id) === String(orderId) ||
                        String(item.orderId) === String(orderId)
                );

                // ----------------------------------------
                // ORDER NOT FOUND
                // ----------------------------------------
                if (!foundOrder) {
                    setError(
                        "We could not find this order. It may have been removed or the order ID may be incorrect."
                    );
                    return;
                }

                // ----------------------------------------
                // OPTIONAL USER SECURITY CHECK
                // ----------------------------------------
                if (user?.id && foundOrder.userId) {
                    if (
                        String(foundOrder.userId) !== String(user.id)
                    ) {
                        setError(
                            "You are not authorized to view this order."
                        );
                        return;
                    }
                }

                setOrder(foundOrder);

            } catch (err) {
                console.error("Order success error:", err);

                setError(
                    "Unable to load order details. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId, user?.id]);

    // ============================================
    // LOADING
    // ============================================
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
                        Loading your order...
                    </p>

                </div>

            </div>
        );
    }

    // ============================================
    // ERROR
    // ============================================
    if (error) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-10">

                <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">

                    <div className="w-20 h-20 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">

                        <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="text-3xl"
                        />

                    </div>

                    <h1 className="mt-6 text-2xl font-bold text-gray-800">
                        Order Not Found
                    </h1>

                    <p className="mt-3 text-gray-500 leading-6">
                        {error}
                    </p>

                    {orderId && (
                        <p className="mt-4 text-sm text-gray-400 break-all">
                            Order ID: {orderId}
                        </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 mt-7">

                        <Link
                            to="/"
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            <FontAwesomeIcon icon={faHouse} />
                            Home
                        </Link>

                        <Link
                            to="/books"
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
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
    // ORDER DATA
    // ============================================

    const items = Array.isArray(order.items)
        ? order.items
        : Array.isArray(order.products)
            ? order.products
            : [];

    const subtotal =
        Number(order.subtotal) ||
        items.reduce(
            (total, item) =>
                total +
                Number(item.price || 0) *
                Number(item.quantity || 1),
            0
        );

    const shipping =
        Number(order.shipping || order.shippingCost || 0);

    const tax =
        Number(order.tax || order.gst || 0);

    const total =
        Number(order.total || order.grandTotal) ||
        subtotal + shipping + tax;

    // ============================================
    // DATE
    // ============================================
    const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "Just now";

    // ============================================
    // SUCCESS PAGE
    // ============================================
    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12">

            <div className="max-w-5xl mx-auto px-4">

                {/* ======================================
                    SUCCESS HEADER
            ====================================== */}

                <div className="text-center">

                    <div className="w-24 h-24 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">

                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="text-5xl"
                        />

                    </div>

                    <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-gray-800">
                        Order Placed Successfully!
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Thank you for your purchase
                        {user?.name ? `, ${user.name}` : ""}.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border text-sm text-gray-600">

                        <FontAwesomeIcon
                            icon={faReceipt}
                            className="text-blue-600"
                        />

                        Order ID:

                        <span className="font-semibold text-gray-800">
                            {order.id || order.orderId}
                        </span>

                    </div>

                </div>


                {/* ======================================
                    ORDER INFORMATION
            ====================================== */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">

                    {/* ====================================
                        ORDER DETAILS
              ==================================== */}

                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">

                        <div className="p-5 sm:p-6 border-b">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-bold text-gray-800">
                                        Order Details
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Placed on {orderDate}
                                    </p>

                                </div>

                                <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">

                                    <FontAwesomeIcon
                                        icon={faBoxOpen}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ITEMS */}

                        <div className="divide-y">

                            {items.length > 0 ? (
                                items.map((item, index) => {

                                    const quantity =
                                        Number(item.quantity) || 1;

                                    const price =
                                        Number(item.price) || 0;

                                    return (
                                        <div
                                            key={
                                                item.id ||
                                                item.bookId ||
                                                index
                                            }
                                            className="p-5 flex gap-4"
                                        >

                                            {/* Image */}

                                            <div className="w-20 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">

                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={
                                                            item.title ||
                                                            "Book"
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                                        📚
                                                    </div>
                                                )}

                                            </div>


                                            {/* Details */}

                                            <div className="flex-1 min-w-0">

                                                <h3 className="font-semibold text-gray-800 line-clamp-2">
                                                    {item.title ||
                                                        item.name ||
                                                        "Book"}
                                                </h3>

                                                {item.author && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {item.author}
                                                    </p>
                                                )}

                                                <div className="flex items-center justify-between mt-3">

                                                    <p className="text-sm text-gray-500">
                                                        Qty:{" "}
                                                        <span className="font-medium text-gray-700">
                                                            {quantity}
                                                        </span>
                                                    </p>

                                                    <p className="font-semibold text-blue-600">
                                                        ₹
                                                        {(
                                                            price *
                                                            quantity
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No item details available.
                                </div>
                            )}

                        </div>

                    </div>


                    {/* ====================================
                    PAYMENT SUMMARY
              ==================================== */}

                    <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">

                        <h2 className="text-xl font-bold text-gray-800">
                            Order Summary
                        </h2>

                        <div className="mt-6 space-y-4">

                            <div className="flex justify-between text-gray-600">

                                <span>Subtotal</span>

                                <span>
                                    ₹{subtotal.toLocaleString("en-IN")}
                                </span>

                            </div>

                            <div className="flex justify-between text-gray-600">

                                <span>Shipping</span>

                                <span>
                                    {shipping === 0
                                        ? "Free"
                                        : `₹${shipping.toLocaleString(
                                            "en-IN"
                                        )}`}
                                </span>

                            </div>

                            {tax > 0 && (
                                <div className="flex justify-between text-gray-600">

                                    <span>Tax</span>

                                    <span>
                                        ₹{tax.toLocaleString("en-IN")}
                                    </span>

                                </div>
                            )}

                            <div className="border-t pt-4 flex justify-between">

                                <span className="font-bold text-gray-800">
                                    Total
                                </span>

                                <span className="text-xl font-bold text-blue-600">
                                    ₹{total.toLocaleString("en-IN")}
                                </span>

                            </div>

                        </div>


                        {/* PAYMENT */}

                        {order.paymentMethod && (
                            <div className="mt-6 p-4 rounded-xl bg-gray-50">

                                <p className="text-xs text-gray-500">
                                    Payment Method
                                </p>

                                <p className="mt-1 font-semibold text-gray-800 capitalize">
                                    {order.paymentMethod}
                                </p>

                            </div>
                        )}


                        {/* STATUS */}

                        <div className="mt-4 p-4 rounded-xl bg-green-50">

                            <p className="text-xs text-green-600">
                                Order Status
                            </p>

                            <p className="mt-1 font-semibold text-green-700 capitalize">
                                {order.status || "Confirmed"}
                            </p>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    SHIPPING ADDRESS
            ====================================== */}

                {order.shippingAddress && (
                    <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">

                        <h2 className="text-xl font-bold text-gray-800">
                            Delivery Address
                        </h2>

                        <div className="mt-4 text-gray-600 leading-7">

                            {typeof order.shippingAddress ===
                                "string" ? (
                                <p>{order.shippingAddress}</p>
                            ) : (
                                <>
                                    <p className="font-semibold text-gray-800">
                                        {order.shippingAddress.name ||
                                            user?.name}
                                    </p>

                                    {order.shippingAddress.address && (
                                        <p>
                                            {order.shippingAddress.address}
                                        </p>
                                    )}

                                    {order.shippingAddress.city && (
                                        <p>
                                            {order.shippingAddress.city},{" "}
                                            {order.shippingAddress.state}
                                        </p>
                                    )}

                                    {order.shippingAddress.pincode && (
                                        <p>
                                            PIN:{" "}
                                            {order.shippingAddress.pincode}
                                        </p>
                                    )}

                                    {order.shippingAddress.mobile && (
                                        <p>
                                            Mobile:{" "}
                                            {order.shippingAddress.mobile}
                                        </p>
                                    )}
                                </>
                            )}

                        </div>

                    </div>
                )}


                {/* ======================================
                    ACTION BUTTONS
            ====================================== */}

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">

                    <Link
                        to="/books"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>

                    <Link
                        to="/user/orders"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        <FontAwesomeIcon icon={faBoxOpen} />
                        View My Orders
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                    >
                        <FontAwesomeIcon icon={faHouse} />
                        Home
                    </Link>

                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;