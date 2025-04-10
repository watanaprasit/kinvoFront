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
  const [avatarKey, setAvatarKey] = useState(Date.now()); 

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

        const profileData = await ProfileService.getProfileByUserId(userData.id);

        const profile = profileData || {
          display_name: userData.full_name,
          slug: userData.slug,
          photo_url: null
        };

        const updatedUser = {
          ...userData,
          profile
        };

        setUser(updatedUser);
        setUserProfile(profile);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAvatarKey(Date.now()); // Update avatar key to force re-render
        setError(null);
      } catch (error) {
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

// Enhance the updateUserProfile method in AuthContext.jsx

const updateUserProfile = async (updatedProfile) => {
  if (!user?.id) {
    throw new Error('User ID is required to update profile');
  }

  try {
    
    let finalUpdatedProfile;
    
    if (updatedProfile instanceof FormData) {
      const response = await ProfileService.updateProfile(user.id, updatedProfile);
      finalUpdatedProfile = response;
    } else {
      finalUpdatedProfile = await ProfileService.updateProfile(user.id, updatedProfile);
    }
    
    
    // Ensure photo_url is properly formatted
    if (finalUpdatedProfile.photo_url) {
      finalUpdatedProfile.photo_url = ProfileService.formatPhotoUrl(finalUpdatedProfile.photo_url);
    }
    
    // Create new profile object with the response data
    const newProfile = {
      ...finalUpdatedProfile
    };
    
    
    // Update state
    setUserProfile(newProfile);
    setUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        profile: newProfile
      };
      return updatedUser;
    });
    
    // Update local storage
    const updatedUser = {
      ...user,
      profile: newProfile
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Force avatar to re-render by updating the key
    setAvatarKey(Date.now());
    
    return newProfile;
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
    setIsRegistrationComplete,
    avatarKey // Expose avatar key to components
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