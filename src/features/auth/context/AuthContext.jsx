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

  // Check authentication status on mount and when token changes
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');
      
      if (!token || !savedUser) {
        // No token or user data, clear any potentially stale data
        if (user) {
          setUser(null);
          setUserProfile(null);
        }
        setIsLoading(false);
        return;
      }
      
      // We have a token and user data, fetch fresh profile data
      try {
        const userData = JSON.parse(savedUser);
        
        if (!userData?.email) {
          throw new Error('Invalid user data in storage');
        }
        
        await fetchUserProfile(userData);
      } catch (err) {
        console.error('Auth check failed:', err);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        setUser(null);
        setUserProfile(null);
        setError('Authentication failed. Please log in again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const fetchUserProfile = async (userData) => {
    if (!userData?.email) {
      setIsLoading(false);
      return;
    }

    try {
      // Get user data from auth.users table
      const freshUserData = await ProfileService.getUserByEmail(userData.email);

      if (!freshUserData?.id) {
        throw new Error('User ID not found');
      }

      const profileData = await ProfileService.getProfileByUserId(freshUserData.id);

      const profile = profileData || {
        display_name: freshUserData.full_name,
        slug: freshUserData.slug,
        photo_url: null
      };

      const updatedUser = {
        ...freshUserData,
        profile
      };

      setUser(updatedUser);
      setUserProfile(profile);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAvatarKey(Date.now()); // Update avatar key to force re-render
      setError(null);
      return updatedUser;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
      throw error;
    }
  };

  const login = async (userData) => {
    if (!userData?.email) {
      throw new Error('Email is required for login');
    }
    
    // First set basic user data
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Then try to fetch complete profile data
    try {
      await fetchUserProfile(userData);
      return true;
    } catch (err) {
      console.warn('Could not fetch complete profile data:', err);
      // We still consider login successful even if profile fetch fails
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('registrationData');
    setUser(null);
    setUserProfile(null);
    setIsRegistrationComplete(true);
    setError(null);
    
    // Force redirect to home page
    window.location.href = '/';
  };

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
      if (finalUpdatedProfile?.photo_url) {
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
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
      
      // Force avatar to re-render by updating the key
      setAvatarKey(Date.now());
      
      return newProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Calculate authentication status - check both user object and token
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
    avatarKey,
    refreshUserProfile: fetchUserProfile
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