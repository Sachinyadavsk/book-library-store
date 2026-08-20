// ============================================
// LOCAL STORAGE
// ============================================

export const getStorage = (key, defaultValue = null) => {
    try {
        const value = localStorage.getItem(key);

        if (value === null) {
            return defaultValue;
        }

        return JSON.parse(value);

    } catch (error) {
        console.error(
            `Failed to read localStorage: ${key}`,
            error
        );

        return defaultValue;
    }
};


export const setStorage = (key, value) => {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {
        console.error(
            `Failed to save localStorage: ${key}`,
            error
        );

        return false;
    }
};


export const removeStorage = (key) => {
    try {
        localStorage.removeItem(key);

        return true;

    } catch (error) {
        console.error(
            `Failed to remove localStorage: ${key}`,
            error
        );

        return false;
    }
};


// ============================================
// USER
// ============================================

export const getCurrentUser = () => {
    return getStorage("user", null);
};


export const isLoggedIn = () => {
    return !!getCurrentUser();
};


export const isAdmin = () => {

    const user = getCurrentUser();

    return (
        !!user &&
        (
            user.role === "admin" ||
            user.role === "ADMIN"
        )
    );
};


// ============================================
// TOKEN
// ============================================

export const getToken = () => {
    return localStorage.getItem("token");
};


export const hasToken = () => {
    return !!getToken();
};


// ============================================
// CURRENCY
// ============================================

export const formatPrice = (
    price,
    currency = "₹"
) => {

    const amount = Number(price) || 0;

    return `${currency}${amount.toLocaleString(
        "en-IN"
    )}`;
};


// ============================================
// NUMBER
// ============================================

export const toNumber = (value, fallback = 0) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
};


// ============================================
// CART
// ============================================

export const getCartQuantity = (cart = []) => {

    return cart.reduce(
        (total, item) =>
            total +
            Number(item.quantity || 1),
        0
    );
};


export const getCartSubtotal = (cart = []) => {

    return cart.reduce(
        (total, item) =>
            total +
            (
                Number(item.price || 0) *
                Number(item.quantity || 1)
            ),
        0
    );
};


export const getCartItemCount = (cart = []) => {
    return cart.length;
};


export const isBookInCart = (
    cart = [],
    bookId
) => {

    return cart.some(
        (item) =>
            String(item.id) ===
            String(bookId)
    );
};


export const findCartItem = (
    cart = [],
    bookId
) => {

    return cart.find(
        (item) =>
            String(item.id) ===
            String(bookId)
    );
};


// ============================================
// WISHLIST
// ============================================

export const isBookInWishlist = (
    wishlist = [],
    bookId
) => {

    return wishlist.some(
        (item) =>
            String(item.id) ===
            String(bookId)
    );
};


// ============================================
// DISCOUNT
// ============================================

export const calculateDiscount = (
    subtotal,
    discountPercent = 0
) => {

    const amount = Number(subtotal) || 0;

    const percent =
        Number(discountPercent) || 0;

    return Math.max(
        0,
        (amount * percent) / 100
    );
};


// ============================================
// SHIPPING
// ============================================

export const calculateShipping = (
    subtotal,
    freeShippingLimit = 999,
    shippingCharge = 50
) => {

    const amount = Number(subtotal) || 0;

    if (amount <= 0) {
        return 0;
    }

    if (amount >= freeShippingLimit) {
        return 0;
    }

    return shippingCharge;
};


// ============================================
// ORDER TOTAL
// ============================================

export const calculateOrderTotal = ({
    subtotal = 0,
    discount = 0,
    shipping = 0,
    tax = 0,
}) => {

    return Math.max(
        0,
        Number(subtotal) -
        Number(discount) +
        Number(shipping) +
        Number(tax)
    );
};


// ============================================
// TEXT
// ============================================

export const truncateText = (
    text,
    length = 100
) => {

    if (!text) {
        return "";
    }

    const value = String(text);

    if (value.length <= length) {
        return value;
    }

    return `${value.substring(0, length)}...`;
};


// ============================================
// DATE
// ============================================

export const formatDate = (
    date,
    options = {}
) => {

    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            ...options,
        }
    );
};


// ============================================
// EMAIL VALIDATION
// ============================================

export const isValidEmail = (email) => {

    if (!email) {
        return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );
};


// ============================================
// PHONE VALIDATION
// ============================================

export const isValidPhone = (phone) => {

    if (!phone) {
        return false;
    }

    return /^[6-9]\d{9}$/.test(
        String(phone)
    );
};


// ============================================
// PINCODE VALIDATION
// ============================================

export const isValidPincode = (pincode) => {

    if (!pincode) {
        return false;
    }

    return /^\d{6}$/.test(
        String(pincode)
    );
};


// ============================================
// PASSWORD VALIDATION
// ============================================

export const isValidPassword = (
    password,
    minLength = 6
) => {

    return (
        typeof password === "string" &&
        password.length >= minLength
    );
};


// ============================================
// REQUIRED VALUE
// ============================================

export const isRequired = (value) => {

    return (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );
};


// ============================================
// API RESPONSE
// ============================================

export const getResponseData = (
    response,
    defaultValue = null
) => {

    if (!response) {
        return defaultValue;
    }

    if (response.data !== undefined) {
        return response.data;
    }

    return response;
};


export const getResponseMessage = (
    response,
    defaultMessage = "Something went wrong."
) => {

    return (
        response?.message ||
        response?.data?.message ||
        defaultMessage
    );
};


export const isApiSuccess = (response) => {

    if (!response) {
        return false;
    }

    return (
        response.success === true ||
        response.data?.success === true
    );
};


// ============================================
// ARRAY
// ============================================

export const uniqueById = (items = []) => {

    const map = new Map();

    items.forEach((item) => {

        if (item?.id !== undefined) {
            map.set(
                String(item.id),
                item
            );
        }

    });

    return Array.from(map.values());
};


// ============================================
// SCROLL
// ============================================

export const scrollToTop = () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};


// ============================================
// DEBOUNCE
// ============================================

export const debounce = (
    callback,
    delay = 300
) => {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};