import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSave,
    FaSpinner,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimes,
    FaUserShield,
} from "react-icons/fa";

import userService from "../../../services/userService";

const CreateUser = () => {
    const navigate = useNavigate();

    // ============================================================
    // FORM STATE
    // ============================================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "users",
    });

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    // ============================================================
    // INPUT CHANGE
    // ============================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        // Mobile: only numbers
        if (name === "mobile") {
            newValue = value
                .replace(/\D/g, "")
                .slice(0, 15);
        }

        setFormData((previous) => ({
            ...previous,
            [name]: newValue,
        }));

        // Clear field error
        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setError("");
        setSuccess("");
    };

    // ============================================================
    // VALIDATION
    // ============================================================

    const validateForm = () => {
        const newErrors = {};

        const name = formData.name.trim();
        const email = formData.email.trim();
        const mobile = formData.mobile.trim();
        const password = formData.password;

        // Name
        if (!name) {
            newErrors.name =
                "Name is required.";
        } else if (name.length < 2) {
            newErrors.name =
                "Name must contain at least 2 characters.";
        } else if (name.length > 100) {
            newErrors.name =
                "Name cannot exceed 100 characters.";
        }

        // Email
        if (!email) {
            newErrors.email =
                "Email is required.";
        } else {
            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                newErrors.email =
                    "Enter a valid email address.";
            }
        }

        // Mobile
        if (!mobile) {
            newErrors.mobile =
                "Mobile number is required.";
        } else if (
            mobile.length < 10 ||
            mobile.length > 15
        ) {
            newErrors.mobile =
                "Enter a valid mobile number.";
        }

        // Password
        if (!password) {
            newErrors.password =
                "Password is required.";
        } else if (password.length < 6) {
            newErrors.password =
                "Password must contain at least 6 characters.";
        } else if (password.length > 100) {
            newErrors.password =
                "Password cannot exceed 100 characters.";
        }

        // Role
        if (!formData.role) {
            newErrors.role =
                "Please select a role.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // ============================================================
    // API ERROR
    // ============================================================

    const getApiError = (err) => {
        if (err?.response?.data?.message) {
            return err.response.data.message;
        }

        if (err?.response?.data?.error) {
            return err.response.data.error;
        }

        if (err?.data?.message) {
            return err.data.message;
        }

        if (err?.message) {
            return err.message;
        }

        return "Unable to create user.";
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                mobile: formData.mobile.trim(),
                password: formData.password,
                role: formData.role,
            };

            console.log(
                "Create User Payload:",
                payload
            );

            const response =
                await userService.createUser(
                    payload
                );

            console.log(
                "Create User Response:",
                response
            );

            setSuccess(
                "User created successfully."
            );

            // Redirect after success
            setTimeout(() => {
                navigate("/admin/users");
            }, 1000);
        } catch (err) {
            console.error(
                "Create User Error:",
                err
            );

            const message =
                getApiError(err);

            // Common duplicate errors
            const lowerMessage =
                String(message).toLowerCase();

            if (
                lowerMessage.includes("email")
            ) {
                setErrors((previous) => ({
                    ...previous,
                    email: message,
                }));
            } else if (
                lowerMessage.includes("mobile") ||
                lowerMessage.includes("phone")
            ) {
                setErrors((previous) => ({
                    ...previous,
                    mobile: message,
                }));
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // RESET
    // ============================================================

    const handleReset = () => {
        if (loading) {
            return;
        }

        setFormData({
            name: "",
            email: "",
            mobile: "",
            password: "",
            role: "users",
        });

        setErrors({});
        setError("");
        setSuccess("");
    };

    // ============================================================
    // UI
    // ============================================================

    return (
        <div className="space-y-6">

            {/* ======================================================
          HEADER
      ====================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <Link
                        to="/admin/users"
                        className="w-10 h-10 rounded-lg border bg-white text-gray-600 hover:bg-gray-50 flex items-center justify-center transition"
                    >
                        <FaArrowLeft />
                    </Link>

                    <div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Add User
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Create a new application user
                        </p>

                    </div>

                </div>

                <Link
                    to="/admin/users"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg bg-white hover:bg-gray-50 transition"
                >
                    <FaArrowLeft />
                    Back to Users
                </Link>

            </div>

            {/* ======================================================
          ALERT
      ====================================================== */}

            {success && (
                <div className="flex items-center justify-between gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">

                    <div className="flex items-center gap-2">
                        <FaCheckCircle />
                        <span>{success}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                    >
                        <FaTimes />
                    </button>

                </div>
            )}

            {error && (
                <div className="flex items-center justify-between gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">

                    <div className="flex items-center gap-2">
                        <FaExclamationTriangle />
                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                    >
                        <FaTimes />
                    </button>

                </div>
            )}

            {/* ======================================================
          FORM
      ====================================================== */}

            <div className="max-w-4xl mx-auto">

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border rounded-2xl shadow-sm overflow-hidden"
                >

                    {/* FORM HEADER */}

                    <div className="p-5 sm:p-6 border-b bg-gray-50">

                        <div className="flex items-center gap-3">

                            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FaUser />
                            </div>

                            <div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    User Information
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Enter the details for the new user.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* FORM BODY */}

                    <div className="p-5 sm:p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* =================================================
                  NAME
              ================================================= */}

                            <div className="md:col-span-2">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter user name"
                                        autoComplete="name"
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.name
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                    />

                                </div>

                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.name}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  EMAIL
              ================================================= */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="johandas@gmail.com"
                                        autoComplete="email"
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.email
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                    />

                                </div>

                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  MOBILE
              ================================================= */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="9673852743"
                                        autoComplete="tel"
                                        inputMode="numeric"
                                        maxLength={15}
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.mobile
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                    />

                                </div>

                                {errors.mobile && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.mobile}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  PASSWORD
              ================================================= */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password"
                                        autoComplete="new-password"
                                        disabled={loading}
                                        className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        disabled={loading}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>

                                </div>

                                <p className="text-xs text-gray-400 mt-1">
                                    Minimum 6 characters.
                                </p>

                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.password}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  ROLE
              ================================================= */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaUserShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.role
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                    >

                                        <option value="users">
                                            User
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>

                                    </select>

                                </div>

                                {errors.role && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.role}
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* ======================================================
              FORM FOOTER
          ====================================================== */}

                    <div className="px-5 sm:px-6 py-4 border-t bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            Reset
                        </button>

                        <Link
                            to="/admin/users"
                            className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-center transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >

                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Create User
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateUser;