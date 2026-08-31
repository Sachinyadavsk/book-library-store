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

import { SORT_OPTIONS, } from "../../utils/constants";
import { formatPrice, } from "../../utils/helpers";

const Books = () => {

  // BOOK STATES
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FILTER STATES
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState(SORT_OPTIONS.DEFAULT);

  // CART
  const { cart = [], addToCart, increaseQuantity, } = useCart();

  // WISHLIST
  const { toggleWishlist, isInWishlist, } = useWishlist();

  // GET BOOK ID
  const getBookId = (book) => {
    if (!book) {
      return null;
    }

    return (
      book.id ??
      book._id ??
      book.bookId ??
      null
    );
  };


  // NORMALIZE ID
  const normalizeId = (id) => {
    if (id === null || id === undefined) {
      return "";
    }
    return String(id);
  };

  // LOAD BOOKS
  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await bookService.getBooks();
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
      }

      setBooks(Array.isArray(bookList) ? bookList : []);
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
    const categoryList = books.map((book) => book?.category).filter(Boolean);
    return [
      "All",
      ...new Set(categoryList),
    ];
  }, [books]);

  // FILTER + SORT
  const filteredBooks = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    return [...books]
      .filter((book) => {
        const title = String(book?.title || "").toLowerCase();
        const author = String(book?.author || "").toLowerCase();
        const searchMatch = title.includes(searchText) || author.includes(searchText);
        const categoryMatch = category === "All" || book?.category === category;
        return (searchMatch && categoryMatch);
      })
      .sort((a, b) => {
        if (sort === "low") {
          return (Number(a?.price || 0) - Number(b?.price || 0));
        }

        if (sort === "high") {
          return (Number(b?.price || 0) - Number(a?.price || 0));
        }

        if (sort === "rating") {
          return (Number(b?.rating || 0) - Number(a?.rating || 0));
        }
        return 0;
      });
  }, [books, search, category, sort,]);


  // GET CART ITEM
  const getCartItem = (bookId) => {
    const normalizedBookId = normalizeId(bookId);
    if (!normalizedBookId) {
      return null;
    }

    return cart.find((item) => {
      const itemId =
        item?.id ??
        item?._id ??
        item?.bookId ??
        item?.productId ??
        item?.book?._id ??
        item?.book?.id;
      return (
        normalizeId(itemId) ===
        normalizedBookId
      );

    }) || null;
  };


  // CHECK BOOK IN CART
  const isBookInCartAPI = (bookId) => {
    return Boolean(
      getCartItem(bookId)
    );
  };

  // ADD TO CART
  const handleCart = async (book) => {
    try {
      const bookId = getBookId(book);
      if (!bookId) {
        console.error("Cannot add book to cart. Book ID is missing:", book);
        return;
      }

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
      await toggleWishlist(book);
    } catch (error) {
      console.error("Wishlist button error:", error);
    }
  };

  // CLEAR FILTERS
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort(SORT_OPTIONS.DEFAULT || "default");
  };

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
          <div className="text-5xl">
            ⚠️
          </div>
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


  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
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
                placeholder="Search books or authors..."
                className="w-full h-12 sm:h-14 pl-11 pr-4 rounded-xl text-gray-800 outline-none focus:ring-4 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        {/* FILTERS */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setCategory(item)
                }
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${category === item
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 border hover:border-blue-500 hover:text-blue-600"
                  }`}
              >
                {item}
              </button>

            ))}
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
              <option value="default">Sort By</option>
              <option value="low"> Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>


        {/* RESULT */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {category === "All" ? "All Books" : category}
          </h2>
          <p className="text-sm text-gray-500">
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1
              ? "book"
              : "books"}{" "}
            found
          </p>
        </div>

        {/* EMPTY DATABASE */}
        {books.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-5xl">📚</div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">No Books Available</h3>
            <p className="mt-2 text-gray-500">
              There are currently no books
              available in the library.
            </p>
          </div>

        ) : filteredBooks.length === 0 ? (

          //  FILTER EMPTY
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-5xl">🔎</div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800">No Books Found </h3>
            <p className="mt-2 text-gray-500">Try changing your search,category, or sort options.</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (

          //  BOOK GRID
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredBooks.map((book) => {
              const bookId = getBookId(book);
              const cartItem = getCartItem(bookId);
              const inCart = isBookInCartAPI(bookId);
              const quantity = Number(cartItem?.quantity || 0);
              const inWishlist = Boolean(isInWishlist(bookId));

              return (
                <div key={bookId || book.title}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
                >

                  {/* Image */}
                  <div className="relative bg-gray-100">
                    <Link to={`/books/${bookId}`}>
                      <img src={book.images?.[0] || "/images/book-placeholder.jpg"}
                        alt={book.title || "Book"}
                        className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition duration-500"
                      />
                    </Link>

                    {/* Wishlist */}
                    <button type="button" onClick={() => handleWishlist(book)}
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
                    <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-full">{book.category}</span>
                  </div>


                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{book.author}</p>
                    <Link to={`/books/${bookId}`}>
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 hover:text-blue-600">{book.title}</h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FontAwesomeIcon
                          icon={faStar}
                        />
                        <span className="text-sm font-medium">{book.rating || 0}</span>
                      </div>
                      <span className="text-xs text-gray-400">Excellent</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xl font-bold text-blue-600">{formatPrice(book.price)}</span>
                      {book.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{book.oldPrice}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Link to={`/books/${bookId}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50"
                      >
                        <FontAwesomeIcon
                          icon={faEye}
                        />
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleCart(book)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${inCart
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                      >

                        <FontAwesomeIcon icon={inCart ? faCheck : faCartShopping} />
                        {inCart ? `In Cart (${quantity})` : "Add to Cart"}
                      </button>
                    </div>

                    {inWishlist && (
                      <p className="mt-3 text-xs text-red-500 text-center">
                        ❤️ Saved to wishlist
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};


export default Books;