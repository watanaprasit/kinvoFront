export const BASE_URL = "http://localhost:8000";

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/v1/auth/login`,
        REGISTER: `${BASE_URL}/api/v1/auth/register`,
        GOOGLE_CALLBACK: `${BASE_URL}/api/v1/auth/google/callback`, // Updated to match backend
    },
    USERS: {
        PROFILE_BY_USER_ID: (userId) => `${BASE_URL}/api/v1/users/${userId}/profile`,
        PROFILE_UPDATE: `${BASE_URL}/api/v1/users/profile`,
        PROFILE: `${BASE_URL}/api/v1/users/me/profile`,  // Endpoint for fetching the authenticated user's profile
        ME: `${BASE_URL}/api/v1/users/me`,
        BY_SLUG: (slug) => `${BASE_URL}/api/v1/users/${slug}`,
        UPDATE_SLUG: `${BASE_URL}/api/v1/users/update-slug`, // Updated endpoint
        CHECK_SLUG: (slug) => `${BASE_URL}/api/v1/users/check-slug/${slug}` // New endpoint
    }
};

export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/signup',
    SETTINGS: '/settings',
    PROFILE: '/profile/:slug', // Profile route with slug parameter
    DASHBOARD: '/dashboard',
    NOT_FOUND: '*'
};



// export const BASE_URL = "http://localhost:8000";

// export const API_ROUTES = {
//     AUTH: {
//         LOGIN: `${BASE_URL}/api/v1/auth/login`,
//         REGISTER: `${BASE_URL}/api/v1/auth/register`,
//         COMPLETE_REGISTER: `${BASE_URL}/api/v1/auth/complete-register`, // Added for slug registration
//         GOOGLE: `${BASE_URL}/api/v1/auth/google`,
//         COMPLETE_GOOGLE: `${BASE_URL}/api/v1/auth/complete-google`, // Added for Google slug registration
//         GOOGLE_LOGIN: `${BASE_URL}/api/v1/auth/google/login`, // Added separate Google login endpoint
//         CHECK_SLUG: `${BASE_URL}/api/v1/auth/check-slug`, // Added for slug availability check
//         REFRESH: `${BASE_URL}/api/v1/auth/refresh`,
//         VERIFY_EMAIL: `${BASE_URL}/api/v1/auth/verify-email`,
//         RESEND_VERIFICATION: `${BASE_URL}/api/v1/auth/resend-verification`,
//     },
//     USERS: {
//         PROFILE: `${BASE_URL}/api/v1/users`,
//         ME: `${BASE_URL}/api/v1/users/me`,
//         BY_SLUG: (slug) => `${BASE_URL}/api/v1/users/${slug}`,
//         UPDATE_SLUG: `${BASE_URL}/api/v1/users/me/slug`,
//         CHECK_SLUG: (slug) => `${BASE_URL}/api/v1/users/check-slug/${slug}`,
//     }
// };

// export const APP_ROUTES = {
//     HOME: '/',
//     LOGIN: '/login',
//     REGISTER: '/signup',
//     COMPLETE_REGISTER: '/complete-registration', // Added for slug registration step
//     SETTINGS: '/settings',
//     PROFILE: '/:slug',
//     DASHBOARD: '/dashboard',
//     VERIFY_EMAIL: '/verify-email',
//     REGISTRATION_SUCCESS: '/registration-success',
//     NOT_FOUND: '*',
// };