import React, { useEffect, useMemo, useState } from "react";
import {
  FaBook,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaSyncAlt,
  FaFilter,
  FaExclamationTriangle,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaBoxOpen,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import bookService from "../../../services/bookService";

const Books = () => {
 
  // STATE
 

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

 
  // GET BOOK ID
  const getBookId = (book) => {
    return book?._id || book?.id;
  };

 
  // GET BOOK TITLE
  const getBookTitle = (book) => {
    return (
      book?.title ||
      book?.name ||
      book?.bookName ||
      "Untitled Book"
    );
  };

 
  // GET AUTHOR
  const getAuthor = (book) => {
    if (typeof book?.author === "string") {
      return book.author;
    }

    return (
      book?.author?.name ||
      book?.author?.fullName ||
      book?.authorName ||
      "Unknown Author"
    );
  };

 
  // GET CATEGORY
  const getCategory = (book) => {
    if (typeof book?.category === "string") {
      return book.category;
    }

    return (
      book?.category?.name ||
      book?.category?.title ||
      book?.categoryName ||
      "Uncategorized"
    );
  };

 
  // GET PRICE
  const getPrice = (book) => {
    return Number(
      book?.price ??
      book?.salePrice ??
      book?.sellingPrice ??
      0
    );
  };

 
  // GET STOCK
  const getStock = (book) => {
    return Number(
      book?.stock ??
      book?.quantity ??
      book?.availableCopies ??
      book?.copies ??
      0
    );
  };

 
  // GET IMAGE
  const getImage = (book) => {
    return (
      book?.image ||
      book?.coverImage ||
      book?.thumbnail ||
      book?.imageUrl ||
      ""
    );
  };

 
  // FORMAT PRICE
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

 
  // NORMALIZE API RESPONSE
  const normalizeBooks = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.books)) {
      return response.books;
    }

    if (Array.isArray(response?.data?.books)) {
      return response.data.books;
    }

    return [];
  };

 
  // LOAD BOOKS
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await bookService.getBooks();
      const bookData = normalizeBooks(response);
      setBooks(bookData);
    } catch (err) {
      console.error("Get Books Error:", err);
      setError(
        err?.message ||
        "Unable to load books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

 
  // INITIAL API CALL
  useEffect(() => {
    loadBooks();
  }, []);

 
  // DELETE BOOK
  const handleDelete = async (book) => {
    const id = getBookId(book);
    if (!id) {
      alert("Book ID is missing.");
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${getBookTitle(book)}"?`
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(id);
      await bookService.deleteBook(id);
      setBooks((previous) =>
        previous.filter(
          (item) => getBookId(item) !== id
        )
      );
      if (selectedBook) {
        setSelectedBook(null);
      }
    } catch (err) {
      console.error("Delete Book Error:", err);
      alert(
        err?.message ||
        "Unable to delete the book."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

 
  // SEARCH + FILTER
  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) => {
      const title = getBookTitle(book).toLowerCase();
      const author = getAuthor(book).toLowerCase();
      const category = getCategory(book).toLowerCase();
      const matchesSearch =
        !query ||
        title.includes(query) ||
        author.includes(query) ||
        category.includes(query);

      const matchesCategory =
        categoryFilter === "all" ||
        category === categoryFilter.toLowerCase();
      const stock = getStock(book);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "available" && stock > 5) ||
        (stockFilter === "low" &&
          stock > 0 &&
          stock <= 5) ||
        (stockFilter === "out" && stock <= 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock
      );
    });
  }, [
    books,
    search,
    categoryFilter,
    stockFilter,
  ]);

 
  // CATEGORY LIST
  const categories = useMemo(() => {
    const categoryList = books
      .map((book) => getCategory(book))
      .filter(
        (category) =>
          category &&
          category !== "Uncategorized"
      );

    return [...new Set(categoryList)];
  }, [books]);

 
  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBooks.length / itemsPerPage
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) * itemsPerPage;

  const paginatedBooks =
    filteredBooks.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    categoryFilter,
    stockFilter,
  ]);

 
  // STATISTICS
  const availableBooks = books.filter(
    (book) => getStock(book) > 5
  ).length;

  const lowStockBooks = books.filter(
    (book) =>
      getStock(book) > 0 &&
      getStock(book) <= 5
  ).length;

  const outOfStockBooks = books.filter(
    (book) => getStock(book) <= 0
  ).length;

 
  // LOADING
 

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
          </div>

          <div className="h-10 w-28 bg-gray-200 rounded-lg" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 bg-gray-200 rounded-xl"
            />
          ))}
        </div>

        <div className="h-16 bg-gray-200 rounded-xl" />

        <div className="h-[500px] bg-gray-200 rounded-xl" />
      </div>
    );
  }

 
  // ERROR
 

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">

        <div className="bg-white rounded-xl shadow p-8 text-center max-w-md w-full">

          <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <FaExclamationTriangle className="text-2xl" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mt-4">
            Unable to Load Books
          </h2>

          <p className="text-gray-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={loadBooks}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaSyncAlt />
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ============================================
          HEADER
      ============================================ */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <FaBook className="text-xl" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Books
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your bookstore books
            </p>
          </div>

        </div>

        <Link
          to="/admin/books/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus />
          Add Book
        </Link>

      </div>

      {/* ============================================
          STAT CARDS
      ============================================ */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Books"
          value={books.length}
          icon={<FaBook />}
          color="blue"
        />

        <StatCard
          title="Available"
          value={availableBooks}
          icon={<FaBoxOpen />}
          color="green"
        />

        <StatCard
          title="Low Stock"
          value={lowStockBooks}
          icon={<FaBoxOpen />}
          color="orange"
        />

        <StatCard
          title="Out of Stock"
          value={outOfStockBooks}
          icon={<FaBoxOpen />}
          color="red"
        />

      </div>

      {/* ============================================
          SEARCH / FILTER
      ============================================ */}

      <div className="bg-white rounded-xl shadow-sm border p-4">

        <div className="flex flex-col lg:flex-row gap-3">

          <div className="relative flex-1">

            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search books, authors..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div className="relative">

            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
              className="w-full lg:w-52 pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

          </div>

          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(e.target.value)
            }
            className="w-full lg:w-44 px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Stock
            </option>

            <option value="available">
              Available
            </option>

            <option value="low">
              Low Stock
            </option>

            <option value="out">
              Out of Stock
            </option>
          </select>

          <button
            type="button"
            onClick={loadBooks}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-gray-50"
          >
            <FaSyncAlt />
            Refresh
          </button>

        </div>

      </div>

      {/* ============================================
          EMPTY STATE
      ============================================ */}

      {books.length === 0 ? (
        <EmptyState />
      ) : filteredBooks.length === 0 ? (
        <NoResults
          onClear={() => {
            setSearch("");
            setCategoryFilter("all");
            setStockFilter("all");
          }}
        />
      ) : (
        <>

          {/* ==========================================
              DESKTOP TABLE
          ========================================== */}

          <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">

            <div className="p-5 border-b">

              <h2 className="text-lg font-semibold text-gray-800">
                Book Collection
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Showing {startIndex + 1}-
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredBooks.length
                )}{" "}
                of {filteredBooks.length}
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">

                    <th className="px-5 py-4">
                      Book
                    </th>

                    <th className="px-5 py-4">
                      Author
                    </th>

                    <th className="px-5 py-4">
                      Category
                    </th>

                    <th className="px-5 py-4">
                      Price
                    </th>

                    <th className="px-5 py-4">
                      Stock
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

                  {paginatedBooks.map((book) => {
                    const id = getBookId(book);
                    const stock = getStock(book);

                    return (
                      <tr
                        key={id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <BookImage
                              book={book}
                              title={getBookTitle(book)}
                            />

                            <div className="max-w-[220px]">

                              <p className="font-semibold text-gray-800 truncate">
                                {getBookTitle(book)}
                              </p>

                              {book?.isbn && (
                                <p className="text-xs text-gray-400 mt-1">
                                  ISBN: {book.isbn}
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {getAuthor(book)}
                        </td>

                        <td className="px-5 py-4">

                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            {getCategory(book)}
                          </span>

                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {formatPrice(
                            getPrice(book)
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {stock}
                        </td>

                        <td className="px-5 py-4">
                          <StockStatus stock={stock} />
                        </td>

                        <td className="px-5 py-4">

                          <BookActions
                            book={book}
                            deleteLoading={deleteLoading}
                            onView={() =>
                              setSelectedBook(book)
                            }
                            onDelete={handleDelete}
                          />

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>

          {/* ==========================================
              MOBILE CARDS
          ========================================== */}

          <div className="md:hidden space-y-4">

            {paginatedBooks.map((book) => {
              const id = getBookId(book);
              const stock = getStock(book);

              return (
                <div
                  key={id}
                  className="bg-white rounded-xl shadow-sm border p-4"
                >

                  <div className="flex gap-4">

                    <BookImage
                      book={book}
                      title={getBookTitle(book)}
                    />

                    <div className="flex-1 min-w-0">

                      <h3 className="font-semibold text-gray-800 truncate">
                        {getBookTitle(book)}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {getAuthor(book)}
                      </p>

                      <p className="text-sm text-blue-600 mt-1">
                        {getCategory(book)}
                      </p>

                      <div className="flex items-center justify-between mt-3">

                        <span className="font-bold text-gray-800">
                          {formatPrice(
                            getPrice(book)
                          )}
                        </span>

                        <StockStatus stock={stock} />

                      </div>

                    </div>

                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">

                    <span className="text-sm text-gray-500">
                      Stock:{" "}
                      <strong className="text-gray-800">
                        {stock}
                      </strong>
                    </span>

                    <BookActions
                      book={book}
                      deleteLoading={deleteLoading}
                      onView={() =>
                        setSelectedBook(book)
                      }
                      onDelete={handleDelete}
                    />

                  </div>

                </div>
              );
            })}

          </div>

          {/* ==========================================
              PAGINATION
          ========================================== */}

          <div className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-sm text-gray-500">
              Page {safePage} of {totalPages}
            </p>

            <div className="flex gap-2">

              <button
                type="button"
                disabled={safePage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
                className="w-9 h-9 border rounded-lg flex items-center justify-center disabled:opacity-40"
              >
                <FaChevronLeft />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .slice(
                  Math.max(0, safePage - 3),
                  Math.min(
                    totalPages,
                    safePage + 2
                  )
                )
                .map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`w-9 h-9 rounded-lg ${safePage === page
                        ? "bg-blue-600 text-white"
                        : "border hover:bg-gray-50"
                      }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                type="button"
                disabled={
                  safePage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
                className="w-9 h-9 border rounded-lg flex items-center justify-center disabled:opacity-40"
              >
                <FaChevronRight />
              </button>

            </div>

          </div>

        </>
      )}

      {/* ============================================
          VIEW MODAL
      ============================================ */}

      {selectedBook && (
        <BookModal
          book={selectedBook}
          getBookTitle={getBookTitle}
          getAuthor={getAuthor}
          getCategory={getCategory}
          getPrice={getPrice}
          getStock={getStock}
          getImage={getImage}
          formatPrice={formatPrice}
          onClose={() => setSelectedBook(null)}
        />
      )}

    </div>
  );
};

// ====================================================
// STAT CARD
// ====================================================

const StatCard = ({
  title,
  value,
  icon,
  color,
}) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-4">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {value}
          </h2>
        </div>

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

// ====================================================
// BOOK IMAGE
// ====================================================

const BookImage = ({ book, title }) => {
  const image =
    book?.image ||
    book?.coverImage ||
    book?.thumbnail ||
    book?.imageUrl ||
    "";

  if (!image) {
    return (
      <div className="w-12 h-16 shrink-0 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center">
        <FaBook />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={title}
      className="w-12 h-16 shrink-0 rounded-lg object-cover border"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
};

// ====================================================
// STOCK STATUS
// ====================================================

const StockStatus = ({ stock }) => {
  if (stock <= 0) {
    return (
      <span className="inline-flex px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
        Out of Stock
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-flex px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
      Available
    </span>
  );
};

// ====================================================
// BOOK ACTIONS
// ====================================================

const BookActions = ({
  book,
  deleteLoading,
  onView,
  onDelete,
}) => {
  const id = book?._id || book?.id;

  return (
    <div className="flex justify-end gap-2">

      <button
        type="button"
        onClick={onView}
        title="View"
        className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center"
      >
        <FaEye />
      </button>

      <Link
        to={`/admin/books/edit/${id}`}
        title="Edit"
        className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
      >
        <FaEdit />
      </Link>

      <button
        type="button"
        disabled={deleteLoading === id}
        onClick={() => onDelete(book)}
        title="Delete"
        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 flex items-center justify-center"
      >
        {deleteLoading === id ? (
          <FaSyncAlt className="animate-spin" />
        ) : (
          <FaTrash />
        )}
      </button>

    </div>
  );
};

// ====================================================
// EMPTY STATE
// ====================================================

const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-10 text-center">

      <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
        <FaBook className="text-3xl" />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mt-5">
        No Books Found
      </h2>

      <p className="text-gray-500 mt-2">
        Start adding books to your bookstore.
      </p>

      <Link
        to="/admin/books/create"
        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <FaPlus />
        Add Book
      </Link>

    </div>
  );
};

// ====================================================
// NO SEARCH RESULTS
// ====================================================

const NoResults = ({ onClear }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-10 text-center">

      <FaSearch className="mx-auto text-4xl text-gray-300" />

      <h2 className="text-xl font-bold text-gray-800 mt-4">
        No Matching Books
      </h2>

      <p className="text-gray-500 mt-2">
        Try changing your search or filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 px-5 py-2.5 border rounded-lg hover:bg-gray-50"
      >
        Clear Filters
      </button>

    </div>
  );
};

// ====================================================
// BOOK MODAL
// ====================================================

const BookModal = ({
  book,
  getBookTitle,
  getAuthor,
  getCategory,
  getPrice,
  getStock,
  getImage,
  formatPrice,
  onClose,
}) => {
  const id = book?._id || book?.id;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="p-5 border-b flex items-center justify-between">

          <h2 className="text-xl font-bold text-gray-800">
            Book Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <FaTimes />
          </button>

        </div>

        {/* Content */}

        <div className="p-6">

          <div className="flex flex-col sm:flex-row gap-5">

            {getImage(book) ? (
              <img
                src={getImage(book)}
                alt={getBookTitle(book)}
                className="w-32 h-44 object-cover rounded-xl border mx-auto sm:mx-0"
              />
            ) : (
              <div className="w-32 h-44 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mx-auto sm:mx-0">
                <FaBook className="text-3xl" />
              </div>
            )}

            <div className="flex-1">

              <h3 className="text-xl font-bold text-gray-800">
                {getBookTitle(book)}
              </h3>

              <p className="text-gray-500 mt-2">
                By {getAuthor(book)}
              </p>

              <p className="text-sm text-blue-600 mt-2">
                {getCategory(book)}
              </p>

              <p className="text-xl font-bold text-gray-800 mt-4">
                {formatPrice(getPrice(book))}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Stock:{" "}
                <strong className="text-gray-800">
                  {getStock(book)}
                </strong>
              </p>

            </div>

          </div>

          {book?.isbn && (
            <div className="mt-5 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                ISBN
              </p>

              <p className="font-medium text-gray-800 mt-1">
                {book.isbn}
              </p>
            </div>
          )}

          {book?.description && (
            <div className="mt-5">

              <h4 className="font-semibold text-gray-800">
                Description
              </h4>

              <p className="text-sm text-gray-600 mt-2 leading-6">
                {book.description}
              </p>

            </div>
          )}

        </div>

        {/* Footer */}

        <div className="p-5 border-t flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>

          <Link
            to={`/admin/books/edit/${id}`}
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaEdit />
            Edit Book
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Books;