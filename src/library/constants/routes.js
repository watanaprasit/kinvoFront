export const BASE_URL = "http://localhost:8000";

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${BASE_URL}/api/v1/auth/login`,
        REGISTER: `${BASE_URL}/api/v1/auth/register`,
        GOOGLE: `${BASE_URL}/api/v1/auth/google`,
        REFRESH: `${BASE_URL}/api/v1/auth/refresh`,
    },
    USERS: {
        PROFILE: `${BASE_URL}/api/v1/users`,
        BY_SLUG: (slug) => `${BASE_URL}/api/v1/users/${slug}`,
        UPDATE_SLUG: `${BASE_URL}/api/v1/users/me/slug`,
    }
};

export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/signup',
    SETTINGS: '/settings',
    PROFILE: '/:slug',  // Dynamic route for user profiles
    DASHBOARD: '/dashboard',
};