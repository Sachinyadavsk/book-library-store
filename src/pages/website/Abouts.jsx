import React from 'react'
import { Link } from 'react-router-dom';
import aboutImage from "../../assets/banner/about-book.jpg"

const Abouts = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero Section */}
            <section className="bg-blue-600 py-20 text-white">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        About Our Book Store
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
                        Discover a world of knowledge, imagination, and inspiration.
                        Find your favorite books and explore new stories with us.
                    </p>
                </div>
            </section>

            {/* About Content */}
            <section className="py-16">
                <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
                    {/* Image */}
                    <div>
                        <img
                            src={aboutImage}
                            alt="Books"
                            className="h-[400px] w-full rounded-2xl object-cover shadow-xl"
                        />
                    </div>

                    {/* Text */}
                    <div>
                        <span className="font-semibold uppercase tracking-wider text-blue-600">
                            Who We Are
                        </span>
                        <h2 className="mt-3 text-3xl font-bold text-gray-800 md:text-4xl">
                            Your One-Stop Destination for Books
                        </h2>
                        <p className="mt-5 leading-7 text-gray-600">
                            Welcome to our Book Library Store, a place created for
                            book lovers and knowledge seekers. We offer a wide collection
                            of books across different categories, genres, and interests.
                        </p>
                        <p className="mt-4 leading-7 text-gray-600">
                            Whether you love fiction, technology, education, business,
                            biographies, or personal development, our collection has
                            something for everyone.
                        </p>
                        <Link
                            to="/books"
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                            Explore Books
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
                        <p className="mt-3 text-gray-500">
                            Everything you need for a better reading experience.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="rounded-xl bg-gray-50 p-8 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                                📚
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-gray-800">
                                Large Collection
                            </h3>
                            <p className="mt-3 text-gray-500">
                                Explore books from different genres, authors, and categories.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="rounded-xl bg-gray-50 p-8 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                                🔍
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-gray-800">
                                Easy Discovery
                            </h3>
                            <p className="mt-3 text-gray-500">
                                Quickly search and discover books that match your interests.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="rounded-xl bg-gray-50 p-8 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-3xl">
                                ❤️
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-gray-800">
                                For Book Lovers
                            </h3>
                            <p className="mt-3 text-gray-500">
                                A simple and enjoyable platform built especially for readers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Our Mission
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-gray-600">
                        Our mission is to make books easier to discover and access.
                        We believe that every book has the power to educate, inspire,
                        and transform lives. We aim to create a simple platform where
                        readers can find, explore, and enjoy their next favorite book.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gray-600 py-14 text-center text-white">
                <div className="mx-auto max-w-3xl px-4">
                    <h2 className="text-3xl font-bold">
                        Ready to Find Your Next Book?
                    </h2>
                    <p className="mt-3 text-gray-400">
                        Explore our collection and start your reading journey today.
                    </p>
                    <Link
                        to="/books"
                        className="mt-6 inline-block rounded-lg bg-blue-600 px-7 py-3 font-medium hover:bg-blue-700"
                    >
                        Browse Books
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Abouts