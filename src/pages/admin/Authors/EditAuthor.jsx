import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaSave,
    FaSpinner,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimes,
    FaLink,
    FaFileAlt,
} from "react-icons/fa";

import authorService from "../../../services/authorService";

const EditAuthor = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // FORM STATE
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        slug: "",
        bio: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // GENERATE SLUG
    const generateSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    // API ERROR
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

        return "Unable to process author.";
    };

    // FETCH AUTHOR
    useEffect(() => {
        const fetchAuthor = async () => {
            if (!id) {
                setError("Author ID is missing.");
                setFetching(false);
                return;
            }

            try {
                setFetching(true);
                setError("");
                console.log("Fetching author ID:", id);
                const response = await authorService.getAuthor(id);
                console.log("Get author Response:", response);
                // Support common API response structures
                const author =
                    response?.author ||
                    response?.data?.author ||
                    response?.data ||
                    response;

                if (!author) {
                    throw new Error("Author not found.");
                }

                setFormData({
                    name: author.name || "",
                    email: author.email || "",
                    slug: author.slug || "",
                    bio: author.bio || "",
                });
            } catch (err) {
                console.error("Get author Error:", err);
                setError(getApiError(err));
            } finally {
                setFetching(false);
            }
        };

        fetchAuthor();
    }, [id]);

    // NAME CHANGE
    const handleNameChange = (e) => {
        const value = e.target.value;

        setFormData((previous) => ({
            ...previous,
            name: value,
            slug: generateSlug(value),
        }));

        setErrors((previous) => ({
            ...previous,
            name: "",
            slug: "",
        }));

        setError("");
        setSuccess("");
    };

    // INPUT CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "slug") {
            newValue = generateSlug(value);
        }

        setFormData((previous) => ({
            ...previous,
            [name]: newValue,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        setError("");
        setSuccess("");
    };

    // VALIDATION
    const validateForm = () => {
        const newErrors = {};

        const name = formData.name.trim();
        const email = formData.email.trim();
        const slug = formData.slug.trim();
        const bio = formData.bio.trim();

        // NAME
        if (!name) {
            newErrors.name = "Name is required.";
        } else if (name.length < 2) {
            newErrors.name =
                "Name must contain at least 2 characters.";
        } else if (name.length > 100) {
            newErrors.name =
                "Name cannot exceed 100 characters.";
        }

        // EMAIL
        if (!email) {
            newErrors.email = "Email is required.";
        } else {
            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                newErrors.email =
                    "Enter a valid email address.";
            } else if (email.length > 150) {
                newErrors.email =
                    "Email cannot exceed 150 characters.";
            }
        }

        // SLUG
        if (!slug) {
            newErrors.slug = "Slug is required.";
        } else if (slug.length < 2) {
            newErrors.slug =
                "Slug must contain at least 2 characters.";
        } else if (slug.length > 120) {
            newErrors.slug =
                "Slug cannot exceed 120 characters.";
        } else if (
            !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
        ) {
            newErrors.slug =
                "Slug can contain only lowercase letters, numbers, and hyphens.";
        }

        // BIO
        if (!bio) {
            newErrors.bio = "Bio is required.";
        } else if (bio.length < 10) {
            newErrors.bio =
                "Bio must contain at least 10 characters.";
        } else if (bio.length > 2000) {
            newErrors.bio =
                "Bio cannot exceed 2000 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        if (!id) {
            setError("Author ID is missing.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                slug: formData.slug.trim().toLowerCase(),
                bio: formData.bio.trim(),
            };

            console.log("Update author ID:", id);
            console.log("Update author Payload:", payload);

            const response =
                await authorService.updateAuthor(id, payload);

            console.log("Update author Response:", response);

            setSuccess("Author updated successfully.");

            // REDIRECT AFTER SUCCESS
            setTimeout(() => {
                navigate("/admin/authors/authors");
            }, 1000);
        } catch (err) {
            console.error("Update author Error:", err);

            const message = getApiError(err);
            const lowerMessage =
                String(message).toLowerCase();

            // DUPLICATE EMAIL
            if (
                lowerMessage.includes("email") ||
                lowerMessage.includes("e-mail")
            ) {
                setErrors((previous) => ({
                    ...previous,
                    email: message,
                }));
            }

            // DUPLICATE SLUG
            else if (lowerMessage.includes("slug")) {
                setErrors((previous) => ({
                    ...previous,
                    slug: message,
                }));
            }

            // GENERAL ERROR
            else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    // RESET FORM
    const handleReset = () => {
        if (loading || fetching) {
            return;
        }

        // Reload original author data
        const fetchOriginalAuthor = async () => {
            try {
                setFetching(true);
                setError("");

                const response =
                    await authorService.getAuthor(id);

                const author =
                    response?.author ||
                    response?.data?.author ||
                    response?.data ||
                    response;

                setFormData({
                    name: author?.name || "",
                    email: author?.email || "",
                    slug: author?.slug || "",
                    bio: author?.bio || "",
                });

                setErrors({});
                setSuccess("");
            } catch (err) {
                console.error(
                    "Reset author Error:",
                    err
                );

                setError(getApiError(err));
            } finally {
                setFetching(false);
            }
        };

        fetchOriginalAuthor();
    };

    // LOADING PAGE
    if (fetching) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-600">
                    <FaSpinner className="animate-spin text-2xl text-blue-600" />
                    <p>Loading author...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="flex items-center gap-3">

                    <Link
                        to="/admin/authors"
                        className="w-10 h-10 rounded-lg border bg-white text-gray-600 hover:bg-gray-50 flex items-center justify-center transition"
                    >
                        <FaArrowLeft />
                    </Link>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Edit Author
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Update author information
                        </p>
                    </div>

                </div>

                <Link
                    to="/admin/authors"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg bg-white hover:bg-gray-50 transition"
                >
                    <FaArrowLeft />
                    Back to authors
                </Link>

            </div>

            {/* SUCCESS ALERT */}
            {success && (
                <div className="flex items-center justify-between gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">

                    <div className="flex items-center gap-2">
                        <FaCheckCircle />
                        <span>{success}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                    >
                        <FaTimes />
                    </button>

                </div>
            )}

            {/* ERROR ALERT */}
            {error && (
                <div className="flex items-center justify-between gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">

                    <div className="flex items-center gap-2">
                        <FaExclamationTriangle />
                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        <FaTimes />
                    </button>

                </div>
            )}

            {/* FORM */}
            <div className="max-w-6xl mx-auto">

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
                                    Author Information
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Update the details for this author.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* FORM BODY */}
                    <div className="p-5 sm:p-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* NAME */}
                            <div>

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
                                        onChange={handleNameChange}
                                        placeholder="Enter author name"
                                        autoComplete="name"
                                        maxLength={100}
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.name
                                                ? "border-red-500 focus:ring-red-500"
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

                            {/* EMAIL */}
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
                                        placeholder="johndoe@gmail.com"
                                        autoComplete="email"
                                        maxLength={150}
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.email
                                                ? "border-red-500 focus:ring-red-500"
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

                            {/* SLUG */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Slug
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="author-name"
                                        autoComplete="off"
                                        maxLength={120}
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${errors.slug
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300"
                                            }`}
                                    />

                                </div>

                                <p className="text-xs text-gray-400 mt-1">
                                    Example: john-doe
                                </p>

                                {errors.slug && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {errors.slug}
                                    </p>
                                )}

                            </div>

                            {/* BIO */}
                            <div className="md:col-span-2">

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bio
                                    <span className="text-red-500">
                                        {" "}*
                                    </span>
                                </label>

                                <div className="relative">

                                    <FaFileAlt className="absolute left-3 top-3.5 text-gray-400" />

                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Enter author bio"
                                        rows={6}
                                        maxLength={2000}
                                        disabled={loading}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 resize-y disabled:bg-gray-100 ${errors.bio
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300"
                                            }`}
                                    />

                                </div>

                                <div className="flex justify-between mt-1">

                                    {errors.bio ? (
                                        <p className="text-xs text-red-500">
                                            {errors.bio}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-400">
                                            Write a short description about the author.
                                        </p>
                                    )}

                                    <span className="text-xs text-gray-400">
                                        {formData.bio.length}/2000
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* FORM FOOTER */}
                    <div className="px-5 sm:px-6 py-4 border-t bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

                        {/* RESET */}
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            Reset
                        </button>

                        {/* CANCEL */}
                        <Link
                            to="/admin/authors"
                            className={`px-5 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-center transition ${loading
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }`}
                        >
                            Cancel
                        </Link>

                        {/* UPDATE */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >

                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    Update Author
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditAuthor;