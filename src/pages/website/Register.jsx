import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faUserPlus,
  faSpinner,
  faPhone,
  faArrowLeft,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

import {
  isValidEmail,
  isValidPassword,
  isRequired,
} from "../../utils/helpers";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  // ============================================
  // FORM DATA
  // ============================================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  // ============================================
  // ERRORS
  // ============================================
  const [errors, setErrors] = useState({});

  const [apiError, setApiError] = useState("");

  const [success, setSuccess] = useState("");

  // ============================================
  // LOADING
  // ============================================
  const [loading, setLoading] = useState(false);

  // ============================================
  // PASSWORD VISIBILITY
  // ============================================
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ============================================
  // ALREADY LOGGED IN
  // ============================================
  useEffect(() => {
    if (user) {
      navigate("/", {
        replace: true,
      });
    }
  }, [user, navigate]);

  // ============================================
  // INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // --------------------------------------------
    // MOBILE
    // --------------------------------------------
    if (name === "mobile") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    // --------------------------------------------
    // NAME
    // --------------------------------------------
    if (name === "name") {
      newValue = value
        .replace(/\s+/g, " ")
        .slice(0, 100);
    }

    // --------------------------------------------
    // EMAIL
    // --------------------------------------------
    if (name === "email") {
      newValue = value.trimStart();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear field error
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Clear API error
    setApiError("");

    // Clear success
    setSuccess("");
  };

  // ============================================
  // VALIDATION
  // ============================================
  const validateForm = () => {
    const newErrors = {};

    // ==========================================
    // NAME
    // ==========================================
    if (!isRequired(formData.name)) {
      newErrors.name =
        "Name is required.";
    } else if (
      formData.name.trim().length < 2
    ) {
      newErrors.name =
        "Name must be at least 2 characters.";
    }

    // ==========================================
    // EMAIL
    // ==========================================
    if (!isRequired(formData.email)) {
      newErrors.email =
        "Email is required.";
    } else if (
      !isValidEmail(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    // ==========================================
    // MOBILE
    // ==========================================
    if (!isRequired(formData.mobile)) {
      newErrors.mobile =
        "Mobile number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        formData.mobile
      )
    ) {
      newErrors.mobile =
        "Please enter a valid 10-digit mobile number.";
    }

    // ==========================================
    // PASSWORD
    // ==========================================
    if (!isRequired(formData.password)) {
      newErrors.password =
        "Password is required.";
    } else if (
      !isValidPassword(
        formData.password,
        6
      )
    ) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    // ==========================================
    // CONFIRM PASSWORD
    // ==========================================
    if (
      !isRequired(
        formData.confirmPassword
      )
    ) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ============================================
  // SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setSuccess("");

    // ------------------------------------------
    // VALIDATE
    // ------------------------------------------
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Save email before clearing form
      const registeredEmail =
        formData.email.trim();

      // ----------------------------------------
      // REQUEST DATA
      // ----------------------------------------
      const payload = {
        name: formData.name.trim(),
        email: registeredEmail.toLowerCase(),
        mobile: formData.mobile,
        password: formData.password,
        password_confirmation:
          formData.confirmPassword,
        role: "users",
      };

      console.log(
        "Register payload:",
        payload
      );

      // ----------------------------------------
      // API
      // ----------------------------------------
      const response =
        await authService.register(
          payload
        );

      console.log(
        "Register response:",
        response
      );

      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------
      if (
        response?.success !== false
      ) {
        setSuccess(
          response?.message ||
          "Registration successful. Please login."
        );

        // Clear form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to Login
        setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: {
              message:
                "Registration successful. Please login.",
              email: registeredEmail,
            },
          });
        }, 1200);

      } else {

        setApiError(
          response?.message ||
          "Registration failed. Please try again."
        );
      }

    } catch (error) {

      console.error(
        "Register error:",
        error
      );

      setApiError(
        error?.message ||
        "Unable to register. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  // ============================================
  // INPUT CLASS
  // ============================================
  const inputClass = (field) => `
    w-full
    py-3
    pl-11
    pr-4
    border
    rounded-xl
    outline-none
    transition
    ${errors[field]
      ? "border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    }
  `;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl">

        {/* ======================================
                    HEADER
        ====================================== */}
        <div className="text-center mb-8">

          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">

            <FontAwesomeIcon
              icon={faUserPlus}
              className="text-2xl"
            />

          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-800">
            Create Your Account
          </h1>

          <p className="mt-2 text-gray-500">
            Register to start using the Book Library Store.
          </p>

        </div>

        {/* ======================================
                    CARD
        ====================================== */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">

          {/* ====================================
                    API ERROR
          ==================================== */}
          {apiError && (

            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">

              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mt-0.5"
              />

              <p className="text-sm">
                {apiError}
              </p>

            </div>

          )}

          {/* ====================================
                    SUCCESS
          ==================================== */}
          {success && (

            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-600">

              <FontAwesomeIcon
                icon={faCircleCheck}
                className="mt-0.5"
              />

              <p className="text-sm">
                {success}
              </p>

            </div>

          )}

          {/* ====================================
                    FORM
          ==================================== */}
          <form
            onSubmit={handleSubmit}
            noValidate
          >

            {/* ==================================
                        NAME
            ================================== */}
            <div className="mb-5">

              <label
                htmlFor="name"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <div className="relative">

                <FontAwesomeIcon
                  icon={faUser}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={loading}
                  className={inputClass("name")}
                />

              </div>

              {errors.name && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.name}
                </p>
              )}

            </div>

            {/* ==================================
                        EMAIL
            ================================== */}
            <div className="mb-5">

              <label
                htmlFor="email"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">

                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  className={inputClass("email")}
                />

              </div>

              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.email}
                </p>
              )}

            </div>

            {/* ==================================
                        MOBILE
            ================================== */}
            <div className="mb-5">

              <label
                htmlFor="mobile"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Mobile Number
              </label>

              <div className="relative">

                <FontAwesomeIcon
                  icon={faPhone}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                  disabled={loading}
                  className={inputClass("mobile")}
                />

              </div>

              {errors.mobile && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.mobile}
                </p>
              )}

            </div>

            {/* ==================================
                        PASSWORD
            ================================== */}
            <div className="mb-5">

              <label
                htmlFor="password"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">

                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`${inputClass(
                    "password"
                  )} pr-12`}
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >

                  <FontAwesomeIcon
                    icon={
                      showPassword
                        ? faEyeSlash
                        : faEye
                    }
                  />

                </button>

              </div>

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password}
                </p>
              )}

            </div>

            {/* ==================================
                    CONFIRM PASSWORD
            ================================== */}
            <div className="mb-6">

              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>

              <div className="relative">

                <FontAwesomeIcon
                  icon={faLock}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className={`${inputClass(
                    "confirmPassword"
                  )} pr-12`}
                />

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >

                  <FontAwesomeIcon
                    icon={
                      showConfirmPassword
                        ? faEyeSlash
                        : faEye
                    }
                  />

                </button>

              </div>

              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}

            </div>

            {/* ==================================
                    REGISTER BUTTON
            ================================== */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >

              {loading ? (
                <>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                  />

                  Creating Account...
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faUserPlus}
                  />

                  Create Account
                </>
              )}

            </button>

          </form>

          {/* ====================================
                    LOGIN
          ==================================== */}
          <div className="mt-6 pt-6 border-t text-center">

            <p className="text-gray-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

        {/* ======================================
                    HOME
        ====================================== */}
        <div className="text-center mt-5">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
          >

            <FontAwesomeIcon
              icon={faArrowLeft}
            />

            Back to Home

          </Link>

        </div>

      </div>

    </div>
  );
};

export default Register;