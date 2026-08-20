import React, { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faCartShopping,
    faCheck,
    faCreditCard,
    faLocationDot,
    faShieldHalved,
    faTruck,
} from "@fortawesome/free-solid-svg-icons";
import {
    PAYMENT_METHODS,
    MESSAGES,
} from "../../utils/constants";
import {
    getCartSubtotal,
    calculateDiscount,
    calculateShipping,
    calculateOrderTotal,
} from "../../utils/helpers";

const Checkout = () => {
    const navigate = useNavigate();

    // ============================================
    // GET USER
    // ============================================
    const user = JSON.parse(localStorage.getItem("user"));

    // ============================================
    // GET CART
    // ============================================
    const [cart] = useState(() => {
        return JSON.parse(localStorage.getItem("cart")) || [];
    });

    // ============================================
    // FORM
    // ============================================
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        pincode: user?.pincode || "",
    });

    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD);
    const [errors, setErrors] = useState({});
    const [placingOrder, setPlacingOrder] = useState(false);

    // ============================================
    // CALCULATE TOTALS
    // ============================================
    const totalItems = cart.reduce(
        (total, item) => total + Number(item.quantity || 1),
        0
    );

    const subtotal = getCartSubtotal(cart);
    const discount = calculateDiscount(subtotal, 10);
    const shipping = calculateShipping(subtotal);
    const total = calculateOrderTotal({ subtotal, discount, shipping, });

    // ============================================
    // INPUT CHANGE
    // ============================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // ============================================
    // VALIDATE
    // ============================================
    const validateForm = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ) {
            newErrors.email = "Enter a valid email";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{10}$/.test(form.phone)) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }

        if (!form.address.trim()) {
            newErrors.address = "Address is required";
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!form.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!form.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^[0-9]{6}$/.test(form.pincode)) {
            newErrors.pincode = "Enter a valid 6-digit pincode";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ============================================
    // PLACE ORDER
    // ============================================
    const handlePlaceOrder = () => {
        if (!validateForm()) {
            return;
        }

        setPlacingOrder(true);

        const order = {
            id: `ORD-${Date.now()}`,
            userId: user.id || user._id || null,
            user: {
                name: form.name,
                email: form.email,
                phone: form.phone,
            },
            shippingAddress: {
                address: form.address,
                city: form.city,
                state: form.state,
                pincode: form.pincode,
            },
            items: cart,
            subtotal,
            shipping,
            total,
            paymentMethod,
            status: "Pending",
            createdAt: new Date().toISOString(),
        };

        // Get existing orders
        const existingOrders =
            JSON.parse(localStorage.getItem("orders")) || [];

        // Add new order
        localStorage.setItem(
            "orders",
            JSON.stringify([order, ...existingOrders])
        );

        // Clear cart
        localStorage.removeItem("cart");

        // Update navbar cart count
        window.dispatchEvent(new Event("cartUpdated"));

        // Move to order success page
        setTimeout(() => {
            navigate(`/order-success/${order.id}`);
        }, 500);
    };

    // ============================================
    // NOT LOGGED IN
    // ============================================
    if (!user) {
        return <Navigate to="/login" replace state={{ from: "/checkout" }} />;
    }

    // ============================================
    // CART EMPTY
    // ============================================
    if (cart.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    // ============================================
    // CHECKOUT PAGE
    // ============================================
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                Checkout
                            </h1>

                            <p className="text-sm text-gray-500 mt-1">
                                Complete your order securely
                            </p>
                        </div>

                        <FontAwesomeIcon
                            icon={faShieldHalved}
                            className="text-2xl text-green-600"
                        />
                    </div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Checkout Steps */}
                <div className="flex items-center justify-center mb-8">

                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <FontAwesomeIcon icon={faCheck} />
                        </div>

                        <span className="font-semibold text-blue-600">
                            Cart
                        </span>
                    </div>

                    <div className="w-12 sm:w-20 h-px bg-blue-600 mx-2" />

                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            2
                        </div>

                        <span className="font-semibold text-blue-600">
                            Checkout
                        </span>
                    </div>

                    <div className="w-12 sm:w-20 h-px bg-gray-300 mx-2" />

                    <div className="flex items-center gap-2 text-gray-400">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                            3
                        </div>

                        <span>Complete</span>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ============================================
                        LEFT SIDE
                    ============================================ */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Address */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Delivery Address
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Where should we deliver your books?
                                    </p>
                                </div>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="Enter full name"
                                    />

                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.email
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="Enter email"
                                    />

                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        maxLength={10}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="10 digit phone"
                                    />

                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Pincode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pincode
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        maxLength={6}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.pincode
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="6 digit pincode"
                                    />

                                    {errors.pincode && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.pincode}
                                        </p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Complete Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        rows="3"
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.address
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="House number, street, area..."
                                    />

                                    {errors.address && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.city
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="City"
                                    />

                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.state
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="State"
                                    />

                                    {errors.state && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.state}
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">

                            <div className="flex items-center gap-3 mb-5">

                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCreditCard} />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Payment Method
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Choose your preferred payment option
                                    </p>
                                </div>

                            </div>

                            <div className="space-y-3">

                                {/* COD */}
                                <label
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === "cod"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                    />

                                    <FontAwesomeIcon
                                        icon={faTruck}
                                        className="text-blue-600"
                                    />

                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Cash on Delivery
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Pay when your order arrives
                                        </p>
                                    </div>
                                </label>

                                {/* Online */}
                                <label
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === "online"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === "online"}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                    />

                                    <FontAwesomeIcon
                                        icon={faCreditCard}
                                        className="text-blue-600"
                                    />

                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Online Payment
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Card, UPI or other online methods
                                        </p>
                                    </div>
                                </label>

                            </div>
                        </div>

                    </div>

                    {/* ============================================
                        RIGHT SIDE - ORDER SUMMARY
                    ============================================ */}
                    <div>

                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 sticky top-24">

                            <h2 className="text-xl font-bold text-gray-800">
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="mt-5 space-y-4 max-h-80 overflow-y-auto">

                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex gap-3"
                                    >
                                        <div className="w-14 h-18 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={
                                                    item.image ||
                                                    "/images/book-placeholder.jpg"
                                                }
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <p className="font-medium text-gray-800 text-sm line-clamp-2">
                                                {item.title}
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Qty: {item.quantity || 1}
                                            </p>

                                            <p className="font-semibold text-blue-600 text-sm mt-1">
                                                ₹
                                                {(
                                                    Number(item.price || 0) *
                                                    Number(item.quantity || 1)
                                                ).toFixed(2)}
                                            </p>

                                        </div>
                                    </div>
                                ))}

                            </div>

                            <div className="border-t mt-5 pt-5 space-y-3">

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

                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>

                                    <span className={
                                        shipping === 0
                                            ? "text-green-600 font-semibold"
                                            : ""
                                    }>
                                        {shipping === 0
                                            ? "FREE"
                                            : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-800">
                                    <span>Total</span>
                                    <span>
                                        ₹{total.toFixed(2)}
                                    </span>
                                </div>

                            </div>

                            {/* Place Order */}
                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={placingOrder}
                                className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                {placingOrder ? (
                                    "Placing Order..."
                                ) : (
                                    <>
                                        Place Order
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </>
                                )}
                            </button>

                            <Link
                                to="/cart"
                                className="mt-3 w-full flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                Back to Cart
                            </Link>

                            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <FontAwesomeIcon
                                    icon={faShieldHalved}
                                    className="text-green-600"
                                />
                                Secure checkout
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;