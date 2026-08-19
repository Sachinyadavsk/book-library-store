import React from 'react'

const Page404 = () => {
    return (
        <section className='max-w-7xl mx-auto px-5 py-15'>
            <div className="flex flex-col items-center justify-center bg-gray-100 p-16">
                <h1 className="text-8xl font-bold text-gray-800">404</h1>

                <h2 className="mt-4 text-2xl font-semibold text-gray-700">
                    Page Not Found
                </h2>
                <p className="mt-2 text-gray-500 text-center">
                    Sorry, the page you are looking for does not exist.
                </p>
                <a
                    href="/"
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
                >
                    Go Back Home
                </a>
            </div>
        </section>
    )
}

export default Page404