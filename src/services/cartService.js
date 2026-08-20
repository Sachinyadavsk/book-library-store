import api from "./api";

const cartService = {
    // Get logged-in user's cart
    getCart: () => {
        return api("/cart", {
            method: "GET",
        });
    },

    // Add book to cart
    addToCart: (data) => {
        return api("/cart", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Update quantity
    updateCart: (id, data) => {
        return api(`/cart/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    // Remove cart item
    removeFromCart: (id) => {
        return api(`/cart/${id}`, {
            method: "DELETE",
        });
    },

    // Clear cart
    clearCart: () => {
        return api("/cart/clear", {
            method: "DELETE",
        });
    },
};

export default cartService;