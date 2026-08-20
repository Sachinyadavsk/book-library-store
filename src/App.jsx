import React from "react";
import { Routes, Route } from "react-router-dom";
import WebsiteLayout from "./layouts/WebsiteLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Website Pages
import Home from "./pages/website/Home";
import Books from "./pages/website/Books";
import Categories from "./pages/website/Categories";
import Authors from "./pages/website/Authors";
import Contact from "./pages/website/Contact";
import Login from "./pages/website/Login";
import Register from "./pages/website/Register";
import ForgetPassword from "./pages/website/ForgetPassword";
import ResetPassword from "./pages/website/ResetPassword";
import BookDetails from "./pages/website/BookDetails";
import Abouts from "./pages/website/Abouts";
import SearchResult from "./pages/website/SearchResult";
import Page404 from "./pages/website/Page404";
import Cart from "./pages/website/Cart";
import Wishlist from "./pages/website/Wishlist";
import Checkout from "./pages/website/Checkout";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserProfile from "./pages/user/Profile";
import UserOrders from "./pages/user/Orders";
import BorrowedBooks from "./pages/user/BorrowedBooks";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBooks from "./pages/admin/Books";
import AdminAuthors from "./pages/admin/Authors";
import AdminCategories from "./pages/admin/Categories";
import AdminUsers from "./pages/admin/Users";
import AdminOrders from "./pages/admin/Orders";
import AdminReviews from "./pages/admin/Reviews";
import AdminReports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";
import AdminRoute from "./routes/AdminRoute";





const App = () => {
  return (

    <Routes>
      {/* ==================== WEBSITE ==================== */}
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-Password" element={<ResetPassword />} />
        <Route path="/abouts" element={<Abouts />} />
        <Route path="/search-result" element={<SearchResult />} />
        <Route path="/Page404" element={<Page404 />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* ==================== USER ==================== */}
      <Route element={<UserLayout />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/orders" element={<UserOrders />} />
        <Route path="/user/borrowed-books" element={<BorrowedBooks />} />
      </Route>

      {/* ======================================
                ADMIN PROTECTED ROUTES
            ====================================== */}
      <Route element={<AdminRoute />}>
        {/* ==================== ADMIN ==================== */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<AdminBooks />} />
          <Route path="/admin/authors" element={<AdminAuthors />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>

      {/* ==================== 404 ==================== */}
      <Route path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">
              404 - Page Not Found
            </h1>
          </div>
        }
      />

    </Routes>

  );
};

export default App;