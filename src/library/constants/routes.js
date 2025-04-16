export const BASE_URL = "http://localhost:8000";

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/v1/auth/login`,
        REGISTER: `${BASE_URL}/api/v1/auth/register`,
        GOOGLE_CALLBACK: `${BASE_URL}/api/v1/auth/google/callback`,
    },
    USERS: {
        ME: `${BASE_URL}/api/v1/users/me`,
        PROFILE: `${BASE_URL}/api/v1/users/profile`,
        BY_EMAIL: `${BASE_URL}/api/v1/users/by-email`,
        BY_SLUG: (slug) => `${BASE_URL}/api/v1/users/${slug}`,
        ME_SLUG: `${BASE_URL}/api/v1/users/me/slug`,
        CHECK_SLUG: (slug) => `${BASE_URL}/api/v1/users/check-slug/${slug}`,
        PROFILE_BY_USER_ID: (userId) => `${BASE_URL}/api/v1/users/${userId}/profile`,
        PROFILE_UPDATE: `${BASE_URL}/api/v1/users/me/profile`,
        CONTACT_INFO_UPDATE: `${BASE_URL}/api/v1/users/me/contact-info`,
    },
    PUBLIC: {
        PROFILE_BY_SLUG: (slug) => `${BASE_URL}/${slug}`
    },
    QR_CODE: {
        GET: `${BASE_URL}/api/v1/users/me/qrcode`,
        UPDATE: `${BASE_URL}/api/v1/users/me/qrcode`
      },
};

export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/signup',
    SETTINGS: '/settings',
    PROFILE: '/profile/:slug',
    PUBLIC_PROFILE: '/:slug',  // Added for public profile access
    DASHBOARD: '/dashboard',
    NOT_FOUND: '*'
};

// Helper function to determine if a path is a reserved system route
export const isReservedRoute = (slug) => {
    const reservedPaths = [
        'login', 
        'signup', 
        'settings', 
        'dashboard', 
        'profile',
        'api'
    ];
    return reservedPaths.includes(slug);
};