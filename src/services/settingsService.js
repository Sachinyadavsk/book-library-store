
import axios from "axios";

const API_URL = "/api/settings";

const settingsService = {

    // GET /api/settings
    getSettings: async () => {
        const response = await axios.get(
            API_URL
        );

        return response.data;
    },

    // PUT /api/settings
    updateSettings: async (data) => {
        const response = await axios.put(
            API_URL,
            data
        );

        return response.data;
    },

    // PATCH /api/settings/password
    changePassword: async (data) => {
        const response = await axios.patch(
            `${API_URL}/password`,
            data
        );

        return response.data;
    },
};

export default settingsService;

