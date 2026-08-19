import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
    return (
        <div className="group min-w-0">

            {/* Image */}
            <div className="relative bg-gray-100 rounded-xl overflow-hidden">

                <Link to={`/books/${book.id}`}>
                    <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-52 sm:h-60 object-cover group-hover:scale-105 transition duration-500"
                    />
                </Link>

                {/* Wishlist */}
                <button
                    type="button"
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-red-500 transition"
                >
                    <FontAwesomeIcon icon={faHeart} className="text-xs" />
                </button>

            </div>

            {/* Content */}
            <div className="pt-3">

                <p className="text-[11px] text-gray-500 truncate">
                    {book.author}
                </p>

                <Link to={`/books/${book.id}`}>
                    <h3 className="mt-1 text-sm font-semibold text-gray-800 truncate hover:text-blue-600">
                        {book.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-2">

                    <span className="font-bold text-gray-900 text-sm">
                        ${book.price}
                    </span>

                    <div className="flex items-center gap-1 text-yellow-500 text-xs">
                        <FontAwesomeIcon icon={faStar} />
                        <span className="text-gray-500">
                            {book.rating}
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default BookCard;
