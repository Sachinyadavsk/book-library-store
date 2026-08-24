import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaUsers,
  FaShoppingCart,
  FaExchangeAlt,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaPlus,
  FaUserPlus,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    borrowedBooks: 0,
    availableBooks: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    // Replace this with your API request
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        /*
        Example API:

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const data = await response.json();

        setDashboard(data);
        */

        // Temporary dashboard data
        await new Promise((resolve) => setTimeout(resolve, 800));

        setDashboard({
          totalBooks: 1250,
          totalUsers: 845,
          totalOrders: 326,
          borrowedBooks: 184,
          availableBooks: 1066,
          pendingOrders: 18,
          totalRevenue: 48560,
          recentOrders: [
            {
              id: "#ORD-1001",
              customer: "Rahul Kumar",
              book: "The Great Gatsby",
              amount: 599,
              status: "Completed",
            },
            {
              id: "#ORD-1002",
              customer: "Amit Sharma",
              book: "Atomic Habits",
              amount: 450,
              status: "Pending",
            },
            {
              id: "#ORD-1003",
              customer: "Priya Singh",
              book: "Rich Dad Poor Dad",
              amount: 399,
              status: "Completed",
            },
            {
              id: "#ORD-1004",
              customer: "Neha Verma",
              book: "Ikigai",
              amount: 299,
              status: "Processing",
            },
          ],
        });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Books",
      value: dashboard.totalBooks,
      icon: <FaBook />,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "+12%",
      positive: true,
    },
    {
      title: "Total Users",
      value: dashboard.totalUsers,
      icon: <FaUsers />,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      change: "+8%",
      positive: true,
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: <FaShoppingCart />,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "+15%",
      positive: true,
    },
    {
      title: "Borrowed Books",
      value: dashboard.borrowedBooks,
      icon: <FaExchangeAlt />,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
      change: "-5%",
      positive: false,
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // LOADING CONDITION
  // =========================
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl shadow p-5 h-32"
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-xl shadow h-80"></div>
          <div className="bg-white rounded-xl shadow h-80"></div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR CONDITION
  // =========================
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <FaExclamationTriangle className="text-2xl" />
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            Unable to load dashboard
          </h2>

          <p className="text-gray-500 mt-2">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Welcome back, Admin! Here's what's happening today.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus />
            Add Book
          </button>

          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <FaChartLine />
            Reports
          </button>
        </div>
      </div>

      {/* =========================
          STAT CARDS
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
                  {stat.value.toLocaleString("en-IN")}
                </h2>
              </div>

              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.iconColor} flex items-center justify-center text-xl`}
              >
                {stat.icon}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {stat.positive ? (
                <FaArrowUp className="text-green-500 text-xs" />
              ) : (
                <FaArrowDown className="text-red-500 text-xs" />
              )}

              <span
                className={
                  stat.positive
                    ? "text-green-600 text-sm font-medium"
                    : "text-red-600 text-sm font-medium"
                }
              >
                {stat.change}
              </span>

              <span className="text-xs text-gray-400">
                vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          SECONDARY STATS
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Available Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Available Books
              </p>

              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {dashboard.availableBooks.toLocaleString("en-IN")}
              </h3>
            </div>

            <FaBook className="text-blue-500 text-2xl" />
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">
                Availability
              </span>

              <span className="font-medium text-gray-700">
                {dashboard.totalBooks
                  ? Math.round(
                    (dashboard.availableBooks /
                      dashboard.totalBooks) *
                    100
                  )
                  : 0}
                %
              </span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${dashboard.totalBooks
                    ? Math.min(
                      100,
                      (dashboard.availableBooks /
                        dashboard.totalBooks) *
                      100
                    )
                    : 0
                    }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Pending Orders
              </p>

              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {dashboard.pendingOrders}
              </h3>
            </div>

            <FaShoppingCart className="text-orange-500 text-2xl" />
          </div>

          <p className="text-sm text-orange-600 mt-4">
            Need attention
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Total Revenue
              </p>

              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency(dashboard.totalRevenue)}
              </h3>
            </div>

            <FaChartLine className="text-green-500 text-2xl" />
          </div>

          <p className="text-sm text-green-600 mt-4">
            +18.5% this month
          </p>
        </div>
      </div>

      {/* =========================
          ORDERS + QUICK ACTIONS
      ========================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">

          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest customer orders
              </p>
            </div>

            <Link
              to="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>

          {dashboard.recentOrders.length === 0 ? (
            <div className="p-10 text-center">
              <FaShoppingCart className="mx-auto text-4xl text-gray-300" />

              <p className="text-gray-500 mt-3">
                No orders found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500 bg-gray-50">
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Book</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {dashboard.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">
                        {order.id}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {order.customer}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {order.book}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-gray-800">
                        {formatCurrency(order.amount)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to="/admin/orders"
                          className="text-blue-600 hover:text-blue-800"
                          title="View Order"
                        >
                          <FaEye />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">

          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your bookstore
            </p>
          </div>

          <div className="p-5 space-y-3">

            <Link
              to="/admin/books"
              className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <FaBook />
              </div>

              <div>
                <h3 className="font-medium text-gray-800">
                  Manage Books
                </h3>

                <p className="text-xs text-gray-500">
                  Add, edit or delete books
                </p>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center">
                <FaUsers />
              </div>

              <div>
                <h3 className="font-medium text-gray-800">
                  Manage Users
                </h3>

                <p className="text-xs text-gray-500">
                  View and manage users
                </p>
              </div>
            </Link>

            <Link
              to="/admin/orders"
              className="flex items-center gap-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                <FaShoppingCart />
              </div>

              <div>
                <h3 className="font-medium text-gray-800">
                  Manage Orders
                </h3>

                <p className="text-xs text-gray-500">
                  Check customer orders
                </p>
              </div>
            </Link>

            <Link
              to="/admin/borrow"
              className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                <FaExchangeAlt />
              </div>

              <div>
                <h3 className="font-medium text-gray-800">
                  Borrow / Return
                </h3>

                <p className="text-xs text-gray-500">
                  Manage borrowed books
                </p>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-700 text-white flex items-center justify-center">
                <FaUserPlus />
              </div>

              <div>
                <h3 className="font-medium text-gray-800">
                  Add User
                </h3>

                <p className="text-xs text-gray-500">
                  Create a new user
                </p>
              </div>
            </Link>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;