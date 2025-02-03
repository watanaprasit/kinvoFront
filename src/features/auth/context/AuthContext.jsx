import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProfileService } from '../../profile/services/profileServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userProfile, setUserProfile] = useState(null);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        // Get user data from auth.users table
        const userData = await ProfileService.getUserByEmail(user.email);
        
        if (!userData?.id) {
          throw new Error('User ID not found');
        }

        // Get user profile from user_profiles table
        const profileData = await ProfileService.getProfileByUserId(userData.id);

        // Create default profile if none exists
        const profile = profileData || {
          display_name: userData.full_name,
          slug: userData.slug,
          photo_url: null
        };

        // Combine user and profile data
        const updatedUser = {
          ...userData,
          profile
        };

        setUser(updatedUser);
        setUserProfile(profile);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setError(null);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [user?.email]);

  const login = async (userData) => {
    if (!userData?.email) {
      throw new Error('Email is required for login');
    }
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('registrationData');
    setUser(null);
    setUserProfile(null);
    setIsRegistrationComplete(true);
    setError(null);
  };

  const updateUserProfile = async (formData) => {
    if (!user?.id) {
      throw new Error('User ID is required to update profile');
    }

    try {
      const updatedProfile = await ProfileService.updateProfile(user.id, formData);
      
      setUserProfile(updatedProfile);
      setUser(prevUser => ({
        ...prevUser,
        profile: updatedProfile
      }));

      localStorage.setItem('user', JSON.stringify({
        ...user,
        profile: updatedProfile
      }));

      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const isAuthenticated = Boolean(user && localStorage.getItem('access_token'));

  const value = {
    user,
    userProfile,
    isAuthenticated,
    isRegistrationComplete,
    isLoading,
    error,
    login,
    logout,
    updateUserProfile,
    setIsRegistrationComplete
  };

  return (
    <AuthContext.Provider value={value}>
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


// import { createContext, useState, useContext, useEffect } from 'react';
// import PropTypes from 'prop-types';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     // Initialize user from localStorage if available
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });
//   const [isRegistrationComplete, setIsRegistrationComplete] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);

//   // Persist user data to localStorage when it changes
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem('user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('user');
//     }
//     setIsLoading(false);
//   }, [user]);

//   const login = (userData) => {
//     console.log('Full User Data:', userData);
//     setUser(userData);
//   };

//   const logout = () => {
//     // Clear all auth-related data
//     localStorage.removeItem('user');
//     localStorage.removeItem('access_token');
//     sessionStorage.removeItem('registrationData');
//     setUser(null);
//     setIsRegistrationComplete(true);
//   };

//   const updateUserProfile = (updates) => {
//     setUser(prevUser => {
//       const updatedUser = {
//         ...prevUser,
//         ...updates
//       };
//       return updatedUser;
//     });
//   };

//   const updateSlug = (newSlug) => {
//     updateUserProfile({ slug: newSlug });
//   };

//   // Check authentication status
//   const isAuthenticated = Boolean(user && localStorage.getItem('access_token'));

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       login, 
//       logout,
//       updateUserProfile,
//       updateSlug,
//       isRegistrationComplete,
//       setIsRegistrationComplete,
//       isAuthenticated,
//       isLoading
//     }}>
//       {!isLoading && children}
//     </AuthContext.Provider>
//   );
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;