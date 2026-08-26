import React, { useEffect, useState } from "react";
import {
    FaBook,
    FaSave,
    FaArrowLeft,
    FaSpinner,
    FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import bookService from "../../../services/bookService";
import categoryService from "../../../services/categoryService";
import authorService from "../../../services/authorService";

const CreateBook = () => {
    const navigate = useNavigate();

    // ==========================================
    // FORM STATE
    // ==========================================

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        isbn: "",
        price: "",
        stock: "",
        language: "English",
        publisher: "",
        publishedYear: "",
        pages: "",
        image: null,
        description: "",
        slug: "",
        featured: false,
        status: "Available",
    });

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    // ==========================================
    // LOAD AUTHORS / CATEGORIES
    // ==========================================

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setPageLoading(true);

            const [authorRes, categoryRes] =
                await Promise.all([
                    authorService.getAuthors(),
                    categoryService.getCategories(),
                ]);

            setAuthors(
                authorRes?.data ||
                authorRes?.authors ||
                authorRes ||
                []
            );

            setCategories(
                categoryRes?.data ||
                categoryRes?.categories ||
                categoryRes ||
                []
            );
        } catch (error) {
            console.error("Load data error:", error);
        } finally {
            setPageLoading(false);
        }
    };

    // ==========================================
    // IMAGE CHANGE
    // ==========================================

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Image validation
        if (!file.type.startsWith("image/")) {
            setErrors((prev) => ({
                ...prev,
                image: "Only image files are allowed",
            }));

            e.target.value = "";
            return;
        }

        // 5MB validation
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                image: "Image must be less than 5MB",
            }));

            e.target.value = "";
            return;
        }

        console.log("SELECTED IMAGE:", {
            name: file.name,
            type: file.type,
            size: file.size,
            file,
        });

        setFormData((prev) => ({
            ...prev,
            image: file,
        }));

        setErrors((prev) => ({
            ...prev,
            image: "",
        }));
    };

    // ==========================================
    // REMOVE IMAGE
    // ==========================================

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
        }));

        const input = document.querySelector(
            'input[name="image"]'
        );

        if (input) {
            input.value = "";
        }
    };

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // ==========================================
    // VALIDATION
    // ==========================================

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title =
                "Book title is required";
        }

        if (!formData.author) {
            newErrors.author =
                "Author is required";
        }

        if (!formData.category) {
            newErrors.category =
                "Category is required";
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            newErrors.price =
                "Valid price is required";
        }

        if (
            formData.stock === "" ||
            Number(formData.stock) < 0
        ) {
            newErrors.stock =
                "Valid stock is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            setSuccess("");

            // ==========================================
            // CREATE FORMDATA
            // ==========================================

            const data = new FormData();

            data.append(
                "title",
                formData.title
            );

            data.append(
                "author",
                formData.author
            );

            data.append(
                "category",
                formData.category
            );

            data.append(
                "isbn",
                formData.isbn
            );

            data.append(
                "price",
                String(Number(formData.price))
            );

            data.append(
                "stock",
                String(Number(formData.stock))
            );

            data.append(
                "language",
                formData.language
            );

            data.append(
                "publisher",
                formData.publisher
            );

            data.append(
                "publishedYear",
                formData.publishedYear
            );

            data.append(
                "pages",
                String(Number(formData.pages || 0))
            );

            data.append(
                "description",
                formData.description
            );

            data.append(
                "slug",
                formData.slug
            );

            data.append(
                "featured",
                String(formData.featured)
            );

            data.append(
                "status",
                formData.status
            );

            // ==========================================
            // IMPORTANT: IMAGE
            // ==========================================

            if (formData.image instanceof File) {
                data.append(
                    "image",
                    formData.image
                );
            }

            // ==========================================
            // DEBUG FORMDATA
            // ==========================================

            console.log(
                "========== BOOK FORMDATA =========="
            );

            for (const [key, value] of data.entries()) {
                if (value instanceof File) {
                    console.log("IMAGE:", {
                        field: key,
                        name: value.name,
                        type: value.type,
                        size: value.size,
                        file: value,
                    });
                } else {
                    console.log(
                        key,
                        value
                    );
                }
            }

            console.log(
                "==================================="
            );

            // ==========================================
            // API
            // ==========================================

            const response =
                await bookService.createBook(
                    data
                );

            console.log(
                "CREATE BOOK RESPONSE:",
                response
            );

            setSuccess(
                "Book created successfully!"
            );

            setTimeout(() => {
                navigate("/admin/books");
            }, 1500);

        } catch (error) {
            console.error(
                "CREATE BOOK ERROR:",
                error
            );

            alert(
                error?.message ||
                "Unable to create book"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // RESET
    // ==========================================

    const handleReset = () => {
        setFormData({
            title: "",
            author: "",
            category: "",
            isbn: "",
            price: "",
            stock: "",
            language: "English",
            publisher: "",
            publishedYear: "",
            pages: "",
            image: null,
            description: "",
            slug: "",
            featured: false,
            status: "Available",
        });

        setErrors({});
        setSuccess("");

        const input = document.querySelector(
            'input[name="image"]'
        );

        if (input) {
            input.value = "";
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (pageLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-gray-200 rounded" />
                <div className="bg-white rounded-xl h-[700px]" />
            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="max-w-6xl mx-auto">

            {/* Header */}

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FaBook />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Add Book
                        </h1>

                        <p className="text-gray-500">
                            Create a new book
                        </p>
                    </div>

                </div>

                <Link
                    to="/admin/books"
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                    <FaArrowLeft />
                </Link>
            </div>

            {/* Success */}

            {success && (
                <div className="mb-5 p-4 rounded-lg bg-green-100 text-green-700">
                    {success}
                </div>
            )}

            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow border p-6"
                encType="multipart/form-data"
            >

                <div className="grid md:grid-cols-2 gap-5">

                    <Input
                        label="Book Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={errors.title}
                    />

                    <Input
                        label="Slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        error={errors.slug}
                    />

                    <Input
                        label="ISBN"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                    />

                    <Select
                        label="Author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        error={errors.author}
                        options={authors}
                    />

                    <Select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        error={errors.category}
                        options={categories}
                    />

                    <Input
                        label="Price"
                        name="price"
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        error={errors.price}
                    />

                    <Input
                        label="Stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        error={errors.stock}
                    />

                    <Input
                        label="Publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                    />

                    <Input
                        label="Language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                    />

                    <Input
                        label="Pages"
                        name="pages"
                        type="number"
                        min="0"
                        value={formData.pages}
                        onChange={handleChange}
                    />

                    <Input
                        label="Published Year"
                        name="publishedYear"
                        type="number"
                        value={formData.publishedYear}
                        onChange={handleChange}
                    />

                    {/* IMAGE */}

                    <div className="md:col-span-2">

                        <label className="font-medium text-gray-700">
                            Book Image
                        </label>

                        <input
                            type="file"
                            name="image"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={changeFileHandler}
                            className={`w-full mt-2 p-3 border rounded-lg bg-white ${errors.image
                                    ? "border-red-500"
                                    : "border-gray-300"
                                }`}
                        />

                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.image}
                            </p>
                        )}

                        {/* IMAGE PREVIEW */}

                        {formData.image instanceof File && (
                            <div className="mt-4 relative w-40">

                                <img
                                    src={URL.createObjectURL(
                                        formData.image
                                    )}
                                    alt="Book preview"
                                    className="w-40 h-52 object-cover rounded-lg border"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center"
                                >
                                    <FaTimes size={12} />
                                </button>

                                <p className="text-xs text-gray-500 mt-2 break-all">
                                    {formData.image.name}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {(
                                        formData.image.size /
                                        1024 /
                                        1024
                                    ).toFixed(2)}{" "}
                                    MB
                                </p>

                            </div>
                        )}

                    </div>

                    {/* DESCRIPTION */}

                    <div className="md:col-span-2">

                        <label className="font-medium">
                            Description
                        </label>

                        <textarea
                            rows="5"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-lg p-3"
                        />

                    </div>

                </div>

                {/* FEATURED */}

                <div className="mt-5 flex items-center gap-3">

                    <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                    />

                    <label>
                        Featured Book
                    </label>

                </div>

                {/* BUTTONS */}

                <div className="mt-8 flex gap-3">

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave />
                                Save Book
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="px-6 py-3 border rounded-lg"
                    >
                        Reset
                    </button>

                </div>

            </form>
        </div>
    );
};

// ==========================================
// INPUT
// ==========================================

const Input = ({
    label,
    error,
    ...props
}) => (
    <div>
        <label className="font-medium">
            {label}
        </label>

        <input
            {...props}
            className={`w-full mt-2 p-3 border rounded-lg ${error
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
        />

        {error && (
            <p className="text-red-500 text-sm mt-1">
                {error}
            </p>
        )}
    </div>
);

// ==========================================
// SELECT
// ==========================================

const Select = ({
    label,
    options = [],
    error,
    ...props
}) => (
    <div>
        <label className="font-medium">
            {label}
        </label>

        <select
            {...props}
            className={`w-full mt-2 p-3 border rounded-lg ${error
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
        >
            <option value="">
                Select {label}
            </option>

            {options.map((item) => (
                <option
                    key={item._id || item.id}
                    value={item._id || item.id}
                >
                    {item.name || item.title}
                </option>
            ))}
        </select>

        {error && (
            <p className="text-red-500 text-sm mt-1">
                {error}
            </p>
        )}
    </div>
);

export default CreateBook;