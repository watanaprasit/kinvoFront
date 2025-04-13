import { useState, useEffect, useCallback, memo } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { ProfileService } from '../../services/profileServices';
import { StyledProfileEditor, PreviewContainer, EditorContainer } from './styles';

const DEFAULT_AVATAR = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const VALID_TYPES = ['image/jpeg', 'image/png'];

// Create a memoized image component that only re-renders when its props change
const ProfileImage = memo(({ isPreview, previewUrl, userProfile, savedPreviewUrl, cleanImageUrl }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  
  // Function to get display image URL is now a local function inside the component
  const getDisplayImageUrl = useCallback(() => {
    if (savedPreviewUrl) {
      return savedPreviewUrl;
    }
    
    if (userProfile?.photo_url) {
      return cleanImageUrl(userProfile.photo_url);
    }
    
    return DEFAULT_AVATAR;
  }, [savedPreviewUrl, userProfile?.photo_url, cleanImageUrl]);
  
  useEffect(() => {
    setLocalLoading(true);
    setRetryCount(0);
    
    // Use different image source logic based on whether this is for the form or preview
    const displayUrl = isPreview 
      ? getDisplayImageUrl() 
      : (previewUrl || (userProfile?.photo_url ? cleanImageUrl(userProfile.photo_url) : DEFAULT_AVATAR));
    
    if (displayUrl.startsWith('blob:')) {
      setImgSrc(displayUrl);
    } else {
      setImgSrc(ProfileService.formatPhotoUrl(displayUrl));
    }
  }, [isPreview, previewUrl, getDisplayImageUrl, userProfile, cleanImageUrl]);

  const handleImageError = (e) => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        if (imgSrc.startsWith('blob:')) {
          setRetryCount(prevCount => prevCount + 1);
        } else {
          setImgSrc(ProfileService.formatPhotoUrl(cleanImageUrl(imgSrc)));
          setRetryCount(prevCount => prevCount + 1);
        }
      }, 500);
    } else {
      setLocalLoading(false);
      if (!e.target.src.includes('dicebear')) {
        e.target.src = DEFAULT_AVATAR;
      }
    }
  };

  return (
    <div className="image-wrapper">
      {localLoading && <div className="loading-spinner">Loading...</div>}
      <img 
        src={imgSrc} 
        alt="Profile"
        onLoad={() => {
          setLocalLoading(false);
        }}
        onError={handleImageError}
        style={{ 
          opacity: localLoading ? 0.5 : 1,
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
});

// Similar component for company logo
const CompanyLogo = memo(({ previewUrl, userProfile, savedPreviewUrl, cleanImageUrl }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  
  useEffect(() => {
    setLocalLoading(true);
    setRetryCount(0);
    
    const displayUrl = previewUrl || 
      (userProfile?.company_logo_url ? cleanImageUrl(userProfile.company_logo_url) : '');
    
    if (!displayUrl) {
      setLocalLoading(false);
      setImgSrc('');
      return;
    }
    
    if (displayUrl.startsWith('blob:')) {
      setImgSrc(displayUrl);
    } else {
      setImgSrc(ProfileService.formatPhotoUrl(displayUrl));
    }
  }, [previewUrl, userProfile, cleanImageUrl]);

  const handleImageError = (e) => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        if (imgSrc.startsWith('blob:')) {
          setRetryCount(prevCount => prevCount + 1);
        } else {
          setImgSrc(ProfileService.formatPhotoUrl(cleanImageUrl(imgSrc)));
          setRetryCount(prevCount => prevCount + 1);
        }
      }, 500);
    } else {
      setLocalLoading(false);
      // No default fallback for company logo
    }
  };

  if (!imgSrc) {
    return null; // Don't render anything if no logo
  }

  return (
    <div className="image-wrapper company-logo-wrapper">
      {localLoading && <div className="loading-spinner">Loading...</div>}
      <img 
        src={imgSrc} 
        alt="Company Logo"
        onLoad={() => {
          setLocalLoading(false);
        }}
        onError={handleImageError}
        style={{ 
          opacity: localLoading ? 0.5 : 1,
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
});

// Add proper display names to memo components
ProfileImage.displayName = 'ProfileImage';
CompanyLogo.displayName = 'CompanyLogo';

const ProfileEditor = () => {
  const { user, userProfile, error: authError, updateUserProfile, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: '',
    company_logo_url: ''
  });
  
  // Separate state for the preview that only updates after saving
  const [previewData, setPreviewData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: '',
    company_logo_url: ''
  });
  
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [savedPreviewUrl, setSavedPreviewUrl] = useState('');
  
  // New state for company logo
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoPreviewUrl, setCompanyLogoPreviewUrl] = useState('');
  const [savedCompanyLogoUrl, setSavedCompanyLogoUrl] = useState('');
  
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fixed unused variable warning
  const [isImageLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: '',
    company_logo_url: ''
  });

  // Helper function to clean URLs by removing trailing question marks
  const cleanImageUrl = useCallback((url) => {
    if (!url) return null;
    
    // First, remove any trailing question mark
    let cleaned = url.endsWith('?') ? url.slice(0, -1) : url;
    
    // Then, remove any existing cache-busting parameters
    if (cleaned.includes('?t=')) {
      cleaned = cleaned.split('?t=')[0];
    }
    
    return cleaned;
  }, []);
  
  useEffect(() => {
    if (userProfile) {
      const newFormData = {
        display_name: userProfile.display_name || user?.full_name || '',
        slug: userProfile.slug || user?.slug || '',
        photo_url: cleanImageUrl(userProfile.photo_url) || '',
        title: userProfile.title || '',
        bio: userProfile.bio || '',
        company_logo_url: cleanImageUrl(userProfile.company_logo_url) || ''
      };
      
      setFormData(newFormData);
      setPreviewData(newFormData); 
      setOriginalFormData(newFormData);
      setSlugAvailable(true);
      
      if (userProfile.photo_url) {
        const cleanUrl = cleanImageUrl(userProfile.photo_url);
        setPreviewUrl(cleanUrl);
        setSavedPreviewUrl(cleanUrl);
      } else {
        setPreviewUrl('');
        setSavedPreviewUrl('');
      }
      
      if (userProfile.company_logo_url) {
        const cleanLogoUrl = cleanImageUrl(userProfile.company_logo_url);
        setCompanyLogoPreviewUrl(cleanLogoUrl);
        setSavedCompanyLogoUrl(cleanLogoUrl);
      } else {
        setCompanyLogoPreviewUrl('');
        setSavedCompanyLogoUrl('');
      }
    }
  }, [userProfile, user, cleanImageUrl]);

  // Modified handleInputChange to use a debounced slug validation
  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;
    
    // Clear previous errors
    setSubmitError(null);
    
    // Special validation for slug
    if (name === 'slug') {
      const slugRegex = /^[a-zA-Z0-9-]+$/;
      if (value && !slugRegex.test(value)) {
        setSubmitError('Slug can only contain letters, numbers, and hyphens.');
        setSlugAvailable(false);
        
        // Still update the form data to show what the user typed
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        return;
      }
    }
        
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    // Only check slug availability if it's different from current slug
    if (name === 'slug' && value.trim()) {
      // Skip validation if the slug is unchanged from user's current slug
      if (userProfile && value === userProfile.slug) {
        setSlugAvailable(true); // User's own slug is always "available" to them
        return;
      }
      
      try {
        const result = await ProfileService.checkSlugAvailability(value);
        setSlugAvailable(result.available);
      } catch (error) {
        setSlugAvailable(false);
        setSubmitError('Error checking slug availability');
      }
    }
  }, [userProfile]);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      setSubmitError('Please upload a JPEG or PNG file');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setSubmitError('File size must be less than 5MB');
      return;
    }

    // Clean up previous blob URL if exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(localPreviewUrl);
    setSubmitError(null);
  }, [previewUrl]);

  // New handler for company logo uploads
  const handleCompanyLogoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      setSubmitError('Please upload a JPEG or PNG file for company logo');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setSubmitError('Company logo file size must be less than 5MB');
      return;
    }

    // Clean up previous blob URL if exists
    if (companyLogoPreviewUrl && companyLogoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(companyLogoPreviewUrl);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setCompanyLogoFile(file);
    setCompanyLogoPreviewUrl(localPreviewUrl);
    setSubmitError(null);
  }, [companyLogoPreviewUrl]);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      if (companyLogoPreviewUrl && companyLogoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(companyLogoPreviewUrl);
      }
    };
  }, [previewUrl, companyLogoPreviewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsSubmitting(true);
    setSubmitError(null);
  
    try {
      const updateFormData = new FormData();
      
      // Only include fields that have changed
      if (formData.display_name.trim() !== originalFormData.display_name) {
          updateFormData.append('display_name', formData.display_name.trim());
      }
      
      // Include slug if it has changed - backend will validate
      if (formData.slug.trim() !== originalFormData.slug) {
        updateFormData.append('slug', formData.slug.trim());
      }
      
      // Add the new fields to the form data
      if (formData.title.trim() !== originalFormData.title) {
        updateFormData.append('title', formData.title.trim());
      }
      
      if (formData.bio.trim() !== originalFormData.bio) {
        updateFormData.append('bio', formData.bio.trim());
      }
      
      // Only include photo if there's a new one
      if (previewFile) {
          updateFormData.append('photo', previewFile);
      }

      // Add company logo if there's a new one
      if (companyLogoFile) {
          updateFormData.append('company_logo', companyLogoFile);
      }
  
      const updatedProfile = await updateUserProfile(updateFormData);
      
      if (updatedProfile) {
        const updatedFormData = {
          display_name: updatedProfile.display_name || originalFormData.display_name,
          slug: updatedProfile.slug || originalFormData.slug,
          photo_url: cleanImageUrl(updatedProfile.photo_url) || originalFormData.photo_url,
          title: updatedProfile.title || originalFormData.title,
          bio: updatedProfile.bio || originalFormData.bio,
          company_logo_url: cleanImageUrl(updatedProfile.company_logo_url) || originalFormData.company_logo_url
        };
        
        // Update original form data with the new values
        setOriginalFormData(updatedFormData);
        
        // Also update current form data
        setFormData(prev => ({
          ...prev,
          ...updatedFormData
        }));
        
        // IMPORTANT: Only now update the preview data
        setPreviewData(updatedFormData);
        
        // Update the saved preview URL if there was a new photo
        if (previewFile) {
          setSavedPreviewUrl(previewUrl);
        } else if (updatedProfile.photo_url) {
          setSavedPreviewUrl(cleanImageUrl(updatedProfile.photo_url));
        }
        
        // Update the saved company logo URL if there was a new one
        if (companyLogoFile) {
          setSavedCompanyLogoUrl(companyLogoPreviewUrl);
        } else if (updatedProfile.company_logo_url) {
          setSavedCompanyLogoUrl(cleanImageUrl(updatedProfile.company_logo_url));
        }
        
        alert('Profile updated successfully!');
      }
  
    } catch (error) {
      // Extract and display the error message
      if (error.message.includes('violates check constraint')) {
          setSubmitError('Your slug contains invalid characters. Please use only letters, numbers, and hyphens.');
      } else if (error.message.includes('Slug is already taken')) {
          setSubmitError('This slug is already taken. Please choose another.');
      } else {
          setSubmitError(error.message || 'Failed to update profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <StyledProfileEditor>
      <EditorContainer>
        
        {(authError || submitError) && (
          <div className="error-message">
            {authError || submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="photo-upload company-logo-upload">
            <div className="image-container">
              <CompanyLogo 
                previewUrl={companyLogoPreviewUrl}
                userProfile={userProfile}
                savedPreviewUrl={savedCompanyLogoUrl}
                cleanImageUrl={cleanImageUrl}
              />
              {!companyLogoPreviewUrl && !userProfile?.company_logo_url && (
                <div className="no-logo-placeholder">No company logo</div>
              )}
            </div>
            <label htmlFor="company-logo-upload">Company Logo</label>
            <input 
              id="company-logo-upload"
              type="file" 
              accept={VALID_TYPES.join(',')}
              onChange={handleCompanyLogoChange}
              aria-label="Upload company logo" 
            />
          </div>

          {/* Profile Photo Upload - Now below company logo */}
          <div className="photo-upload">
            <div className="image-container">
              {isImageLoading && <div className="loading-spinner">Loading...</div>}
              <ProfileImage 
                isPreview={false}
                previewUrl={previewUrl}
                userProfile={userProfile}
                savedPreviewUrl={savedPreviewUrl}
                cleanImageUrl={cleanImageUrl}
              />
            </div>
            <label htmlFor="photo-upload">Profile Photo</label>
            <input 
              id="photo-upload"
              type="file" 
              accept={VALID_TYPES.join(',')}
              onChange={handlePhotoChange}
              aria-label="Upload profile photo" 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="display_name">Display Name</label>
            <input
              id="display_name"
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleInputChange}
              placeholder="Display Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Profile Slug</label>
            <input
              id="slug"
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Profile Slug"
              required
            />
            {!slugAvailable && formData.slug && (
              <p className="text-red-500">
                This slug is already taken. Please choose another.
              </p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Professional Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Your Professional Title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself"
              rows="6"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !slugAvailable || !formData.slug}
            className={isSubmitting || !slugAvailable || !formData.slug ? 'disabled' : ''}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </EditorContainer>

      <PreviewContainer>
        <div className="preview-card">
          {/* Company Logo Area with background color */}
          <div className="company-logo-container" style={{ backgroundColor: '#4a90e2' }}>
            <CompanyLogo 
              previewUrl={companyLogoPreviewUrl}
              userProfile={userProfile}
              savedPreviewUrl={savedCompanyLogoUrl}
              cleanImageUrl={cleanImageUrl}
            />
            {!companyLogoPreviewUrl && !userProfile?.company_logo_url && (
              <div className="no-logo-placeholder">No company logo</div>
            )}
          </div>
          
          {/* Profile Content Section */}
          <div className="profile-content">
            {/* Profile Image */}
            <ProfileImage 
              isPreview={true}
              previewUrl={previewUrl}
              userProfile={userProfile}
              savedPreviewUrl={savedPreviewUrl}
              cleanImageUrl={cleanImageUrl}
            />
            
            <h3>{previewData.display_name || 'Display Name'}</h3>
            {previewData.title && <h4>{previewData.title}</h4>}
            
            {previewData.bio && 
              <p className="bio-text">{previewData.bio}</p>
            }
            
            {/* Contact Buttons Section */}
            <div className="contact-buttons">
              <div className="contact-button">
                <span>Email</span>
              </div>
              <div className="contact-button">
                <span>Phone</span>
              </div>
              <div className="contact-button">
                <span>Website</span>
              </div>
            </div>
            
            {/* Kinvo Branding Section - Now INSIDE the phone screen */}
            <div className="kinvo-branding">
              <div className="brand-text">Kinvo</div>
              <div className="profile-url">
                <span>kinvo.com/{previewData.slug || 'profile-slug'}</span>
              </div>
            </div>
          </div>
        </div>
      </PreviewContainer>
    </StyledProfileEditor>
  );
};

export default ProfileEditor;