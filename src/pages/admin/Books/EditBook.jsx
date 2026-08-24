import React, { useEffect, useState } from "react";
import {
    FaBook,
    FaImage,
    FaSave,
    FaArrowLeft,
    FaSpinner,
    FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import bookService from "../../../services/bookService";
import categoryService from "../../../services/categoryService";
import authorService from "../../../services/authorService";

const EditBook = () => {
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
        image: "",
        description: "",
        featured: false,
        status: "active",
    });

    // ==========================================
    // OTHER STATES
    // ==========================================

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
            console.log(error);
        } finally {
            setPageLoading(false);
        }
    };

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value, type, checked } =
            e.target;

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

        if (!formData.price) {
            newErrors.price =
                "Price is required";
        }

        if (!formData.stock) {
            newErrors.stock =
                "Stock is required";
        }

        if (
            formData.price &&
            Number(formData.price) < 0
        ) {
            newErrors.price =
                "Invalid price";
        }

        if (
            formData.stock &&
            Number(formData.stock) < 0
        ) {
            newErrors.stock =
                "Invalid stock";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);

            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                pages: Number(formData.pages || 0),
            };

            await bookService.createBook(
                payload
            );

            setSuccess(
                "Book created successfully!"
            );

            setTimeout(() => {
                navigate("/admin/books");
            }, 1500);
        } catch (error) {
            console.error(error);

            alert(
                error.message ||
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
            image: "",
            description: "",
            featured: false,
            status: "active",
        });

        setErrors({});
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (pageLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="bg-white rounded-xl h-[700px]"></div>
            </div>
        );
    }

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
                    className="px-4 py-2 border rounded-lg"
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
            >

                <div className="grid md:grid-cols-2 gap-5">

                    {/* Title */}

                    <Input
                        label="Book Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        error={errors.title}
                    />

                    {/* ISBN */}

                    <Input
                        label="ISBN"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                    />

                    {/* Author */}

                    <Select
                        label="Author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        error={errors.author}
                        options={authors}
                    />

                    {/* Category */}

                    <Select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        error={errors.category}
                        options={categories}
                    />

                    {/* Price */}

                    <Input
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        error={errors.price}
                    />

                    {/* Stock */}

                    <Input
                        label="Stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        error={errors.stock}
                    />

                    {/* Publisher */}

                    <Input
                        label="Publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                    />

                    {/* Language */}

                    <Input
                        label="Language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                    />

                    {/* Pages */}

                    <Input
                        label="Pages"
                        name="pages"
                        type="number"
                        value={formData.pages}
                        onChange={handleChange}
                    />

                    {/* Year */}

                    <Input
                        label="Published Year"
                        name="publishedYear"
                        type="number"
                        value={formData.publishedYear}
                        onChange={handleChange}
                    />

                    {/* Image */}

                    <div className="md:col-span-2">
                        <label className="font-medium">
                            Image URL
                        </label>

                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-lg p-3"
                        />

                        {formData.image && (
                            <img
                                src={formData.image}
                                alt=""
                                className="w-32 h-44 mt-4 rounded-lg object-cover border"
                            />
                        )}
                    </div>

                    {/* Description */}

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

                {/* Featured */}

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

                {/* Buttons */}

                <div className="mt-8 flex gap-3">

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    >
                        {loading ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaSave />
                        )}

                        Save Book
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
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
// INPUT COMPONENT
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
// SELECT COMPONENT
// ==========================================

const Select = ({
    label,
    options,
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
                    key={
                        item._id || item.id
                    }
                    value={
                        item._id || item.id
                    }
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

export default EditBook;