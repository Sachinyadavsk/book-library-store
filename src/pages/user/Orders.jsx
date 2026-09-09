
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faEye,
  faShoppingBag,
  faCalendar,
  faIndianRupeeSign,
  faArrowRight,
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import orderService from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET LOGGED-IN USER
  const user = JSON.parse(localStorage.getItem("user"));

  // LOAD ORDERS FROM API
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // CONDITION 1: LOGIN
      if (!user) {
        setOrders([]);
        setError("Please login to view your orders.");
        return;
      }

      // CONDITION 2: API EXISTENCE
      if (!orderService || typeof orderService.getMyOrders !== "function") {
        setOrders([]);
        setError("Order API is not configured.");
        return;
      }

      // GET ORDERS API
      const response = await orderService.getMyOrders();
      console.log("Orders API Response:", response);

      // CONDITION 3: API FAILURE
      if (!response) {
        setOrders([]);
        setError("Unable to load orders. Please try again.");
        return;
      }

      if (response.success === false) {
        setOrders([]);
        setError(
          response.message ||
          "Unable to load your orders."
        );
        return;
      }


      // GET ORDERS ARRAY

      const apiOrders =
        response?.orders ??
        response?.data?.orders ??
        response?.data ??
        [];


      // CONDITION 4: INVALID ORDERS RESPONSE

      if (!Array.isArray(apiOrders)) {
        setOrders([]);
        setError("Invalid orders response from server.");
        return;
      }


      // USER ID

      const userId =
        user?.id ??
        user?._id ??
        user?.user_id ??
        "";


      // USER ORDER FILTER
      //
      // If API already returns only current user's
      // orders, this filter simply leaves them intact.

      const userOrders = apiOrders.filter((order) => {
        const orderUserId =
          order?.user_id ??
          order?.userId ??
          order?.user?._id ??
          order?.user?.id ??
          "";

        // If API does not provide user ID on order,
        // trust backend's current-user endpoint.
        if (!orderUserId) {
          return true;
        }

        return String(orderUserId) === String(userId);
      });


      // LATEST ORDERS FIRST
      const sortedOrders = [...userOrders].sort(
        (a, b) => {
          const dateA = new Date(a?.createdAt || a?.date || a?.orderDate || 0).getTime();
          const dateB = new Date(b?.createdAt || b?.date || b?.orderDate || 0).getTime();
          return dateB - dateA;
        }
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Unable to load orders:", err);
      setOrders([]);
      setError(err?.message || "Unable to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // INITIAL LOAD
  useEffect(() => {
    loadOrders();
    // creates/updates an order.
    window.addEventListener(
      "ordersUpdated",
      loadOrders
    );

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        loadOrders
      );
    };
  }, []);


  // STATUS
  const getStatusClass = (status) => {
    switch (String(status)) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Confirmed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  // FILTER

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => String(order.orderStatus || "Pending") === filter);

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ORDER TOTAL
  const getOrderTotal = (order) => {
    if (order?.totalAmount !== undefined) {
      return Number(order.totalAmount) || 0;
    }

    if (order?.total !== undefined) {
      return Number(order.total) || 0;
    }

    if (order?.grandTotal !== undefined) {
      return Number(order.grandTotal) || 0;
    }

    if (Array.isArray(order?.items)) {
      return order.items.reduce(
        (total, item) =>
          total +
          Number(item?.price || 0) *
          Number(item?.quantity || 1),
        0
      );
    }
    return 0;
  };


  // ITEM COUNT
  const getItemCount = (order) => {
    if (!Array.isArray(order?.items)) {
      return Number(
        order?.itemCount ||
        order?.totalItems ||
        0
      );
    }

    return order.items.reduce(
      (total, item) =>
        total +
        Number(item?.quantity || 1),
      0
    );
  };


  // ORDER ID
  const getOrderId = (order) => {
    return (
      order?._id ||
      order?.orderNumber ||
      order?.orderId ||
      order?.id ||
      "N/A"
    );
  };


  // LOADING
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl text-blue-600"
              />
              <p className="mt-4 text-gray-600">
                Loading your orders...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ERROR
  if (error && orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="text-center py-10">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="text-3xl"
              />
            </div>
            <h2 className="mt-5 text-xl sm:text-2xl font-bold text-gray-800">
              Unable to Load Orders
            </h2>
            <p className="mt-2 text-gray-500">
              {error}
            </p>
            <button
              type="button"
              onClick={loadOrders}
              className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============================================
          HEADER
      ============================================ */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faShoppingBag}
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  My Orders
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  View and manage your book orders.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/books"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <FontAwesomeIcon
              icon={faShoppingBag}
            />
            Continue Shopping
          </Link>
        </div>
      </div>


      {/* ============================================
          FILTER
      ============================================ */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex gap-2 overflow-x-auto">

            {[
              "All",
              "Pending",
              "Processing",
              "Shipped",
              "Delivered",
              "Cancelled",
            ].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}


      {/* ============================================
          ORDER COUNT
      ============================================ */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {filter === "All"
              ? "All Orders"
              : `${filter} Orders`}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredOrders.length} order
            {filteredOrders.length !== 1
              ? "s"
              : ""}
          </span>
        </div>
      )}


      {/* ============================================
          NO ORDERS
      ============================================ */}
      {orders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <FontAwesomeIcon
              icon={faBoxOpen}
              className="text-3xl"
            />
          </div>

          <h2 className="mt-5 text-xl sm:text-2xl font-bold text-gray-800">
            No Orders Yet
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            You haven't placed any orders yet. Explore our
            books and find something you love.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Browse Books
            <FontAwesomeIcon
              icon={faArrowRight}
            />
          </Link>
        </div>
      )}


      {/* ============================================
          FILTER HAS NO ORDERS
      ============================================ */}
      {orders.length > 0 &&
        filteredOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-800">No {filter} Orders</h2>
            <p className="mt-2 text-gray-500">There are no orders with this status.</p>
            <button
              type="button"
              onClick={() => setFilter("All")}
              className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Orders
            </button>
          </div>
        )}


      {/* ============================================
          ORDERS
      ============================================ */}
      <div className="space-y-5">
        {filteredOrders.map(
          (order, index) => {
            const orderId = getOrderId(order);
            const status = order.orderStatus || "Pending";
            const items = Array.isArray(order.items)
              ? order.items
              : [];

            return (
              <div
                key={`${orderId}-${index}`}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >

                {/* ====================================
                    ORDER HEADER
                ==================================== */}
                <div className="p-4 sm:p-5 border-b">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-800">
                          Order #{orderId}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCalendar}
                          />
                          {formatDate(order.createdAt || order.date || order.orderDate)}
                        </span>

                        <span className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faShoppingBag} />
                          {getItemCount(order)} item
                          {getItemCount(order) !==
                            1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                    </div>


                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500">
                          Order Total
                        </p>
                        <p className="text-xl font-bold text-blue-600 flex items-center gap-1">
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            className="text-sm"
                          />
                          {getOrderTotal(order).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Link
                        to={`/order-success/${orderId}`}
                        className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition"
                        title="View Order"
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                        />
                      </Link>
                    </div>
                  </div>
                </div>


                {/* ====================================
                    ORDER ITEMS
                ==================================== */}
                <div className="p-4 sm:p-5">
                  {items.length > 0 ? (
                    <div className="space-y-4">
                      {items.slice(0, 3).map((item, itemIndex) => {
                        const book = item?.book && typeof item.book === "object" ? item.book : null;
                        const title = item?.title || "Book";
                        const image = item?.images || "";
                        const author = item?.author || book?.author || "";

                        return (
                          <div
                            key={item?._id || item?.id || item?.bookId || book?._id || itemIndex}
                            className="flex gap-4"
                          >
                            {/* Image */}
                            <div className="w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                              {image ? (
                                <img src={image}
                                  alt={title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                  📚
                                </div>
                              )}
                            </div>


                            {/* Information */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 line-clamp-2">
                                {title}
                              </h4>
                              {author && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {
                                    author
                                  }
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="text-sm text-gray-500">
                                  Qty:{" "}{item.quantity || 1}
                                </span>
                                <span className="font-semibold text-blue-600">
                                  ₹ {Number(item.price || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      )}


                      {/* More items */}
                      {items.length >
                        3 && (
                          <p className="text-sm text-gray-500 pt-1">
                            +{" "}
                            {items.length - 3}{" "}
                            more item
                            {items.length - 3 !== 1 ? "s" : ""}
                          </p>
                        )}
                    </div>
                  ) : (
                    <div className="py-5 text-center text-gray-500">
                      Order items are unavailable.
                    </div>
                  )}
                </div>


                {/* ====================================
                    FOOTER
                ==================================== */}
                <div className="px-4 sm:px-5 py-4 bg-gray-50 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-gray-500">
                    Payment:{" "}
                    <span className="font-medium text-gray-700">
                      {order.payment_method || order.paymentMethod || "Not specified"}
                    </span>
                  </div>

                  <Link
                    to={`/order-success/${orderId}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition"
                  >
                    View Order
                    <FontAwesomeIcon
                      icon={faArrowRight}
                    />
                  </Link>
                </div>
              </div>
            );
          }
        )}

      </div>

    </div>
  );
};

export default Orders;
