// src/pages/app/ProfilePage.jsx
import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
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
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileUserId = userId || user?.id;
        
        if (!profileUserId) {
          throw new Error('No user ID available');
        }

        const profileData = await ProfileService.getProfileByUserId(profileUserId);
        
        // Format photo URL before setting user data
        if (profileData.photo_url) {
          profileData.photo_url = formatPhotoUrl(cleanImageUrl(profileData.photo_url));
        }
        
        // Validate slug format
        if (profileData.slug && !isValidSlugFormat(profileData.slug)) {
          setValidationErrors(prev => ({
            ...prev,
            slug: 'Profile slug can only contain letters, numbers, and hyphens'
          }));
        }
        
        // Format profile URL if slug exists
        if (profileData.slug) {
          profileData.profile_url = formatProfileUrl(profileData.slug);
        }
        
        // Validate email if present
        if (profileData.email) {
          if (!validateEmailFormat(profileData.email)) {
            setValidationErrors(prev => ({
              ...prev,
              email: 'Please enter a valid email address'
            }));
          }
          
          // Only check known providers if email format is valid
          if (validateEmailFormat(profileData.email) && 
              !validateKnownEmailProvider(profileData.email)) {
            console.warn('Unknown email provider used');
          }
        }
        
        setUserData(profileData);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(getUserFriendlyError(error.message));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [userId, user]);

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
      
      // Save profile data
      await ProfileService.updateProfile(profileData);
      
      // Update local state with formatted data
      setUserData({
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error}</div>;

  return (
    <>
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
      
      <ProfileEditor 
        initialProfile={{
          displayName: userData.display_name,
          slug: userData.slug,
          photoUrl: userData.photo_url,
          userId: userData.user_id,
          email: userData.email,
          profileUrl: userData.profile_url
        }}
        onUpdate={handleProfileUpdate}
        validationErrors={validationErrors}
      />
    </>
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