import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(true);


  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserProfile = (updates) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updates
    }));
  };

  const updateSlug = (newSlug) => {
    updateUserProfile({ slug: newSlug });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      updateUserProfile,
      updateSlug,
      isRegistrationComplete,
      setIsRegistrationComplete
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);