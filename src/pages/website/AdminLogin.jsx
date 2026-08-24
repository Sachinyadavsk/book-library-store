import React, { useEffect, useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faLock,
    faEye,
    faEyeSlash,
    faRightToBracket,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

import {
    isValidEmail,
    isValidPassword,
    isRequired,
} from "../../utils/helpers";

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // AUTH CONTEXT
    const { user, login, } = useAuth();

    // FORM
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // VALIDATION
    const [errors, setErrors] = useState({});
    // API ERROR
    const [apiError, setApiError] = useState("");
    // LOADING
    const [loading, setLoading] = useState(false);

    // PASSWORD VISIBILITY
    const [showPassword, setShowPassword] = useState(false);
    // MESSAGE FROM OTHER PAGE
    const message = location.state?.message || "";
    // REDIRECT AFTER LOGIN
    const redirectTo = location.state?.from || "/admin/dashboard";
    // ALREADY LOGGED IN

    useEffect(() => {
        if (user) {
            navigate(
                redirectTo,
                {
                    replace: true,
                }
            );

        }

    }, [
        user,
        navigate,
        redirectTo,
    ]);


    // INPUT CHANGE
    const handleChange = (e) => {
        const { name, value, } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        setApiError("");
    };


    // VALIDATE
    const validateForm = () => {
        const newErrors = {};
        // Email
        if (!isRequired(formData.email)) {
            newErrors.email = "Email is required.";
        } else if (!isValidEmail(formData.email.trim())) {
            newErrors.email = "Please enter a valid email address.";
        }

        // Password
        if (!isRequired(formData.password)) {
            newErrors.password = "Password is required.";
        } else if (!isValidPassword(formData.password, 6)) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        setErrors(newErrors);
        return (
            Object.keys(newErrors).length === 0
        );
    };


    // LOGIN
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const response = await authService.login({
                email: formData.email.trim(),
                password: formData.password,
                role: "admin",
            });

            // CHECK API RESPONSE
            if (response?.success === false) {
                setApiError(response?.message || "Invalid email or password.");
                return;
            }

            // GET USER
            const loggedInUser = response?.user || response?.data?.user;
            const token = response?.token || response?.data?.token;

            // UPDATE AUTH CONTEXT
            if (login) {
                login(loggedInUser, token);
            } else {
                // Fallback if AuthContext
                // login method is not ready yet
                if (loggedInUser) {
                    localStorage.setItem("user", JSON.stringify(loggedInUser));
                }

                if (token) {
                    localStorage.setItem("token", token);
                }
            }

            // REDIRECT
            navigate(
                redirectTo,
                {
                    replace: true,
                }
            );

        } catch (error) {
            console.error("Login error:", error);
            setApiError(error?.message || "Unable to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // INPUT CLASS
    const inputClass = (field) => `
        w-full
        py-3
        pl-11
        pr-4
        border
        rounded-xl
        outline-none
        transition
        ${errors[field]
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }
    `;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-lg">

                {/* ========================================
                    HEADER
                ======================================== */}
                <div className="text-center mb-8">

                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">

                        <FontAwesomeIcon
                            icon={faRightToBracket}
                            className="text-2xl"
                        />

                    </div>

                    <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-800">
                        Welcome Admin Panel
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Login to your account
                    </p>

                </div>

                {/* ========================================
                    CARD
                ======================================== */}
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">

                    {/* MESSAGE FROM PREVIOUS PAGE */}
                    {message && (

                        <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-sm">
                            {message}
                        </div>

                    )}

                    {/* API ERROR */}
                    {apiError && (

                        <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {apiError}
                        </div>

                    )}

                    {/* ====================================
                        FORM
                    ==================================== */}
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        {/* EMAIL */}
                        <div className="mb-5">

                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-semibold text-gray-700"
                            >
                                Email Address
                            </label>

                            <div className="relative">

                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className={inputClass(
                                        "email"
                                    )}
                                />

                            </div>

                            {errors.email && (

                                <p className="mt-1.5 text-sm text-red-500">
                                    {errors.email}
                                </p>

                            )}

                        </div>

                        {/* PASSWORD */}
                        <div className="mb-4">

                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-semibold text-gray-700"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <FontAwesomeIcon
                                    icon={faLock}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className={`${inputClass(
                                        "password"
                                    )} pr-12`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (prev) =>
                                                !prev
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            showPassword
                                                ? faEyeSlash
                                                : faEye
                                        }
                                    />
                                </button>

                            </div>

                            {errors.password && (

                                <p className="mt-1.5 text-sm text-red-500">
                                    {errors.password}
                                </p>

                            )}

                        </div>

                        {/* FORGOT PASSWORD */}
                        <div className="flex justify-end mb-6">

                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Forgot Password?
                            </Link>

                        </div>

                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >

                            {loading ? (

                                <>
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        spin
                                    />

                                    Logging in...
                                </>

                            ) : (

                                <>
                                    <FontAwesomeIcon
                                        icon={faRightToBracket}
                                    />

                                    Login
                                </>

                            )}

                        </button>

                    </form>



                </div>

                {/* ========================================
                    HOME
                ======================================== */}
                <div className="text-center mt-5">

                    <Link
                        to="/"
                        className="text-sm text-gray-500 hover:text-blue-600"
                    >
                        ← Back to Home
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default AdminLogin
