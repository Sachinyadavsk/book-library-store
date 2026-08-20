import api from "../services/api";

// ============================================
// AUTH SERVICE
// ============================================

const authService = {

    // ========================================
    // LOGIN
    // ========================================
    async login(email, password) {
        const response = await api("/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        });

        // Save token
        if (response?.token) {
            localStorage.setItem(
                "token",
                response.token
            );
        }

        // Save user
        if (response?.user) {
            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );
        }

        return response;
    },

    // ========================================
    // REGISTER
    // ========================================
    async register(userData) {
        const response = await api("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });

        return response;
    },

    // ========================================
    // GET CURRENT USER
    // ========================================
    async getCurrentUser() {
        const response = await api("/auth/me", {
            method: "GET",
        });

        if (response?.user) {
            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );
        }

        return response;
    },

    // ========================================
    // LOGOUT
    // ========================================
    async logout() {

        try {
            await api("/auth/logout", {
                method: "POST",
            });
        } catch (error) {
            console.error(
                "Logout API error:",
                error
            );
        }

        // Clear authentication
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },

    // ========================================
    // GET USER FROM STORAGE
    // ========================================
    getUser() {
        try {
            const user =
                localStorage.getItem("user");

            return user
                ? JSON.parse(user)
                : null;

        } catch (error) {
            console.error(
                "Invalid user data:",
                error
            );

            return null;
        }
    },

    // ========================================
    // GET TOKEN
    // ========================================
    getToken() {
        return localStorage.getItem("token");
    },

    // ========================================
    // CHECK LOGIN
    // ========================================
    isLoggedIn() {
        return !!localStorage.getItem("token");
    },

    // ========================================
    // CHECK ADMIN
    // ========================================
    isAdmin() {
        const user = this.getUser();

        return (
            user?.role === "admin" ||
            user?.isAdmin === true ||
            user?.userType === "admin"
        );
    },

    // ========================================
    // CLEAR AUTH
    // ========================================
    clearAuth() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};

export default authService;