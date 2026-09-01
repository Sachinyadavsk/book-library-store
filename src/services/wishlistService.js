
import api from "./api";

const wishlistService = {
    // ==========================================
    // GET USER WISHLIST
    // ==========================================
    getWishlist: () => {
        return api("/wishlist", {
            method: "GET",
        });
    },

    // ==========================================
    // ADD BOOK TO WISHLIST
    // ==========================================
    addToWishlist: (data) => {
        return api("/wishlist", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // ==========================================
    // REMOVE BOOK FROM WISHLIST
    // ==========================================
    removeFromWishlist: (id) => {
        if (!id) {
            return Promise.reject(
                new Error("Wishlist item ID is required.")
            );
        }

        return api(`/wishlist/${id}`, {
            method: "DELETE",
        });
    },
};

export default wishlistService;

