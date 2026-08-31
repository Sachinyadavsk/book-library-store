
import axios from "axios";

const API_URL = "/api/reviews";

const reviewService = {

    // GET /api/reviews
    getReviews: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // GET /api/reviews/:id
    getReview: async (id) => {
        const response = await axios.get(
            `${API_URL}/${id}`
        );

        return response.data;
    },

    // PATCH /api/reviews/:id/status
    updateReviewStatus: async (
        id,
        status
    ) => {
        const response = await axios.patch(
            `${API_URL}/${id}/status`,
            { status }
        );

        return response.data;
    },

    // DELETE /api/reviews/:id
    deleteReview: async (id) => {
        const response = await axios.delete(
            `${API_URL}/${id}`
        );

        return response.data;
    },
};

export default reviewService;

