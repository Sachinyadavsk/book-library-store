import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faEnvelope,
    faPhone,
    faLock,
    faPen,
    faCheck,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const { user, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [apiError, setApiError] = useState("");

    // =====================================================
    // LOAD USER DATA
    // =====================================================

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "",
            });
        }
    }, [user]);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "mobile") {
            const mobile = value
                .replace(/\D/g, "")
                .slice(0, 10);

            setFormData((prev) => ({
                ...prev,
                mobile,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setApiError("");
        setSuccess("");
    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        } else if (formData.name.trim().length < 2) {
            newErrors.name =
                "Name must be at least 2 characters.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {
            newErrors.email =
                "Please enter a valid email address.";
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile =
                "Mobile number is required.";
        } else if (
            !/^[6-9]\d{9}$/.test(formData.mobile)
        ) {
            newErrors.mobile =
                "Please enter a valid 10-digit mobile number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // SAVE PROFILE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess("");
        setApiError("");

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const updatedUser = {
                ...user,
                name: formData.name.trim(),
                email: formData.email.trim(),
                mobile: formData.mobile,
            };

            /*
             * If your AuthContext has updateUser(), use it.
             */
            if (typeof updateUser === "function") {
                await updateUser(updatedUser);
            } else {
                /*
                 * Fallback:
                 * update localStorage if updateUser is not available.
                 */
                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );
            }

            setSuccess(
                "Profile updated successfully."
            );

            setIsEditing(false);

        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            setApiError(
                error?.message ||
                "Unable to update profile."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            mobile: user?.mobile || "",
        });

        setErrors({});
        setApiError("");
        setSuccess("");
        setIsEditing(false);
    };

    // =====================================================
    // INPUT CLASS
    // =====================================================

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

    // =====================================================
    // USER NOT FOUND
    // =====================================================

    if (!user) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

                <div className="text-5xl mb-4">
                    👤
                </div>

                <h2 className="text-xl font-bold text-gray-800">
                    User not found
                </h2>

                <p className="mt-2 text-gray-500">
                    Please login again to access your profile.
                </p>

            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* =================================================
                          HEADER
      ================================================= */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        My Profile
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage your account information.
                    </p>
                </div>

                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            setSuccess("");
                            setApiError("");
                            setIsEditing(true);
                        }}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                    >
                        <FontAwesomeIcon icon={faPen} />
                        Edit Profile
                    </button>
                )}

            </div>


            {/* =================================================
                         SUCCESS
      ================================================= */}

            {success && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheck} />
                        {success}
                    </div>
                </div>
            )}


            {/* =================================================
                         API ERROR
      ================================================= */}

            {apiError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
                    {apiError}
                </div>
            )}


            {/* =================================================
                       PROFILE CARD
      ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                {/* Profile Header */}

                <div className="bg-blue-600 px-6 py-8 sm:px-8">

                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">

                        <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl shadow">
                            <FontAwesomeIcon icon={faUser} />
                        </div>

                        <div className="text-white">

                            <h2 className="text-2xl font-bold">
                                {user.name || "User"}
                            </h2>

                            <p className="text-blue-100 mt-1">
                                {user.email}
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                            FORM
        ================================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6 sm:p-8"
                >

                    {/* NAME */}

                    <div className="mb-5">

                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                            Full Name
                        </label>

                        <div className="relative">

                            <FontAwesomeIcon
                                icon={faUser}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`
                  ${inputClass("name")}
                  ${!isEditing
                                        ? "bg-gray-50 cursor-not-allowed"
                                        : ""
                                    }
                `}
                            />

                        </div>

                        {errors.name && (
                            <p className="mt-1.5 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}

                    </div>


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
                                disabled={!isEditing}
                                className={`
                  ${inputClass("email")}
                  ${!isEditing
                                        ? "bg-gray-50 cursor-not-allowed"
                                        : ""
                                    }
                `}
                            />

                        </div>

                        {errors.email && (
                            <p className="mt-1.5 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}

                    </div>


                    {/* MOBILE */}

                    <div className="mb-5">

                        <label
                            htmlFor="mobile"
                            className="block mb-2 text-sm font-semibold text-gray-700"
                        >
                            Mobile Number
                        </label>

                        <div className="relative">

                            <FontAwesomeIcon
                                icon={faPhone}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={handleChange}
                                disabled={!isEditing}
                                maxLength={10}
                                inputMode="numeric"
                                className={`
                  ${inputClass("mobile")}
                  ${!isEditing
                                        ? "bg-gray-50 cursor-not-allowed"
                                        : ""
                                    }
                `}
                            />

                        </div>

                        {errors.mobile && (
                            <p className="mt-1.5 text-sm text-red-500">
                                {errors.mobile}
                            </p>
                        )}

                    </div>


                    {/* PASSWORD */}

                    <div className="mb-6">

                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Password
                        </label>

                        <div className="relative">

                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="password"
                                value="********"
                                disabled
                                className="w-full py-3 pl-11 pr-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                            />

                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            Password cannot be changed from this page.
                        </p>

                    </div>


                    {/* =================================================
                         ACTION BUTTONS
          ================================================= */}

                    {isEditing && (
                        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t">

                            {/* Save */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                            >

                                <FontAwesomeIcon icon={faCheck} />

                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>


                            {/* Cancel */}

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-60 transition"
                            >

                                <FontAwesomeIcon icon={faTimes} />

                                Cancel

                            </button>

                        </div>
                    )}

                </form>

            </div>

        </div>
    );
};

export default Profile;