
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaChartBar,
  FaBook,
  FaUsers,
  FaBookReader,
  FaStar,
  FaSyncAlt,
  FaDownload,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

import reportService from "../../services/reportService";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("30");

  // ============================================================
  // LOAD REPORT
  // ============================================================

  useEffect(() => {
    fetchReports();
  }, [period]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await reportService.getReports({
          days: period,
        });

      const reportData =
        response?.reports ||
        response?.data?.reports ||
        response?.data ||
        [];

      const summaryData =
        response?.summary ||
        response?.data?.summary ||
        null;

      setReports(
        Array.isArray(reportData)
          ? reportData
          : []
      );

      setSummary(summaryData);
    } catch (err) {
      console.error(
        "Reports error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HELPERS
  // ============================================================

  const numberValue = (...values) => {
    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        const number = Number(value);

        if (!Number.isNaN(number)) {
          return number;
        }
      }
    }

    return 0;
  };

  const getBookName = (item) =>
    item?.book?.title ||
    item?.book?.name ||
    item?.bookTitle ||
    item?.title ||
    "Unknown Book";

  const getCategory = (item) =>
    item?.category?.name ||
    item?.category ||
    item?.book?.category?.name ||
    "General";

  const getBorrowed = (item) =>
    numberValue(
      item?.borrowed,
      item?.borrowCount,
      item?.borrowings,
      item?.totalBorrowed
    );

  const getReturned = (item) =>
    numberValue(
      item?.returned,
      item?.returnCount,
      item?.totalReturned
    );

  const getOverdue = (item) =>
    numberValue(
      item?.overdue,
      item?.overdueCount,
      item?.totalOverdue
    );

  const getViews = (item) =>
    numberValue(
      item?.views,
      item?.viewCount,
      item?.totalViews
    );

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(
      numberValue(value)
    );

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
  // CALCULATED SUMMARY
  // ============================================================

  const calculatedSummary = useMemo(() => {
    return {
      totalBorrowed: reports.reduce(
        (sum, item) =>
          sum + getBorrowed(item),
        0
      ),

      totalReturned: reports.reduce(
        (sum, item) =>
          sum + getReturned(item),
        0
      ),

      totalOverdue: reports.reduce(
        (sum, item) =>
          sum + getOverdue(item),
        0
      ),

      totalViews: reports.reduce(
        (sum, item) =>
          sum + getViews(item),
        0
      ),
    };
  }, [reports]);

  const totalBooks = numberValue(
    summary?.totalBooks,
    summary?.books,
    summary?.bookCount
  );

  const totalUsers = numberValue(
    summary?.totalUsers,
    summary?.users,
    summary?.userCount,
    summary?.members
  );

  const totalBorrowed = numberValue(
    summary?.totalBorrowed,
    summary?.borrowedBooks,
    calculatedSummary.totalBorrowed
  );

  const totalReturned = numberValue(
    summary?.totalReturned,
    summary?.returnedBooks,
    calculatedSummary.totalReturned
  );

  const totalOverdue = numberValue(
    summary?.totalOverdue,
    summary?.overdueBooks,
    calculatedSummary.totalOverdue
  );

  const totalReviews = numberValue(
    summary?.totalReviews,
    summary?.reviews,
    summary?.reviewCount
  );

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredReports = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return reports;
    }

    return reports.filter((item) => {
      const book =
        getBookName(item).toLowerCase();

      const category =
        getCategory(item).toLowerCase();

      return (
        book.includes(query) ||
        category.includes(query)
      );
    });
  }, [reports, search]);

  // ============================================================
  // EXPORT CSV
  // ============================================================

  const exportCSV = () => {
    if (!filteredReports.length) {
      return;
    }

    const headers = [
      "Book",
      "Category",
      "Borrowed",
      "Returned",
      "Overdue",
      "Views",
    ];

    const rows = filteredReports.map(
      (item) => [
        getBookName(item),
        getCategory(item),
        getBorrowed(item),
        getReturned(item),
        getOverdue(item),
        getViews(item),
      ]
    );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              / "/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = `library-report-${period}-days.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
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

            <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse" />
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

        <div className="h-72 bg-gray-200 rounded-xl animate-pulse" />

        <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />

      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ==================================================
                HEADER
            ================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaChartBar className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Reports
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Library activity and performance reports
            </p>
          </div>

        </div>

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={fetchReports}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <FaSyncAlt />
            Refresh
          </button>

          <button
            type="button"
            onClick={exportCSV}
            disabled={!filteredReports.length}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FaDownload />
            Export CSV
          </button>

        </div>

      </div>

      {/* ==================================================
                ERROR
            ================================================== */}

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

      {/* ==================================================
                FILTERS
            ================================================== */}

      <div className="bg-white border rounded-xl shadow-sm p-4">

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
              placeholder="Search book or category..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={period}
            onChange={(e) =>
              setPeriod(
                e.target.value
              )
            }
            className="lg:w-48 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">
              Last 7 Days
            </option>

            <option value="30">
              Last 30 Days
            </option>

            <option value="90">
              Last 90 Days
            </option>

            <option value="180">
              Last 6 Months
            </option>

            <option value="365">
              Last 1 Year
            </option>
          </select>

        </div>

      </div>

      {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={<FaBook />}
          bg="bg-blue-100"
          text="text-blue-600"
        />

        <StatCard
          title="Total Members"
          value={totalUsers}
          icon={<FaUsers />}
          bg="bg-purple-100"
          text="text-purple-600"
        />

        <StatCard
          title="Books Borrowed"
          value={totalBorrowed}
          icon={<FaBookReader />}
          bg="bg-orange-100"
          text="text-orange-600"
        />

        <StatCard
          title="Reviews"
          value={totalReviews}
          icon={<FaStar />}
          bg="bg-yellow-100"
          text="text-yellow-600"
        />

      </div>

      {/* ==================================================
                ACTIVITY OVERVIEW
            ================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <MetricCard
          title="Borrowed"
          value={totalBorrowed}
          icon={<FaArrowUp />}
          description={`Last ${period} days`}
        />

        <MetricCard
          title="Returned"
          value={totalReturned}
          icon={<FaArrowDown />}
          description={`Last ${period} days`}
        />

        <MetricCard
          title="Overdue"
          value={totalOverdue}
          icon={<FaExclamationTriangle />}
          description="Requires attention"
          danger
        />

      </div>

      {/* ==================================================
                REPORT TABLE
            ================================================== */}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-4 sm:p-5 border-b">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Book Performance
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredReports.length} records found
              </p>
            </div>

            <span className="text-xs text-gray-500">
              Last {period} days
            </span>

          </div>

        </div>

        {filteredReports.length === 0 ? (
          <EmptyReports />
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="bg-gray-50 border-b">

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    #
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Book
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Borrowed
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Returned
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Overdue
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Views
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredReports.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        item?._id ||
                        item?.id ||
                        index
                      }
                      className="hover:bg-gray-50 transition"
                    >

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FaBook />
                          </div>

                          <span className="font-medium text-sm text-gray-800">
                            {getBookName(
                              item
                            )}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {getCategory(
                          item
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">

                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                          {formatNumber(
                            getBorrowed(
                              item
                            )
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-center">

                        <span className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                          {formatNumber(
                            getReturned(
                              item
                            )
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-center">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getOverdue(
                            item
                          ) > 0
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {formatNumber(
                            getOverdue(
                              item
                            )
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-center text-sm text-gray-600">
                        {formatNumber(
                          getViews(
                            item
                          )
                        )}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ==================================================
                REPORT INFORMATION
            ================================================== */}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

        <div className="flex gap-3">

          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <FaChartBar />
          </div>

          <div>

            <h3 className="font-semibold text-blue-900">
              Report Period
            </h3>

            <p className="text-sm text-blue-700 mt-1">
              This report displays library
              activity for the selected
              period of the last{" "}
              <strong>
                {period} days
              </strong>
              .
            </p>

            {summary?.generatedAt && (
              <p className="text-xs text-blue-600 mt-2">
                Generated on{" "}
                {formatDate(
                  summary.generatedAt
                )}
              </p>
            )}

          </div>

        </div>

      </div>

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
// METRIC CARD
// ============================================================

const MetricCard = ({
  title,
  value,
  icon,
  description,
  danger = false,
}) => (
  <div className="bg-white border rounded-xl shadow-sm p-5">

    <div className="flex items-start justify-between">

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <p
          className={`text-3xl font-bold mt-2 ${danger
            ? "text-red-600"
            : "text-gray-800"
            }`}
        >
          {value}
        </p>

        <p className="text-xs text-gray-400 mt-2">
          {description}
        </p>

      </div>

      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${danger
          ? "bg-red-100 text-red-600"
          : "bg-gray-100 text-gray-600"
          }`}
      >
        {icon}
      </div>

    </div>

  </div>
);

// ============================================================
// EMPTY STATE
// ============================================================

const EmptyReports = () => (
  <div className="py-16 text-center">

    <FaChartBar className="mx-auto text-5xl text-gray-300" />

    <h3 className="text-lg font-semibold text-gray-700 mt-4">
      No report data found
    </h3>

    <p className="text-sm text-gray-500 mt-1">
      Try selecting another date range or search.
    </p>

  </div>
);

export default Reports;

