import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faStar,
  faCartShopping,
  faHeart,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import books from '../../staticValue/bookData'

const Books = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const categories = [
    "All",
    "Fiction",
    "Classic",
    "Self Help",
    "Finance",
    "Fantasy",
  ];

  const filteredBooks = books
    .filter((book) => {
      const searchMatch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      const categoryMatch =
        category === "All" || book.category === category;

      return searchMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Explore Our Books
            </h1>
            <p className="mt-4 text-blue-100 text-sm sm:text-base">
              Discover amazing books from your favorite authors and
              explore our growing collection.
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search books or authors..."
                className="w-full h-12 sm:h-14 pl-11 pr-4 rounded-xl text-gray-800 outline-none focus:ring-4 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </section>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between mb-8">

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
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
              onChange={(e) => setSort(e.target.value)}
              className="w-full lg:w-52 h-10 pl-9 pr-4 bg-white border rounded-lg outline-none text-sm"
            >
              <option value="default">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>


        {/* Result Count */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Books</h2>
          <p className="text-sm text-gray-500">
            {filteredBooks.length} books found
          </p>
        </div>

        {/* ================= BOOK GRID ================= */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
              >
                {/* Image */}
                <div className="relative bg-gray-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Wishlist */}
                  <button
                    type="button"
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>

                  {/* Category */}
                  <span className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {book.category}
                  </span>
                </div>


                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{book.author}</p>
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{book.title}</h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FontAwesomeIcon icon={faStar} />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">Excellent</span>
                  </div>


                  {/* Price */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xl font-bold text-blue-600">₹{book.price}</span>
                    <span className="text-sm text-gray-400 line-through">₹{book.oldPrice}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/books/${book.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50"
                    >
                      <FontAwesomeIcon icon={faEye} />
                      View
                    </Link>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      <FontAwesomeIcon icon={faCartShopping} />
                      Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (

          /* No Results */
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-800"> No books found</h3>
            <p className="mt-2 text-gray-500">
              Try changing your search or category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Books;