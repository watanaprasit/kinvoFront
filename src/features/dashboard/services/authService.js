export const logoutUser = () => {
    localStorage.removeItem('access_token');
    // Clear any other auth-related data if needed
    localStorage.removeItem('user_data');
    sessionStorage.clear();
};