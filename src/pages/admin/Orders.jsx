
import React, { useEffect, useMemo, useState } from "react";
import {
    FaShoppingBag,
    FaSearch,
    FaEye,
    FaTrash,
    FaTimes,
    FaSyncAlt,
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
    FaTruck,
    FaBoxOpen,
    FaRupeeSign,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // ============================================================
    // LOAD ORDERS
    // ============================================================

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await orderService.getOrders();

            const orderData =
                response?.orders ||
                response?.data?.orders ||
                response?.data ||
                response ||
                [];

            setOrders(Array.isArray(orderData) ? orderData : []);
        } catch (err) {
            console.error("Orders error:", err);
            setError(err?.message || "Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // HELPERS
    // ============================================================

    const getOrderId = (order) =>
        order?._id || order?.id || order?.orderId;

    const getOrderNumber = (order) =>
        order?.orderNumber ||
        order?.orderNo ||
        order?.number ||
        `#${String(getOrderId(order) || "").slice(-8)}`;

    const getCustomerName = (order) =>
        order?.customer?.name ||
        order?.user?.name ||
        order?.user?.fullName ||
        order?.customerName ||
        order?.name ||
        "Guest Customer";

    const getCustomerEmail = (order) =>
        order?.customer?.email ||
        order?.user?.email ||
        order?.email ||
        "-";

    const getOrderStatus = (order) =>
        String(
            order?.status ||
            order?.orderStatus ||
            "pending"
        ).toLowerCase();

    const getPaymentStatus = (order) =>
        String(
            order?.paymentStatus ||
            order?.payment?.status ||
            "pending"
        ).toLowerCase();

    const getTotal = (order) =>
        Number(
            order?.total ||
            order?.grandTotal ||
            order?.amount ||
            order?.totalAmount ||
            0
        );

    const getItemsCount = (order) => {
        if (Array.isArray(order?.items)) {
            return order.items.reduce(
                (total, item) =>
                    total + Number(item?.quantity || 1),
                0
            );
        }

        return Number(
            order?.itemsCount ||
            order?.quantity ||
            0
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const d = new Date(date);

        if (Number.isNaN(d.getTime())) {
            return "-";
        }

        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // ============================================================
    // FILTER ORDERS
    // ============================================================

    const filteredOrders = useMemo(() => {
        const query = search.trim().toLowerCase();

        return orders.filter((order) => {
            const orderNumber =
                getOrderNumber(order).toLowerCase();

            const customer =
                getCustomerName(order).toLowerCase();

            const email =
                getCustomerEmail(order).toLowerCase();

            const orderStatus = getOrderStatus(order);

            const searchMatch =
                !query ||
                orderNumber.includes(query) ||
                customer.includes(query) ||
                email.includes(query);

            const statusMatch =
                status === "all" ||
                orderStatus === status;

            return searchMatch && statusMatch;
        });
    }, [orders, search, status]);

    // ============================================================
    // STATISTICS
    // ============================================================

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => getOrderStatus(order) === "pending"
    ).length;

    const processingOrders = orders.filter(
        (order) =>
            getOrderStatus(order) === "processing"
    ).length;

    const completedOrders = orders.filter(
        (order) =>
            ["completed", "delivered"].includes(
                getOrderStatus(order)
            )
    ).length;

    const totalRevenue = orders.reduce(
        (total, order) => total + getTotal(order),
        0
    );

    // ============================================================
    // VIEW
    // ============================================================

    const handleView = (order) => {
        setSelectedOrder(order);
        setShowViewModal(true);
    };

    // ============================================================
    // DELETE
    // ============================================================

    const handleDelete = async (order) => {
        const id = getOrderId(order);

        if (!id) return;

        const confirmed = window.confirm(
            `Delete order ${getOrderNumber(order)}?`
        );

        if (!confirmed) return;

        try {
            setError("");
            setSuccess("");

            await orderService.deleteOrder(id);

            setOrders((prev) =>
                prev.filter(
                    (item) => getOrderId(item) !== id
                )
            );

            setSuccess("Order deleted successfully.");
        } catch (err) {
            console.error("Delete order error:", err);

            setError(
                err?.message ||
                "Failed to delete order."
            );
        }
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <div className="space-y-6">

                <div className="flex justify-between">
                    <div>
                        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-60 bg-gray-200 rounded mt-2 animate-pulse" />
                    </div>

                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-28 bg-gray-200 rounded-xl animate-pulse"
                        />
                    ))}
                </div>

                <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />

                <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />

            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <div className="space-y-6">

            {/* ======================================================
                HEADER
            ====================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FaShoppingBag className="text-xl" />
                    </div>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Orders
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage customer orders
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={fetchOrders}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                    <FaSyncAlt />
                    Refresh
                </button>

            </div>

            {/* ======================================================
                ALERTS
            ====================================================== */}

            {success && (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">

                    <div className="flex items-center gap-2">
                        <FaCheckCircle />
                        {success}
                    </div>

                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                    >
                        <FaTimes />
                    </button>

                </div>
            )}

            {error && (
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">

                    <div className="flex items-center gap-2">
                        <FaExclamationTriangle />
                        {error}
                    </div>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        <FaTimes />
                    </button>

                </div>
            )}

            {/* ======================================================
                STATISTICS
            ====================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={<FaShoppingBag />}
                    bg="bg-blue-100"
                    text="text-blue-600"
                />

                <StatCard
                    title="Pending"
                    value={pendingOrders}
                    icon={<FaClock />}
                    bg="bg-yellow-100"
                    text="text-yellow-600"
                />

                <StatCard
                    title="Processing"
                    value={processingOrders}
                    icon={<FaTruck />}
                    bg="bg-purple-100"
                    text="text-purple-600"
                />

                <StatCard
                    title="Completed"
                    value={completedOrders}
                    icon={<FaCheckCircle />}
                    bg="bg-green-100"
                    text="text-green-600"
                />

            </div>

            {/* ======================================================
                REVENUE
            ====================================================== */}

            <div className="bg-white border rounded-xl shadow-sm p-5">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-sm text-gray-500">
                            Total Revenue
                        </p>

                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {formatCurrency(totalRevenue)}
                        </p>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                        <FaRupeeSign />
                    </div>

                </div>

            </div>

            {/* ======================================================
                SEARCH + FILTER
            ====================================================== */}

            <div className="bg-white border rounded-xl shadow-sm p-4">

                <div className="flex flex-col lg:flex-row gap-3">

                    <div className="relative flex-1">

                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="search"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search order number, customer or email..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                        className="lg:w-52 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">
                            All Status
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="processing">
                            Processing
                        </option>

                        <option value="shipped">
                            Shipped
                        </option>

                        <option value="delivered">
                            Delivered
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>
                    </select>

                    <button
                        type="button"
                        onClick={fetchOrders}
                        className="px-4 py-2.5 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <FaSyncAlt />
                        Refresh
                    </button>

                </div>

            </div>

            {/* ======================================================
                ORDERS TABLE
            ====================================================== */}

            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                <div className="p-4 sm:p-5 border-b">

                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                        All Orders
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {filteredOrders.length} orders found
                    </p>

                </div>

                {filteredOrders.length === 0 ? (
                    <EmptyOrders />
                ) : (

                    <div className="w-full overflow-x-auto">

                        <table className="w-full min-w-[850px] table-auto">

                            <thead>
                                <tr className="bg-gray-50 border-b">

                                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        #
                                    </th>

                                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Order
                                    </th>

                                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Customer
                                    </th>

                                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Items
                                    </th>

                                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Total
                                    </th>

                                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Payment
                                    </th>

                                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Date
                                    </th>

                                    <th className="px-4 sm:px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredOrders.map((order, index) => {

                                    const orderStatus =
                                        getOrderStatus(order);

                                    const paymentStatus =
                                        getPaymentStatus(order);

                                    return (
                                        <tr
                                            key={
                                                getOrderId(order) ||
                                                index
                                            }
                                            className="hover:bg-gray-50 transition"
                                        >

                                            <td className="px-4 sm:px-5 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>

                                            <td className="px-4 sm:px-5 py-4">

                                                <p className="font-semibold text-sm text-gray-800">
                                                    {getOrderNumber(order)}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    #
                                                    {String(
                                                        getOrderId(order) || ""
                                                    ).slice(-8)}
                                                </p>

                                            </td>

                                            <td className="px-4 sm:px-5 py-4">

                                                <p className="font-medium text-sm text-gray-800">
                                                    {getCustomerName(order)}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    {getCustomerEmail(order)}
                                                </p>

                                            </td>

                                            <td className="px-4 sm:px-5 py-4 text-sm text-gray-600">
                                                {getItemsCount(order)}
                                            </td>

                                            <td className="px-4 sm:px-5 py-4">

                                                <p className="font-semibold text-sm text-gray-800">
                                                    {formatCurrency(
                                                        getTotal(order)
                                                    )}
                                                </p>

                                            </td>

                                            <td className="px-4 sm:px-5 py-4">
                                                <PaymentBadge
                                                    status={
                                                        paymentStatus
                                                    }
                                                />
                                            </td>

                                            <td className="px-4 sm:px-5 py-4">
                                                <OrderStatusBadge
                                                    status={
                                                        orderStatus
                                                    }
                                                />
                                            </td>

                                            <td className="px-4 sm:px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                {formatDate(
                                                    order?.createdAt ||
                                                    order?.orderDate
                                                )}
                                            </td>

                                            <td className="px-4 sm:px-5 py-4">

                                                <div className="flex justify-end items-center gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleView(
                                                                order
                                                            )
                                                        }
                                                        title="View"
                                                        className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition"
                                                    >
                                                        <FaEye />
                                                    </button>

                                                    <Link
                                                        to={`/admin/orders/${getOrderId(order)}`}
                                                        title="View Order"
                                                        className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
                                                    >
                                                        <FaBoxOpen />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                order
                                                            )
                                                        }
                                                        title="Delete"
                                                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* ======================================================
                VIEW ORDER MODAL
            ====================================================== */}

            {showViewModal && selectedOrder && (
                <div
                    className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
                    onClick={() =>
                        setShowViewModal(false)
                    }
                >

                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="p-5 border-b flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Order Details
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {getOrderNumber(
                                        selectedOrder
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowViewModal(false)
                                }
                                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                            >
                                <FaTimes />
                            </button>

                        </div>

                        <div className="p-6 space-y-5">

                            <div className="flex items-center justify-between">

                                <OrderStatusBadge
                                    status={getOrderStatus(
                                        selectedOrder
                                    )}
                                />

                                <PaymentBadge
                                    status={getPaymentStatus(
                                        selectedOrder
                                    )}
                                />

                            </div>

                            <div className="space-y-1">

                                <InfoRow
                                    label="Order Number"
                                    value={getOrderNumber(
                                        selectedOrder
                                    )}
                                />

                                <InfoRow
                                    label="Customer"
                                    value={getCustomerName(
                                        selectedOrder
                                    )}
                                />

                                <InfoRow
                                    label="Email"
                                    value={getCustomerEmail(
                                        selectedOrder
                                    )}
                                />

                                <InfoRow
                                    label="Items"
                                    value={getItemsCount(
                                        selectedOrder
                                    )}
                                />

                                <InfoRow
                                    label="Total"
                                    value={formatCurrency(
                                        getTotal(
                                            selectedOrder
                                        )
                                    )}
                                />

                                <InfoRow
                                    label="Payment"
                                    value={getPaymentStatus(
                                        selectedOrder
                                    )}
                                />

                                <InfoRow
                                    label="Status"
                                    value={getOrderStatus(
                                        selectedOrder
                                    )}
                                />

                                <InfoRow
                                    label="Created"
                                    value={formatDate(
                                        selectedOrder?.createdAt
                                    )}
                                />

                                <InfoRow
                                    label="Order ID"
                                    value={
                                        getOrderId(
                                            selectedOrder
                                        ) || "-"
                                    }
                                />

                            </div>

                            {/* ORDER ITEMS */}

                            {Array.isArray(
                                selectedOrder?.items
                            ) &&
                                selectedOrder.items.length > 0 && (

                                    <div>

                                        <h3 className="font-semibold text-gray-800 mb-3">
                                            Order Items
                                        </h3>

                                        <div className="border rounded-xl divide-y">

                                            {selectedOrder.items.map(
                                                (item, index) => (

                                                    <div
                                                        key={
                                                            item?._id ||
                                                            item?.id ||
                                                            index
                                                        }
                                                        className="p-3 flex items-center justify-between gap-3"
                                                    >

                                                        <div className="min-w-0">

                                                            <p className="font-medium text-sm text-gray-800 truncate">
                                                                {item?.product?.name ||
                                                                    item?.name ||
                                                                    "Product"}
                                                            </p>

                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Qty:{" "}
                                                                {item?.quantity ||
                                                                    1}
                                                            </p>

                                                        </div>

                                                        <p className="font-semibold text-sm whitespace-nowrap">
                                                            {formatCurrency(
                                                                Number(
                                                                    item?.price ||
                                                                    item?.total ||
                                                                    0
                                                                )
                                                            )}
                                                        </p>

                                                    </div>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
    title,
    value,
    icon,
    bg,
    text,
}) => (
    <div className="bg-white border rounded-xl shadow-sm p-5">

        <div className="flex items-center justify-between">

            <div>
                <p className="text-sm text-gray-500">
                    {title}
                </p>

                <p className="text-2xl font-bold text-gray-800 mt-1">
                    {value}
                </p>
            </div>

            <div
                className={`w-11 h-11 rounded-xl ${bg} ${text} flex items-center justify-center`}
            >
                {icon}
            </div>

        </div>

    </div>
);

// ============================================================
// ORDER STATUS BADGE
// ============================================================

const OrderStatusBadge = ({ status }) => {

    const styles = {
        pending: "bg-yellow-100 text-yellow-700",
        processing: "bg-purple-100 text-purple-700",
        shipped: "bg-blue-100 text-blue-700",
        delivered: "bg-green-100 text-green-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700",
        canceled: "bg-red-100 text-red-700",
    };

    const label =
        status.charAt(0).toUpperCase() +
        status.slice(1);

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] ||
                "bg-gray-100 text-gray-700"
                }`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />

            {label}
        </span>
    );
};

// ============================================================
// PAYMENT BADGE
// ============================================================

const PaymentBadge = ({ status }) => {

    const paid = [
        "paid",
        "success",
        "completed",
    ].includes(status);

    return (
        <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${paid
                ? "bg-green-100 text-green-700"
                : status === "failed"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
        >
            {status.charAt(0).toUpperCase() +
                status.slice(1)}
        </span>
    );
};

// ============================================================
// EMPTY ORDERS
// ============================================================

const EmptyOrders = () => (
    <div className="py-16 text-center">

        <FaShoppingBag className="mx-auto text-5xl text-gray-300" />

        <h3 className="text-lg font-semibold text-gray-700 mt-4">
            No orders found
        </h3>

        <p className="text-sm text-gray-500 mt-1">
            Try changing your search or filters.
        </p>

    </div>
);

// ============================================================
// INFO ROW
// ============================================================

const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">

        <span className="text-sm text-gray-500">
            {label}
        </span>

        <span className="text-sm font-medium text-gray-800 text-right break-all">
            {value}
        </span>

    </div>
);

export default Orders;

