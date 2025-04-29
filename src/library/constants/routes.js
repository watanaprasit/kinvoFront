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
        // Business card endpoints
        BUSINESS_CARDS: (userId) => `${BASE_URL}/api/v1/users/${userId}/business-cards`,
        PRIMARY_BUSINESS_CARD: (userId) => `${BASE_URL}/api/v1/users/${userId}/business-card`,
        CREATE_BUSINESS_CARD: `${BASE_URL}/api/v1/users/business-card`,
        UPDATE_BUSINESS_CARD: (cardId) => `${BASE_URL}/api/v1/users/business-card/${cardId}`,
        DELETE_BUSINESS_CARD: (cardId) => `${BASE_URL}/api/v1/users/business-card/${cardId}`,
        SET_PRIMARY_BUSINESS_CARD: (cardId) => `${BASE_URL}/api/v1/users/business-card/${cardId}/set-primary`,
        BUSINESS_CARD_BY_SLUG: (slug) => `${BASE_URL}/api/v1/users/business-card/${slug}`,
    },
    PUBLIC: {
        PROFILE_BY_SLUG: (slug) => `${BASE_URL}/${slug}`
    },
    QR_CODE: {
        GET: `${BASE_URL}/api/v1/users/me/qrcode`,
        UPDATE: `${BASE_URL}/api/v1/users/me/qrcode`,
        PUBLIC: (slug) => `${BASE_URL}/api/v1/users/${slug}/qrcode`
    },
};

export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/signup',
    SETTINGS: '/settings',
    PROFILE: '/profile/:slug',
    BUSINESS_CARDS: '/business-cards',
    BUSINESS_CARD_EDITOR: '/business-cards/:cardId',
    CREATE_BUSINESS_CARD: '/business-cards/new',
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
        'business-cards',
        'api'
    ];
    return reservedPaths.includes(slug);
};