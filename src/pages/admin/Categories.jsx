import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaTags,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaSpinner,
  FaSyncAlt,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import categoryService from "../../services/categoryService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    status: "active",
  });

  const [formErrors, setFormErrors] = useState({});
  // LOAD CATEGORIES
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await categoryService.getCategories();
      const data = normalizeCategories(response);
      setCategories(data);
    } catch (err) {
      console.error("Category API Error:", err);
      setError(err?.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };


  // NORMALIZE API RESPONSE
  const normalizeCategories = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.categories)) {
      return response.categories;
    }

    if (Array.isArray(response?.data?.categories)) {
      return response.data.categories;
    }

    return [];
  };


  // GET CATEGORY ID
  const getCategoryId = (category) => {
    return (
      category?._id ||
      category?.id
    );
  };


  // GET CATEGORY NAME
  const getCategoryName = (category) => {
    return (category?.name || category?.title || "Unnamed Category");
  };

  // GET DESCRIPTION
  const getDescription = (category) => {
    return (category?.description || "-");
  };


  // STATUS
  const isActive = (category) => {
    const status = category?.status;
    if (status === undefined || status === null) {
      return true;
    }
    if (typeof status === "boolean") {
      return status;
    }
    return (String(status).toLowerCase() === "active");
  };


  // FILTER
  const filteredCategories =
    useMemo(() => {
      const query = search.trim().toLowerCase();
      return categories.filter((category) => {
        const name = getCategoryName(category).toLowerCase();
        const description = getDescription(category).toLowerCase();
        const active = isActive(category);
        const searchMatch = !query || name.includes(query) || description.includes(query);
        const statusMatch = statusFilter === "all" || (statusFilter === "active" && active) || (statusFilter === "inactive" && !active);
        return (searchMatch && statusMatch);
      }
      );

    }, [categories, search, statusFilter,]);


  // STATISTICS
  const totalCategories = categories.length;
  const activeCategories = categories.filter(isActive).length;
  const inactiveCategories = totalCategories - activeCategories;
  // OPEN CREATE MODAL

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      slug: "",
      status: "active",
    });

    setFormErrors({});
    setError("");
    setSuccess("");
    setModalOpen(true);
  };


  // OPEN EDIT MODAL
  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category?.name || category?.title || "",
      description: category?.description || "",
      slug: category?.slug || "",
      status: category?.status || "active",
    });

    setFormErrors({});
    setError("");
    setSuccess("");
    setModalOpen(true);
  };


  // CLOSE MODAL
  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingCategory(null);
    setFormErrors({});
  };


  // FORM CHANGE
  const handleChange = (e) => {
    const { name, value, } = e.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setFormErrors(
      (previous) => ({
        ...previous,
        [name]: "",
      })
    );
  };


  // VALIDATION
  const validateForm = () => {
    const errors = {};
    const name = formData.name.trim();
    if (!name) {
      errors.name = "Category name is required.";
    } else if (name.length < 2) {
      errors.name = "Category name must contain at least 2 characters.";
    } else if (name.length > 100) {
      errors.name = "Category name cannot exceed 100 characters.";
    }

    const duplicate =
      categories.some(
        (category) => {
          const existingName = getCategoryName(category).trim().toLowerCase();
          const currentId = getCategoryId(category);
          const editingId = getCategoryId(editingCategory);
          return (existingName === name.toLowerCase() && currentId !== editingId);
        }
      );

    if (duplicate) {
      errors.name = "This category already exists.";
    }
    setFormErrors(errors);
    return (
      Object.keys(errors).length ===
      0
    );
  };


  // CREATE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        slug: formData.slug.trim(),
        status: formData.status,
      };

      if (editingCategory) {
        const id = getCategoryId(editingCategory);
        const response = await categoryService.updateCategory(id, payload);

        const updatedCategory = extractCategory(response) ||
        {
          ...editingCategory,
          ...payload,
        };

        setCategories((previous) => previous.map((category) => getCategoryId(category) === id
          ? updatedCategory
          : category
        )
        );
        setSuccess("Category updated successfully.");
      } else {
        const response = await categoryService.createCategory(payload);
        const newCategory = extractCategory(response);
        if (newCategory) {
          setCategories((previous) => [newCategory, ...previous,]);
        } else {
          await loadCategories();
        }
        setSuccess("Category created successfully.");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Save Category Error:", err);
      setError(err?.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };


  // EXTRACT CATEGORY
  const extractCategory = (response) => {
    if (response?._id || response?.id) {
      return response;
    }

    if (response?.data?._id || response?.data?.id) {
      return response.data;
    }

    if (response?.category?._id || response?.category?.id) {
      return response.category;
    }
    if (response?.data?.category?._id || response?.data?.category?.id) {
      return response.data.category;
    }
    return null;
  };

  // DELETE
  const handleDelete = async (category) => {
    const id = getCategoryId(category);
    if (!id) {
      setError("Category ID is missing.");
      return;
    }

    const name = getCategoryName(category);
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);
      setError("");
      await categoryService.deleteCategory(id);
      setCategories((previous) => previous.filter((item) =>
        getCategoryId(item) !== id
      )
      );
      setSuccess("Category deleted successfully.");
    } catch (err) {
      console.error("Delete Category Error:", err);
      setError(err?.message || "Unable to delete category.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // STATUS TOGGLE
  const handleStatusToggle = async (category) => {
    const id = getCategoryId(category);
    if (!id) return;
    const newStatus = isActive(category) ? "inactive" : "active";
    try {
      setStatusLoading(id);
      setError("");
      await categoryService.updateStatus(id, newStatus);
      setCategories((previous) => previous.map((item) =>
        getCategoryId(item) === id
          ? {
            ...item,
            status:
              newStatus,
          }
          : item
      )
      );
    } catch (err) {
      console.error("Status Update Error:", err);
      setError(err?.message || "Unable to update category status.");
    } finally {
      setStatusLoading(null);
    }
  };


  // LOADING UI
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(
            (item) => (
              <div
                key={item}
                className="h-28 bg-gray-200 rounded-xl"
              />
            )
          )}
        </div>
        <div className="h-[400px] bg-gray-200 rounded-xl" />
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="space-y-6">
      {/* ============================================
          HEADER
      ============================================ */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaTags className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your book categories
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Add Category
        </button>
      </div>

      {/* ============================================
          ALERTS
      ============================================ */}

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

      {/* ============================================
          STATISTICS
      ============================================ */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon={<FaTags />}
          className="blue"
        />

        <StatCard
          title="Active"
          value={activeCategories}
          icon={<FaCheckCircle />}
          className="green"
        />

        <StatCard
          title="Inactive"
          value={inactiveCategories}
          icon={<FaTimes />}
          className="red"
        />
      </div>

      {/* ============================================
          SEARCH / FILTER
      ============================================ */}

      <div className="bg-white border rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="md:w-48 px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive"> Inactive</option>
          </select>

          <button
            type="button"
            onClick={loadCategories}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-gray-50"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>
      </div>

      {/* ============================================
          EMPTY
      ============================================ */}

      {categories.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center">
          <FaTags className="mx-auto text-5xl text-gray-300" />
          <h2 className="text-xl font-bold text-gray-800 mt-4">
            No Categories Found
          </h2>
          <p className="text-gray-500 mt-2">
            Create your first book category.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg"
          >
            <FaPlus />
            Add Category
          </button>
        </div>

      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center">
          <FaSearch className="mx-auto text-4xl text-gray-300" />
          <h2 className="text-xl font-bold text-gray-800 mt-4">
            No Matching Categories
          </h2>
          <p className="text-gray-500 mt-2">
            Try another search or filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="mt-5 px-5 py-2.5 border rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (

        /* ==========================================
           TABLE
        ========================================== */

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Category List
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredCategories.length} categories
            </p>
          </div>

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <th className="px-5 py-4">
                    #
                  </th>
                  <th className="px-5 py-4">
                    Category
                  </th>
                  <th className="px-5 py-4">
                    Description
                  </th>
                  <th className="px-5 py-4">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">

                {filteredCategories.map((category, index) => {
                  const id = getCategoryId(category);
                  const active = isActive(category);
                  return (
                    <tr
                      key={id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FaTags />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {getCategoryName(
                              category
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500 max-w-sm">
                        {getDescription(
                          category
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          disabled={
                            statusLoading ===
                            id
                          }
                          onClick={() =>
                            handleStatusToggle(
                              category
                            )
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {statusLoading ===
                            id ? (
                            <FaSpinner className="animate-spin" />
                          ) : active ? (
                            "Active"
                          ) : (
                            "Inactive"
                          )}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                category
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            disabled={
                              deleteLoading ===
                              id
                            }
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                          >
                            {deleteLoading ===
                              id ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaTrash />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}

          <div className="md:hidden divide-y">
            {filteredCategories.map((category) => {
              const id = getCategoryId(category);
              const active = isActive(category);

              return (
                <div
                  key={id}
                  className="p-4"
                >

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FaTags />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800">
                        {getCategoryName(
                          category
                        )}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {getDescription(
                          category
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={statusLoading === id}
                      onClick={() => handleStatusToggle(category)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {statusLoading ===
                        id ? (
                        <FaSpinner className="animate-spin" />
                      ) : active ? (
                        "Active"
                      ) : (
                        "Inactive"
                      )}
                    </button>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            category
                          )
                        }
                        className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        disabled={
                          deleteLoading === id
                        }
                        onClick={() =>
                          handleDelete(
                            category
                          )
                        }
                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"
                      >
                        {deleteLoading === id ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash />
                        )}
                      </button>

                    </div>

                  </div>

                </div>
              );
            }
            )}

          </div>

        </div>

      )}

      {/* ============================================
          CREATE / EDIT MODAL
      ============================================ */}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="p-5 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {editingCategory
                    ? "Update category information"
                    : "Create a new book category"}
                </p>

              </div>

              <button
                type="button"
                disabled={saving}
                onClick={closeModal}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-5 space-y-5">
                {/* Name */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Category Name
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    maxLength={100}
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />

                  {formErrors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.name}
                    </p>
                  )}

                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    placeholder="Enter category description"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 text-right mt-1">
                    {formData.description.length}/500
                  </p>
                </div>

                {/* slug */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Category slug
                    <span className="text-red-500">
                      {" "}*
                    </span>
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="Enter category slug"
                    maxLength={100}
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.slug
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />

                  {formErrors.slug && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.slug}
                    </p>
                  )}

                </div>

                {/* Status */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="active">
                      Active
                    </option>
                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}

              <div className="p-5 border-t flex justify-end gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeModal}
                  className="px-5 py-2.5 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >

                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {editingCategory
                        ? "Update Category"
                        : "Create Category"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};


// STAT CARD


const StatCard = ({
  title,
  value,
  icon,
  className,
}) => {

  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-2xl font-bold text-gray-800 mt-1">
            {value}
          </p>

        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[className]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default Categories;