import api from "../services/api";

const userService = {

    // ============================================
    // GET CURRENT USER
    // ============================================
    async getProfile() {
        return api("/user/profile", {
            method: "GET",
        });
    },

    // ============================================
    // UPDATE PROFILE
    // ============================================
    async updateProfile(userData) {

        if (!userData) {
            throw new Error(
                "User data is required"
            );
        }

        return api("/user/profile", {
            method: "PUT",
            body: JSON.stringify(userData),
        });
    },

    // ============================================
    // CHANGE PASSWORD
    // ============================================
    async changePassword(passwordData) {

        if (!passwordData) {
            throw new Error(
                "Password data is required"
            );
        }

        return api("/user/change-password", {
            method: "PUT",
            body: JSON.stringify(passwordData),
        });
    },

    // ============================================
    // GET USER ORDERS
    // ============================================
    async getOrders() {

        return api("/user/orders", {
            method: "GET",
        });
    },

    // ============================================
    // GET USER ORDER
    // ============================================
    async getOrder(orderId) {

        if (!orderId) {
            throw new Error(
                "Order ID is required"
            );
        }

        return api(`/user/orders/${orderId}`, {
            method: "GET",
        });
    },

    // ============================================
    // GET USER BORROWED BOOKS
    // ============================================
    async getBorrowedBooks() {

        return api("/user/borrowed-books", {
            method: "GET",
        });
    },

    // ============================================
    // GET USER WISHLIST
    // ============================================
    async getWishlist() {

        return api("/user/wishlist", {
            method: "GET",
        });
    },

    // ============================================
    // DELETE ACCOUNT
    // ============================================
    async deleteAccount() {

        return api("/user/account", {
            method: "DELETE",
        });
    },

};

export default userService;