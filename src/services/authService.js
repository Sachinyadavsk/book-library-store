import api from "./api";

const authService = {

    // ============================================
    // REGISTER
    // ============================================
    async register(userData) {

        return api("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    },

    // ============================================
    // LOGIN
    // ============================================
    async login(credentials) {

        return api("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    },

    // ============================================
    // LOGOUT
    // ============================================
    async logout() {

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return true;
    },

    // ============================================
    // GET TOKEN
    // ============================================
    getToken() {

        return localStorage.getItem("token");
    },

    // ============================================
    // SET TOKEN
    // ============================================
    setToken(token) {

        if (token) {

            localStorage.setItem(
                "token",
                token
            );

        } else {

            localStorage.removeItem(
                "token"
            );

        }

    },

    // ============================================
    // REMOVE TOKEN
    // ============================================
    removeToken() {

        localStorage.removeItem("token");
    },

    // ============================================
    // GET USER
    // ============================================
    getUser() {

        try {

            const user =
                localStorage.getItem("user");

            return user
                ? JSON.parse(user)
                : null;

        } catch (error) {

            console.error(
                "Get user error:",
                error
            );

            return null;
        }
    },

    // ============================================
    // SET USER
    // ============================================
    setUser(user) {

        if (user) {

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

        } else {

            localStorage.removeItem(
                "user"
            );

        }
    },

    // ============================================
    // CLEAR AUTH
    // ============================================
    clearAuth() {

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    },

    // ============================================
    // CHECK LOGIN
    // ============================================
    isAuthenticated() {

        const token =
            this.getToken();

        const user =
            this.getUser();

        return !!(
            token &&
            user
        );
    },

};

export default authService;