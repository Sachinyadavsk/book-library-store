import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const location = useLocation();

  const {
    user,
    loading,
  } = useAuth();

  // ============================================
  // AUTH LOADING
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

          <p className="mt-4 text-gray-500 text-sm">
            Checking authentication...
          </p>

        </div>
      </div>
    );
  }

  // ============================================
  // NOT LOGGED IN
  // ============================================
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message:
            "Please login to access the admin panel.",
        }}
      />
    );
  }

  // ============================================
  // ADMIN CHECK
  // ============================================
  const isAdmin =
    user.role === "admin" ||
    user.isAdmin === true ||
    user.userType === "admin";

  // ============================================
  // NOT ADMIN
  // ============================================
  if (!isAdmin) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{
          message:
            "You do not have permission to access the admin panel.",
        }}
      />
    );
  }

  // ============================================
  // ADMIN ALLOWED
  // ============================================
  return <Outlet />;
};

export default AdminRoute;