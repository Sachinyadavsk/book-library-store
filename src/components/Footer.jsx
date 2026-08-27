import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-10 py-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* About */}
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-white"
            >
              BookStore
            </Link>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Discover your next favorite book from our wide
              collection of books, authors and categories.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">

              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-blue-600 transition"
                aria-label="Twitter"
              >
                X
              </a>

              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-pink-600 transition"
                aria-label="Instagram"
              >
                ◎
              </a>

            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/books"
                  className="text-gray-400 hover:text-white transition"
                >
                  Books
                </Link>
              </li>

              <li>
                <Link
                  to="/categories"
                  className="text-gray-400 hover:text-white transition"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  to="/authors"
                  className="text-gray-400 hover:text-white transition"
                >
                  Authors
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact
                </Link>
              </li>

            </ul>
          </div>


          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Account
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-white transition"
                >
                  Register
                </Link>
              </li>

              <li>
                <Link
                  to="/user/cart"
                  className="text-gray-400 hover:text-white transition"
                >
                  My Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/user/wishlist"
                  className="text-gray-400 hover:text-white transition"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/user/orders"
                  className="text-gray-400 hover:text-white transition"
                >
                  My Orders
                </Link>
              </li>

            </ul>
          </div>


          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm text-gray-400">

              <li className="flex items-start gap-3">
                <span>📍</span>
                <span>India</span>
              </li>

              <li className="flex items-start gap-3">
                <span>📧</span>
                <a
                  href="mailto:info@bookstore.com"
                  className="hover:text-white transition"
                >
                  info@bookstore.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <span>📞</span>
                <a
                  href="tel:+919876543210"
                  className="hover:text-white transition"
                >
                  +91 98765 43210
                </a>
              </li>

            </ul>
          </div>

        </div>


        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-10 pt-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">

            <p className="text-center md:text-left">
              © {new Date().getFullYear()} BookStore.
              All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4">

              <Link
                to="/privacy-policy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="hover:text-white transition"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/contact"
                className="hover:text-white transition"
              >
                Support
              </Link>
              <Link
                to="/admin/login"
                className="hover:text-white transition"
              >
                Maintain
              </Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;