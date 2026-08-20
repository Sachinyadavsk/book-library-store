import api from "./api";

const wishlistService = {
    // Get logged-in user's wishlist
    getWishlist: () => {
        return api("/wishlist", {
            method: "GET",
        });
    },

    // Add book
    addToWishlist: (data) => {
        return api("/wishlist", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Remove book
    removeFromWishlist: (id) => {
        return api(`/wishlist/${id}`, {
            method: "DELETE",
        });
    },
};

export default wishlistService;