import React, { useEffect, useMemo, useState } from "react";
import { FaUsers, FaUserPlus, FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaSyncAlt, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaUserShield, FaUser, } from "react-icons/fa";
import userService from "../../../services/userService";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);


  // LOAD USERS
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await userService.getUsers();
      const userData =
        response?.users ||
        response?.data?.users ||
        response?.data ||
        response ||
        [];

      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error("Users error:", err);
      setError(err?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };


  // USER HELPERS
  const getUserId = (user) => user?._id || user?.id;
  const getUserName = (user) => user?.name || user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown User";
  const getUserEmail = (user) => user?.email || "-";
  const getUserRole = (user) => String(user?.role || "user").toLowerCase();
  const getUserStatus = (user) => {
    if (typeof user?.isActive === "boolean") {
      return user.isActive
        ? "active"
        : "inactive";
    }
    return String(user?.status || "active").toLowerCase();
  };

  const getInitial = (user) =>
    getUserName(user).charAt(0).toUpperCase();


  // FILTER
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const name = getUserName(user).toLowerCase();
      const email = getUserEmail(user).toLowerCase();
      const userRole = getUserRole(user);
      const userStatus = getUserStatus(user);
      const searchMatch = !query || name.includes(query) || email.includes(query);
      const statusMatch = status === "all" || userStatus === status;
      const roleMatch = role === "all" || userRole === role;
      return (searchMatch && statusMatch && roleMatch);
    });
  }, [users, search, status, role,]);


  // STATISTICS
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => getUserStatus(user) === "active").length;
  const inactiveUsers = users.filter((user) => getUserStatus(user) === "inactive").length;
  const adminUsers = users.filter((user) => getUserRole(user) === "admin").length;

  // DATE
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString("en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // DELETE
  const handleDelete = async (user) => {
    const id = getUserId(user);
    if (!id) return;
    const confirmed = window.confirm(`Delete ${getUserName(user)}?`);
    if (!confirmed) return;
    try {
      setError("");
      setSuccess("");
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((item) => getUserId(item) !== id));
      setSuccess("User deleted successfully.");
    } catch (err) {
      setError(err?.message || "Failed to delete user.");
    }
  };


  // VIEW
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };


  // LOADING
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

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaUsers className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Users</h1>
            <p className="text-sm text-gray-500 mt-1">Manage registered users</p>
          </div>
        </div>

        <Link
          to="/admin/users/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaUserPlus />
          Add User
        </Link>
      </div>

      {/* ALERT */}

      {success && (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          <div className="flex items-center gap-2">
            <FaCheckCircle />
            {success}
          </div>
          <button onClick={() => setSuccess("")}>
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
          <button onClick={() => setError("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<FaUsers />}
          bg="bg-blue-100"
          text="text-blue-600"
        />

        <StatCard
          title="Active Users"
          value={activeUsers}
          icon={<FaCheckCircle />}
          bg="bg-green-100"
          text="text-green-600"
        />

        <StatCard
          title="Inactive Users"
          value={inactiveUsers}
          icon={<FaTimes />}
          bg="bg-red-100"
          text="text-red-600"
        />

        <StatCard
          title="Admin Users"
          value={adminUsers}
          icon={<FaUserShield />}
          bg="bg-purple-100"
          text="text-purple-600"
        />
      </div>

      {/* SEARCH + FILTER */}
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
              placeholder="Search user name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="lg:w-44 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="lg:w-44 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <button
            type="button"
            onClick={fetchUsers}
            className="px-4 py-2.5 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FaSyncAlt />
            Refresh
          </button>

        </div>

      </div>

      {/* ======================================================
    RESPONSIVE USERS TABLE
====================================================== */}

      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                All Users
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {filteredUsers.length} users found
              </p>
            </div>

          </div>

        </div>

        {/* EMPTY */}
        {filteredUsers.length === 0 ? (
          <EmptyUsers />
        ) : (

          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[650px] table-auto">

              {/* ==================================================
            TABLE HEAD
        ================================================== */}

              <thead>
                <tr className="bg-gray-50 border-b">

                  {/* NUMBER */}

                  <th className="w-14 px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    #
                  </th>

                  {/* USER */}

                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  {/* EMAIL */}

                  <th className="hidden sm:table-cell px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  {/* ROLE */}

                  <th className="hidden md:table-cell px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Role
                  </th>

                  {/* STATUS */}

                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  {/* JOINED */}

                  <th className="hidden lg:table-cell px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>

                  {/* ACTIONS */}

                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* ==================================================
            TABLE BODY
        ================================================== */}

              <tbody className="divide-y divide-gray-100">

                {filteredUsers.map((user, index) => {

                  const userRole = getUserRole(user);
                  const userStatus = getUserStatus(user);

                  return (
                    <tr
                      key={getUserId(user) || index}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* =================================================
                    NUMBER
                ================================================= */}

                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 align-middle">
                        {index + 1}
                      </td>

                      {/* =================================================
                    USER
                ================================================= */}

                      <td className="px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                          <div className="shrink-0">
                            <UserAvatar user={user} />
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-xs sm:text-sm text-gray-800 truncate max-w-[120px] sm:max-w-[180px] lg:max-w-[220px]">
                              {getUserName(user)}
                            </p>

                            {/* User ID */}

                            <p className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[180px]">
                              #
                              {String(
                                getUserId(user) || ""
                              ).slice(-8)}
                            </p>

                            {/* EMAIL ON MOBILE */}

                            <p className="sm:hidden text-[11px] text-gray-500 truncate max-w-[150px] mt-0.5">
                              {getUserEmail(user)}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* =================================================
                    EMAIL
                ================================================= */}

                      <td className="hidden sm:table-cell px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[180px] lg:max-w-[250px]">
                          {getUserEmail(user)}
                        </p>

                      </td>

                      {/* =================================================
                    ROLE
                ================================================= */}

                      <td className="hidden md:table-cell px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <RoleBadge role={userRole} />

                      </td>

                      {/* =================================================
                    STATUS
                ================================================= */}

                      <td className="px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <span
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${userStatus === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >

                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${userStatus === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                              }`}
                          />

                          {userStatus === "active"
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      {/* =================================================
                    JOINED
                ================================================= */}

                      <td className="hidden lg:table-cell px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap align-middle">

                        {formatDate(
                          user?.createdAt ||
                          user?.joinedAt
                        )}

                      </td>

                      {/* =================================================
                    ACTIONS
                ================================================= */}

                      <td className="px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <div className="flex justify-end items-center gap-1.5 sm:gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(user)
                            }
                            title="View"
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition"
                          >
                            <FaEye className="text-xs sm:text-sm" />
                          </button>

                          {/* EDIT */}

                          <Link
                            to={`/admin/users/edit/${getUserId(user)}`}
                            title="Edit"
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 flex items-center justify-center transition"
                          >
                            <FaEdit className="text-xs sm:text-sm" />
                          </Link>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(user)
                            }
                            title="Delete"
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 flex items-center justify-center transition"
                          >
                            <FaTrash className="text-xs sm:text-sm" />
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

      {/* VIEW USER MODAL */}
      {showViewModal &&
        selectedUser && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="p-5 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">User Details</h2>
                <button onClick={() => setShowViewModal(false)}
                  className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col items-center">
                  <UserAvatar user={selectedUser} large />
                  <h3 className="text-xl font-bold text-gray-800 mt-3">
                    {getUserName(selectedUser)}
                  </h3>
                  <p className="text-gray-500">
                    {getUserEmail(selectedUser)}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <InfoRow label="Role" value={getUserRole(selectedUser)} />
                  <InfoRow label="Status" value={getUserStatus(selectedUser)} />
                  <InfoRow label="Joined" value={formatDate(selectedUser?.createdAt)} />
                  <InfoRow label="User ID" value={getUserId(selectedUser) || "-"} />
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};


// STAT CARD
const StatCard = ({ title, value, icon, bg, text, }) => (
  <div className="bg-white border rounded-xl shadow-sm p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl ${bg} ${text} flex items-center justify-center`}>{icon}</div>
    </div>
  </div>
);


// USER AVATAR
const UserAvatar = ({ user, large = false, }) => {
  const image = user?.avatar || user?.profileImage || user?.image || user?.photo;
  const initial = getUserInitial(user);
  return image ? (
    <img
      src={image}
      alt={getUserName(user)}
      className={`${large
        ? "w-20 h-20"
        : "w-10 h-10"
        } rounded-full object-cover border border-gray-200`}
      onError={(e) => {
        e.currentTarget.style.display =
          "none";
      }}
    />
  ) : (
    <div
      className={`${large
        ? "w-20 h-20 text-2xl"
        : "w-10 h-10"
        } rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0`}
    >
      {initial}
    </div>
  );
};


// ROLE BADGE
const RoleBadge = ({ role }) => {
  const admin = role === "admin";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${admin
        ? "bg-purple-100 text-purple-700"
        : "bg-blue-100 text-blue-700"
        }`}
    >
      {admin ? (
        <FaUserShield />
      ) : (
        <FaUser />
      )}

      {admin ? "Admin" : "User"}
    </span>
  );
};


// INITIAL
const getUserInitial = (user) => {
  const name = user?.name || user?.fullName || user?.firstName || "User";
  return name.charAt(0).toUpperCase();
};


// EMPTY
const EmptyUsers = () => (
  <div className="py-16 text-center">
    <FaUsers className="mx-auto text-5xl text-gray-300" />
    <h3 className="text-lg font-semibold text-gray-700 mt-4">
      No users found
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      Try changing your search or filters.
    </p>
  </div>
);


// INFO ROW
const InfoRow = ({ label, value, }) => (
  <div className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
    <span className="text-sm text-gray-500">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-800 text-right break-all">
      {value}
    </span>
  </div>
);

export default Users;