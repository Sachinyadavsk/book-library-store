import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBook,
  faCartShopping,
  faHeart,
  faBox,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Dashboard = () => {

  const { user } = useAuth();
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();

  const userName =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  const cartCount = cart.reduce(
    (total, item) =>
      total + (Number(item.quantity) || 1),
    0
  );

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8">

        <p className="text-blue-100 text-sm">
          Welcome back
        </p>

        <h1 className="mt-1 text-2xl sm:text-3xl font-bold">
          Hi, {userName}! 👋
        </h1>

        <p className="mt-2 text-blue-100">
          Manage your books, orders, cart and wishlist.
        </p>

      </div>


      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Books */}
        <Link
          to="/books"
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Books
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-800">
                Explore
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faBook} />
            </div>

          </div>

        </Link>


        {/* Cart */}
        <Link
          to="/user/cart"
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Cart Items
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-800">
                {cartCount}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faCartShopping} />
            </div>

          </div>

        </Link>


        {/* Wishlist */}
        <Link
          to="/user/wishlist"
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Wishlist
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-800">
                {wishlistCount}
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-red-100 text-red-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faHeart} />
            </div>

          </div>

        </Link>


        {/* Orders */}
        <Link
          to="/user/orders"
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Orders
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-800">
                View
              </h2>
            </div>

            <div className="w-11 h-11 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faBox} />
            </div>

          </div>

        </Link>

      </div>


      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">

        <h2 className="text-xl font-bold text-gray-800">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

          <Link
            to="/books"
            className="flex items-center justify-between border rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span className="font-medium text-gray-700">
              Browse Books
            </span>

            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-blue-600"
            />
          </Link>


          <Link
            to="/user/orders"
            className="flex items-center justify-between border rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span className="font-medium text-gray-700">
              My Orders
            </span>

            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-blue-600"
            />
          </Link>


          <Link
            to="/user/profile"
            className="flex items-center justify-between border rounded-xl p-4 hover:border-blue-500 hover:bg-blue-50 transition"
          >
            <span className="font-medium text-gray-700">
              My Profile
            </span>

            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-blue-600"
            />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;