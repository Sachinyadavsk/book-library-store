
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

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import orderService from "../../services/orderService";

const Checkout = () => {
    const navigate = useNavigate();
    //  USER
    const { user } = useAuth();
    // CART API
    const { cart = [], loading: cartLoading, loadCart, clearCart, } = useCart();

    //   FORM
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        mobile: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [errors, setErrors] = useState({});
    const [placingOrder, setPlacingOrder] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // NORMALIZE CART


    const getCartItems = () => {
        if (!Array.isArray(cart)) {
            return [];
        }

        return cart
            .flatMap((cartData) => {
                if (Array.isArray(cartData?.items)) {
                    return cartData.items;
                }
                return cartData;
            })
            .filter(Boolean);
    };

    const cartItems = getCartItems();


    //    BOOK DATA HELPERS
    const getBook = (item) => {
        return item?.book ?? item;
    };

    const getBookId = (item) => {
        const book = getBook(item);
        return (
            item?.book_id ??
            item?.bookId ??
            book?.id ??
            book?._id ??
            ""
        );
    };

    const getTitle = (item) => {
        const book = getBook(item);
        return (
            item?.title ??
            book?.title ??
            "Untitled Book"
        );
    };

    const getImage = (item) => {
        const book = getBook(item);
        return (
            item?.images?.[0] ??
            "/images/book-placeholder.jpg"
        );
    };

    const getPrice = (item) => {
        const book = getBook(item);
        return Number(
            item?.price ??
            book?.price ??
            0
        );
    };

    const getQuantity = (item) => {
        return Number(item?.quantity ?? 1);
    };

    //    TOTALS
    const totalItems = cartItems.reduce((total, item) => total + getQuantity(item), 0);
    const subtotal = cartItems.reduce(
        (total, item) =>
            total +
            getPrice(item) *
            getQuantity(item),
        0
    );
    //  Keep your existing checkout design.
    const shipping = 0;
    const total = subtotal + shipping;

    //  LOAD CART FROM API
    useEffect(() => {
        if (user && typeof loadCart === "function") {
            loadCart();
        }
    }, [user]);

    //  SET USER DATA
    useEffect(() => {
        if (!user) {
            return;
        }

        setForm((prev) => ({
            ...prev,
            fullName: prev.fullName || user?.name || user?.username || "",
            email: prev.email || user?.email || "",
            mobile: prev.mobile || user?.mobile || user?.mobile || "",
            address: prev.address || user?.address || "",
            city: prev.city || user?.city || "",
            state: prev.state || user?.state || "",
            postalCode: prev.postalCode || user?.postalCode || "",
        }));
    }, [user]);

    // INPUT CHANGE
    const handleChange = (e) => {
        const { name, value, } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        setApiError("");
        setSuccessMessage("");
    };

    // VALIDATE FORM
    const validateForm = () => {
        const newErrors = {};
        if (!form.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            newErrors.email = "Enter a valid email";
        }

        // if (!String(!form.mobile ?? "").trim()) {
        //     newErrors.mobile = "mobile number is required";
        // }

        if (!form.address.trim()) {
            newErrors.address = "address is required";
        }

        if (!form.city.trim()) {
            newErrors.city = "city is required";
        }

        if (!form.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!form.postalCode.trim()) {
            newErrors.postalCode = "postalCode is required";
        } else if (!/^[0-9]{6}$/.test(form.postalCode.trim())) {
            newErrors.postalCode = "Enter a valid 6-digit postalCode";
        }
        setErrors(newErrors);
        return (
            Object.keys(newErrors).length === 0
        );
    };

    //    PLACE ORDER

    const handlePlaceOrder = async () => {
        setApiError("");
        setSuccessMessage("");


        // CONDITION 1: LOGIN

        if (!user) {
            navigate("/login", {
                replace: true,
                state: {
                    from: "/checkout",
                    message: "Please login to continue checkout.",
                },
            });
            return;
        }


        // CONDITION 2: CART LOADING

        if (cartLoading) {
            setApiError("Cart is still loading. Please wait.");
            return;
        }


        // CONDITION 3: EMPTY CART

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            setApiError("Your cart is empty.");
            return;
        }


        // CONDITION 4: INVALID TOTAL

        if (total <= 0 || !Number.isFinite(Number(total))) {
            setApiError("Invalid order amount.");
            return;
        }


        // CONDITION 5: FORM VALIDATION

        if (!validateForm()) {
            return;
        }

        try {
            setPlacingOrder(true);


            // NORMALIZE FORM VALUES

            const fullName = String(form.fullName ?? "").trim();
            const email = String(form.email ?? "").trim();
            const mobile = String(form.mobile ?? "").trim();
            const address = String(form.address ?? "").trim();
            const city = String(form.city ?? "").trim();
            const state = String(form.state ?? "").trim();
            const postalCode = String(form.postalCode ?? "").trim();


            // CREATE ORDER ITEMS

            const orderItems = cartItems.map((item) => {
                let bookId = "";
                // BOOK OBJECT
                if (item?.book && typeof item.book === "object") {
                    bookId = item.book?._id ?? item.book?.id ?? "";
                }

                // BOOK ID DIRECTLY
                else if (item?.book) {
                    bookId = item.book;
                }

                // FALLBACK BOOK_ID
                if (!bookId) {
                    bookId = item?.book_id ?? item?.bookId ?? "";
                }

                bookId = String(bookId ?? "").trim();

                // INVALID BOOK
                if (!bookId) {
                    return null;
                }
                const quantity = Number(getQuantity(item)) || 1;
                const price = Number(getPrice(item)) || 0;
                const title = getTitle(item) || 'null';
                const images = getImage(item) || 'null';


                return {
                    book: bookId,
                    price: price,
                    quantity: quantity,
                    title: title,
                    images: images,
                };
            })
                .filter(Boolean);

            // CONDITION 6: NO VALID BOOK IDS
            if (orderItems.length === 0) {
                setApiError("Unable to identify the books in your cart. Please refresh your cart and try again.");
                return;
            }

            // CONDITION 7: CART ITEM COUNT MISMATCH
            if (orderItems.length !== cartItems.length) {
                setApiError("One or more cart items are invalid. Please refresh your cart and try again.");
                return;
            }

            // ORDER DATA
            const orderData = {
                user_id: user?.id ?? user?._id ?? null,
                fullName: fullName,
                email: email,
                mobile: 'null',
                address: address,
                city: city,
                state: state,
                postalCode: postalCode,
                payment_method: paymentMethod,
                items: orderItems,
                totalItems: Number(totalItems) || orderItems.length,
                subtotal: Number(subtotal) || 0,
                shipping: Number(shipping) || 0,
                totalAmount: Number(total) || 0,
            };

            // DEBUG PAYLOAD

            // API EXISTENCE CONDITION
            if (!orderService || typeof orderService.createOrder !== "function") {
                setApiError("Order API is not configured.");
                return;
            }

            // CREATE ORDER API
            const response = await orderService.createOrder(orderData);

            // SUCCESS CONDITION
            if (response?.success === true) {
                setSuccessMessage(response?.message || "Order placed successfully.");
                try {
                    // CONDITION 1: CLEAR CART AFTER SUCCESS
                    if (typeof clearCart === "function") {
                        await clearCart();
                    }

                    // CONDITION 2: REFRESH CART
                    if (typeof loadCart === "function") {
                        await loadCart();
                    }

                    // CONDITION 3: GET ORDER ID
                    const orderId =
                        response?.order?._id ??
                        response?.order?.id ??
                        response?.data?._id ??
                        response?.data?.id ??
                        response?.order_id ??
                        response?.id ??
                        "";


                    // CONDITION 4: REDIRECT ONLY AFTER CART CLEAR
                    setTimeout(() => {
                        if (orderId) {
                            navigate(`/order-success/${orderId}`, {
                                replace: true,
                            });
                        } else {
                            navigate("/order-success", {
                                replace: true,
                            });
                        }
                    }, 1000);

                    return;

                } catch (cartError) {
                    console.error("Order successful but cart clearing failed:", cartError);

                    // ORDER WAS SUCCESSFUL
                    const orderId =
                        response?.order?._id ??
                        response?.order?.id ??
                        response?.data?._id ??
                        response?.data?.id ??
                        response?.order_id ??
                        response?.id ??
                        "";

                    setApiError("Order placed successfully, but we could not clear your cart. Please refresh the cart.");

                    // Still redirect to success page
                    setTimeout(() => {
                        if (orderId) {
                            navigate(`/order-success/${orderId}`, {
                                replace: true,
                            });
                        } else {
                            navigate("/order-success", {
                                replace: true,
                            });
                        }
                    }, 1500);

                    return;
                }
            }


            // API FAILURE
            setApiError(response?.message || "Unable to place order. Please try again.");

        } catch (error) {
            console.error("Place Order Error:", error);
            setApiError(error?.message || "Something went wrong while placing your order.");
        } finally {
            setPlacingOrder(false);
        }
    };


    // NOT LOGGED IN
    if (!user) {
        return (
            <Navigate to="/login" replace state={{ from: "/checkout", }} />
        );
    }

    //    CART LOADING
    if (cartLoading && cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-3xl mb-3">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            spin
                            className="text-blue-600"
                        />
                    </div>
                    <p className="text-gray-500">
                        Loading checkout...
                    </p>
                </div>
            </div>
        );
    }

    // EMPTY CART
    if (!cartLoading && cartItems.length === 0) {
        return (
            <Navigate to="/cart" replace />
        );
    }

    //    CHECKOUT PAGE
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
                            <FontAwesomeIcon
                                icon={faCheck}
                            />
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
                        <span>
                            Complete
                        </span>
                    </div>
                </div>

                {/* API ERROR */}
                {apiError && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                        {apiError}
                    </div>
                )}

                {/* API SUCCESS */}

                {successMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl">
                        <FontAwesomeIcon
                            icon={faCheck}
                            className="mr-2"
                        />
                        {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping address */}
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FontAwesomeIcon
                                        icon={faLocationDot}
                                    />
                                </div>
                                <div>

                                    <h2 className="text-xl font-bold text-gray-800">
                                        Delivery address
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
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName
                                            ? "border-red-500"
                                            : "border-gray-300"}
                                            }`}
                                        placeholder="Enter full name"
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>

                                {/* email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        email
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

                                {/* mobile */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        mobile Number
                                    </label>
                                    <input
                                        type="number"
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleChange}
                                        maxLength={10}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.mobile
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="10 digit mobile"
                                    />
                                    {errors.mobile && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.mobile}
                                        </p>
                                    )}
                                </div>

                                {/* postalCode */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        postalCode
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={form.postalCode}
                                        onChange={handleChange}
                                        maxLength={6}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${errors.postalCode
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            }`}
                                        placeholder="6 digit postalCode"
                                    />
                                    {errors.postalCode && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.postalCode}
                                        </p>
                                    )}
                                </div>

                                {/* address */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Complete address
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

                                {/* city */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        city
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
                                        placeholder="city"
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
                                    <FontAwesomeIcon
                                        icon={faCreditCard}
                                    />
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
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod ===
                                        "cod"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={
                                            paymentMethod ===
                                            "cod"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
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
                                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod ===
                                        "online"
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === "online"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
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

                    {/* RIGHT SIDE - ORDER SUMMARY */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800">
                                Order Summary
                            </h2>
                            {/* Cart Items */}
                            <div className="mt-5 space-y-4 max-h-80 overflow-y-auto">
                                {cartItems.map((item, index) => {
                                    const itemId = getBookId(item) || item?._id || item?.id || index;
                                    const quantity = getQuantity(item);
                                    const price = getPrice(item);

                                    return (
                                        <div key={itemId} className="flex gap-3">
                                            <div className="w-14 h-18 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={getImage(item)} alt={getTitle(item)}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.currentTarget.src = "/images/book-placeholder.jpg"; }} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 text-sm line-clamp-2">
                                                    {getTitle(item)}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    Qty:{" "}
                                                    {quantity}
                                                </p>

                                                <p className="font-semibold text-blue-600 text-sm mt-1">
                                                    ₹
                                                    {(price * quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                                )}
                            </div>

                            <div className="border-t mt-5 pt-5 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items</span>
                                    <span>{totalItems}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹ {subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>
                                        {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-800">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Place Order */}
                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={placingOrder || cartLoading || cartItems.length === 0}
                                className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >

                                {placingOrder ? ("Placing Order...") : (
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
                                <FontAwesomeIcon icon={faShieldHalved} className="text-green-600" />
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

