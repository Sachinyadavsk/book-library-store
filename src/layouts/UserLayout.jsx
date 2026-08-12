import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import userMenu from "../staticValue/userMenu";

const UserLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="h-16 px-4 flex items-center justify-between">

          {/* Left Side */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button type="button" onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100">
              <span className="text-2xl">☰</span>
            </button>

            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600">
              BookStore
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Website */}
            <Link to="/" className="hidden sm:block text-gray-600 hover:text-blue-600">
              Website
            </Link>

            {/* User */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                👤
              </div>
              <span className="text-sm font-medium text-gray-700">User</span>
            </div>

            {/* Logout */}
            <button type="button" className="px-3 py-2 sm:px-4 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </header>


      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}


      {/* ================= MOBILE SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full w-72
          bg-white shadow-xl
          transform transition-transform duration-300
          md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* Mobile Sidebar Header */}
        <div className="h-16 px-5 border-b flex items-center justify-between">

          <h2 className="text-lg font-semibold text-gray-800">
            User Panel
          </h2>

          <button
            type="button"
            onClick={closeSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>

        </div>


        {/* Mobile Menu */}
        <nav className="p-4 space-y-2">

          {userMenu.map((item) => {
            const active = location.pathname === item.path;

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
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}

        </nav>

      </aside>


      {/* ================= MAIN AREA ================= */}
      <div className="flex">


        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden md:block w-64 shrink-0 min-h-[calc(100vh-64px)] bg-white shadow">

          <div className="p-5">

            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              User Panel
            </h2>

            <nav className="space-y-2">

              {userMenu.map((item) => {

                const active = location.pathname === item.path;

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
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );

              })}

            </nav>

          </div>

        </aside>


        {/* ================= CONTENT ================= */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 md:p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default UserLayout;