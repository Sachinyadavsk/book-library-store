
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // GET CART
    // ==========================================

    const loadCart = async () => {
        if (!user) {
            setCart([]);
            setCartCount(0);
            setError("");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await cartService.getCart();
            const cartData = Array.isArray(response?.carts) ? response.carts : [];
            setCart(cartData);
            // Total quantity
            const totalQuantity =
                cartData.reduce(
                    (total, item) =>
                        total +
                        Number(
                            item?.quantity ?? 1
                        ),
                    0
                );

            setCartCount(totalQuantity);
        } catch (err) {
            console.error("Get cart error:", err);
            setCart([]);
            setCartCount(0);
            setError(err?.response?.data?.message || err?.message || "Unable to load cart.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [user]);

    // GET BOOK ID
    const getBookId = (item) => {
        const book = item?.book ?? item;
        return (item?.book_id ?? book?.id ?? book?._id ?? null);
    };

    //    GET CART ITEM ID
    const getCartItemId = (item) => {
        return (item?.id ?? item?._id ?? item?.cart_id ?? item?.cartItemId ?? null);
    };

    //    ADD TO CART
    const addToCart = async (book) => {
        if (!user) {
            return {
                success: false,
                requiresLogin: true,
            };
        }

        const bookId = book?.id ?? book?._id;
        if (!bookId) {
            const err = new Error("Book ID is required.");
            setError(err.message);
            throw err;
        }

        try {
            setLoading(true);
            setError("");
            await cartService.addToCart({
                bookId: bookId,
                quantity: 1,
            });
            await loadCart();
            window.dispatchEvent(new Event("cartUpdated"));
            return {
                success: true,
            };
        } catch (err) {
            console.error("Add to cart error:", err);
            setError(err?.response?.data?.message || err?.message || "Unable to add item to cart.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // REMOVE FROM CART
    const removeFromCart = async (cartItemId) => {
        if (!user) {
            return {
                success: false,
                requiresLogin: true,
            };
        }

        if (!cartItemId) {
            const err = new Error("Cart item ID is required.");
            setError(err.message);
            throw err;
        }

        try {
            setLoading(true);
            setError("");
            await cartService.removeFromCart(cartItemId);
            await loadCart();
            window.dispatchEvent(new Event("cartUpdated"));
            return {
                success: true,
            };
        } catch (err) {
            console.error("Remove cart error:", err);
            setError(err?.response?.data?.message || err?.message || "Unable to remove item from cart.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // INCREASE QUANTITY
    const increaseQuantity = async (bookId) => {
        if (!user) {
            return {
                success: false,
                requiresLogin: true,
            };
        }

        if (!bookId) {
            throw new Error("Book ID is required.");
        }

        try {
            setLoading(true);
            setError("");

            // Get all cart items from all cart documents
            const cartItems = cart.flatMap(
                (cartData) => cartData?.items ?? []
            );

            console.log("Cart Items:", cartItems);
            console.log("Requested Book ID:", bookId);

            // Find item by Book ID
            const existingItem = cartItems.find(
                (item) =>
                    String(
                        typeof item?.book === "object"
                            ? item?.book?._id
                            : item?.book
                    ) === String(bookId)
            );

            console.log("Existing Cart Item:", existingItem);

            if (!existingItem) {
                throw new Error("Cart item not found.");
            }

            // Cart item's _id
            const cartItemId = existingItem?._id;

            if (!cartItemId) {
                throw new Error("Cart item ID not found.");
            }

            // Current quantity
            const currentQuantity = Number(
                existingItem?.quantity ?? 1
            );

            const newQuantity = currentQuantity + 1;

            console.log("Cart Item ID:", cartItemId);
            console.log("Current Quantity:", currentQuantity);
            console.log("New Quantity:", newQuantity);

            // Update quantity
            if (
                typeof cartService.updateQuantity === "function"
            ) {
                await cartService.updateQuantity(
                    cartItemId,
                    newQuantity
                );
            } else {
                // Fallback
                await cartService.addToCart({
                    bookId: bookId,
                    quantity: 1,
                });
            }

            // Reload cart
            await loadCart();

            // Notify other components
            window.dispatchEvent(
                new Event("cartUpdated")
            );

            return {
                success: true,
            };

        } catch (err) {
            console.error(
                "Increase quantity error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to increase quantity."
            );

            throw err;

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    // DECREASE QUANTITY
    const decreaseQuantity = async (bookId) => {
        if (!user) {
            return {
                success: false,
                requiresLogin: true,
            };
        }

        if (!bookId) {
            throw new Error("Book ID is required.");
        }

        try {
            setLoading(true);
            setError("");

            // Get all items from cart documents
            const cartItems = cart.flatMap(
                (cartData) => cartData?.items ?? []
            );

            console.log("Cart Items:", cartItems);
            console.log("Requested Book ID:", bookId);

            // Find cart item by Book ID
            const existingItem = cartItems.find(
                (item) =>
                    String(getBookId(item)) ===
                    String(bookId)
            );

            console.log("Existing Cart Item:", existingItem);

            if (!existingItem) {
                throw new Error("Cart item not found.");
            }

            // Current quantity
            const currentQuantity =
                getQuantity(existingItem);

            console.log(
                "Current Quantity:",
                currentQuantity
            );

            // Never go below 1
            if (currentQuantity <= 1) {
                return {
                    success: true,
                    message: "Minimum quantity is 1",
                };
            }

            // Cart item ID
            const cartItemId =
                getCartItemId(existingItem);

            if (!cartItemId) {
                throw new Error(
                    "Cart item ID not found."
                );
            }

            console.log(
                "Cart Item ID:",
                cartItemId
            );

            // New quantity
            const newQuantity =
                currentQuantity - 1;

            console.log(
                "New Quantity:",
                newQuantity
            );

            // Update quantity
            if (
                typeof cartService.updateQuantity ===
                "function"
            ) {
                await cartService.updateQuantity(
                    cartItemId,
                    newQuantity
                );
            } else {
                throw new Error(
                    "updateQuantity function not found in cartService."
                );
            }

            // Reload cart
            await loadCart();

            // Notify other components
            window.dispatchEvent(
                new Event("cartUpdated")
            );

            return {
                success: true,
            };

        } catch (err) {
            console.error(
                "Decrease quantity error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to decrease quantity."
            );

            throw err;

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // GET QUANTITY
    // ==========================================

    const getQuantity = (item) => {
        return Number(
            item?.quantity ?? 1
        );
    };

    // ==========================================
    // CONTEXT VALUE
    // ==========================================

    const value = {
        cart,
        cartCount,
        loading,
        error,

        loadCart,

        addToCart,
        removeFromCart,

        increaseQuantity,
        decreaseQuantity,
    };

    return (
        <CartContext.Provider
            value={value}
        >
            {children}
        </CartContext.Provider>
    );
};

// ==========================================
// USE CART
// ==========================================

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
};

