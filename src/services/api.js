const API_BASE_URL = "https://book-library-store-api.onrender.com/api/v2";
// http://localhost:8000/api/v2
// https://book-library-store-api.onrender.com
const api = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const token = localStorage.getItem("token");

        const isFormData =
            options.body instanceof FormData;

        const headers = {
            Accept: "application/json",
            ...(options.headers || {}),
        };

        // IMPORTANT:
        // FormData must NOT have application/json
        if (!isFormData) {
            headers["Content-Type"] =
                "application/json";
        }

        if (token) {
            headers.Authorization =
                `Bearer ${token}`;
        }

        console.log("API URL:", url);
        console.log("IS FORMDATA:", isFormData);
        console.log("HEADERS:", headers);

        const response = await fetch(url, {
            ...options,
            headers,
        });

        console.log(
            "API STATUS:",
            response.status
        );

        const text = await response.text();

        let data = {};

        try {
            data = text
                ? JSON.parse(text)
                : {};
        } catch {
            data = {
                message: text,
            };
        }

        if (!response.ok) {
            throw new Error(
                data?.message ||
                `HTTP ${response.status}`
            );
        }

        return data;

    } catch (error) {
        console.error("API ERROR:", error);
        console.error("FAILED URL:", url);

        throw error;
    }
};

export default api;