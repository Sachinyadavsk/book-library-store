
import React, { useEffect, useMemo, useState } from "react";
import {
  FaBook,
  FaSearch,
  FaEye,
  FaUndo,
  FaTimes,
  FaSyncAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaBookReader,
  FaUser,
} from "react-icons/fa";
import borrowService from "../../services/borrowService";

const BorrowBooks = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // ============================================================
  // LOAD BORROWINGS
  // ============================================================

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await borrowService.getBorrowings();

      const data =
        response?.borrowings ||
        response?.borrows ||
        response?.data?.borrowings ||
        response?.data?.borrows ||
        response?.data ||
        response ||
        [];

      setBorrowings(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error("Borrow books error:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load borrowed books."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getBorrowId = (borrow) =>
    borrow?._id ||
    borrow?.id ||
    borrow?.borrowId;

  const getBookName = (borrow) =>
    borrow?.book?.title ||
    borrow?.book?.name ||
    borrow?.bookTitle ||
    borrow?.title ||
    "Unknown Book";

  const getBookAuthor = (borrow) =>
    borrow?.book?.author ||
    borrow?.book?.authorName ||
    borrow?.author ||
    "-";

  const getUserName = (borrow) =>
    borrow?.user?.name ||
    borrow?.user?.fullName ||
    borrow?.member?.name ||
    borrow?.member?.fullName ||
    borrow?.userName ||
    borrow?.memberName ||
    "Unknown Member";

  const getUserEmail = (borrow) =>
    borrow?.user?.email ||
    borrow?.member?.email ||
    borrow?.email ||
    "-";

  const getStatus = (borrow) =>
    String(
      borrow?.status ||
      borrow?.borrowStatus ||
      "borrowed"
    ).toLowerCase();

  const getBorrowDate = (borrow) =>
    borrow?.borrowDate ||
    borrow?.issuedAt ||
    borrow?.createdAt;

  const getDueDate = (borrow) =>
    borrow?.dueDate ||
    borrow?.returnDate ||
    borrow?.expectedReturnDate;

  const getReturnDate = (borrow) =>
    borrow?.returnedAt ||
    borrow?.actualReturnDate ||
    borrow?.returnDate;

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "-";
    }

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isOverdue = (borrow) => {
    const statusValue = getStatus(borrow);

    if (
      ["returned", "completed", "cancelled"].includes(
        statusValue
      )
    ) {
      return false;
    }

    const dueDate = getDueDate(borrow);

    if (!dueDate) return false;

    return new Date(dueDate) < new Date();
  };

  // ============================================================
  // SEARCH + FILTER
  // ============================================================

  const filteredBorrowings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return borrowings.filter((borrow) => {
      const book =
        getBookName(borrow).toLowerCase();

      const author =
        getBookAuthor(borrow).toLowerCase();

      const user =
        getUserName(borrow).toLowerCase();

      const email =
        getUserEmail(borrow).toLowerCase();

      let borrowStatus = getStatus(borrow);

      // Automatically treat overdue borrowed books as overdue
      if (
        borrowStatus === "borrowed" &&
        isOverdue(borrow)
      ) {
        borrowStatus = "overdue";
      }

      const searchMatch =
        !query ||
        book.includes(query) ||
        author.includes(query) ||
        user.includes(query) ||
        email.includes(query);

      const statusMatch =
        status === "all" ||
        borrowStatus === status;

      return searchMatch && statusMatch;
    });
  }, [borrowings, search, status]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalBorrowings = borrowings.length;

  const activeBorrowings = borrowings.filter(
    (borrow) =>
      ["borrowed", "issued"].includes(
        getStatus(borrow)
      ) && !isOverdue(borrow)
  ).length;

  const overdueBorrowings = borrowings.filter(
    (borrow) => isOverdue(borrow)
  ).length;

  const returnedBorrowings = borrowings.filter(
    (borrow) =>
      ["returned", "completed"].includes(
        getStatus(borrow)
      )
  ).length;

  // ============================================================
  // VIEW
  // ============================================================

  const handleView = (borrow) => {
    setSelectedBorrow(borrow);
    setShowViewModal(true);
  };

  // ============================================================
  // RETURN BOOK
  // ============================================================

  const handleReturn = async (borrow) => {
    const id = getBorrowId(borrow);

    if (!id) {
      setError("Borrow record ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Mark "${getBookName(
        borrow
      )}" as returned?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await borrowService.returnBook(id);

      setBorrowings((prev) =>
        prev.map((item) =>
          getBorrowId(item) === id
            ? {
              ...item,
              status: "returned",
              returnedAt:
                new Date().toISOString(),
            }
            : item
        )
      );

      setSuccess(
        "Book returned successfully."
      );
    } catch (err) {
      console.error(
        "Return book error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to return book."
      );
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="flex justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse" />
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

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaBookReader className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Borrowed Books
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage borrowed and returned books
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={fetchBorrowings}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          <FaSyncAlt />
          Refresh
        </button>

      </div>

      {/* ALERTS */}

      {success && (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">

          <div className="flex items-center gap-2">
            <FaCheckCircle />
            {success}
          </div>

          <button
            type="button"
            onClick={() => setSuccess("")}
          >
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

          <button
            type="button"
            onClick={() => setError("")}
          >
            <FaTimes />
          </button>

        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Borrowings"
          value={totalBorrowings}
          icon={<FaBook />}
          bg="bg-blue-100"
          text="text-blue-600"
        />

        <StatCard
          title="Currently Borrowed"
          value={activeBorrowings}
          icon={<FaBookReader />}
          bg="bg-purple-100"
          text="text-purple-600"
        />

        <StatCard
          title="Overdue"
          value={overdueBorrowings}
          icon={<FaClock />}
          bg="bg-red-100"
          text="text-red-600"
        />

        <StatCard
          title="Returned"
          value={returnedBorrowings}
          icon={<FaCheckCircle />}
          bg="bg-green-100"
          text="text-green-600"
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
              placeholder="Search book, author, member or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="lg:w-48 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="borrowed">
              Borrowed
            </option>

            <option value="overdue">
              Overdue
            </option>

            <option value="returned">
              Returned
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

          <button
            type="button"
            onClick={fetchBorrowings}
            className="px-4 py-2.5 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FaSyncAlt />
            Refresh
          </button>

        </div>

      </div>

      {/* TABLE */}

      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-4 sm:p-5 border-b">

          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            All Borrowed Books
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {filteredBorrowings.length} records found
          </p>

        </div>

        {filteredBorrowings.length === 0 ? (
          <EmptyBorrowings />
        ) : (

          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[900px] table-auto">

              <thead>
                <tr className="bg-gray-50 border-b">

                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    #
                  </th>

                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Book
                  </th>

                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Member
                  </th>

                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Borrow Date
                  </th>

                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Due Date
                  </th>

                  <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-4 sm:px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredBorrowings.map(
                  (borrow, index) => {

                    let borrowStatus =
                      getStatus(borrow);

                    if (
                      borrowStatus ===
                      "borrowed" &&
                      isOverdue(borrow)
                    ) {
                      borrowStatus =
                        "overdue";
                    }

                    return (
                      <tr
                        key={
                          getBorrowId(
                            borrow
                          ) ||
                          index
                        }
                        className="hover:bg-gray-50 transition"
                      >

                        {/* NUMBER */}

                        <td className="px-4 sm:px-5 py-4 text-sm text-gray-500">
                          {index + 1}
                        </td>

                        {/* BOOK */}

                        <td className="px-4 sm:px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                              <FaBook />
                            </div>

                            <div className="min-w-0">

                              <p className="font-semibold text-sm text-gray-800 truncate max-w-[220px]">
                                {getBookName(
                                  borrow
                                )}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {getBookAuthor(
                                  borrow
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* MEMBER */}

                        <td className="px-4 sm:px-5 py-4">

                          <p className="font-medium text-sm text-gray-800">
                            {getUserName(
                              borrow
                            )}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {getUserEmail(
                              borrow
                            )}
                          </p>

                        </td>

                        {/* BORROW DATE */}

                        <td className="px-4 sm:px-5 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(
                            getBorrowDate(
                              borrow
                            )
                          )}
                        </td>

                        {/* DUE DATE */}

                        <td className="px-4 sm:px-5 py-4 text-sm whitespace-nowrap">

                          <span
                            className={
                              isOverdue(
                                borrow
                              )
                                ? "text-red-600 font-semibold"
                                : "text-gray-500"
                            }
                          >
                            {formatDate(
                              getDueDate(
                                borrow
                              )
                            )}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-4 sm:px-5 py-4">

                          <BorrowStatusBadge
                            status={
                              borrowStatus
                            }
                          />

                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 sm:px-5 py-4">

                          <div className="flex justify-end items-center gap-2">

                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  borrow
                                )
                              }
                              title="View"
                              className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition"
                            >
                              <FaEye />
                            </button>

                            {/* RETURN */}

                            {![
                              "returned",
                              "completed",
                              "cancelled",
                            ].includes(
                              getStatus(
                                borrow
                              )
                            ) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleReturn(
                                      borrow
                                    )
                                  }
                                  title="Return Book"
                                  className="w-9 h-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition"
                                >
                                  <FaUndo />
                                </button>
                              )}

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ======================================================
                VIEW MODAL
            ====================================================== */}

      {showViewModal &&
        selectedBorrow && (
          <div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() =>
              setShowViewModal(false)
            }
          >

            <div
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="p-5 border-b flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Borrow Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    #
                    {String(
                      getBorrowId(
                        selectedBorrow
                      ) || ""
                    ).slice(-8)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowViewModal(
                      false
                    )
                  }
                  className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <FaTimes />
                </button>

              </div>

              {/* MODAL BODY */}

              <div className="p-6">

                <div className="flex flex-col items-center">

                  <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FaBook className="text-3xl" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mt-3 text-center">
                    {getBookName(
                      selectedBorrow
                    )}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {getBookAuthor(
                      selectedBorrow
                    )}
                  </p>

                  <div className="mt-3">

                    <BorrowStatusBadge
                      status={
                        isOverdue(
                          selectedBorrow
                        )
                          ? "overdue"
                          : getStatus(
                            selectedBorrow
                          )
                      }
                    />

                  </div>

                </div>

                <div className="mt-6">

                  <InfoRow
                    label="Member"
                    value={getUserName(
                      selectedBorrow
                    )}
                  />

                  <InfoRow
                    label="Email"
                    value={getUserEmail(
                      selectedBorrow
                    )}
                  />

                  <InfoRow
                    label="Borrow Date"
                    value={formatDate(
                      getBorrowDate(
                        selectedBorrow
                      )
                    )}
                  />

                  <InfoRow
                    label="Due Date"
                    value={formatDate(
                      getDueDate(
                        selectedBorrow
                      )
                    )}
                  />

                  <InfoRow
                    label="Return Date"
                    value={formatDate(
                      getReturnDate(
                        selectedBorrow
                      )
                    )}
                  />

                  <InfoRow
                    label="Status"
                    value={getStatus(
                      selectedBorrow
                    )}
                  />

                  <InfoRow
                    label="Borrow ID"
                    value={
                      getBorrowId(
                        selectedBorrow
                      ) || "-"
                    }
                  />

                </div>

              </div>

            </div>

          </div>
        )}

    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
  title,
  value,
  icon,
  bg,
  text,
}) => (
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
        className={`w-11 h-11 rounded-xl ${bg} ${text} flex items-center justify-center`}
      >
        {icon}
      </div>

    </div>

  </div>
);

// ============================================================
// STATUS BADGE
// ============================================================

const BorrowStatusBadge = ({ status }) => {

  const styles = {
    borrowed:
      "bg-blue-100 text-blue-700",

    issued:
      "bg-blue-100 text-blue-700",

    overdue:
      "bg-red-100 text-red-700",

    returned:
      "bg-green-100 text-green-700",

    completed:
      "bg-green-100 text-green-700",

    cancelled:
      "bg-gray-100 text-gray-700",
  };

  const labels = {
    borrowed: "Borrowed",
    issued: "Issued",
    overdue: "Overdue",
    returned: "Returned",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] ||
        "bg-gray-100 text-gray-700"
        }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />

      {labels[status] ||
        status.charAt(0).toUpperCase() +
        status.slice(1)}
    </span>
  );
};

// ============================================================
// EMPTY
// ============================================================

const EmptyBorrowings = () => (
  <div className="py-16 text-center">

    <FaBookReader className="mx-auto text-5xl text-gray-300" />

    <h3 className="text-lg font-semibold text-gray-700 mt-4">
      No borrowed books found
    </h3>

    <p className="text-sm text-gray-500 mt-1">
      Try changing your search or status filter.
    </p>

  </div>
);

// ============================================================
// INFO ROW
// ============================================================

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">

    <span className="text-sm text-gray-500">
      {label}
    </span>

    <span className="text-sm font-medium text-gray-800 text-right break-all">
      {value}
    </span>

  </div>
);

export default BorrowBooks;

