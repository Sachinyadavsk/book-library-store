import api from "../services/api";

const cartService = {

    // ============================================
    // GET USER CART
    // ============================================
    async getCart() {
        return api("/cart", {
            method: "GET",
        });
    },

    // ============================================
    // GET CART COUNT
    // ============================================
    async getCartCount() {
        return api("/cart/count", {
            method: "GET",
        });
    },

    // ============================================
    // ADD ITEM TO CART
    // ============================================
    async addToCart(bookId, quantity = 1) {

        if (!bookId) {
            throw new Error("Book ID is required");
        }

        return api("/cart", {
            method: "POST",
            body: JSON.stringify({
                book_id: bookId,
                quantity,
            }),
        });
    },

    // ============================================
    // UPDATE QUANTITY
    // ============================================
    async updateQuantity(cartItemId, quantity) {

        if (!cartItemId) {
            throw new Error("Cart item ID is required");
        }

        if (quantity < 1) {
            throw new Error(
                "Quantity must be at least 1"
            );
        }

        return api(`/cart/${cartItemId}`, {
            method: "PUT",
            body: JSON.stringify({
                quantity,
            }),
        });
    },

    // ============================================
    // INCREASE QUANTITY
    // ============================================
    async increaseQuantity(cartItemId) {

        return api(
            `/cart/${cartItemId}/increase`,
            {
                method: "PATCH",
            }
        );
    },

    // ============================================
    // DECREASE QUANTITY
    // ============================================
    async decreaseQuantity(cartItemId) {

        return api(
            `/cart/${cartItemId}/decrease`,
            {
                method: "PATCH",
            }
        );
    },

    // ============================================
    // REMOVE CART ITEM
    // ============================================
    async removeFromCart(cartItemId) {

        if (!cartItemId) {
            throw new Error(
                "Cart item ID is required"
            );
        }

        return api(`/cart/${cartItemId}`, {
            method: "DELETE",
        });
    },

    // ============================================
    // CLEAR CART
    // ============================================
    async clearCart() {

        return api("/cart", {
            method: "DELETE",
        });
    },

};

export default cartService;