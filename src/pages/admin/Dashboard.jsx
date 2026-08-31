
import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaShoppingCart,
  FaStar,
  FaSyncAlt,
  FaArrowRight,
} from "react-icons/fa";

import dashboardService from "../../services/dashboardService";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    statistics: {
      totalBooks: 0,
      totalMembers: 0,
      borrowedBooks: 0,
      overdueBooks: 0,
      totalOrders: 0,
      totalReviews: 0,
    },
    recentBorrowings: [],
    recentOrders: [],
    recentReviews: [],
    activities: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // GET DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response =
        await dashboardService.getDashboard();

      /*
       * Supports:
       *
       * {
       *   data: {
       *      statistics: {},
       *      recentBorrowings: [],
       *      recentOrders: [],
       *      recentReviews: [],
       *      activities: []
       *   }
       * }
       *
       * OR
       *
       * {
       *   statistics: {},
       *   recentBorrowings: []
       * }
       */

      const data =
        response?.data ??
        response ??
        {};

      setDashboard({
        statistics: {
          totalBooks:
            data?.statistics
              ?.totalBooks ?? 0,

          totalMembers:
            data?.statistics
              ?.totalMembers ?? 0,

          borrowedBooks:
            data?.statistics
              ?.borrowedBooks ?? 0,

          overdueBooks:
            data?.statistics
              ?.overdueBooks ?? 0,

          totalOrders:
            data?.statistics
              ?.totalOrders ?? 0,

          totalReviews:
            data?.statistics
              ?.totalReviews ?? 0,
        },

        recentBorrowings:
          Array.isArray(
            data?.recentBorrowings
          )
            ? data.recentBorrowings
            : [],

        recentOrders:
          Array.isArray(
            data?.recentOrders
          )
            ? data.recentOrders
            : [],

        recentReviews:
          Array.isArray(
            data?.recentReviews
          )
            ? data.recentReviews
            : [],

        activities:
          Array.isArray(
            data?.activities
          )
            ? data.activities
            : [],
      });
    } catch (err) {
      console.error(
        "Dashboard API error:",
        err
      );

      const status =
        err?.response?.status;

      if (status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
      } else if (status === 403) {
        setError(
          "You do not have permission to view the dashboard."
        );
      } else if (status === 404) {
        setError(
          "Dashboard API endpoint was not found."
        );
      } else if (status >= 500) {
        setError(
          "Server error. Please try again later."
        );
      } else {
        setError(
          err?.response?.data?.message ||
          "Unable to load dashboard data."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return <DashboardSkeleton />;
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="space-y-6">

        <DashboardHeader
          onRefresh={() =>
            fetchDashboard(true)
          }
          refreshing={refreshing}
        />

        <div className="min-h-[350px] flex items-center justify-center bg-white border rounded-xl">

          <div className="text-center px-5">

            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <FaExclamationTriangle />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>

            <button
              onClick={() =>
                fetchDashboard(true)
              }
              disabled={refreshing}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSyncAlt />
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  const stats =
    dashboard.statistics;

  return (
    <div className="space-y-6">

      {/* =================================================
                HEADER
            ================================================= */}

      <DashboardHeader
        onRefresh={() =>
          fetchDashboard(true)
        }
        refreshing={refreshing}
      />

      {/* =================================================
                STATISTICS
            ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={<FaBook />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={<FaUsers />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Borrowed Books"
          value={stats.borrowedBooks}
          icon={<FaExchangeAlt />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Overdue Books"
          value={stats.overdueBooks}
          icon={<FaExclamationTriangle />}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          danger={
            Number(
              stats.overdueBooks
            ) > 0
          }
        />

      </div>

      {/* =================================================
                SECONDARY STATISTICS
            ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={<FaStar />}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />

      </div>

      {/* =================================================
                RECENT DATA
            ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* RECENT BORROWINGS */}

        <Panel
          title="Recent Borrowings"
          icon={<FaExchangeAlt />}
        >
          {dashboard.recentBorrowings
            .length === 0 ? (
            <EmptyState
              message="No recent borrowings found."
            />
          ) : (
            <BorrowingList
              data={
                dashboard.recentBorrowings
              }
            />
          )}
        </Panel>

        {/* RECENT ORDERS */}

        <Panel
          title="Recent Orders"
          icon={<FaShoppingCart />}
        >
          {dashboard.recentOrders
            .length === 0 ? (
            <EmptyState
              message="No recent orders found."
            />
          ) : (
            <OrderList
              data={
                dashboard.recentOrders
              }
            />
          )}
        </Panel>

      </div>

      {/* =================================================
                REVIEWS + ACTIVITY
            ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <Panel
          title="Recent Reviews"
          icon={<FaStar />}
        >
          {dashboard.recentReviews
            .length === 0 ? (
            <EmptyState
              message="No reviews found."
            />
          ) : (
            <ReviewList
              data={
                dashboard.recentReviews
              }
            />
          )}
        </Panel>

        <Panel
          title="Recent Activity"
          icon={<FaSyncAlt />}
        >
          {dashboard.activities
            .length === 0 ? (
            <EmptyState
              message="No recent activity."
            />
          ) : (
            <ActivityList
              data={
                dashboard.activities
              }
            />
          )}
        </Panel>

      </div>

    </div>
  );
};

// =============================================================
// HEADER
// =============================================================

const DashboardHeader = ({
  onRefresh,
  refreshing,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Overview of your library system
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        <FaSyncAlt
          className={
            refreshing
              ? "animate-spin"
              : ""
          }
        />

        {refreshing
          ? "Refreshing..."
          : "Refresh"}
      </button>

    </div>
  );
};

// =============================================================
// STAT CARD
// =============================================================

const StatCard = ({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  danger = false,
}) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3
            className={`text-2xl font-bold mt-2 ${danger
              ? "text-red-600"
              : "text-gray-800"
              }`}
          >
            {Number(value || 0).toLocaleString()}
          </h3>

        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

// =============================================================
// PANEL
// =============================================================

const Panel = ({
  title,
  icon,
  children,
}) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

      <div className="flex items-center justify-between p-5 border-b">

        <div className="flex items-center gap-2">

          <span className="text-blue-600">
            {icon}
          </span>

          <h2 className="font-semibold text-gray-800">
            {title}
          </h2>

        </div>

      </div>

      <div className="p-5">
        {children}
      </div>

    </div>
  );
};

// =============================================================
// BORROWING LIST
// =============================================================

const BorrowingList = ({
  data,
}) => {
  return (
    <div className="space-y-3">

      {data.slice(0, 5).map(
        (item, index) => {

          const status =
            String(
              item.status || ""
            ).toLowerCase();

          const isOverdue =
            status === "overdue";

          return (
            <div
              key={
                item._id ||
                item.id ||
                index
              }
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50"
            >

              <div className="min-w-0">

                <p className="font-medium text-gray-800 truncate">
                  {item.book?.title ||
                    item.bookTitle ||
                    item.title ||
                    "Unknown Book"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {item.user?.name ||
                    item.member?.name ||
                    item.userName ||
                    "Unknown Member"}
                </p>

              </div>

              <StatusBadge
                status={
                  item.status
                }
              />

            </div>
          );
        }
      )}

    </div>
  );
};

// =============================================================
// ORDER LIST
// =============================================================

const OrderList = ({
  data,
}) => {
  return (
    <div className="space-y-3">

      {data.slice(0, 5).map(
        (item, index) => {

          const status =
            item.status ||
            "pending";

          return (
            <div
              key={
                item._id ||
                item.id ||
                index
              }
              className="flex items-center justify-between gap-4 p-3 rounded-lg bg-gray-50"
            >

              <div className="min-w-0">

                <p className="font-medium text-gray-800 truncate">
                  {item.orderNumber ||
                    item.orderId ||
                    `Order #${item.id || index + 1}`}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {item.user?.name ||
                    item.customer?.name ||
                    item.customerName ||
                    "Unknown Customer"}
                </p>

              </div>

              <div className="text-right">

                <p className="font-semibold text-gray-800">
                  ₹
                  {Number(
                    item.total ||
                    item.amount ||
                    0
                  ).toLocaleString()}
                </p>

                <StatusBadge
                  status={
                    status
                  }
                />

              </div>

            </div>
          );
        }
      )}

    </div>
  );
};

// =============================================================
// REVIEW LIST
// =============================================================

const ReviewList = ({
  data,
}) => {
  return (
    <div className="space-y-3">

      {data.slice(0, 5).map(
        (item, index) => {

          const rating =
            Number(
              item.rating || 0
            );

          return (
            <div
              key={
                item._id ||
                item.id ||
                index
              }
              className="p-3 rounded-lg bg-gray-50"
            >

              <div className="flex justify-between gap-3">

                <p className="font-medium text-gray-800">
                  {item.user?.name ||
                    item.userName ||
                    item.name ||
                    "Anonymous"}
                </p>

                <div className="flex items-center gap-1 text-yellow-500">

                  <FaStar />

                  <span className="text-sm font-medium">
                    {rating}
                  </span>

                </div>

              </div>

              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {item.comment ||
                  item.review ||
                  "No review text."}
              </p>

            </div>
          );
        }
      )}

    </div>
  );
};

// =============================================================
// ACTIVITY
// =============================================================

const ActivityList = ({
  data,
}) => {
  return (
    <div className="space-y-4">

      {data.slice(0, 6).map(
        (item, index) => (
          <div
            key={
              item._id ||
              item.id ||
              index
            }
            className="flex gap-3"
          >

            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 shrink-0" />

            <div>

              <p className="text-sm text-gray-700">
                {item.message ||
                  item.description ||
                  item.action ||
                  "Activity updated"}
              </p>

              {item.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(
                    item.createdAt
                  )}
                </p>
              )}

            </div>

          </div>
        )
      )}

    </div>
  );
};

// =============================================================
// STATUS
// =============================================================

const StatusBadge = ({
  status,
}) => {
  const value =
    String(
      status || "pending"
    ).toLowerCase();

  let classes =
    "bg-gray-100 text-gray-600";

  if (
    [
      "completed",
      "returned",
      "approved",
      "success",
      "delivered",
    ].includes(value)
  ) {
    classes =
      "bg-green-100 text-green-700";
  }

  if (
    [
      "pending",
      "processing",
      "requested",
    ].includes(value)
  ) {
    classes =
      "bg-yellow-100 text-yellow-700";
  }

  if (
    [
      "overdue",
      "cancelled",
      "rejected",
      "failed",
    ].includes(value)
  ) {
    classes =
      "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${classes}`}
    >
      {value}
    </span>
  );
};

// =============================================================
// EMPTY STATE
// =============================================================

const EmptyState = ({
  message,
}) => (
  <div className="py-10 text-center">

    <p className="text-sm text-gray-400">
      {message}
    </p>

  </div>
);

// =============================================================
// DATE
// =============================================================

const formatDate = (date) => {
  if (!date) return "-";

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "-";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

// =============================================================
// LOADING SKELETON
// =============================================================

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">

      <div className="h-10 w-48 bg-gray-200 rounded-lg" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-32 bg-gray-200 rounded-xl"
            />
          )
        )}

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {[1, 2].map(
          (item) => (
            <div
              key={item}
              className="h-80 bg-gray-200 rounded-xl"
            />
          )
        )}

      </div>

    </div>
  );
};

export default Dashboard;

