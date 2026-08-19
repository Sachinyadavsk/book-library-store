import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const ResetPassword = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })

        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        // Add your API request here
        console.log({
            token: searchParams.get('token'),
            password: formData.password,
        })

        navigate('/login')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">

                {/* Logo / Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                    🔐
                </div>

                {/* Heading */}
                <div className="mt-5 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Reset Password
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Create a new password for your account.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">

                    {/* New Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            New Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            Password must contain at least 8 characters.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Reset Password
                    </button>

                </form>

                {/* Back to Login */}
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

export default ResetPassword