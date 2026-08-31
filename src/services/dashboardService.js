
import axios from "axios";

const API_URL = "/api/dashboard";

const dashboardService = {

    // GET dashboard data
    getDashboard: async () => {
        const response = await axios.get(
            API_URL
        );

        return response.data;
    },

};

export default dashboardService;

