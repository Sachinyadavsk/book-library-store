import api from "../services/api";

const userService = {

    getUsers: async (params = {}) => {
        const queryParams =
            new URLSearchParams();

        Object.entries(params).forEach(
            ([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                ) {
                    queryParams.append(
                        key,
                        value
                    );
                }
            }
        );

        const queryString =
            queryParams.toString();

        return api(
            `/users/get-all-users${queryString
                ? `?${queryString}`
                : ""
            }`,
            {
                method: "GET",
            }
        );
    },


    // GET SINGLE USER
    getUser: async (id) => {
        if (!id) {
            throw new Error("User ID is required.");
        }
        return api(`/users/${id}`, {
            method: "GET",
        });
    },


    // CREATE USER
    createUser: async (userData) => {
        return api("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify(
                userData
            ),
        });
    },

    // UPDATE USER
    updateUser: async (id, userData) => {
        if (!id) {
            throw new Error("User ID is required.");
        }
        return api(`/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData
            ),
        });
    },

    // DELETE USER
    deleteUser: async (id) => {
        if (!id) {
            throw new Error("User ID is required.");
        }
        return api(`/users/${id}`, {
            method: "DELETE",
        });
    },


    // UPDATE USER STATUS
    updateStatus: async (
        id,
        status
    ) => {
        if (!id) {
            throw new Error(
                "User ID is required."
            );
        }

        return api(`/user/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                status,
            }),
        });
    },


    // GET CURRENT USER
    async getProfile() {
        return api("/user/profile", {
            method: "GET",
        });
    },


    // UPDATE PROFILE
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


    // CHANGE PASSWORD
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


    // GET USER ORDERS
    async getOrders() {
        return api("/user/orders", {
            method: "GET",
        });
    },


    // GET USER ORDER
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


    // GET USER BORROWED BOOKS
    async getBorrowedBooks() {
        return api("/user/borrowed-books", {
            method: "GET",
        });
    },


    // GET USER WISHLIST
    async getWishlist() {
        return api("/user/wishlist", {
            method: "GET",
        });
    },


    // DELETE ACCOUNT
    async deleteAccount() {
        return api("/user/account", {
            method: "DELETE",
        });
    },

};

export default userService;