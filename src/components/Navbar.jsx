import React, { useEffect, useState } from "react";
import {
    Link,
    NavLink,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    // AUTH
    const { user, logout, } = useAuth();
    // CART
    const { cart = [], } = useCart();
    // WISHLIST
    const { wishlistCount = 0, } = useWishlist();
    // CART COUNT
    const cartCount = cart.reduce((total, item) =>
        total + (Number(item.quantity) || 1),
        0
    );

    // CLOSE MOBILE MENU
    const closeMenu = () => { setIsOpen(false); };

    // LOGOUT
    const handleLogout = () => {
        closeMenu();
        logout();
        navigate("/login", {
            replace: true,
            state: {
                message: "You have been logged out successfully.",
            },
        });
    };

    // CART / WISHLIST UPDATE
    useEffect(() => {
        const handleUpdate = () => {
            // Context normally handles this automatically.
        };
        window.addEventListener("cartUpdated", handleUpdate);
        window.addEventListener("wishlistUpdated", handleUpdate);
        return () => {
            window.removeEventListener("cartUpdated", handleUpdate);
            window.removeEventListener("wishlistUpdated", handleUpdate);
        };
    }, []);


    // MENU ITEMS
    const menuItems = [
        {
            name: "Home",
            path: "/",
        },
        {
            name: "Books",
            path: "/books",
        },
        {
            name: "Categories",
            path: "/categories",
        },
        {
            name: "Authors",
            path: "/authors",
        },
        {
            name: "Contact",
            path: "/contact",
        },
    ];


    // USER ROLE

    const isAdmin =
        user?.role === "admin" ||
        user?.role === "Admin" ||
        user?.role === "ADMIN";

    const dashboardPath = isAdmin
        ? "/admin/dashboard"
        : "/user/dashboard";

    // USER NAME
    const displayName =
        user?.name ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "User";

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-4">
                {/* HEADER */}
                <div className="h-16 flex items-center justify-between">
                    {/* LOGO */}
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="text-2xl font-bold text-blue-600"
                    >
                        BookStore
                    </Link>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center gap-6">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `font-medium transition ${isActive
                                        ? "text-blue-600"
                                        : "text-gray-700 hover:text-blue-600"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* DESKTOP RIGHT SIDE */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* CART */}
                        <Link
                            to="/cart"
                            className="relative p-2 text-gray-700 hover:text-blue-600 transition"
                            title="Cart"
                        >
                            <span className="text-xl">🛒</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                                    {cartCount > 99
                                        ? "99+"
                                        : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* WISHLIST */}
                        <Link
                            to="/wishlist"
                            className="relative p-2 text-gray-700 hover:text-red-500 transition"
                            title="Wishlist"
                        >
                            <span className="text-xl">❤️</span>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                                    {wishlistCount > 99
                                        ? "99+"
                                        : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* NOT LOGGED IN */}
                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (

                            // LOGGED IN
                            <div className="flex items-center gap-2 ml-2">
                                {/* User */}
                                <Link
                                    to={dashboardPath}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {displayName
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-semibold text-gray-800 max-w-28 truncate">
                                            {displayName}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {isAdmin
                                                ? "Administrator"
                                                : "My Account"}
                                        </p>
                                    </div>
                                </Link>

                                {/* Logout */}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600"
                                >
                                    Logout
                                </button>

                            </div>
                        )}

                    </div>


                    {/* MOBILE BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            setIsOpen((prev) => !prev)
                        }
                        className="md:hidden p-2 text-gray-700 text-xl"
                        aria-label="Toggle menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>

                </div>


                {/* MOBILE MENU */}

                {isOpen && (
                    <div className="md:hidden border-t py-4">
                        <div className="flex flex-col gap-1">
                            {/* Main Menu */}
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg ${isActive
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>

                            ))}


                            <div className="border-t pt-3 mt-2">
                                {/* CART */}
                                <Link
                                    to="/cart"
                                    onClick={closeMenu}
                                    className="relative flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <span>🛒 Cart</span>
                                    {cartCount > 0 && (
                                        <span className="min-w-6 h-6 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                                            {cartCount > 99
                                                ? "99+"
                                                : cartCount}
                                        </span>
                                    )}

                                </Link>

                                {/* WISHLIST */}
                                <Link
                                    to="/wishlist"
                                    onClick={closeMenu}
                                    className="relative flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <span>❤️ Wishlist</span>
                                    {wishlistCount > 0 && (
                                        <span className="min-w-6 h-6 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold">
                                            {wishlistCount > 99
                                                ? "99+"
                                                : wishlistCount}
                                        </span>
                                    )}
                                </Link>

                                {/* USER CONDITIONS */}
                                {!user ? (
                                    <>
                                        {/* Login */}
                                        <Link
                                            to="/login"
                                            onClick={closeMenu}
                                            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                                        >
                                            Login
                                        </Link>

                                        {/* Register */}
                                        <Link
                                            to="/register"
                                            onClick={closeMenu}
                                            className="block mx-4 mt-2 px-4 py-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Register
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {/* User Info */}
                                        <Link to={dashboardPath}>
                                            <div className="mx-4 mt-3 p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                        {displayName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-800 truncate">
                                                            {displayName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {isAdmin
                                                                ? "Administrator"
                                                                : "User Account"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Logout */}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg"
                                        >
                                            🚪 Logout
                                        </button>

                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;