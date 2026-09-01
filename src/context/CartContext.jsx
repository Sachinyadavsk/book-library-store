
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

            const response =
                await cartService.getCart();

            console.log(
                "Cart API Response:",
                response
            );

            /*
             * YOUR API RESPONSE:
             *
             * {
             *   success: true,
             *   message: "Carts fetched successfully",
             *   carts: [...]
             * }
             *
             * Therefore we MUST use response.carts
             */

            const cartData = Array.isArray(
                response?.carts
            )
                ? response.carts
                : [];

            console.log(
                "Cart Data:",
                cartData
            );

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
            console.error(
                "Get cart error:",
                err
            );

            setCart([]);
            setCartCount(0);

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load cart."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD CART WHEN USER CHANGES
    // ==========================================

    useEffect(() => {
        loadCart();
    }, [user]);

    // ==========================================
    // GET BOOK ID
    // ==========================================

    const getBookId = (item) => {
        const book = item?.book ?? item;

        return (
            item?.book_id ??
            book?.id ??
            book?._id ??
            null
        );
    };

    // ==========================================
    // GET CART ITEM ID
    // ==========================================

    const getCartItemId = (item) => {
        return (
            item?.id ??
            item?._id ??
            item?.cart_id ??
            item?.cartItemId ??
            null
        );
    };

    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = async (book) => {
        if (!user) {
            return {
                success: false,
                requiresLogin: true,
            };
        }

        const bookId =
            book?.id ?? book?._id;

        if (!bookId) {
            const err = new Error(
                "Book ID is required."
            );

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

            window.dispatchEvent(
                new Event("cartUpdated")
            );

            return {
                success: true,
            };
        } catch (err) {
            console.error(
                "Add to cart error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Unable to add item to cart."
            );

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // REMOVE FROM CART
    // ==========================================

    const removeFromCart = async (
        cartItemId
    ) => {
        if (!user) {
            return {
                success: false,
                requiresLogin: true,
            };
        }

        if (!cartItemId) {
            const err = new Error(
                "Cart item ID is required."
            );

            setError(err.message);

            throw err;
        }

        try {
            setLoading(true);
            setError("");

            await cartService.removeFromCart(
                cartItemId
            );

            await loadCart();

            window.dispatchEvent(
                new Event("cartUpdated")
            );

            return {
                success: true,
            };
        } catch (err) {
            console.error(
                "Remove cart error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Unable to remove item from cart."
            );

            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    const increaseQuantity = async (
        bookId
    ) => {
        if (!user) {
            return {
                success: false,
                requiresLogin: true,
            };
        }

        if (!bookId) {
            throw new Error(
                "Book ID is required."
            );
        }

        try {
            setLoading(true);
            setError("");

            /*
             * Find existing cart item
             */
            const existingItem =
                cart.find(
                    (item) =>
                        String(
                            getBookId(item)
                        ) ===
                        String(bookId)
                );

            if (!existingItem) {
                throw new Error(
                    "Cart item not found."
                );
            }

            const cartItemId =
                getCartItemId(
                    existingItem
                );

            /*
             * If your API has a dedicated
             * quantity update endpoint,
             * use it here.
             *
             * Otherwise use addToCart with
             * the same book to increase quantity.
             */

            if (
                typeof cartService.updateQuantity ===
                "function"
            ) {
                await cartService.updateQuantity(
                    cartItemId,
                    getQuantity(
                        existingItem
                    ) + 1
                );
            } else {
                await cartService.addToCart({
                    book_id: bookId,
                    quantity: 1,
                });
            }

            await loadCart();

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

    const decreaseQuantity = async (
        bookId
    ) => {
        if (!user) {
            return {
                success: false,
                requiresLogin: true,
            };
        }

        if (!bookId) {
            throw new Error(
                "Book ID is required."
            );
        }

        try {
            setLoading(true);
            setError("");

            const existingItem =
                cart.find(
                    (item) =>
                        String(
                            getBookId(item)
                        ) ===
                        String(bookId)
                );

            if (!existingItem) {
                throw new Error(
                    "Cart item not found."
                );
            }

            const currentQuantity =
                getQuantity(
                    existingItem
                );

            /*
             * Never go below 1
             */
            if (currentQuantity <= 1) {
                return {
                    success: true,
                };
            }

            const cartItemId =
                getCartItemId(
                    existingItem
                );

            /*
             * Use dedicated update API
             * if available.
             */

            if (
                typeof cartService.updateQuantity ===
                "function"
            ) {
                await cartService.updateQuantity(
                    cartItemId,
                    currentQuantity - 1
                );
            } else if (
                typeof cartService.decreaseQuantity ===
                "function"
            ) {
                await cartService.decreaseQuantity(
                    cartItemId
                );
            } else {
                console.warn(
                    "No quantity update API found in cartService."
                );
            }

            await loadCart();

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
    const context =useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used inside CartProvider");
    }

    return context;
};

