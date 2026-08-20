// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

// ============================================
// GET AUTH TOKEN
// ============================================
const getToken = () => {
    return localStorage.getItem("token");
};

// ============================================
// COMMON REQUEST FUNCTION
// ============================================
const api = async (
    endpoint,
    options = {}
) => {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    // Add token when available
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers,
            }
        );

        // Try to read JSON
        const data = await response.json().catch(() => null);

        // ========================================
        // API ERROR
        // ========================================
        if (!response.ok) {
            throw new Error(
                data?.message ||
                `Request failed with status ${response.status}`
            );
        }

        return data;

    } catch (error) {

        console.error(
            "API Error:",
            error
        );

        throw error;
    }
};

// ============================================
// GET
// ============================================
export const get = (endpoint) => {
    return api(endpoint, {
        method: "GET",
    });
};

// ============================================
// POST
// ============================================
export const post = (
    endpoint,
    data = {}
) => {
    return api(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

// ============================================
// PUT
// ============================================
export const put = (
    endpoint,
    data = {}
) => {
    return api(endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

// ============================================
// PATCH
// ============================================
export const patch = (
    endpoint,
    data = {}
) => {
    return api(endpoint, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};

// ============================================
// DELETE
// ============================================
export const remove = (endpoint) => {
    return api(endpoint, {
        method: "DELETE",
    });
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default api;