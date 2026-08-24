import api from "./api";

// ============================================
// CATEGORY SERVICE
// ============================================

const categoryService = {

    // ============================================
    // GET ALL CATEGORIES
    // ============================================

    async getCategories(params = {}) {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                query.append(key, value);
            }
        });

        const queryString = query.toString();

        return api(
            `/category${queryString ? `?${queryString}` : ""}`,
            {
                method: "GET",
            }
        );
    },

    // ============================================
    // GET SINGLE CATEGORY
    // ============================================

    async getCategory(id) {
        if (!id) {
            throw new Error("Category ID is required");
        }

        return api(`/category/${id}`, {
            method: "GET",
        });
    },

    // ============================================
    // SEARCH CATEGORIES
    // ============================================

    async searchCategories(search) {
        if (!search) {
            return this.getCategories();
        }

        return this.getCategories({
            search,
        });
    },

    // ============================================
    // CREATE CATEGORY
    // ============================================

    async createCategory(categoryData) {
        if (!categoryData) {
            throw new Error(
                "Category data is required"
            );
        }

        return api("/category", {
            method: "POST",
            body: JSON.stringify(categoryData),
        });
    },

    // ============================================
    // UPDATE CATEGORY
    // ============================================

    async updateCategory(id, categoryData) {
        if (!id) {
            throw new Error(
                "Category ID is required"
            );
        }

        return api(`/category/${id}`, {
            method: "PUT",
            body: JSON.stringify(categoryData),
        });
    },

    // ============================================
    // DELETE CATEGORY
    // ============================================

    async deleteCategory(id) {
        if (!id) {
            throw new Error(
                "Category ID is required"
            );
        }

        return api(`/category/${id}`, {
            method: "DELETE",
        });
    },

    // ============================================
    // UPDATE CATEGORY STATUS
    // ============================================

    async updateStatus(id, status) {
        if (!id) {
            throw new Error(
                "Category ID is required"
            );
        }

        return api(`/category/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({
                status,
            }),
        });
    },
};

export default categoryService;