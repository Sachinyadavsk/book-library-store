const API_BASE_URL ='https://book-library-store-api.onrender.com/api/v2';
// http://localhost:8000/api/v2
const api = async (endpoint, options = {}) => {

    const url = `${API_BASE_URL}${endpoint}`;

    console.log("================================");
    console.log("API BASE URL:", API_BASE_URL);
    console.log("API ENDPOINT:", endpoint);
    console.log("FINAL API URL:", url);
    console.log("================================");

    try {

        const token =
            localStorage.getItem("token");

        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(options.headers || {}),
        };

        if (token) {
            headers.Authorization =
                `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        console.log(
            "API STATUS:",
            response.status
        );

        const text =
            await response.text();

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

        console.error(
            "API Error:",
            error
        );

        console.error(
            "FAILED URL:",
            url
        );

        throw error;
    }
};

export default api;