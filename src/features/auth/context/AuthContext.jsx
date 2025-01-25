import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Persist user data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  }, [user]);

  const login = (userData) => {
    console.log('Full User Data:', userData);
    setUser(userData);
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('registrationData');
    setUser(null);
    setIsRegistrationComplete(true);
  };

  const updateUserProfile = (updates) => {
    setUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        ...updates
      };
      return updatedUser;
    });
  };

  const updateSlug = (newSlug) => {
    updateUserProfile({ slug: newSlug });
  };

  // Check authentication status
  const isAuthenticated = Boolean(user && localStorage.getItem('access_token'));

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      updateUserProfile,
      updateSlug,
      isRegistrationComplete,
      setIsRegistrationComplete,
      isAuthenticated,
      isLoading
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;