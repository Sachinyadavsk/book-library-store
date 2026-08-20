import api from "../services/api";

// ============================================
// BOOK SERVICE
// ============================================

const bookService = {

    // ============================================
    // GET ALL BOOKS
    // ============================================
    async getBooks(params = {}) {
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
            `/books${queryString ? `?${queryString}` : ""}`,
            {
                method: "GET",
            }
        );
    },

    // ============================================
    // GET SINGLE BOOK
    // ============================================
    async getBook(id) {
        if (!id) {
            throw new Error(
                "Book ID is required"
            );
        }

        return api(`/books/${id}`, {
            method: "GET",
        });
    },

    // ============================================
    // SEARCH BOOKS
    // ============================================
    async searchBooks(search) {
        if (!search) {
            return this.getBooks();
        }

        return this.getBooks({
            search,
        });
    },

    // ============================================
    // GET BOOKS BY CATEGORY
    // ============================================
    async getBooksByCategory(category) {
        if (!category) {
            return this.getBooks();
        }

        return this.getBooks({
            category,
        });
    },

    // ============================================
    // GET BOOKS BY AUTHOR
    // ============================================
    async getBooksByAuthor(authorId) {
        if (!authorId) {
            throw new Error(
                "Author ID is required"
            );
        }

        return api(
            `/books/author/${authorId}`,
            {
                method: "GET",
            }
        );
    },

    // ============================================
    // GET FEATURED BOOKS
    // ============================================
    async getFeaturedBooks() {
        return api(
            "/books/featured",
            {
                method: "GET",
            }
        );
    },

    // ============================================
    // GET LATEST BOOKS
    // ============================================
    async getLatestBooks() {
        return api(
            "/books/latest",
            {
                method: "GET",
            }
        );
    },

    // ============================================
    // CREATE BOOK - ADMIN
    // ============================================
    async createBook(bookData) {
        if (!bookData) {
            throw new Error(
                "Book data is required"
            );
        }

        return api("/books", {
            method: "POST",
            body: JSON.stringify(bookData),
        });
    },

    // ============================================
    // UPDATE BOOK - ADMIN
    // ============================================
    async updateBook(id, bookData) {
        if (!id) {
            throw new Error(
                "Book ID is required"
            );
        }

        return api(`/books/${id}`, {
            method: "PUT",
            body: JSON.stringify(bookData),
        });
    },

    // ============================================
    // DELETE BOOK - ADMIN
    // ============================================
    async deleteBook(id) {
        if (!id) {
            throw new Error(
                "Book ID is required"
            );
        }

        return api(`/books/${id}`, {
            method: "DELETE",
        });
    },

    // ============================================
    // UPDATE STOCK - ADMIN
    // ============================================
    async updateStock(id, stock) {
        if (!id) {
            throw new Error(
                "Book ID is required"
            );
        }

        return api(`/books/${id}/stock`, {
            method: "PATCH",
            body: JSON.stringify({
                stock,
            }),
        });
    },

    // ============================================
    // UPDATE BOOK STATUS - ADMIN
    // ============================================
    async updateStatus(id, status) {
        if (!id) {
            throw new Error(
                "Book ID is required"
            );
        }

        return api(`/books/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({
                status,
            }),
        });
    },
};

export default bookService;