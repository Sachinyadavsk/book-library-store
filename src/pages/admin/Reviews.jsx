
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaStar,
  FaSearch,
  FaEye,
  FaTrash,
  FaTimes,
  FaSyncAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaBook,
  FaRegStar,
} from "react-icons/fa";
import reviewService from "../../services/reviewService";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("all");
  const [status, setStatus] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedReview, setSelectedReview] =
    useState(null);

  const [showViewModal, setShowViewModal] =
    useState(false);

  // ============================================================
  // LOAD REVIEWS
  // ============================================================

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await reviewService.getReviews();

      const data =
        response?.reviews ||
        response?.data?.reviews ||
        response?.data ||
        response ||
        [];

      setReviews(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Reviews error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const getReviewId = (review) =>
    review?._id ||
    review?.id ||
    review?.reviewId;

  const getUserName = (review) =>
    review?.user?.name ||
    review?.user?.fullName ||
    review?.member?.name ||
    review?.member?.fullName ||
    review?.userName ||
    review?.name ||
    "Anonymous";

  const getUserEmail = (review) =>
    review?.user?.email ||
    review?.member?.email ||
    review?.email ||
    "-";

  const getBookName = (review) =>
    review?.book?.title ||
    review?.book?.name ||
    review?.bookTitle ||
    review?.title ||
    "Unknown Book";

  const getReviewText = (review) =>
    review?.comment ||
    review?.review ||
    review?.message ||
    review?.content ||
    "";

  const getRating = (review) =>
    Number(
      review?.rating ||
      review?.stars ||
      review?.score ||
      0
    );

  const getStatus = (review) =>
    String(
      review?.status ||
      (review?.isApproved === false
        ? "pending"
        : review?.isApproved === true
          ? "approved"
          : "approved")
    ).toLowerCase();

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

  // ============================================================
  // FILTER
  // ============================================================

  const filteredReviews = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return reviews.filter((review) => {
      const user =
        getUserName(review).toLowerCase();

      const email =
        getUserEmail(review).toLowerCase();

      const book =
        getBookName(review).toLowerCase();

      const text =
        getReviewText(review).toLowerCase();

      const reviewRating =
        getRating(review);

      const reviewStatus =
        getStatus(review);

      const searchMatch =
        !query ||
        user.includes(query) ||
        email.includes(query) ||
        book.includes(query) ||
        text.includes(query);

      const ratingMatch =
        rating === "all" ||
        reviewRating === Number(rating);

      const statusMatch =
        status === "all" ||
        reviewStatus === status;

      return (
        searchMatch &&
        ratingMatch &&
        statusMatch
      );
    });
  }, [
    reviews,
    search,
    rating,
    status,
  ]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalReviews = reviews.length;

  const approvedReviews = reviews.filter(
    (review) =>
      getStatus(review) === "approved"
  ).length;

  const pendingReviews = reviews.filter(
    (review) =>
      getStatus(review) === "pending"
  ).length;

  const averageRating =
    totalReviews > 0
      ? (
        reviews.reduce(
          (sum, review) =>
            sum + getRating(review),
          0
        ) / totalReviews
      ).toFixed(1)
      : "0.0";

  // ============================================================
  // VIEW REVIEW
  // ============================================================

  const handleView = (review) => {
    setSelectedReview(review);
    setShowViewModal(true);
  };

  // ============================================================
  // DELETE REVIEW
  // ============================================================

  const handleDelete = async (review) => {
    const id = getReviewId(review);

    if (!id) {
      setError(
        "Review ID not found."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete review by ${getUserName(
          review
        )
        }?`
      );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await reviewService.deleteReview(
        id
      );

      setReviews((prev) =>
        prev.filter(
          (item) =>
            getReviewId(item) !== id
        )
      );

      setSuccess(
        "Review deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete review error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete review."
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
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />

            <div className="h-4 w-60 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>

          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-28 bg-gray-200 rounded-xl animate-pulse"
              />
            )
          )}

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

          <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
            <FaStar className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Reviews
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage customer book reviews
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={fetchReviews}
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
            onClick={() =>
              setSuccess("")
            }
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
            onClick={() =>
              setError("")
            }
          >
            <FaTimes />
          </button>

        </div>
      )}

      {/* STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Reviews"
          value={totalReviews}
          icon={<FaStar />}
          bg="bg-blue-100"
          text="text-blue-600"
        />

        <StatCard
          title="Average Rating"
          value={`${averageRating} / 5`}
          icon={< FaStar />}
          bg="bg-yellow-100"
          text="text-yellow-600"
        />

        <StatCard
          title="Approved"
          value={approvedReviews}
          icon={<FaCheckCircle />}
          bg="bg-green-100"
          text="text-green-600"
        />

        <StatCard
          title="Pending"
          value={pendingReviews}
          icon={<FaClockIcon />}
          bg="bg-orange-100"
          text="text-orange-600"
        />

      </div >

      {/* SEARCH + FILTER */}

      < div className="bg-white border rounded-xl shadow-sm p-4" >

        <div className="flex flex-col lg:flex-row gap-3">

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
              placeholder="Search book, reviewer or review..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={rating}
            onChange={(e) =>
              setRating(
                e.target.value
              )
            }
            className="lg:w-44 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Ratings
            </option>

            <option value="5">
              ★★★★★ 5 Stars
            </option>

            <option value="4">
              ★★★★ 4 Stars
            </option>

            <option value="3">
              ★★★ 3 Stars
            </option>

            <option value="2">
              ★★ 2 Stars
            </option>

            <option value="1">
              ★ 1 Star
            </option>
          </select>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="lg:w-44 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="rejected">
              Rejected
            </option>
          </select>

          <button
            type="button"
            onClick={fetchReviews}
            className="px-4 py-2.5 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <FaSyncAlt />
            Refresh
          </button>

        </div>

      </div >

      {/* TABLE */}

      < div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden" >

        <div className="p-4 sm:p-5 border-b">

          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            All Reviews
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {filteredReviews.length} reviews found
          </p>

        </div>

        {
          filteredReviews.length === 0 ? (
            <EmptyReviews />
          ) : (

            <div className="w-full overflow-x-auto">

              <table className="w-full min-w-[850px] table-auto">

                <thead>
                  <tr className="bg-gray-50 border-b">

                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      #
                    </th>

                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Book
                    </th>

                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Reviewer
                    </th>

                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Rating
                    </th>

                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Review
                    </th>

                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-4 sm:px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Date
                    </th>

                    <th className="px-4 sm:px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {filteredReviews.map(
                    (
                      review,
                      index
                    ) => (

                      <tr
                        key={
                          getReviewId(
                            review
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

                              <p className="font-semibold text-sm text-gray-800 truncate max-w-[180px]">
                                {getBookName(
                                  review
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* REVIEWER */}

                        <td className="px-4 sm:px-5 py-4">

                          <div className="flex items-center gap-2">

                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
                              <FaUser className="text-xs" />
                            </div>

                            <div>

                              <p className="font-medium text-sm text-gray-800">
                                {getUserName(
                                  review
                                )}
                              </p>

                              <p className="text-xs text-gray-500">
                                {getUserEmail(
                                  review
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* RATING */}

                        <td className="px-4 sm:px-5 py-4">

                          <RatingStars
                            rating={getRating(
                              review
                            )}
                          />

                        </td>

                        {/* REVIEW */}

                        <td className="px-4 sm:px-5 py-4">

                          <p className="text-sm text-gray-600 max-w-[250px] truncate">
                            {getReviewText(
                              review
                            ) ||
                              "No review text"}
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-4 sm:px-5 py-4">

                          <StatusBadge
                            status={getStatus(
                              review
                            )}
                          />

                        </td>

                        {/* DATE */}

                        <td className="px-4 sm:px-5 py-4 text-sm text-gray-500 whitespace-nowrap">

                          {formatDate(
                            review?.createdAt ||
                            review?.date
                          )}

                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 sm:px-5 py-4">

                          <div className="flex justify-end items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleView(
                                  review
                                )
                              }
                              title="View"
                              className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition"
                            >
                              <FaEye />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  review
                                )
                              }
                              title="Delete"
                              className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )
        }

      </div >

      {/* ======================================================
                VIEW REVIEW MODAL
            ====================================================== */}

      {
        showViewModal &&
        selectedReview && (
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

              {/* HEADER */}

              <div className="p-5 border-b flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Review Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    #
                    {String(
                      getReviewId(
                        selectedReview
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

              {/* BODY */}

              <div className="p-6">

                <div className="flex flex-col items-center">

                  <div className="w-20 h-20 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                    <FaStar className="text-3xl" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mt-3 text-center">
                    {getBookName(
                      selectedReview
                    )}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Reviewed by{" "}
                    {getUserName(
                      selectedReview
                    )}
                  </p>

                  <div className="mt-3">
                    <RatingStars
                      rating={getRating(
                        selectedReview
                      )}
                      large
                    />
                  </div>

                </div>

                {/* REVIEW TEXT */}

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">

                  <p className="text-sm text-gray-700 leading-6">
                    {getReviewText(
                      selectedReview
                    ) ||
                      "No review text provided."}
                  </p>

                </div>

                {/* DETAILS */}

                <div className="mt-5">

                  <InfoRow
                    label="Reviewer"
                    value={getUserName(
                      selectedReview
                    )}
                  />

                  <InfoRow
                    label="Email"
                    value={getUserEmail(
                      selectedReview
                    )}
                  />

                  <InfoRow
                    label="Book"
                    value={getBookName(
                      selectedReview
                    )}
                  />

                  <InfoRow
                    label="Rating"
                    value={`${getRating(
                      selectedReview
                    )} / 5`}
                  />

                  <InfoRow
                    label="Status"
                    value={getStatus(
                      selectedReview
                    )}
                  />

                  <InfoRow
                    label="Date"
                    value={formatDate(
                      selectedReview?.createdAt ||
                      selectedReview?.date
                    )}
                  />

                  <InfoRow
                    label="Review ID"
                    value={
                      getReviewId(
                        selectedReview
                      ) || "-"
                    }
                  />

                </div>

              </div>

            </div>

          </div>
        )
      }

    </div >
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
// RATING STARS
// ============================================================

const RatingStars = ({
  rating = 0,
  large = false,
}) => {

  const value = Math.max(
    0,
    Math.min(5, Number(rating))
  );

  return (
    <div
      className={`flex items-center gap-0.5 ${large ? "text-xl" : "text-sm"
        }`}
    >

      {[1, 2, 3, 4, 5].map(
        (star) => (
          <span key={star}>
            {star <= value ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </span>
        )
      )}

    </div>
  );
};

// ============================================================
// STATUS BADGE
// ============================================================

const StatusBadge = ({ status }) => {

  const styles = {
    approved:
      "bg-green-100 text-green-700",

    pending:
      "bg-yellow-100 text-yellow-700",

    rejected:
      "bg-red-100 text-red-700",
  };

  const labels = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${styles[status] ||
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

const EmptyReviews = () => (
  <div className="py-16 text-center">

    <FaRegStar className="mx-auto text-5xl text-gray-300" />

    <h3 className="text-lg font-semibold text-gray-700 mt-4">
      No reviews found
    </h3>

    <p className="text-sm text-gray-500 mt-1">
      Try changing your search or filters.
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

// ============================================================
// CLOCK ICON
// ============================================================

const FaClockIcon = () => (
  <span className="text-lg">◷</span>
);

export default Reviews;

