import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUserEdit,
  FaUserPlus,
  FaUsers,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaSpinner,
  FaSyncAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBook,
} from "react-icons/fa";

import authorService from "../../services/authorService";

const Authors = () => {

  // ============================================
  // STATE
  // ============================================

  const [authors, setAuthors] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [statusLoading, setStatusLoading] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editingAuthor, setEditingAuthor] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    country: "",
    status: "active",
  });

  const [formErrors, setFormErrors] =
    useState({});

  // ============================================
  // LOAD AUTHORS
  // ============================================

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await authorService.getAuthors();

      setAuthors(
        normalizeAuthors(response)
      );

    } catch (err) {
      console.error(
        "Author API Error:",
        err
      );

      setError(
        err?.message ||
        "Unable to load authors."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // NORMALIZE RESPONSE
  // ============================================

  const normalizeAuthors = (
    response
  ) => {

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (
      Array.isArray(response?.authors)
    ) {
      return response.authors;
    }

    if (
      Array.isArray(
        response?.data?.authors
      )
    ) {
      return response.data.authors;
    }

    return [];
  };

  // ============================================
  // AUTHOR ID
  // ============================================

  const getAuthorId = (author) => {
    return (
      author?._id ||
      author?.id
    );
  };

  // ============================================
  // AUTHOR NAME
  // ============================================

  const getAuthorName = (author) => {
    return (
      author?.name ||
      author?.fullName ||
      `${author?.firstName || ""} ${author?.lastName || ""
        }`.trim() ||
      "Unnamed Author"
    );
  };

  // ============================================
  // AUTHOR BIO
  // ============================================

  const getBio = (author) => {
    return (
      author?.bio ||
      author?.biography ||
      "-"
    );
  };

  // ============================================
  // AUTHOR EMAIL
  // ============================================

  const getEmail = (author) => {
    return (
      author?.email ||
      "-"
    );
  };

  // ============================================
  // AUTHOR COUNTRY
  // ============================================

  const getCountry = (author) => {
    return (
      author?.country ||
      author?.nationality ||
      "-"
    );
  };

  // ============================================
  // AUTHOR STATUS
  // ============================================

  const isActive = (author) => {

    const status =
      author?.status;

    if (
      status === undefined ||
      status === null
    ) {
      return true;
    }

    if (
      typeof status === "boolean"
    ) {
      return status;
    }

    return (
      String(status).toLowerCase() ===
      "active"
    );
  };

  // ============================================
  // FILTER AUTHORS
  // ============================================

  const filteredAuthors =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      return authors.filter(
        (author) => {

          const name =
            getAuthorName(
              author
            ).toLowerCase();

          const bio =
            getBio(
              author
            ).toLowerCase();

          const email =
            getEmail(
              author
            ).toLowerCase();

          const country =
            getCountry(
              author
            ).toLowerCase();

          const active =
            isActive(author);

          const searchMatch =
            !query ||
            name.includes(query) ||
            bio.includes(query) ||
            email.includes(query) ||
            country.includes(query);

          const statusMatch =
            statusFilter === "all" ||
            (
              statusFilter === "active" &&
              active
            ) ||
            (
              statusFilter === "inactive" &&
              !active
            );

          return (
            searchMatch &&
            statusMatch
          );
        }
      );

    }, [
      authors,
      search,
      statusFilter,
    ]);

  // ============================================
  // STATISTICS
  // ============================================

  const totalAuthors =
    authors.length;

  const activeAuthors =
    authors.filter(
      isActive
    ).length;

  const inactiveAuthors =
    totalAuthors -
    activeAuthors;

  // ============================================
  // OPEN CREATE
  // ============================================

  const openCreateModal = () => {

    setEditingAuthor(null);

    setFormData({
      name: "",
      bio: "",
      email: "",
      country: "",
      status: "active",
    });

    setFormErrors({});
    setError("");

    setModalOpen(true);
  };

  // ============================================
  // OPEN EDIT
  // ============================================

  const openEditModal = (
    author
  ) => {

    setEditingAuthor(author);

    setFormData({
      name:
        getAuthorName(author) ===
          "Unnamed Author"
          ? ""
          : getAuthorName(author),

      bio:
        author?.bio ||
        author?.biography ||
        "",

      email:
        author?.email ||
        "",

      country:
        author?.country ||
        author?.nationality ||
        "",

      status:
        author?.status ||
        "active",
    });

    setFormErrors({});
    setError("");

    setModalOpen(true);
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const closeModal = () => {

    if (saving) return;

    setModalOpen(false);
    setEditingAuthor(null);
    setFormErrors({});
  };

  // ============================================
  // FORM CHANGE
  // ============================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

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

  // ============================================
  // VALIDATION
  // ============================================

  const validateForm = () => {

    const errors = {};

    const name =
      formData.name.trim();

    if (!name) {

      errors.name =
        "Author name is required.";

    } else if (
      name.length < 2
    ) {

      errors.name =
        "Author name must contain at least 2 characters.";

    } else if (
      name.length > 100
    ) {

      errors.name =
        "Author name cannot exceed 100 characters.";

    }

    // Duplicate check

    const duplicate =
      authors.some(
        (author) => {

          const existingName =
            getAuthorName(
              author
            )
              .trim()
              .toLowerCase();

          const currentId =
            getAuthorId(
              author
            );

          const editingId =
            getAuthorId(
              editingAuthor
            );

          return (
            existingName ===
            name.toLowerCase() &&
            currentId !== editingId
          );
        }
      );

    if (duplicate) {

      errors.name =
        "This author already exists.";

    }

    // Email validation

    if (formData.email.trim()) {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          formData.email.trim()
        )
      ) {
        errors.email =
          "Enter a valid email address.";
      }
    }

    if (
      formData.bio.length > 1000
    ) {

      errors.bio =
        "Biography cannot exceed 1000 characters.";

    }

    setFormErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };

  // ============================================
  // EXTRACT AUTHOR
  // ============================================

  const extractAuthor = (
    response
  ) => {

    if (
      response?._id ||
      response?.id
    ) {
      return response;
    }

    if (
      response?.data?._id ||
      response?.data?.id
    ) {
      return response.data;
    }

    if (
      response?.author?._id ||
      response?.author?.id
    ) {
      return response.author;
    }

    if (
      response?.data?.author?._id ||
      response?.data?.author?.id
    ) {
      return response.data.author;
    }

    return null;
  };

  // ============================================
  // CREATE / UPDATE
  // ============================================

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
        name:
          formData.name.trim(),

        bio:
          formData.bio.trim(),

        email:
          formData.email.trim(),

        country:
          formData.country.trim(),

        status:
          formData.status,
      };

      // UPDATE

      if (editingAuthor) {

        const id =
          getAuthorId(
            editingAuthor
          );

        const response =
          await authorService.updateAuthor(
            id,
            payload
          );

        const updatedAuthor =
          extractAuthor(response) ||
          {
            ...editingAuthor,
            ...payload,
          };

        setAuthors(
          (previous) =>
            previous.map(
              (author) =>
                getAuthorId(
                  author
                ) === id
                  ? updatedAuthor
                  : author
            )
        );

        setSuccess(
          "Author updated successfully."
        );

      }

      // CREATE

      else {

        const response =
          await authorService.createAuthor(
            payload
          );

        const newAuthor =
          extractAuthor(response);

        if (newAuthor) {

          setAuthors(
            (previous) => [
              newAuthor,
              ...previous,
            ]
          );

        } else {

          await loadAuthors();

        }

        setSuccess(
          "Author created successfully."
        );
      }

      setModalOpen(false);

    } catch (err) {

      console.error(
        "Author Save Error:",
        err
      );

      setError(
        err?.message ||
        "Unable to save author."
      );

    } finally {

      setSaving(false);
    }
  };

  // ============================================
  // DELETE
  // ============================================

  const handleDelete = async (
    author
  ) => {

    const id =
      getAuthorId(author);

    if (!id) {

      setError(
        "Author ID is missing."
      );

      return;
    }

    const name =
      getAuthorName(author);

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeleteLoading(id);
      setError("");

      await authorService.deleteAuthor(
        id
      );

      setAuthors(
        (previous) =>
          previous.filter(
            (item) =>
              getAuthorId(item) !== id
          )
      );

      setSuccess(
        "Author deleted successfully."
      );

    } catch (err) {

      console.error(
        "Author Delete Error:",
        err
      );

      setError(
        err?.message ||
        "Unable to delete author."
      );

    } finally {

      setDeleteLoading(null);
    }
  };

  // ============================================
  // STATUS TOGGLE
  // ============================================

  const handleStatusToggle = async (
    author
  ) => {

    const id =
      getAuthorId(author);

    if (!id) return;

    const newStatus =
      isActive(author)
        ? "inactive"
        : "active";

    try {

      setStatusLoading(id);
      setError("");

      await authorService.updateStatus(
        id,
        newStatus
      );

      setAuthors(
        (previous) =>
          previous.map(
            (item) =>
              getAuthorId(item) === id
                ? {
                  ...item,
                  status:
                    newStatus,
                }
                : item
          )
      );

    } catch (err) {

      console.error(
        "Author Status Error:",
        err
      );

      setError(
        err?.message ||
        "Unable to update author status."
      );

    } finally {

      setStatusLoading(null);
    }
  };

  // ============================================
  // LOADING
  // ============================================

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

        <div className="h-[450px] bg-gray-200 rounded-xl" />

      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <FaUsers className="text-xl" />
          </div>

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Authors
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your book authors
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaUserPlus />
          Add Author
        </button>

      </div>

      {/* ========================================
          SUCCESS
      ======================================== */}

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

      {/* ========================================
          ERROR
      ======================================== */}

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

      {/* ========================================
          STATISTICS
      ======================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <StatCard
          title="Total Authors"
          value={totalAuthors}
          icon={<FaUsers />}
          type="blue"
        />

        <StatCard
          title="Active Authors"
          value={activeAuthors}
          icon={<FaCheckCircle />}
          type="green"
        />

        <StatCard
          title="Inactive Authors"
          value={inactiveAuthors}
          icon={<FaTimes />}
          type="red"
        />

      </div>

      {/* ========================================
          SEARCH
      ======================================== */}

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
              placeholder="Search authors..."
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

            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

          <button
            type="button"
            onClick={loadAuthors}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-gray-50"
          >
            <FaSyncAlt />
            Refresh
          </button>

        </div>

      </div>

      {/* ========================================
          NO AUTHORS
      ======================================== */}

      {authors.length === 0 ? (

        <EmptyState
          title="No Authors Found"
          description="Create your first book author."
          onClick={openCreateModal}
        />

      ) : filteredAuthors.length === 0 ? (

        <EmptyState
          title="No Matching Authors"
          description="Try another search or status filter."
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
          }}
          buttonText="Clear Filters"
        />

      ) : (

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

          {/* ======================================
              TABLE HEADER
          ====================================== */}

          <div className="p-5 border-b">

            <h2 className="text-lg font-semibold text-gray-800">
              Author List
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredAuthors.length} authors
            </p>

          </div>

          {/* ======================================
              DESKTOP TABLE
          ====================================== */}

          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">

                  <th className="px-5 py-4">
                    #
                  </th>

                  <th className="px-5 py-4">
                    Author
                  </th>

                  <th className="px-5 py-4">
                    Email
                  </th>

                  <th className="px-5 py-4">
                    Country
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

                {filteredAuthors.map(
                  (author, index) => {

                    const id =
                      getAuthorId(
                        author
                      );

                    const active =
                      isActive(
                        author
                      );

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

                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                              <FaUserEdit />
                            </div>

                            <div>

                              <p className="font-semibold text-gray-800">
                                {getAuthorName(
                                  author
                                )}
                              </p>

                              <p className="text-xs text-gray-400 max-w-xs truncate">
                                {getBio(
                                  author
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {getEmail(
                            author
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {getCountry(
                            author
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
                                author
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
                                  author
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
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
                                  author
                                )
                              }
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center disabled:opacity-50"
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

          {/* ======================================
              MOBILE CARDS
          ====================================== */}

          <div className="md:hidden divide-y">

            {filteredAuthors.map(
              (author) => {

                const id =
                  getAuthorId(
                    author
                  );

                const active =
                  isActive(
                    author
                  );

                return (

                  <div
                    key={id}
                    className="p-4"
                  >

                    <div className="flex gap-3">

                      <div className="w-11 h-11 shrink-0 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                        <FaUserEdit />
                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-gray-800">
                          {getAuthorName(
                            author
                          )}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1 break-all">
                          {getEmail(
                            author
                          )}
                        </p>

                        <p className="text-sm text-gray-500">
                          {getCountry(
                            author
                          )}
                        </p>

                      </div>

                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                      {getBio(
                        author
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-4">

                      <button
                        type="button"
                        disabled={
                          statusLoading === id
                        }
                        onClick={() =>
                          handleStatusToggle(
                            author
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

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              author
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
                              author
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

      {/* ========================================
          CREATE / EDIT MODAL
      ======================================== */}

      {modalOpen && (

        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="p-5 border-b flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-800">

                  {editingAuthor
                    ? "Edit Author"
                    : "Add Author"}

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  {editingAuthor
                    ? "Update author information"
                    : "Create a new book author"}

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

                    Author Name
                    <span className="text-red-500">
                      {" "}*
                    </span>

                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Enter author name"
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

                {/* Email */}

                <div>

                  <label className="block font-medium text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="author@example.com"
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />

                  {formErrors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}

                </div>

                {/* Country */}

                <div>

                  <label className="block font-medium text-gray-700 mb-2">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={
                      formData.country
                    }
                    onChange={handleChange}
                    placeholder="India"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

                {/* Bio */}

                <div>

                  <label className="block font-medium text-gray-700 mb-2">
                    Biography
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    maxLength={1000}
                    placeholder="Write author biography..."
                    className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none ${formErrors.bio
                      ? "border-red-500"
                      : "border-gray-300"
                      }`}
                  />

                  <div className="flex justify-between mt-1">

                    {formErrors.bio ? (
                      <p className="text-sm text-red-500">
                        {formErrors.bio}
                      </p>
                    ) : (
                      <span />
                    )}

                    <span className="text-xs text-gray-400">
                      {formData.bio.length}/1000
                    </span>

                  </div>

                </div>

                {/* Status */}

                <div>

                  <label className="block font-medium text-gray-700 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
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

              {/* Footer */}

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

                      {editingAuthor
                        ? "Update Author"
                        : "Create Author"}
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

// ==================================================
// STAT CARD
// ==================================================

const StatCard = ({
  title,
  value,
  icon,
  type,
}) => {

  const colors = {
    blue:
      "bg-blue-100 text-blue-600",

    green:
      "bg-green-100 text-green-600",

    red:
      "bg-red-100 text-red-600",
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
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[type]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

// ==================================================
// EMPTY STATE
// ==================================================

const EmptyState = ({
  title,
  description,
  onClick,
  buttonText = "Add Author",
}) => {

  return (
    <div className="bg-white border rounded-xl p-10 text-center">

      <FaUsers className="mx-auto text-5xl text-gray-300" />

      <h2 className="text-xl font-bold text-gray-800 mt-4">
        {title}
      </h2>

      <p className="text-gray-500 mt-2">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <FaUserPlus />
        {buttonText}
      </button>

    </div>
  );
};

export default Authors;