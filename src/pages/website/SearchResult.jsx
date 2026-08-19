import React from 'react'
import { Link } from 'react-router-dom';
import bookImage1 from "../../assets/books/book1.jpg";
import bookImage2 from "../../assets/books/book2.jpg";
import bookImage3 from "../../assets/books/book3.jpg";

const SearchResult = () => {
    const books = [
        {
            id: 1,
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            price: 299,
            image: bookImage1,
        },
        {
            id: 2,
            title: 'Atomic Habits',
            author: 'James Clear',
            price: 399,
            image: bookImage2,
        },
        {
            id: 3,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            price: 249,
            image: bookImage3,
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="mx-auto max-w-7xl px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Search Results
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Showing results for your search
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8 flex gap-3">
                    <input
                        type="text"
                        placeholder="Search books..."
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    />
                    <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">
                        Search
                    </button>
                </div>

                {/* Results */}
                {books.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {books.map((book) => (
                            <div
                                key={book.id}
                                className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Book Image */}
                                <Link to={`/books/${book.id}`}>
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className="h-64 w-full object-cover"
                                    />
                                </Link>

                                {/* Book Details */}
                                <div className="p-5">
                                    <h2 className="line-clamp-1 text-lg font-bold text-gray-800">
                                        {book.title}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        By {book.author}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xl font-bold text-blue-600">
                                            ₹{book.price}
                                        </span>

                                        <Link
                                            to={`/books/${book.id}`}
                                            className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-900"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    /* No Results */
                    <div className="rounded-xl bg-white py-16 text-center shadow">
                        <div className="text-5xl">📚</div>
                        <h2 className="mt-4 text-2xl font-bold text-gray-800">
                            No Books Found
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Try searching with a different book title or author.
                        </p>
                        <Link
                            to="/books"
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                        >
                            Browse All Books
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchResult