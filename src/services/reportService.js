
import axios from "axios";

const API_URL = "/api/reports";

const reportService = {

    // GET /api/reports?days=30
    getReports: async (params = {}) => {
        const response = await axios.get(
            API_URL,
            {
                params,
            }
        );

        return response.data;
    },

    // GET /api/reports/summary
    getSummary: async () => {
        const response = await axios.get(
            `${API_URL}/summary`
        );

        return response.data;
    },

    // GET /api/reports/borrowing
    getBorrowingReport: async (
        params = {}
    ) => {
        const response = await axios.get(
            `${API_URL}/borrowing`,
            {
                params,
            }
        );

        return response.data;
    },

    // GET /api/reports/books
    getBookReport: async (
        params = {}
    ) => {
        const response = await axios.get(
            `${API_URL}/books`,
            {
                params,
            }
        );

        return response.data;
    },
};

export default reportService;

