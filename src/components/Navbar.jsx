import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "Books", path: "/books" },
        { name: "Categories", path: "/categories" },
        { name: "Authors", path: "/authors" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <nav className="container mx-auto px-4">

                <div className="h-16 flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-blue-600"
                    >
                        BookStore
                    </Link>

                    {/* Desktop Menu */}
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

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">

                        {/* Cart */}
                        <Link
                            to="/user/cart"
                            className="relative p-2 text-gray-700 hover:text-blue-600"
                        >
                            🛒
                            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                                0
                            </span>
                        </Link>

                        {/* Wishlist */}
                        <Link
                            to="/user/wishlist"
                            className="p-2 text-gray-700 hover:text-red-500"
                        >
                            ❤️
                        </Link>

                        {/* Login */}
                        <Link
                            to="/login"
                            className="px-4 py-2 text-gray-700 hover:text-blue-600"
                        >
                            Login
                        </Link>

                        {/* Register */}
                        <Link
                            to="/register"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Register
                        </Link>

                    </div>

                    {/* Mobile Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-700"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? "✕" : "☰"}
                    </button>

                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t py-4">

                        <div className="flex flex-col gap-2">

                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
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

                                <Link
                                    to="/user/cart"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 text-gray-700"
                                >
                                    🛒 Cart
                                </Link>

                                <Link
                                    to="/user/wishlist"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 text-gray-700"
                                >
                                    ❤️ Wishlist
                                </Link>

                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 text-gray-700"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block mx-4 mt-2 px-4 py-2 text-center bg-blue-600 text-white rounded-lg"
                                >
                                    Register
                                </Link>

                            </div>

                        </div>

                    </div>
                )}

            </nav>
        </header>
    );
};

export default Navbar;