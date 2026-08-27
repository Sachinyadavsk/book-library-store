import React, { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

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
    FaToggleOn,
} from "react-icons/fa";

import userService from "../../../services/userService";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // FORM
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "users",
        status: "active",
    });

    // Keep original data for reset
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // GET USER ID
    const getUserId = (user) => {
        return (
            user?._id ||
            user?.id ||
            user?.userId ||
            ""
        );
    };

    // NORMALIZE USER
    const normalizeUser = (user) => {
        return {
            name: user?.name || user?.fullName || "",
            email: user?.email || "",
            mobile: user?.mobile || user?.phone || "",
            password: "",
            role: user?.role || "users",
            status: String(user?.status || "active").toLowerCase() === "inactive"
                ? "inactive"
                : "active",
        };
    };

    // LOAD USER
    const fetchUser = async () => {
        if (!id) {
            setError("User ID is missing.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            console.log("id", id);
            const response = await userService.getUser(id);
            console.log("Edit User Response:", response);
            const user = response?.user || response?.data?.user || response?.data || response;
            if (!user) {
                throw new Error("User not found.");
            }
            const normalized = normalizeUser(user);
            setFormData(normalized);
            setOriginalData(normalized);
        } catch (err) {
            console.error("Fetch User Error:", err);
            setError(err?.response?.data?.message || err?.data?.message || err?.message || "Unable to load user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);


    // HANDLE CHANGE
    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        let newValue = value;

        // Mobile only numbers
        if (name === "mobile") {
            newValue = value
                .replace(/\D/g, "")
                .slice(0, 15);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setError("");
        setSuccess("");
    };


    // VALIDATION


    const validateForm = () => {
        const newErrors = {};

        const name =
            formData.name.trim();

        const email =
            formData.email.trim();

        const mobile =
            formData.mobile.trim();

        const password =
            formData.password;

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

        /*
         * Password is OPTIONAL during edit.
         *
         * Empty password:
         *   Keep existing password.
         *
         * New password:
         *   Minimum 6 characters.
         */

        if (
            password &&
            password.length < 6
        ) {
            newErrors.password =
                "Password must contain at least 6 characters.";
        }

        if (
            password &&
            password.length > 100
        ) {
            newErrors.password =
                "Password cannot exceed 100 characters.";
        }

        if (!formData.role) {
            newErrors.role =
                "Please select a role.";
        }

        if (!formData.status) {
            newErrors.status =
                "Please select a status.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };


    // API ERROR


    const getApiError = (err) => {
        return (
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.data?.message ||
            err?.message ||
            "Unable to update user."
        );
    };


    // SUBMIT


    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            /*
             * Don't send an empty password.
             *
             * This allows the backend to keep
             * the existing password.
             */

            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                mobile: formData.mobile.trim(),
                role: formData.role,
                status: formData.status,
            };

            if (
                formData.password.trim()
            ) {
                payload.password =
                    formData.password;
            }

            console.log(
                "Update User Payload:",
                payload
            );

            const response =
                await userService.updateUser(
                    id,
                    payload
                );

            console.log(
                "Update User Response:",
                response
            );

            setSuccess(
                "User updated successfully."
            );

            setTimeout(() => {
                navigate("/admin/users");
            }, 1000);
        } catch (err) {
            console.error(
                "Update User Error:",
                err
            );

            const message =
                getApiError(err);

            const lowerMessage =
                String(
                    message
                ).toLowerCase();

            if (
                lowerMessage.includes(
                    "email"
                )
            ) {
                setErrors((prev) => ({
                    ...prev,
                    email: message,
                }));
            } else if (
                lowerMessage.includes(
                    "mobile"
                ) ||
                lowerMessage.includes(
                    "phone"
                )
            ) {
                setErrors((prev) => ({
                    ...prev,
                    mobile: message,
                }));
            } else {
                setError(message);
            }
        } finally {
            setSaving(false);
        }
    };


    // RESET


    const handleReset = () => {
        if (
            loading ||
            saving ||
            !originalData
        ) {
            return;
        }

        setFormData({
            ...originalData,
            password: "",
        });

        setErrors({});
        setError("");
        setSuccess("");
    };


    // INPUT CLASS


    const inputClass = (field) =>
        `w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg outline-none transition
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${errors[field]
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300"
        }`;


    // LOADING SCREEN


    if (loading) {
        return (
            <div className="w-full min-h-[400px] flex items-center justify-center">

                <div className="flex flex-col items-center justify-center gap-3 text-gray-500">

                    <FaSpinner className="text-3xl animate-spin text-blue-600" />

                    <p className="text-sm">
                        Loading user...
                    </p>

                </div>

            </div>
        );
    }


    // ERROR + NO DATA


    if (
        error &&
        !formData.name &&
        !formData.email
    ) {
        return (
            <div className="w-full">

                <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">

                    <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                        <FaExclamationTriangle />
                    </div>

                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Unable to Load User
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 max-w-md">
                        {error}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 mt-5">

                        <button
                            type="button"
                            onClick={fetchUser}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Try Again
                        </button>

                        <Link
                            to="/admin/users"
                            className="px-5 py-2.5 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition text-center"
                        >
                            Back to Users
                        </Link>

                    </div>

                </div>

            </div>
        );
    }


    // MAIN UI


    return (
        <div className="w-full max-w-full space-y-4 sm:space-y-6">

            {/* ======================================================
          HEADER
      ====================================================== */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3 min-w-0">

                    <Link
                        to="/admin/users"
                        className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 flex items-center justify-center transition"
                        aria-label="Back to users"
                    >
                        <FaArrowLeft />
                    </Link>

                    <div className="min-w-0">

                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 truncate">
                            Edit User
                        </h1>

                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Update user account information
                        </p>

                    </div>

                </div>

                <Link
                    to="/admin/users"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                    <FaArrowLeft />
                    Back to Users
                </Link>

            </div>

            {/* ======================================================
          SUCCESS
      ====================================================== */}

            {success && (
                <div className="w-full flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">

                    <div className="flex items-start sm:items-center gap-2 min-w-0">

                        <FaCheckCircle className="mt-0.5 sm:mt-0 shrink-0" />

                        <span className="text-sm">
                            {success}
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess("")
                        }
                        className="shrink-0"
                    >
                        <FaTimes />
                    </button>

                </div>
            )}

            {/* ======================================================
          ERROR
      ====================================================== */}

            {error && (
                <div className="w-full flex items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">

                    <div className="flex items-start sm:items-center gap-2 min-w-0">

                        <FaExclamationTriangle className="mt-0.5 sm:mt-0 shrink-0" />

                        <span className="text-sm break-words">
                            {error}
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setError("")
                        }
                        className="shrink-0"
                    >
                        <FaTimes />
                    </button>

                </div>
            )}

            {/* ======================================================
          FORM
      ====================================================== */}

            <div className="w-full max-w-5xl mx-auto">

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="w-full bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden"
                >

                    {/* ==================================================
              FORM HEADER
          ================================================== */}

                    <div className="p-4 sm:p-6 lg:p-7 border-b bg-gray-50">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <FaUser />
                            </div>

                            <div className="min-w-0">

                                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                    User Information
                                </h2>

                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    Update the user's account details.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
              FORM BODY
          ================================================== */}

                    <div className="p-4 sm:p-6 lg:p-7">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">

                            {/* =================================================
                  NAME
              ================================================= */}

                            <div className="md:col-span-2">

                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Name
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter user name"
                                        autoComplete="name"
                                        disabled={saving}
                                        className={inputClass("name")}
                                    />

                                </div>

                                {errors.name && (
                                    <p className="text-xs text-red-500 mt-1.5">
                                        {errors.name}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  EMAIL
              ================================================= */}

                            <div>

                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email"
                                        autoComplete="email"
                                        disabled={saving}
                                        className={inputClass("email")}
                                    />

                                </div>

                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1.5">
                                        {errors.email}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  MOBILE
              ================================================= */}

                            <div>

                                <label
                                    htmlFor="mobile"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Mobile
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                                    <input
                                        id="mobile"
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Enter mobile number"
                                        autoComplete="tel"
                                        inputMode="numeric"
                                        maxLength={15}
                                        disabled={saving}
                                        className={inputClass("mobile")}
                                    />

                                </div>

                                {errors.mobile && (
                                    <p className="text-xs text-red-500 mt-1.5">
                                        {errors.mobile}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  PASSWORD
              ================================================= */}

                            <div>

                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    New Password
                                </label>

                                <div className="relative">

                                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep password"
                                        autoComplete="new-password"
                                        disabled={saving}
                                        className="w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        disabled={saving}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 disabled:opacity-50"
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>

                                </div>

                                <p className="text-xs text-gray-400 mt-1.5">
                                    Leave blank if you don't want to change the password.
                                </p>

                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1.5">
                                        {errors.password}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  ROLE
              ================================================= */}

                            <div>

                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Role
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaUserShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        disabled={saving}
                                        className={inputClass("role")}
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
                                    <p className="text-xs text-red-500 mt-1.5">
                                        {errors.role}
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                  STATUS
              ================================================= */}

                            <div>

                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Status
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaToggleOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        disabled={saving}
                                        className={inputClass("status")}
                                    >
                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>

                                </div>

                                {errors.status && (
                                    <p className="text-xs text-red-500 mt-1.5">
                                        {errors.status}
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* ==================================================
              FOOTER
          ================================================== */}

                    <div className="px-4 sm:px-6 lg:px-7 py-4 border-t bg-gray-50">

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={saving}
                                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Reset
                            </button>

                            <Link
                                to="/admin/users"
                                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-center transition"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                            >
                                {saving ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Update User
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditUser;