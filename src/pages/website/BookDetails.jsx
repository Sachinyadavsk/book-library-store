import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCartShopping,
  faHeart,
  faMinus,
  faPlus,
  faArrowLeft,
  faBook,
  faUser,
  faTag,
  faCalendar,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";

import bookImage1 from "../../assets/books/book1.jpg";

const BookDetails = () => {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  // Temporary book data
  // Later you can replace this with API data using the id.
  const book = {
    id: id || 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    price: 299,
    oldPrice: 399,
    rating: 4.8,
    reviews: 128,
    stock: 15,
    pages: 180,
    language: "English",
    published: "1925",
    isbn: "978-0743273565",
    image: bookImage1,
    description:
      "The Great Gatsby is a classic American novel that explores themes of wealth, love, ambition, and the American Dream. Set in the 1920s, the story follows Jay Gatsby and his mysterious life surrounding the pursuit of his lost love.",
  };

  const increaseQuantity = () => {
    if (quantity < book.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
          <Link
            to="/books"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Books
          </Link>
          <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold">Book Details</h1>
        </div>
      </section>


      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        {/* Product Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-5 sm:p-8 lg:p-10">
            {/* ================= IMAGE ================= */}
            <div>
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-[350px] sm:h-[450px] lg:h-[520px] object-cover"
                />

                {/* Category */}
                <span className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-full">
                  {book.category}
                </span>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => setWishlist(!wishlist)}
                  className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full shadow flex items-center justify-center transition hover:scale-105"
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={
                      wishlist ? "text-red-500" : "text-gray-500"
                    }
                  />
                </button>
              </div>
            </div>


            {/* ================= DETAILS ================= */}
            <div className="flex flex-col justify-center">
              {/* Author */}
              <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                <FontAwesomeIcon icon={faUser} />{book.author}
              </div>

              {/* Title */}
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-800">{book.title}</h2>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesomeIcon
                      key={star}
                      icon={faStar}
                    />
                  ))}
                </div>
                <span className="font-semibold text-gray-700">{book.rating}</span>
                <span className="text-gray-400">({book.reviews} Reviews)</span>
              </div>


              {/* Price */}
              <div className="flex items-center gap-3 mt-6">
                <span className="text-3xl font-bold text-blue-600"> ₹{book.price}</span>
                <span className="text-lg text-gray-400 line-through">₹{book.oldPrice}</span>
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded">
                  SAVE ₹{book.oldPrice - book.price}
                </span>
              </div>


              {/* Stock */}
              <div className="mt-5">
                {book.stock > 0 ? (
                  <p className="text-green-600 text-sm font-medium">
                    ✓ In Stock ({book.stock} available)
                  </p>
                ) : (
                  <p className="text-red-600 text-sm font-medium">Out of Stock</p>
                )}
              </div>

              {/* Description */}
              <p className="mt-5 text-gray-600 leading-7 text-sm sm:text-base">{book.description}</p>

              {/* Quantity */}
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-2"> Quantity</p>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit overflow-hidden">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>

                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= book.stock}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>


              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">

                <button
                  type="button"
                  disabled={book.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  <FontAwesomeIcon icon={faCartShopping} />
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={() => setWishlist(!wishlist)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-red-400 hover:text-red-500 transition"
                >
                  <FontAwesomeIcon icon={faHeart} />
                  {wishlist ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>


          {/* ================= BOOK INFORMATION ================= */}
          <div className="border-t">

            <div className="p-5 sm:p-8 lg:p-10">

              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                Book Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="p-4 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon
                    icon={faBook}
                    className="text-blue-600 mb-2"
                  />

                  <p className="text-xs text-gray-500">
                    Pages
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {book.pages}
                  </p>
                </div>


                <div className="p-4 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon
                    icon={faLanguage}
                    className="text-blue-600 mb-2"
                  />

                  <p className="text-xs text-gray-500">
                    Language
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {book.language}
                  </p>
                </div>


                <div className="p-4 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-blue-600 mb-2"
                  />

                  <p className="text-xs text-gray-500">
                    Published
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {book.published}
                  </p>
                </div>


                <div className="p-4 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="text-blue-600 mb-2"
                  />

                  <p className="text-xs text-gray-500">
                    ISBN
                  </p>

                  <p className="font-semibold text-gray-800 mt-1 break-all">
                    {book.isbn}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= DESCRIPTION ================= */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm p-5 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            About This Book
          </h3>
          <p className="text-gray-600 leading-7 text-sm sm:text-base">
            {book.description}
          </p>
        </div>
      </main>
    </div>
  );
};

export default BookDetails;