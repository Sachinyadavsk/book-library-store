
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faSearch,
  faFilter,
  faStar,
  faCartShopping,
  faHeart,
  faEye,
  faCheck,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext.jsx";
import bookService from "../../services/bookService";

import { SORT_OPTIONS } from "../../utils/constants";
import { formatPrice } from "../../utils/helpers";
import api from "../../services/api";


// CACHE
const authorCache = new Map();
const categoryCache = new Map();

// GET AUTHOR NAME
const getAuthorName = async (author) => {
  // Condition 1: Author does not exist
  if (!author) {
    return "Unknown Author";
  }

  // Condition 2: Author is already an object
  if (typeof author === "object") {
    return (
      author?.name ||
      author?.authorName ||
      author?.fullName ||
      "Unknown Author"
    );
  }

  // Condition 3: Author is not a string
  if (typeof author !== "string") {
    return "Unknown Author";
  }

  // Condition 4: Empty string
  if (!author.trim()) {
    return "Unknown Author";
  }

  // Condition 5: Check cache
  if (authorCache.has(author)) {
    return authorCache.get(author);
  }

  try {
    const response = await api(`/author/${author}`, {
      method: "GET",
    });

    console.log("Author API Response:", response);

    const authorData =
      response?.author ||
      response?.data?.author ||
      response?.data ||
      null;

    const name =
      authorData?.name ||
      authorData?.authorName ||
      authorData?.fullName ||
      "Unknown Author";

    // Save in cache
    authorCache.set(author, name);

    return name;
  } catch (error) {
    console.error("Get Author Error:", error);

    authorCache.set(author, "Unknown Author");

    return "Unknown Author";
  }
};


// GET CATEGORY NAME
const getCategoryName = async (category) => {
  // Condition 1: Category does not exist
  if (!category) {
    return "Unknown Category";
  }

  // Condition 2: Category is already an object
  if (typeof category === "object") {
    return (
      category?.name ||
      category?.categoryName ||
      category?.title ||
      "Unknown Category"
    );
  }

  // Condition 3: Category is not a string
  if (typeof category !== "string") {
    return "Unknown Category";
  }

  // Condition 4: Empty category ID
  if (!category.trim()) {
    return "Unknown Category";
  }

  // Condition 5: Check cache
  if (categoryCache.has(category)) {
    return categoryCache.get(category);
  }

  try {
    const response = await api(`/category/${category}`, {
      method: "GET",
    });

    console.log("Category API Response:", response);

    const categoryData =
      response?.category ||
      response?.data?.category ||
      response?.data ||
      null;

    const name =
      categoryData?.name ||
      categoryData?.categoryName ||
      categoryData?.title ||
      "Unknown Category";

    // Save in cache
    categoryCache.set(category, name);

    return name;
  } catch (error) {
    console.error("Get Category Error:", error);
    categoryCache.set(category, "Unknown Category");
    return "Unknown Category";
  }
};


// BOOKS COMPONENT
const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState(SORT_OPTIONS?.DEFAULT || "default");

  // CART
  const { cart = [], addToCart, increaseQuantity, } = useCart();

  // WISHLIST
  const { toggleWishlist, isInWishlist, } = useWishlist();

  // GET BOOK ID
  const getBookId = (book) => {
    if (!book) {
      return null;
    }
    return (book?.id ?? book?._id ?? book?.bookId ?? null);
  };

  // NORMALIZE ID
  const normalizeId = (id) => {
    if (id === null || id === undefined) {
      return "";
    }
    return String(id);
  };

  // GET AUTHOR ID
  const getAuthorId = (author) => {
    if (!author) {
      return null;
    }
    if (typeof author === "object") {
      return (author?.id ?? author?._id ?? author?.authorId ?? null);
    }
    if (typeof author === "string") {
      return author;
    }
    return null;
  };

  // GET CATEGORY ID
  const getCategoryId = (categoryData) => {
    if (!categoryData) {
      return null;
    }
    if (typeof categoryData === "object") {
      return (categoryData?.id ?? categoryData?._id ?? categoryData?.categoryId ?? null);
    }
    if (typeof categoryData === "string") {
      return categoryData;
    }
    return null;
  };

  // LOAD BOOKS
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await bookService.getBooks();
      console.log("Books API Response:", response);

      // NORMALIZE BOOK RESPONSE
      let bookList = [];
      if (Array.isArray(response)) {
        bookList = response;
      } else if (Array.isArray(response?.books)) {
        bookList = response.books;
      } else if (Array.isArray(response?.data)) {
        bookList = response.data;
      } else if (Array.isArray(response?.data?.books)) {
        bookList = response.data.books;
      } else if (Array.isArray(response?.results)) {
        bookList = response.results;
      } else {
        bookList = [];
      }

      // INVALID RESPONSE CONDITION
      if (!Array.isArray(bookList)) {
        setBooks([]);
        return;
      }

      // GET AUTHOR + CATEGORY NAME
      const booksWithDetails = await Promise.all(
        bookList.map(async (book) => {
          const authorId = getAuthorId(book?.author);
          const categoryId = getCategoryId(book?.category);
          const [authorName, categoryName,] = await Promise.all([getAuthorName(authorId), getCategoryName(categoryId),]);
          return {
            ...book,
            // Original IDs
            authorId,
            categoryId,

            // API names
            authorName,
            categoryName,
          };
        })
      );
      setBooks(booksWithDetails);
    } catch (err) {
      console.error("Load books error:", err);
      setError(err?.response?.data?.message || err?.message || "Unable to load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // LOAD ON PAGE OPEN
  useEffect(() => {
    loadBooks();
  }, []);

  // CATEGORIES
  const categories = useMemo(() => {
    const categoryMap = new Map();
    books.forEach((book) => {
      const categoryId = book?.categoryId;
      const categoryName = book?.categoryName || "Unknown Category";

      // Only add valid category IDs
      if (categoryId) {
        const normalizedId = String(categoryId);
        if (!categoryMap.has(normalizedId)) {
          categoryMap.set(normalizedId, categoryName);
        }
      }
    });

    return [
      { id: "All", name: "All", },
      ...Array.from(
        categoryMap.entries()
      ).map(([id, name]) => ({ id, name, })),];
  }, [books]);


  // FILTER + SORT
  const filteredBooks = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return [...books]
      .filter((book) => {

        // SEARCH DATA
        const title = String(book?.title || "").toLowerCase();
        const authorName = String(book?.authorName || "").toLowerCase();
        const categoryName = String(book?.categoryName || "").toLowerCase();

        // SEARCH CONDITION
        const searchMatch = !searchText || title.includes(searchText) || authorName.includes(searchText) || categoryName.includes(searchText);

        // CATEGORY CONDITION
        const categoryMatch = category === "All" || normalizeId(book?.categoryId) === normalizeId(category);
        return (searchMatch && categoryMatch);
      })
      .sort((a, b) => {

        // LOW PRICE
        if (sort === "low") {
          return (Number(a?.price || 0) - Number(b?.price || 0));
        }

        // HIGH PRICE
        if (sort === "high") {
          return (Number(b?.price || 0) - Number(a?.price || 0));
        }

        // RATING
        if (sort === "rating") {
          return (Number(b?.rating ?? b?.averageRating ?? 0) -
            Number(a?.rating ?? a?.averageRating ?? 0));
        }

        // DEFAULT
        return 0;
      });
  }, [books, search, category, sort,]);

  // GET CART ITEM
  const getCartItem = (bookId) => {
    const normalizedBookId = normalizeId(bookId);
    if (!normalizedBookId) {
      return null;
    }

    // CART CAN BE ARRAY OF ITEMS
    // OR ARRAY OF CART DOCUMENTS
    const cartItems = Array.isArray(cart)
      ? cart.flatMap((cartData) => {
        if (Array.isArray(cartData?.items)) {
          return cartData.items;
        }
        return [cartData];
      })
      : [];

    return (
      cartItems.find((item) => {
        const itemBookId = item?.book?._id ?? item?.book?.id ?? item?.bookId ?? item?.productId ?? item?.id ?? item?._id;
        return (normalizeId(itemBookId) === normalizedBookId);
      }) || null
    );
  };

  // CHECK BOOK IN CART
  const isBookInCartAPI = (bookId) => {
    return Boolean(getCartItem(bookId));
  };

  // ADD TO CART
  const handleCart = async (book) => {
    try {
      if (!book) {
        console.error("Book information is missing.");
        return;
      }

      const bookId = getBookId(book);
      if (!bookId) {
        console.error("Cannot add book to cart. Book ID is missing:", book);
        return;
      }

      // CHECK EXISTING CART ITEM
      const existingItem = getCartItem(bookId);

      // ALREADY IN CART
      if (existingItem) {
        await increaseQuantity(bookId);
        return;
      }

      // NOT IN CART
      await addToCart(book);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // WISHLIST
  const handleWishlist = async (book) => {
    try {
      // Book condition
      if (!book) {
        console.error("Book information is missing.");
        return;
      }
      await toggleWishlist(book);
    } catch (err) {
      console.error("Wishlist button error:", err);
    }
  };

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort(SORT_OPTIONS?.DEFAULT || "default");
  };

  // SELECT CATEGORY
  const handleCategoryChange = (categoryId) => {
    if (!categoryId) {
      setCategory("All");
      return;
    }
    setCategory(categoryId);
  };

  // GET SELECTED CATEGORY NAME
  const selectedCategoryName = useMemo(() => {
    if (category === "All") {
      return "All Books";
    }
    const selected = categories.find((item) => normalizeId(item?.id) === normalizeId(category));
    return (selected?.name || "Books");
  }, [categories, category,]);


  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

          <p className="mt-4 text-gray-500">
            Loading books...
          </p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="text-5xl">⚠️</div>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            Unable to Load Books
          </h1>
          <p className="mt-3 text-gray-500">
            {error}
          </p>
          <button
            type="button"
            onClick={loadBooks}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            <FontAwesomeIcon
              icon={faRotate}
            />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // MAIN
  return (
    <div className="min-h-screen bg-gray-50">
      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Explore Our Books
            </h1>

            <p className="mt-4 text-blue-100">
              Discover amazing books from your
              favorite authors and explore our
              growing collection.
            </p>

            {/* Search */}

            <div className="relative mt-7">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search books, authors or categories..."
                className="w-full h-12 sm:h-14 pl-11 pr-4 rounded-xl text-gray-800 outline-none focus:ring-4 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-10">

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">

          {/* Categories */}

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(
              (item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(
                      item.id
                    )
                  }
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${normalizeId(
                    category
                  ) ===
                    normalizeId(
                      item.id
                    )
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border hover:border-blue-500 hover:text-blue-600"
                    }`}
                >
                  {item.name}
                </button>
              )
            )}
          </div>

          {/* Sort */}

          <div className="relative shrink-0">
            <FontAwesomeIcon
              icon={faFilter}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
              className="w-full lg:w-52 h-10 pl-9 pr-4 bg-white border rounded-lg outline-none text-sm"
            >
              <option value="default">
                Sort By
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>
            </select>
          </div>
        </div>

        {/* =================================================
            RESULT
        ================================================= */}

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {selectedCategoryName}
          </h2>

          <p className="text-sm text-gray-500">
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1
              ? "book"
              : "books"}{" "}
            found
          </p>
        </div>

        {/* =================================================
            EMPTY DATABASE
        ================================================= */}

        {books.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-5xl">
              📚
            </div>

            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              No Books Available
            </h3>

            <p className="mt-2 text-gray-500">
              There are currently no books
              available in the library.
            </p>
          </div>
        ) : filteredBooks.length === 0 ? (

          /* =================================================
             FILTER EMPTY
          ================================================= */

          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-5xl">
              🔎
            </div>

            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              No Books Found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search,
              category, or sort options.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>

        ) : (

          /* =================================================
             BOOK GRID
          ================================================= */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">

            {filteredBooks.map(
              (book) => {
                const bookId =
                  getBookId(book);

                const cartItem =
                  getCartItem(
                    bookId
                  );

                const inCart =
                  isBookInCartAPI(
                    bookId
                  );

                const quantity =
                  Number(
                    cartItem?.quantity ||
                    0
                  );

                const inWishlist =
                  Boolean(
                    isInWishlist(
                      bookId
                    )
                  );

                return (
                  <div
                    key={
                      bookId ||
                      book?.title ||
                      Math.random()
                    }
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
                  >

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div className="relative bg-gray-100">
                      <Link
                        to={`/books/${bookId}`}
                      >
                        <img
                          src={
                            book?.images?.[0] ||
                            "/images/book-placeholder.jpg"
                          }
                          alt={
                            book?.title ||
                            "Book"
                          }
                          className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition duration-500"
                        />
                      </Link>

                      {/* Wishlist */}

                      <button
                        type="button"
                        onClick={() =>
                          handleWishlist(
                            book
                          )
                        }
                        className={`absolute top-3 right-3 w-10 h-10 rounded-full shadow flex items-center justify-center ${inWishlist
                          ? "bg-red-500 text-white"
                          : "bg-white text-gray-500 hover:text-red-500"
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                        />
                      </button>

                      {/* Category */}

                      <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                        {book?.categoryName ||
                          "Unknown Category"}
                      </span>
                    </div>

                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="p-4">

                      {/* Author */}

                      <p className="text-xs text-gray-500 mb-1">
                        {book?.authorName ||
                          "Unknown Author"}
                      </p>

                      {/* Title */}

                      <Link
                        to={`/books/${bookId}`}
                      >
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 hover:text-blue-600">
                          {book?.title ||
                            "Untitled Book"}
                        </h3>
                      </Link>

                      {/* =================================================
                          RATING
                      ================================================= */}

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FontAwesomeIcon
                            icon={faStar}
                          />

                          <span className="text-sm font-medium">
                            {book?.rating ??
                              book?.averageRating ??
                              0}
                          </span>
                        </div>

                        <span className="text-xs text-gray-400">
                          Excellent
                        </span>
                      </div>

                      {/* =================================================
                          PRICE
                      ================================================= */}

                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xl font-bold text-blue-600">
                          {formatPrice(
                            Number(
                              book?.price ||
                              0
                            )
                          )}
                        </span>

                        {book?.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹
                            {
                              book.oldPrice
                            }
                          </span>
                        )}
                      </div>

                      {/* =================================================
                          BUTTONS
                      ================================================= */}

                      <div className="flex gap-2 mt-4">

                        {/* View */}

                        <Link
                          to={`/books/${bookId}`}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50"
                        >
                          <FontAwesomeIcon
                            icon={faEye}
                          />

                          View
                        </Link>

                        {/* Cart */}

                        <button
                          type="button"
                          onClick={() =>
                            handleCart(
                              book
                            )
                          }
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${inCart
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                          <FontAwesomeIcon
                            icon={
                              inCart
                                ? faCheck
                                : faCartShopping
                            }
                          />

                          {inCart
                            ? `In Cart (${quantity})`
                            : "Add to Cart"}
                        </button>
                      </div>

                      {/* Wishlist */}

                      {inWishlist && (
                        <p className="mt-3 text-xs text-red-500 text-center">
                          ❤️ Saved to wishlist
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Books;

