import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import userMenu from "../staticValue/userMenu";
import { useAuth } from "../context/AuthContext";

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    closeSidebar();

    logout();

    navigate("/login", {
      replace: true,
      state: {
        message: "You have been logged out successfully.",
      },
    });
  };

  // ============================================
  // USER NAME
  // ============================================

  const userName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail = user?.email || "";

  // ============================================
  // ACTIVE MENU
  // ============================================

  const isMenuActive = (path) => {
    if (path === "/user/dashboard") {
      return location.pathname === "/user/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =====================================================
                            HEADER
      ===================================================== */}

      <header className="bg-white shadow sticky top-0 z-50">

        <div className="h-16 px-4 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <span className="text-2xl">☰</span>
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-blue-600"
            >
              BookStore
            </Link>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Website */}
            <Link
              to="/"
              className="hidden sm:block text-gray-600 hover:text-blue-600"
            >
              Website
            </Link>

            {/* User */}
            <Link
              to="/user/profile"
              className="hidden sm:flex items-center gap-2"
            >

              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                👤
              </div>

              <div className="leading-tight">

                <p className="text-sm font-semibold text-gray-700">
                  {userName}
                </p>

                {userEmail && (
                  <p className="text-xs text-gray-400 max-w-[180px] truncate">
                    {userEmail}
                  </p>
                )}

              </div>

            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 sm:px-4 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
                       MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}


      {/* =====================================================
                       MOBILE SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full w-72
          bg-white shadow-xl
          transform transition-transform duration-300
          md:hidden
          ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >

        {/* Header */}
        <div className="h-16 px-5 border-b flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-gray-800">
              User Panel
            </h2>

          </div>

          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>

        </div>


        {/* User information */}
        <div className="p-4 border-b">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              👤
            </div>

            <div className="min-w-0">

              <p className="font-semibold text-gray-800 truncate">
                {userName}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {userEmail}
              </p>

            </div>

          </div>

        </div>


        {/* Menu */}
        <nav className="p-4 space-y-2">

          {userMenu.map((item) => {

            const active = isMenuActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  rounded-lg
                  transition
                  ${active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >

                <span className="text-lg">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </Link>
            );

          })}

          {/* Mobile logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition md:hidden"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </nav>

      </aside>


      {/* =====================================================
                         MAIN AREA
      ===================================================== */}

      <div className="flex">


        {/* =====================================================
                         DESKTOP SIDEBAR
        ===================================================== */}

        <aside className="hidden md:block w-64 shrink-0 min-h-[calc(100vh-64px)] bg-white shadow">

          <div className="p-5">

            {/* User */}
            <div className="mb-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  👤
                </div>

                <div className="min-w-0">

                  <p className="font-semibold text-gray-800 truncate">
                    {userName}
                  </p>

                  <p className="text-xs text-gray-400 truncate">
                    {userEmail}
                  </p>

                </div>

              </div>

            </div>


            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              User Panel
            </h2>


            {/* Menu */}
            <nav className="space-y-2">

              {userMenu.map((item) => {

                const active = isMenuActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center gap-3
                      px-4 py-3
                      rounded-lg
                      transition
                      ${active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >

                    <span className="text-lg">
                      {item.icon}
                    </span>

                    <span>
                      {item.name}
                    </span>

                  </Link>
                );

              })}

            </nav>

          </div>

        </aside>


        {/* =====================================================
                           CONTENT
        ===================================================== */}

        <main className="flex-1 min-w-0 p-4 sm:p-5 md:p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default UserLayout;