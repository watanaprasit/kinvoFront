// import { createContext, useState, useContext, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { ProfileService } from '../../profile/services/profileServices';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem('user');
//     return savedUser ? JSON.parse(savedUser) : null;
//   });
//   const [userProfile, setUserProfile] = useState(null);
//   const [isRegistrationComplete, setIsRegistrationComplete] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [avatarKey, setAvatarKey] = useState(Date.now());

//   // Check authentication status on mount and when token changes
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('access_token');
//       const savedUser = localStorage.getItem('user');
      
//       if (!token || !savedUser) {
//         // No token or user data, clear any potentially stale data
//         if (user) {
//           setUser(null);
//           setUserProfile(null);
//         }
//         setIsLoading(false);
//         return;
//       }
      
//       // We have a token and user data, fetch fresh profile data
//       try {
//         const userData = JSON.parse(savedUser);
        
//         if (!userData?.email) {
//           throw new Error('Invalid user data in storage');
//         }
        
//         await fetchUserProfile(userData);
//       } catch (err) {
//         console.error('Auth check failed:', err);
//         // Clear invalid data
//         localStorage.removeItem('user');
//         localStorage.removeItem('access_token');
//         setUser(null);
//         setUserProfile(null);
//         setError('Authentication failed. Please log in again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     checkAuth();
//   }, []);

//   const fetchUserProfile = async (userData) => {
//     if (!userData?.email) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Get user data from auth.users table
//       const freshUserData = await ProfileService.getUserByEmail(userData.email);

//       if (!freshUserData?.id) {
//         throw new Error('User ID not found');
//       }

//       const profileData = await ProfileService.getProfileByUserId(freshUserData.id);

//       const profile = profileData || {
//         display_name: freshUserData.full_name,
//         slug: freshUserData.slug,
//         photo_url: null
//       };

//       const updatedUser = {
//         ...freshUserData,
//         profile
//       };

//       setUser(updatedUser);
//       setUserProfile(profile);
//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setAvatarKey(Date.now()); // Update avatar key to force re-render
//       setError(null);
//       return updatedUser;
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//       setError(error.message);
//       throw error;
//     }
//   };

//   const login = async (userData) => {
//     if (!userData?.email) {
//       throw new Error('Email is required for login');
//     }
    
//     // First set basic user data
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
    
//     // Then try to fetch complete profile data
//     try {
//       await fetchUserProfile(userData);
//       return true;
//     } catch (err) {
//       console.warn('Could not fetch complete profile data:', err);
//       // We still consider login successful even if profile fetch fails
//       return true;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('access_token');
//     sessionStorage.removeItem('registrationData');
//     setUser(null);
//     setUserProfile(null);
//     setIsRegistrationComplete(true);
//     setError(null);
    
//     // Force redirect to home page
//     window.location.href = '/';
//   };

//   const updateUserProfile = async (updatedProfile) => {
//     if (!user?.id) {
//       throw new Error('User ID is required to update profile');
//     }

//     try {
//       let finalUpdatedProfile;
      
//       if (updatedProfile instanceof FormData) {
//         const response = await ProfileService.updateProfile(user.id, updatedProfile);
//         finalUpdatedProfile = response;
//       } else {
//         finalUpdatedProfile = await ProfileService.updateProfile(user.id, updatedProfile);
//       }
      
//       // Ensure photo_url is properly formatted
//       if (finalUpdatedProfile?.photo_url) {
//         finalUpdatedProfile.photo_url = ProfileService.formatPhotoUrl(finalUpdatedProfile.photo_url);
//       }
      
//       // Create new profile object with the response data
//       const newProfile = {
//         ...finalUpdatedProfile
//       };
      
//       // Update state
//       setUserProfile(newProfile);
//       setUser(prevUser => {
//         const updatedUser = {
//           ...prevUser,
//           profile: newProfile
//         };
//         localStorage.setItem('user', JSON.stringify(updatedUser));
//         return updatedUser;
//       });
      
//       // Force avatar to re-render by updating the key
//       setAvatarKey(Date.now());
      
//       return newProfile;
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       throw error;
//     }
//   };

//   // Calculate authentication status - check both user object and token
//   const isAuthenticated = Boolean(user && localStorage.getItem('access_token'));

//   const value = {
//     user,
//     userProfile,
//     isAuthenticated,
//     isRegistrationComplete,
//     isLoading,
//     error,
//     login,
//     logout,
//     updateUserProfile,
//     setIsRegistrationComplete,
//     avatarKey,
//     refreshUserProfile: fetchUserProfile
//   };

//   return (
//     <AuthContext.Provider value={value}>
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


// new below 

import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ProfileService } from '../../profile/services/profileServices';
import { BusinessCardService } from '../../businessCards/services/businessCardServices';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userProfile, setUserProfile] = useState(null);
  const [businessCards, setBusinessCards] = useState([]);
  const [primaryCard, setPrimaryCard] = useState(null);
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
          setBusinessCards([]);
          setPrimaryCard(null);
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
        setBusinessCards([]);
        setPrimaryCard(null);
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

      // Fetch all business cards for the user
      const userCards = await BusinessCardService.getBusinessCardsByUserId(freshUserData.id);
      
      // Find the primary card
      const primary = userCards.find(card => card.is_primary) || userCards[0] || null;
      
      // Use primary card as profile or create a basic default profile
      const profile = primary || {
        display_name: freshUserData.full_name,
        slug: freshUserData.slug,
        photo_url: null
      };

      const updatedUser = {
        ...freshUserData,
        profile,
        subscription_tier: freshUserData.subscription_tier || 'free'
      };

      setUser(updatedUser);
      setUserProfile(profile);
      setBusinessCards(userCards);
      setPrimaryCard(primary);
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
    setBusinessCards([]);
    setPrimaryCard(null);
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
      // If updating the primary business card
      if (primaryCard?.id) {
        let updatedCard;
        
        if (updatedProfile instanceof FormData) {
          updatedCard = await BusinessCardService.updateBusinessCard(primaryCard.id, updatedProfile);
        } else {
          updatedCard = await BusinessCardService.updateBusinessCard(primaryCard.id, updatedProfile);
        }
        
        // Ensure photo_url is properly formatted
        if (updatedCard?.photo_url) {
          updatedCard.photo_url = BusinessCardService.formatPhotoUrl(updatedCard.photo_url);
        }
        
        // Update businessCards state
        setBusinessCards(prevCards => {
          return prevCards.map(card => 
            card.id === updatedCard.id ? updatedCard : card
          );
        });
        
        // Update primaryCard state
        setPrimaryCard(updatedCard);
        
        // Also update userProfile for backward compatibility
        setUserProfile(updatedCard);
        
        // Update user state
        setUser(prevUser => {
          const updatedUser = {
            ...prevUser,
            profile: updatedCard
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        });
        
        // Force avatar to re-render by updating the key
        setAvatarKey(Date.now());
        
        return updatedCard;
      } else {
        // Creating a new primary business card
        let newCard;
        
        if (updatedProfile instanceof FormData) {
          // Add is_primary flag if creating a new card
          updatedProfile.append('is_primary', 'true');
          newCard = await BusinessCardService.createBusinessCard(user.id, updatedProfile);
        } else {
          newCard = await BusinessCardService.createBusinessCard(user.id, {
            ...updatedProfile,
            is_primary: true
          });
        }
        
        // Ensure photo_url is properly formatted
        if (newCard?.photo_url) {
          newCard.photo_url = BusinessCardService.formatPhotoUrl(newCard.photo_url);
        }
        
        // Update businessCards state
        setBusinessCards(prevCards => [...prevCards, newCard]);
        
        // Update primaryCard state
        setPrimaryCard(newCard);
        
        // Also update userProfile for backward compatibility
        setUserProfile(newCard);
        
        // Update user state
        setUser(prevUser => {
          const updatedUser = {
            ...prevUser,
            profile: newCard
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        });
        
        // Force avatar to re-render by updating the key
        setAvatarKey(Date.now());
        
        return newCard;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const createBusinessCard = async (cardData) => {
    if (!user?.id) {
      throw new Error('User ID is required to create a business card');
    }

    try {
      const maxCards = getBusinessCardLimit();
      if (businessCards.length >= maxCards) {
        throw new Error(`You've reached your limit of ${maxCards} business cards for your current subscription tier`);
      }

      let newCard;
      if (cardData instanceof FormData) {
        newCard = await BusinessCardService.createBusinessCard(user.id, cardData);
      } else {
        newCard = await BusinessCardService.createBusinessCard(user.id, cardData);
      }

      // Update businessCards state
      setBusinessCards(prevCards => [...prevCards, newCard]);
      
      return newCard;
    } catch (error) {
      console.error('Error creating business card:', error);
      throw error;
    }
  };

  const updateBusinessCard = async (cardId, cardData) => {
    if (!user?.id) {
      throw new Error('User ID is required to update a business card');
    }

    try {
      let updatedCard;
      if (cardData instanceof FormData) {
        updatedCard = await BusinessCardService.updateBusinessCard(cardId, cardData);
      } else {
        updatedCard = await BusinessCardService.updateBusinessCard(cardId, cardData);
      }

      // Update businessCards state
      setBusinessCards(prevCards => {
        return prevCards.map(card => 
          card.id === updatedCard.id ? updatedCard : card
        );
      });

      // If this is the primary card, also update primaryCard and userProfile
      if (updatedCard.is_primary) {
        setPrimaryCard(updatedCard);
        setUserProfile(updatedCard);
        
        // Update user state
        setUser(prevUser => {
          const updatedUser = {
            ...prevUser,
            profile: updatedCard
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        });
        
        // Force avatar to re-render
        setAvatarKey(Date.now());
      }
      
      return updatedCard;
    } catch (error) {
      console.error('Error updating business card:', error);
      throw error;
    }
  };

  const deleteBusinessCard = async (cardId) => {
    if (!user?.id) {
      throw new Error('User ID is required to delete a business card');
    }

    try {
      // Check if this is the primary card
      const isRemovingPrimaryCard = businessCards.find(
        card => card.id === cardId && card.is_primary
      );

      // Cannot delete if it's the only card
      if (businessCards.length === 1) {
        throw new Error('You must have at least one business card');
      }

      await BusinessCardService.deleteBusinessCard(cardId);

      // Update businessCards state
      setBusinessCards(prevCards => prevCards.filter(card => card.id !== cardId));

      // If removed the primary card, set a new primary
      if (isRemovingPrimaryCard) {
        // Find first remaining card to make primary
        const newPrimaryCard = businessCards.find(card => card.id !== cardId);
        
        if (newPrimaryCard) {
          await BusinessCardService.updateBusinessCard(newPrimaryCard.id, { is_primary: true });
          
          // Update the card in our state
          const updatedCard = { ...newPrimaryCard, is_primary: true };
          
          setPrimaryCard(updatedCard);
          setUserProfile(updatedCard);
          
          // Update user state
          setUser(prevUser => {
            const updatedUser = {
              ...prevUser,
              profile: updatedCard
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
          });
          
          // Update cards state to reflect new primary
          setBusinessCards(prevCards => {
            return prevCards.map(card => 
              card.id === updatedCard.id ? updatedCard : card
            );
          });
          
          // Force avatar to re-render
          setAvatarKey(Date.now());
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting business card:', error);
      throw error;
    }
  };

  const setPrimaryBusinessCard = async (cardId) => {
    if (!user?.id) {
      throw new Error('User ID is required to set primary business card');
    }

    try {
      const card = businessCards.find(c => c.id === cardId);
      
      if (!card) {
        throw new Error('Business card not found');
      }
      
      if (card.is_primary) {
        // Already primary, nothing to do
        return card;
      }

      // Update the card to be primary
      const updatedCard = await BusinessCardService.updateBusinessCard(cardId, { is_primary: true });
      
      // Update businessCards state to reflect changes in primary status
      setBusinessCards(prevCards => {
        return prevCards.map(card => ({
          ...card,
          is_primary: card.id === cardId
        }));
      });
      
      // Update primaryCard state
      setPrimaryCard(updatedCard);
      
      // Also update userProfile for backward compatibility
      setUserProfile(updatedCard);
      
      // Update user state
      setUser(prevUser => {
        const updatedUser = {
          ...prevUser,
          profile: updatedCard
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
      
      // Force avatar to re-render
      setAvatarKey(Date.now());
      
      return updatedCard;
    } catch (error) {
      console.error('Error setting primary business card:', error);
      throw error;
    }
  };

  const getBusinessCardLimit = () => {
    const tier = user?.subscription_tier || 'free';
    
    switch (tier) {
      case 'premium':
        return 5;
      case 'business':
        return 10;
      case 'enterprise':
        return 25;
      case 'free':
      default:
        return 1;
    }
  };

  // Calculate authentication status - check both user object and token
  const isAuthenticated = Boolean(user && localStorage.getItem('access_token'));

  const value = {
    user,
    userProfile,
    businessCards,
    primaryCard,
    isAuthenticated,
    isRegistrationComplete,
    isLoading,
    error,
    login,
    logout,
    updateUserProfile,
    createBusinessCard,
    updateBusinessCard, 
    deleteBusinessCard,
    setPrimaryBusinessCard,
    setIsRegistrationComplete,
    avatarKey,
    refreshUserProfile: fetchUserProfile,
    getBusinessCardLimit
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