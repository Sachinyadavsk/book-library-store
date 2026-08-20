import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faTruckFast,
  faRotate,
  faShieldHalved,
  faHeadset,
  faStar,
  faCartShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import categories from "../../staticValue/categoryData";
import featuredBooks from "../../staticValue/featureData";
import bookService from "../../services/bookService";
import BookCard from "./BookCard";
import bannerImage1 from "../../assets/banner/banner_home1.jpg";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await bookService.getBooks();
        console.log("Books API Response:", response);
        const bookData =
          response?.data ||
          response?.books ||
          response?.results ||
          [];
        setBooks(
          Array.isArray(bookData)
            ? bookData
            : []
        );
      } catch (error) {
        console.error("Get books error:", error);
        setError(error?.message || "Unable to load books."
        );
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);


  console.log('dd',books);

  return (
    <div className="bg-white">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="bg-gradient-to-r from-white via-blue-50 to-white border-b">

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[460px] lg:min-h-[500px]">
            {/* Hero Content */}
            <div className="py-12 lg:py-16 text-center lg:text-left">
              <span className="inline-block text-xs sm:text-sm font-medium text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
                📚 Welcome to BookStore
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover Your
                <span className="block text-blue-600">
                  Next Favorite Book
                </span>
              </h1>
              <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-gray-500 text-sm sm:text-base leading-7">
                Thousands of books, best authors and easy borrowing
                & buying. Find your next great read today.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mt-7">
                <Link
                  to="/books"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
                >
                  Shop Now
                </Link>
                <Link
                  to="/books"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-white transition"
                >
                  Explore Library
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:flex justify-center items-end h-full">
              <div className="relative w-full max-w-xl">
                <img src={bannerImage1} alt="Book Library" className="w-full h-[400px] object-cover rounded-t-3xl shadow-lg" />

                {/* Floating book label */}
                <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur px-5 py-4 rounded-xl shadow-xl">
                  <p className="text-xs text-gray-500">
                    Featured Book
                  </p>
                  <p className="font-bold text-gray-800">
                    Atomic Habits
                  </p>
                  <p className="text-xs text-gray-500">
                    James Clear
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          BENEFITS
      ====================================================== */}
      <section className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Item */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faTruckFast} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800">Free Shipping</h4>
                <p className="text-[10px] sm:text-xs text-gray-400">On orders over $50</p>
              </div>
            </div>


            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faRotate} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800">Easy Returns</h4>
                <p className="text-[10px] sm:text-xs text-gray-400">30 day return policy</p>
              </div>
            </div>


            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faShieldHalved} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800"> Secure Payment</h4>
                <p className="text-[10px] sm:text-xs text-gray-400">100% secure payment</p>
              </div>
            </div>


            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faHeadset} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800">24/7 Support</h4>
                <p className="text-[10px] sm:text-xs text-gray-400">Dedicated support
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          CATEGORIES
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Categories</h2>
          <Link to="/categories" className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium">
            View All
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to="/books"
              className={`${category.bg} border border-white rounded-xl p-4 sm:p-5 text-center hover:shadow-md hover:-translate-y-1 transition`}
            >
              <div className="text-3xl">{category.icon}</div>
              <h3 className="mt-3 text-sm font-semibold text-gray-800">{category.name}</h3>
              <p className="mt-1 text-[10px] text-gray-500">{category.books}</p>
            </Link>
          ))}
        </div>
      </section>


      {/* =====================================================
          FEATURED BOOKS
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Featured Books</h2>
            <p className="text-xs text-gray-500 mt-1"> Handpicked books for you </p>
          </div>

          <Link
            to="/books"
            className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium"
          >
            View All
            <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>
      </section>


      {/* =====================================================
          OFFER BANNER
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700">
          <div className="px-6 sm:px-10 py-8 sm:py-10">
            <div className="max-w-lg">
              <p className="text-yellow-300 text-sm font-semibold">LIMITED TIME OFFER</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
                Get 50% Off On Your First Order
              </h2>
              <p className="mt-2 text-blue-100 text-sm">
                Use code <strong>WELCOME50</strong> at checkout.
              </p>
              <Link
                to="/books"
                className="inline-block mt-5 px-5 py-2.5 bg-white text-blue-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Decorative Books */}
          <div className="hidden sm:block absolute right-10 bottom-0 text-7xl">📚</div>
        </div>
      </section>


      {/* =====================================================
          BEST SELLING
      ====================================================== */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Best Selling Books</h2>
              <p className="text-xs text-gray-500 mt-1">Popular books loved by our readers</p>
            </div>
            <Link
              to="/books"
              className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium"
            >
              View All
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;