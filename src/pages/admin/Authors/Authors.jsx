import React, { useEffect, useMemo, useState } from "react";
import {
  FaUsers, FaUserPlus, FaSearch, FaEdit, FaTrash, FaEye, FaTimes,
  FaSyncAlt, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaUserShield, FaUser,
} from "react-icons/fa";
import authorService from "../../../services/authorService";
import { Link } from "react-router-dom";

const Authors = () => {
  const [authors, setauthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedauthor, setSelectedauthor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);


  // LOAD authors
  useEffect(() => {
    fetchauthors();
  }, []);

  const fetchauthors = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authorService.getAuthors();
      const authorData =
        response?.authors ||
        response?.data?.authors ||
        response?.data ||
        response ||
        [];

      setauthors(Array.isArray(authorData) ? authorData : []);
    } catch (err) {
      console.error("authors error:", err);
      setError(err?.message || "Failed to load authors.");
    } finally {
      setLoading(false);
    }
  };


  // author HELPERS
  const getAuthorId = (author) => author?._id || author?.id;
  const getAuthorName = (author) => author?.name || author?.fullName || `${author?.firstName || ""} ${author?.lastName || ""}`.trim() || "Unknown author";
  const getAuthorEmail = (author) => author?.email || "-";
  const getAuthorstatus = (author) => {
    if (typeof author?.isActive === "boolean") {
      return author.isActive
        ? "active"
        : "inactive";
    }
    return String(author?.status || "active").toLowerCase();
  };

  const getInitial = (author) =>
    getAuthorName(author).charAt(0).toUpperCase();


  // FILTER
  const filteredauthors = useMemo(() => {
    const query = search.trim().toLowerCase();
    return authors.filter((author) => {
      const name = getAuthorName(author).toLowerCase();
      const email = getAuthorEmail(author).toLowerCase();

      const authorstatus = getAuthorstatus(author);
      const searchMatch = !query || name.includes(query) || email.includes(query);
      const statusMatch = status === "all" || authorstatus === status;

      return (searchMatch && statusMatch);
    });
  }, [authors, search, status,]);


  // STATISTICS
  const totalauthors = authors.length;
  const activeauthors = authors.filter((author) => getAuthorstatus(author) === "active").length;
  const inactiveauthors = authors.filter((author) => getAuthorstatus(author) === "inactive").length;


  // DATE
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString("en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // DELETE
  const handleDelete = async (author) => {
    const id = getAuthorId(author);
    if (!id) return;
    const confirmed = window.confirm(`Delete ${getAuthorName(author)}?`);
    if (!confirmed) return;
    try {
      setError("");
      setSuccess("");
      await authorService.deleteAuthor(id);
      setauthors((prev) => prev.filter((item) => getAuthorId(item) !== id));
      setSuccess("author deleted successfully.");
    } catch (err) {
      setError(err?.message || "Failed to delete author.");
    }
  };


  // VIEW
  const handleView = (author) => {
    setSelectedauthor(author);
    setShowViewModal(true);
  };


  // LOADING
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-60 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaUsers className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">authors</h1>
            <p className="text-sm text-gray-500 mt-1">Manage registered authors</p>
          </div>
        </div>

        <Link
          to="/admin/authors/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaUserPlus />
          Add author
        </Link>
      </div>

      {/* ALERT */}

      {success && (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          <div className="flex items-center gap-2">
            <FaCheckCircle />
            {success}
          </div>
          <button onClick={() => setSuccess("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle />
            {error}
          </div>
          <button onClick={() => setError("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total authors"
          value={totalauthors}
          icon={<FaUsers />}
          bg="bg-blue-100"
          text="text-blue-600"
        />

        <StatCard
          title="Active authors"
          value={activeauthors}
          icon={<FaCheckCircle />}
          bg="bg-green-100"
          text="text-green-600"
        />

        <StatCard
          title="Inactive authors"
          value={inactiveauthors}
          icon={<FaTimes />}
          bg="bg-red-100"
          text="text-red-600"
        />
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white border rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search author name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>



          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="lg:w-44 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
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
            onClick={fetchauthors}
            className="px-4 py-2.5 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>
      </div>

      {/* ======================================================
    RESPONSIVE authors TABLE
====================================================== */}

      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                All authors
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {filteredauthors.length} authors found
              </p>
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {filteredauthors.length === 0 ? (
          <Emptyauthors />
        ) : (

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[650px] table-auto">
              {/* ==================================================
            TABLE HEAD
        ================================================== */}

              <thead>
                <tr className="bg-gray-50 border-b">

                  {/* NUMBER */}

                  <th className="w-14 px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    #
                  </th>

                  {/* author */}

                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    author
                  </th>

                  {/* EMAIL */}

                  <th className="hidden sm:table-cell px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>


                  {/* STATUS */}

                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  {/* JOINED */}

                  <th className="hidden lg:table-cell px-3 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>

                  {/* ACTIONS */}

                  <th className="px-3 sm:px-5 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* ==================================================
            TABLE BODY
        ================================================== */}

              <tbody className="divide-y divide-gray-100">

                {filteredauthors.map((author, index) => {


                  const authorstatus = getAuthorstatus(author);

                  return (
                    <tr
                      key={getAuthorId(author) || index}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* =================================================
                    NUMBER
                ================================================= */}

                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 align-middle">
                        {index + 1}
                      </td>

                      {/* =================================================
                    author
                ================================================= */}

                      <td className="px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">

                          <div className="shrink-0">
                            <AuthorAvatar author={author} />
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-xs sm:text-sm text-gray-800 truncate max-w-[120px] sm:max-w-[180px] lg:max-w-[220px]">
                              {getAuthorName(author)}
                            </p>

                            {/* author ID */}

                            <p className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[120px] sm:max-w-[180px]">
                              #
                              {String(
                                getAuthorId(author) || ""
                              ).slice(-8)}
                            </p>

                            {/* EMAIL ON MOBILE */}

                            <p className="sm:hidden text-[11px] text-gray-500 truncate max-w-[150px] mt-0.5">
                              {getAuthorEmail(author)}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* =================================================
                    EMAIL
                ================================================= */}

                      <td className="hidden sm:table-cell px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[180px] lg:max-w-[250px]">
                          {getAuthorEmail(author)}
                        </p>

                      </td>



                      {/* =================================================
                    STATUS
                ================================================= */}

                      <td className="px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <span
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${authorstatus === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >

                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${authorstatus === "active"
                              ? "bg-green-500"
                              : "bg-red-500"
                              }`}
                          />

                          {authorstatus === "active"
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>

                      {/* =================================================
                    JOINED
                ================================================= */}

                      <td className="hidden lg:table-cell px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 whitespace-nowrap align-middle">

                        {formatDate(
                          author?.createdAt ||
                          author?.joinedAt
                        )}

                      </td>

                      {/* =================================================
                    ACTIONS
                ================================================= */}

                      <td className="px-3 sm:px-5 py-3 sm:py-4 align-middle">

                        <div className="flex justify-end items-center gap-1.5 sm:gap-2">

                          {/* VIEW */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(author)
                            }
                            title="View"
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition"
                          >
                            <FaEye className="text-xs sm:text-sm" />
                          </button>

                          {/* EDIT */}

                          <Link
                            to={`/admin/authors/edit/${getAuthorId(author)}`}
                            title="Edit"
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 active:bg-blue-200 flex items-center justify-center transition"
                          >
                            <FaEdit className="text-xs sm:text-sm" />
                          </Link>

                          {/* DELETE */}

                          <button type="button" onClick={() => handleDelete(author)}
                            title="Delete"
                            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 flex items-center justify-center transition"
                          >
                            <FaTrash className="text-xs sm:text-sm" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* VIEW author MODAL */}
      {showViewModal &&
        selectedauthor && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="p-5 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">author Details</h2>
                <button onClick={() => setShowViewModal(false)}
                  className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6">
                <div className="flex flex-col items-center">
                  <AuthorAvatar author={selectedauthor} large />
                  <h3 className="text-xl font-bold text-gray-800 mt-3">
                    {getAuthorName(selectedauthor)}
                  </h3>
                  <p className="text-gray-500">
                    {getAuthorEmail(selectedauthor)}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <InfoRow label="Status" value={getAuthorstatus(selectedauthor)} />
                  <InfoRow label="Joined" value={formatDate(selectedauthor?.createdAt)} />
                  <InfoRow label="author ID" value={getAuthorId(selectedauthor) || "-"} />
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};


// STAT CARD
const StatCard = ({ title, value, icon, bg, text, }) => (
  <div className="bg-white border rounded-xl shadow-sm p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl ${bg} ${text} flex items-center justify-center`}>{icon}</div>
    </div>
  </div>
);


// author AVATAR
const AuthorAvatar = ({ author, large = false, }) => {
  const image = author?.avatar || author?.profileImage || author?.image || author?.photo;
  const initial = getauthorInitial(author);
  return image ? (
    <img
      src={image}
      alt={getAuthorName(author)}
      className={`${large
        ? "w-20 h-20"
        : "w-10 h-10"
        } rounded-full object-cover border border-gray-200`}
      onError={(e) => {
        e.currentTarget.style.display =
          "none";
      }}
    />
  ) : (
    <div
      className={`${large
        ? "w-20 h-20 text-2xl"
        : "w-10 h-10"
        } rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0`}
    >
      {initial}
    </div>
  );
};





// INITIAL
const getauthorInitial = (author) => {
  const name = author?.name || author?.fullName || author?.firstName || "author";
  return name.charAt(0).toUpperCase();
};


// EMPTY
const Emptyauthors = () => (
  <div className="py-16 text-center">
    <FaUsers className="mx-auto text-5xl text-gray-300" />
    <h3 className="text-lg font-semibold text-gray-700 mt-4">
      No authors found
    </h3>
    <p className="text-sm text-gray-500 mt-1">
      Try changing your search or filters.
    </p>
  </div>
);


// INFO ROW
const InfoRow = ({ label, value, }) => (
  <div className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
    <span className="text-sm text-gray-500">
      {label}
    </span>
    <span className="text-sm font-medium text-gray-800 text-right break-all">
      {value}
    </span>
  </div>
);

export default Authors;