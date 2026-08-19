import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const ForgetPassword = () => {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        setError('')
        setMessage('')

        if (!email) {
            setError('Please enter your email address.')
            return
        }

        // Add your forgot password API here
        console.log('Reset link requested for:', email)

        setMessage(
            'If an account exists with this email, a password reset link has been sent.'
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">

                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                    🔑
                </div>

                {/* Heading */}
                <div className="mt-5 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Forgot Password?
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Enter your registered email address and we'll send you a
                        link to reset your password.
                    </p>
                </div>

                {/* Success Message */}
                {message && (
                    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter your email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Send Reset Link
                    </button>

                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Login
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default ForgetPassword