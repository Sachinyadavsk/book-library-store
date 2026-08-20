// ============================================
// APPLICATION
// ============================================

export const APP_NAME = "Book Library Store";

export const APP_VERSION = "1.0.0";


// ============================================
// API
// ============================================

export const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
    USER: "user",
    TOKEN: "token",
    CART: "cart",
    WISHLIST: "wishlist",
};


// ============================================
// USER ROLES
// ============================================

export const USER_ROLES = {
    USER: "user",
    ADMIN: "admin",
};


// ============================================
// ORDER STATUS
// ============================================

export const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    RETURNED: "returned",
};


// ============================================
// PAYMENT STATUS
// ============================================

export const PAYMENT_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
};


// ============================================
// PAYMENT METHODS
// ============================================

export const PAYMENT_METHODS = {
    COD: "cod",
    ONLINE: "online",
};


// ============================================
// BOOK CATEGORIES
// ============================================

export const BOOK_CATEGORIES = [
    "All",
    "Fiction",
    "Classic",
    "Self Help",
    "Finance",
    "Fantasy",
];


// ============================================
// SORT OPTIONS
// ============================================

export const SORT_OPTIONS = {
    DEFAULT: "default",
    PRICE_LOW: "low",
    PRICE_HIGH: "high",
    RATING: "rating",
};


// ============================================
// PAGINATION
// ============================================

export const DEFAULT_PAGE = 1;

export const DEFAULT_LIMIT = 12;

export const MAX_LIMIT = 100;


// ============================================
// CART
// ============================================

export const MAX_CART_QUANTITY = 10;


// ============================================
// BORROW STATUS
// ============================================

export const BORROW_STATUS = {
    BORROWED: "borrowed",
    RETURNED: "returned",
    OVERDUE: "overdue",
};


// ============================================
// API RESPONSE
// ============================================

export const API_RESPONSE = {
    SUCCESS: "success",
    ERROR: "error",
};


// ============================================
// ROUTES
// ============================================

export const ROUTES = {

    // Website
    HOME: "/",
    BOOKS: "/books",
    BOOK_DETAILS: "/books/:id",
    CART: "/cart",
    WISHLIST: "/wishlist",
    CHECKOUT: "/checkout",

    // Authentication
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",

    // User
    USER: "/user",
    USER_DASHBOARD: "/user/dashboard",
    USER_PROFILE: "/user/profile",
    USER_ORDERS: "/user/orders",
    USER_CART: "/user/cart",
    USER_WISHLIST: "/user/wishlist",
    USER_BORROWED_BOOKS: "/user/borrowed-books",

    // Admin
    ADMIN: "/admin",
    ADMIN_DASHBOARD: "/admin/dashboard",
    ADMIN_BOOKS: "/admin/books",
    ADMIN_AUTHORS: "/admin/authors",
    ADMIN_CATEGORIES: "/admin/categories",
    ADMIN_USERS: "/admin/users",
    ADMIN_ORDERS: "/admin/orders",
    ADMIN_BORROW: "/admin/borrow",
    ADMIN_REVIEWS: "/admin/reviews",
};


// ============================================
// VALIDATION
// ============================================

export const VALIDATION = {

    MIN_PASSWORD_LENGTH: 6,

    MAX_PASSWORD_LENGTH: 50,

    MIN_NAME_LENGTH: 2,

    MAX_NAME_LENGTH: 100,

    PINCODE_LENGTH: 6,

    PHONE_LENGTH: 10,
};


// ============================================
// TOAST / MESSAGE TYPES
// ============================================

export const MESSAGE_TYPES = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info",
};


// ============================================
// COMMON MESSAGES
// ============================================

export const MESSAGES = {

    LOGIN_REQUIRED:
        "Please login to continue.",

    CART_EMPTY:
        "Your cart is empty.",

    BOOK_ADDED:
        "Book added to cart.",

    BOOK_REMOVED:
        "Book removed from cart.",

    WISHLIST_ADDED:
        "Book added to wishlist.",

    WISHLIST_REMOVED:
        "Book removed from wishlist.",

    ORDER_CREATED:
        "Your order has been placed successfully.",

    ORDER_CANCELLED:
        "Your order has been cancelled.",

    SOMETHING_WENT_WRONG:
        "Something went wrong. Please try again.",

    NETWORK_ERROR:
        "Unable to connect to the server.",
};