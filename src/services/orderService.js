import api from "../services/api";

const orderService = {

    // ============================================
    // CREATE ORDER
    // ============================================
    async createOrder(orderData) {
        if (!orderData) {
            throw new Error("Order data is required");
        }
        return api("/order/", {
            method: "POST",
            body: JSON.stringify(orderData),
        });
    },

    // ============================================
    // GET MY ORDERS
    // ============================================
    async getMyOrders() {

        return api("/order/my-orders", {
            method: "GET",
        });
    },

    // ============================================
    // GET SINGLE ORDER
    // ============================================
    async getOrder(orderId) {

        if (!orderId) {
            throw new Error("Order ID is required");
        }

        return api(`/order/${orderId}`, {
            method: "GET",
        });
    },

    // ============================================
    // CANCEL ORDER
    // ============================================
    async cancelOrder(orderId) {

        if (!orderId) {
            throw new Error("Order ID is required");
        }

        return api(`/orders/${orderId}/cancel`, {
            method: "PATCH",
        });
    },

    // ============================================
    // TRACK ORDER
    // ============================================
    async trackOrder(orderId) {

        if (!orderId) {
            throw new Error("Order ID is required");
        }

        return api(`/orders/${orderId}/track`, {
            method: "GET",
        });
    },

    // ============================================
    // ADMIN - GET ALL ORDERS
    // ============================================
    async getAllOrders() {

        return api("/order/", {
            method: "GET",
        });
    },

    // ============================================
    // ADMIN - UPDATE ORDER STATUS
    // ============================================
    async updateOrderStatus(id, status) {
        if (!id) {
            throw new Error("Order ID is required");
        }

        if (!status) {
            throw new Error("Order status is required");
        }
        return api(`/order/${id}/status`,
            {
                method: "PUT",
                body: JSON.stringify({
                    status,
                }),
            }
        );
    },



};

export default orderService;