// // src/pages/app/ProfilePage.jsx
// import { useEffect, useState, Suspense } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../../features/auth/context/AuthContext'; 
// import { ProfileService } from '../../features/profile/services/profileServices';
// import ProfileEditor from '../../features/profile/components/ProfileEditor';
// import { 
//   cleanImageUrl, 
//   formatPhotoUrl, 
//   getUserFriendlyError, 
//   isValidSlugFormat,
//   formatProfileUrl
// } from '../../library/utils/formatters';
// import {
//   validateEmailFormat,
//   validateRequired,
//   validateKnownEmailProvider,
//   validateEmailUniqueness
// } from '../../library/utils/validators';

// const UserProfile = () => {
//   const { userId } = useParams();
//   const { user } = useAuth();
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [validationErrors, setValidationErrors] = useState({});

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const profileUserId = userId || user?.id;
        
//         if (!profileUserId) {
//           throw new Error('No user ID available');
//         }

//         const profileData = await ProfileService.getProfileByUserId(profileUserId);
        
//         // Format photo URL before setting user data
//         if (profileData.photo_url) {
//           profileData.photo_url = formatPhotoUrl(cleanImageUrl(profileData.photo_url));
//         }
        
//         // Validate slug format
//         if (profileData.slug && !isValidSlugFormat(profileData.slug)) {
//           setValidationErrors(prev => ({
//             ...prev,
//             slug: 'Profile slug can only contain letters, numbers, and hyphens'
//           }));
//         }
        
//         // Format profile URL if slug exists
//         if (profileData.slug) {
//           profileData.profile_url = formatProfileUrl(profileData.slug);
//         }
        
//         // Validate email if present
//         if (profileData.email) {
//           if (!validateEmailFormat(profileData.email)) {
//             setValidationErrors(prev => ({
//               ...prev,
//               email: 'Please enter a valid email address'
//             }));
//           }
          
//           // Only check known providers if email format is valid
//           if (validateEmailFormat(profileData.email) && 
//               !validateKnownEmailProvider(profileData.email)) {
//             console.warn('Unknown email provider used');
//           }
//         }
        
//         setUserData(profileData);
//       } catch (error) {
//         console.error('Profile fetch error:', error);
//         setError(getUserFriendlyError(error.message));
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchUserProfile();
//   }, [userId, user]);

//   // Handler for profile updates
//   const handleProfileUpdate = async (profileData) => {
//     try {
//       // Reset validation errors
//       setValidationErrors({});
      
//       // Validate required fields
//       const requiredFields = ['display_name', 'email'];
//       const newErrors = {};
      
//       requiredFields.forEach(field => {
//         if (!validateRequired(profileData[field])) {
//           newErrors[field] = `${field.replace('_', ' ')} is required`;
//         }
//       });
      
//       // Validate email format
//       if (profileData.email && !validateEmailFormat(profileData.email)) {
//         newErrors.email = 'Please enter a valid email address';
//       }
      
//       // Validate slug format
//       if (profileData.slug && !isValidSlugFormat(profileData.slug)) {
//         newErrors.slug = 'Profile slug can only contain letters, numbers, and hyphens';
//       }
      
//       // Check if there are validation errors
//       if (Object.keys(newErrors).length > 0) {
//         setValidationErrors(newErrors);
//         return false;
//       }
      
//       // Check email uniqueness if email has changed
//       if (profileData.email !== userData.email) {
//         const isUnique = await validateEmailUniqueness(profileData.email);
//         if (!isUnique) {
//           setValidationErrors(prev => ({
//             ...prev,
//             email: 'This email is already in use'
//           }));
//           return false;
//         }
//       }
      
//       // Format photo URL before saving
//       if (profileData.photo_url) {
//         profileData.photo_url = cleanImageUrl(profileData.photo_url);
//       }
      
//       // Save profile data
//       await ProfileService.updateProfile(profileData);
      
//       // Update local state with formatted data
//       setUserData({
//         ...profileData,
//         photo_url: formatPhotoUrl(profileData.photo_url),
//         profile_url: formatProfileUrl(profileData.slug)
//       });
      
//       return true;
//     } catch (error) {
//       setError(getUserFriendlyError(error.message));
//       return false;
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading profile: {error}</div>;

//   return (
//     <>
//       {Object.keys(validationErrors).length > 0 && (
//         <div className="bg-yellow-50 p-4 rounded-lg mb-4">
//           <h3 className="text-yellow-800 font-medium mb-2">Please fix the following issues:</h3>
//           <ul className="list-disc pl-5 text-yellow-700">
//             {Object.values(validationErrors).map((error, index) => (
//               <li key={index}>{error}</li>
//             ))}
//           </ul>
//         </div>
//       )}
      
//       <ProfileEditor 
//         initialProfile={{
//           displayName: userData.display_name,
//           slug: userData.slug,
//           photoUrl: userData.photo_url,
//           userId: userData.user_id,
//           email: userData.email,
//           profileUrl: userData.profile_url
//         }}
//         onUpdate={handleProfileUpdate}
//         validationErrors={validationErrors}
//       />
//     </>
//   );
// };

// const ProfilePage = () => {
//   return (
//     <Suspense fallback={<div>Loading Profile...</div>}>
//       <UserProfile />
//     </Suspense>
//   );
// };

// export default ProfilePage;

// new below 

// src/pages/app/ProfilePage.jsx
import { useEffect, useState, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext'; 
import { ProfileService } from '../../features/profile/services/profileServices';
import ProfileEditor from '../../features/profile/components/ProfileEditor';
import { 
  cleanImageUrl, 
  formatPhotoUrl, 
  getUserFriendlyError, 
  isValidSlugFormat,
  formatProfileUrl
} from '../../library/utils/formatters';
import {
  validateEmailFormat,
  validateRequired,
  validateKnownEmailProvider,
  validateEmailUniqueness
} from '../../library/utils/validators';

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [businessCards, setBusinessCards] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch business cards for the user
  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const profileUserId = userId || user?.id;
        
        if (!profileUserId) {
          throw new Error('No user ID available');
        }

        // In real implementation, make the actual API call
        // const response = await fetch(`/api/v1/users/${profileUserId}/business-cards`);
        // const cards = await response.json();
        
        // For now, simulate API response
        setTimeout(() => {
          const mockCards = [
            {
              id: 1,
              is_primary: true,
              display_name: 'John Doe',
              title: 'Software Engineer',
              bio: 'Passionate about building web applications',
              email: 'john@example.com',
              website: 'https://johndoe.com',
              photo_url: 'https://example.com/photos/john.jpg',
              company_logo_url: 'https://example.com/logos/company.png',
              qr_code_url: 'https://example.com/qr/johndoe',
              contact: { phone: '123-456-7890', linkedin: 'johndoe' },
              slug: 'johndoe',
              created_at: '2025-01-01T00:00:00Z',
              updated_at: '2025-04-01T00:00:00Z'
            }
          ];
          
          setBusinessCards(mockCards);
          
          // Set the primary card as selected by default
          const primaryCard = mockCards.find(card => card.is_primary) || mockCards[0];
          if (primaryCard) {
            setSelectedCardId(primaryCard.id);
            
            // Format photo URL before setting user data
            if (primaryCard.photo_url) {
              primaryCard.photo_url = formatPhotoUrl(cleanImageUrl(primaryCard.photo_url));
            }
            
            // Format profile URL if slug exists
            if (primaryCard.slug) {
              primaryCard.profile_url = formatProfileUrl(primaryCard.slug);
            }
            
            setUserData(primaryCard);
          }
          
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(getUserFriendlyError(error.message));
        setIsLoading(false);
      }
    };
    
    fetchUserCards();
  }, [userId, user]);

  // Handler for when user selects a different card to edit
  const handleCardChange = (cardId) => {
    const selectedCard = businessCards.find(card => card.id === cardId);
    if (selectedCard) {
      setSelectedCardId(cardId);
      
      // Format photo URL and profile URL
      if (selectedCard.photo_url) {
        selectedCard.photo_url = formatPhotoUrl(cleanImageUrl(selectedCard.photo_url));
      }
      
      if (selectedCard.slug) {
        selectedCard.profile_url = formatProfileUrl(selectedCard.slug);
      }
      
      setUserData(selectedCard);
      setValidationErrors({});
    }
  };

  // Handler for profile updates
  const handleProfileUpdate = async (profileData) => {
    try {
      // Reset validation errors
      setValidationErrors({});
      
      // Validate required fields
      const requiredFields = ['display_name', 'email'];
      const newErrors = {};
      
      requiredFields.forEach(field => {
        if (!validateRequired(profileData[field])) {
          newErrors[field] = `${field.replace('_', ' ')} is required`;
        }
      });
      
      // Validate email format
      if (profileData.email && !validateEmailFormat(profileData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Validate slug format
      if (profileData.slug && !isValidSlugFormat(profileData.slug)) {
        newErrors.slug = 'Profile slug can only contain letters, numbers, and hyphens';
      }
      
      // Check if there are validation errors
      if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors);
        return false;
      }
      
      // Check email uniqueness if email has changed
      if (profileData.email !== userData.email) {
        const isUnique = await validateEmailUniqueness(profileData.email);
        if (!isUnique) {
          setValidationErrors(prev => ({
            ...prev,
            email: 'This email is already in use'
          }));
          return false;
        }
      }
      
      // Format photo URL before saving
      if (profileData.photo_url) {
        profileData.photo_url = cleanImageUrl(profileData.photo_url);
      }
      
      // In real implementation, save profile data to the selected business card
      // await fetch(`/api/v1/business-cards/${selectedCardId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });
      
      // Simulate successful update
      console.log('Updating business card:', selectedCardId, profileData);
      
      // Update the card in local state
      const updatedCards = businessCards.map(card => 
        card.id === selectedCardId 
          ? { 
              ...card, 
              display_name: profileData.display_name,
              title: profileData.title,
              bio: profileData.bio,
              email: profileData.email,
              website: profileData.website,
              photo_url: profileData.photo_url,
              company_logo_url: profileData.company_logo_url,
              slug: profileData.slug,
              contact: profileData.contact,
              updated_at: new Date().toISOString()
            }
          : card
      );
      
      setBusinessCards(updatedCards);
      
      // Update selected card data
      setUserData({
        ...userData,
        ...profileData,
        photo_url: formatPhotoUrl(profileData.photo_url),
        profile_url: formatProfileUrl(profileData.slug)
      });
      
      return true;
    } catch (error) {
      setError(getUserFriendlyError(error.message));
      return false;
    }
  };

  const handleSetAsPrimary = async () => {
    try {
      if (!selectedCardId) return;
      
      // In real implementation, make API call to set as primary
      // await fetch(`/api/v1/business-cards/${selectedCardId}/set-primary`, {
      //   method: 'PUT'
      // });
      
      // Update local state
      const updatedCards = businessCards.map(card => ({
        ...card,
        is_primary: card.id === selectedCardId
      }));
      
      setBusinessCards(updatedCards);
      alert(`Card set as primary successfully!`);
    } catch (error) {
      setError(getUserFriendlyError(error.message));
    }
  };

  const handleManageCards = () => {
    navigate('/app/business-cards');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
        <button 
          onClick={handleManageCards}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Manage Business Cards
        </button>
      </div>

      {businessCards.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Business Card to Edit:
          </label>
          <div className="flex flex-wrap gap-3">
            {businessCards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardChange(card.id)}
                className={`px-4 py-2 rounded-md border ${
                  selectedCardId === card.id
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {card.display_name}
                {card.is_primary && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Primary
                  </span>
                )}
              </button>
            ))}
          </div>
          {selectedCardId && !businessCards.find(card => card.id === selectedCardId).is_primary && (
            <button
              onClick={handleSetAsPrimary}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Set as primary card
            </button>
          )}
        </div>
      )}
      
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h3 className="text-yellow-800 font-medium mb-2">Please fix the following issues:</h3>
          <ul className="list-disc pl-5 text-yellow-700">
            {Object.values(validationErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {userData && (
        <ProfileEditor 
          initialProfile={{
            displayName: userData.display_name,
            title: userData.title,
            bio: userData.bio,
            slug: userData.slug,
            photoUrl: userData.photo_url,
            companyLogoUrl: userData.company_logo_url,
            userId: userData.user_id,
            email: userData.email,
            website: userData.website,
            profileUrl: userData.profile_url,
            contact: userData.contact || {}
          }}
          onUpdate={handleProfileUpdate}
          validationErrors={validationErrors}
        />
      )}
    </div>
  );
};

const ProfilePage = () => {
  return (
    <Suspense fallback={<div>Loading Profile...</div>}>
      <UserProfile />
    </Suspense>
  );
};

export default ProfilePage;