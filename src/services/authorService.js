import api from "./api";

// ============================================
// AUTHOR SERVICE
// ============================================

const authorService = {

    // ============================================
    // GET ALL AUTHORS
    // ============================================

    async getAuthors(params = {}) {
        const query = new URLSearchParams();

        Object.entries(params).forEach(
            ([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                ) {
                    query.append(key, value);
                }
            }
        );

        const queryString = query.toString();

        return api(
            `/author${queryString ? `?${queryString}` : ""}`,
            {
                method: "GET",
            }
        );
    },

    // ============================================
    // GET SINGLE AUTHOR
    // ============================================

    async getAuthor(id) {
        if (!id) {
            throw new Error(
                "Author ID is required"
            );
        }

        return api(`/author/${id}`, {
            method: "GET",
        });
    },

    // ============================================
    // SEARCH AUTHORS
    // ============================================

    async searchAuthors(search) {
        if (!search) {
            return this.getAuthors();
        }

        return this.getAuthors({
            search,
        });
    },

    // ============================================
    // CREATE AUTHOR - ADMIN
    // ============================================

    async createAuthor(authorData) {
        if (!authorData) {
            throw new Error(
                "Author data is required"
            );
        }

        return api("/author", {
            method: "POST",
            body: JSON.stringify(authorData),
        });
    },

    // ============================================
    // UPDATE AUTHOR - ADMIN
    // ============================================

    async updateAuthor(id, authorData) {
        if (!id) {
            throw new Error(
                "Author ID is required"
            );
        }

        return api(`/author/${id}`, {
            method: "PUT",
            body: JSON.stringify(authorData),
        });
    },

    // ============================================
    // DELETE AUTHOR - ADMIN
    // ============================================

    async deleteAuthor(id) {
        if (!id) {
            throw new Error(
                "Author ID is required"
            );
        }

        return api(`/author/${id}`, {
            method: "DELETE",
        });
    },

    // ============================================
    // UPDATE AUTHOR STATUS
    // ============================================

    async updateStatus(id, status) {
        if (!id) {
            throw new Error(
                "Author ID is required"
            );
        }

        return api(`/author/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({
                status,
            }),
        });
    },
};

export default authorService;