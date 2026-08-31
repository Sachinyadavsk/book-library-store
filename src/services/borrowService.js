
import axios from "axios";

const API_URL = "/api/borrow";

const borrowService = {

    // GET /api/borrow
    getBorrowings: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // GET /api/borrow/:id
    getBorrowing: async (id) => {
        const response = await axios.get(
            `${API_URL}/${id}`
        );

        return response.data;
    },

    // POST /api/borrow
    borrowBook: async (data) => {
        const response = await axios.post(
            API_URL,
            data
        );

        return response.data;
    },

    // PATCH /api/borrow/:id/return
    returnBook: async (id) => {
        const response = await axios.patch(
            `${API_URL}/${id}/return`
        );

        return response.data;
    },

    // DELETE /api/borrow/:id
    deleteBorrowing: async (id) => {
        const response = await axios.delete(
            `${API_URL}/${id}`
        );

        return response.data;
    },
};

export default borrowService;

