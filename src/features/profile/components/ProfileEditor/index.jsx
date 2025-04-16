import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { ProfileService } from '../../services/profileServices';
import ProfileQRCode from '../../../qrCode/components/ProfileQRCode';
import { StyledProfileEditor, PreviewContainer, EditorContainer, SlugLinkContainer, ErrorToast } from './styles';

const DEFAULT_AVATAR = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const VALID_TYPES = ['image/jpeg', 'image/png'];

// Helper function to convert technical errors to user-friendly messages
const getUserFriendlyError = (error) => {
  // Check for specific error patterns and return user-friendly alternatives
  if (error.includes('violates check constraint')) {
    return 'Your profile name can only contain letters, numbers, and hyphens.';
  } else if (error.includes('Slug is already taken')) {
    return 'This profile name is already being used by someone else. Please choose another one.';
  } else if (error.includes('maximum size')) {
    return 'Your file is too large. Please choose a smaller image (under 5MB).';
  } else if (error.includes('JPEG or PNG')) {
    return 'Please upload a photo in JPG or PNG format only.';
  } else if (error.includes('network error') || error.includes('timeout')) {
    return 'We couldn\'t connect to our servers. Please check your internet connection and try again.';
  } else if (error.includes('validation')) {
    return 'Something doesn\'t look right with your information. Please double-check what you\'ve entered.';
  } else if (error.includes('unauthorized') || error.includes('401')) {
    return 'Your session has expired. Please refresh the page and log in again.';
  } else if (error.includes('30 characters or less')) {
    return 'Your display name must be 30 characters or less.';
  } else if (error.includes('Display name must be')) {
    return 'Your display name must be 30 characters or less.';
  } else if (error.includes('email')) {
    return 'Please enter a valid email address.';
  } else if (error.includes('website')) {
    return 'Website must be a valid URL starting with http:// or https://';
  }
  
  // Default user-friendly message
  try {
    if (error.includes('{') && error.includes('}')) {
      const jsonMatch = error.match(/\{.*\}/);
      if (jsonMatch) {
        const errorObj = JSON.parse(jsonMatch[0]);
        if (errorObj.detail) {
          return errorObj.detail; // Return the specific error message from the API
        }
      }
    }
  } catch (e) {
    // If JSON parsing fails, continue to default message
  }
  
  // Default user-friendly message
  return 'Something went wrong. Please try again or contact support if the problem persists.';
};

// Profile Image component remains unchanged
const ProfileImage = memo(({ isPreview, previewUrl, userProfile, savedPreviewUrl, cleanImageUrl }) => {
  // Component code unchanged
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

// Company Logo component remains unchanged
const CompanyLogo = memo(({ previewUrl, userProfile, savedPreviewUrl, cleanImageUrl }) => {
  // Component code unchanged
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
  
  // Fix 1: Use useRef instead of the non-standard useCallback implementation
  const photoInputRef = useRef(null);
  const companyLogoInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: '',
    company_logo_url: '',
    email: '',
    website: '',
    contact: {} // For storing contact information
  });
  
  // Separate state for the preview that only updates after saving
  const [previewData, setPreviewData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: '',
    company_logo_url: '',
    email: '',
    website: '',
    contact: {} // For storing contact information
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
    company_logo_url: '',
    email: '',
    website: '',
    contact: {} // For storing contact information
  });
  
  // New state for error toast visibility
  const [showErrorToast, setShowErrorToast] = useState(false);

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
        company_logo_url: cleanImageUrl(userProfile.company_logo_url) || '',
        email: userProfile.email || user?.email || '',
        website: userProfile.website || '',
        contact: userProfile.contact || {}  
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

  // Effect to show error toast when error changes
  useEffect(() => {
    if (submitError || authError) {
      setShowErrorToast(true);
      
      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [submitError, authError]);

  // Fix 2: Simplified handlePencilClick to directly access the ref 
  const handlePencilClick = (inputRef) => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show a temporary success message (we'll add this element)
        const copySuccess = document.getElementById('copy-success');
        copySuccess.style.opacity = '1';
        setTimeout(() => {
          copySuccess.style.opacity = '0';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy URL to clipboard');
      });
  };

  // Modified handleInputChange to use a debounced slug validation
  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;
    
    // Clear previous errors
    setSubmitError(null);
    
    // Special validation for slug
    if (name === 'slug') {
      const slugRegex = /^[a-zA-Z0-9-]+$/;
      if (value && !slugRegex.test(value)) {
        setSubmitError('Your profile name can only contain letters, numbers, and hyphens.');
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
        
        if (!result.available) {
          setSubmitError('This profile name is already being used by someone else. Please choose another one.');
        }
      } catch (error) {
        setSlugAvailable(false);
        setSubmitError('We couldn\'t check if this profile name is available. Please try again.');
      }
    }
  }, [userProfile]);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      setSubmitError('Please upload a JPG or PNG image file for your profile photo.');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setSubmitError('Your profile photo is too large. Please choose an image under 5MB.');
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
      setSubmitError('Please upload a JPG or PNG image file for your company logo.');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setSubmitError('Your company logo is too large. Please choose an image under 5MB.');
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

  // Close error toast handler
  const handleCloseErrorToast = () => {
    setShowErrorToast(false);
  };

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

      // Add new contact fields
      if (formData.email !== originalFormData.email) {
        updateFormData.append('email', formData.email);
      }
      
      if (formData.website !== originalFormData.website) {
        updateFormData.append('website', formData.website);
      }
      
      // Handle contact object - only if it's changed
      if (JSON.stringify(formData.contact) !== JSON.stringify(originalFormData.contact)) {
        updateFormData.append('contact', JSON.stringify(formData.contact));
      }
      
      // Only include photo if there's a new one
      if (previewFile) {
          updateFormData.append('photo', previewFile);
      }

      // Add company logo if there's a new one
      if (companyLogoFile) {
          updateFormData.append('company_logo', companyLogoFile);
      }

      if (formData.email !== originalFormData.email || 
        formData.website !== originalFormData.website ||
        JSON.stringify(formData.contact) !== JSON.stringify(originalFormData.contact)) {
      
      // Optional: You can use the specialized endpoint for contact info
      const contactData = {
        email: formData.email,
        website: formData.website,
        contact: formData.contact
      };
      
      await ProfileService.updateContactInfo(contactData);
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
        
        // More friendly success message
        alert('Your profile has been updated successfully!');
      }

      setIsSubmitting(false);
  
    } catch (error) {
      console.error('Profile update error:', error); // Log the full error for debugging
      // Extract error message, handling different error object structures
      let errorMessage = 'Unknown error';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response && error.response.data) {
        // Handle API error responses
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || JSON.stringify(error.response.data);
      }
      
      // Convert to user-friendly message and set in state
      setSubmitError(getUserFriendlyError(errorMessage));
      setShowErrorToast(true); // Explicitly show the toast

      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <div>Loading your profile...</div>;
  }
  

  return (
    <StyledProfileEditor>
      {/* Error Toast Component with user-friendly messages */}
      {showErrorToast && (authError || submitError) && (
        <ErrorToast>
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <p>{authError ? getUserFriendlyError(authError) : submitError}</p>
          </div>
          <button className="close-button" onClick={handleCloseErrorToast}>×</button>
        </ErrorToast>
      )}
      
      {formData.slug && (
        <SlugLinkContainer className="standalone-slug-link">
          <div className="slug-message">Your Kinvo is Live:</div>
          <div className="slug-link-container">
            <a 
              href={`https://kinvo.com/${formData.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="slug-link"
            >
              <span className="domain">kinvo.com/</span>
              <span className="slug-value">{formData.slug}</span>
            </a>
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(`https://kinvo.com/${formData.slug}`)}
            >
              Copy your Kinvo URL
            </button>
            <span id="copy-success" className="copy-success">URL copied!</span>
          </div>
        </SlugLinkContainer>
      )}
      
      <div className="editor-preview-container">
        <EditorContainer>
          <form onSubmit={handleSubmit}>
              <div className="photo-upload company-logo-upload">
                {/* Label moved to the top */}
                <label htmlFor="company-logo-upload">Company Branding</label>
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
                  {/* Added pencil icon with attribution */}
                  <div 
                    className="edit-icon" 
                    onClick={() => handlePencilClick(companyLogoInputRef)}
                    title="Edit Image (Icon by alkhalifi design - Flaticon)"
                  >
                    {/* SVG pencil icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                      <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                    </svg>
                  </div>
                </div>
                <input 
                  id="company-logo-upload"
                  type="file" 
                  accept={VALID_TYPES.join(',')}
                  onChange={handleCompanyLogoChange}
                  aria-label="Upload company logo"
                  ref={companyLogoInputRef}
                  style={{ display: 'none' }} // Hide the input
                />
            </div>

            {/* Profile Photo Upload - Now below company logo */}
            <div className="photo-upload">
              {/* Label moved to the top */}
              <label htmlFor="photo-upload">Profile Picture</label>
              <div className="image-container">
                {isImageLoading && <div className="loading-spinner">Loading...</div>}
                <ProfileImage 
                  isPreview={false}
                  previewUrl={previewUrl}
                  userProfile={userProfile}
                  savedPreviewUrl={savedPreviewUrl}
                  cleanImageUrl={cleanImageUrl}
                />
                {/* Added pencil icon with attribution */}
                <div 
                  className="edit-icon" 
                  onClick={() => handlePencilClick(photoInputRef)}
                  title="Edit Image (Icon by alkhalifi design - Flaticon)"
                >
                  {/* SVG pencil icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                  </svg>
                </div>
              </div>
              <input 
                id="photo-upload"
                type="file" 
                accept={VALID_TYPES.join(',')}
                onChange={handlePhotoChange}
                aria-label="Upload profile photo"
                ref={photoInputRef}
                style={{ display: 'none' }} // Hide the input
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
                placeholder="Your name as shown on your profile"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Profile Name</label>
              <input
                id="slug"
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Choose a unique profile name (letters, numbers, hyphens only)"
                required
              />
              {!slugAvailable && formData.slug && (
                <p className="text-red-500">
                  This profile name is already being used by someone else. Please choose another one.
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
                placeholder="Your job title or professional role"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell visitors about yourself, your experience, and what you do"
                rows="6"
              />
            </div>

            {/* Add after the bio field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your contact email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Your website or portfolio (https://...)"
              />
            </div>

            {/* Optional: Add phone number field using the contact object */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.contact?.phone || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      phone: value
                    }
                  }));
                }}
                placeholder="Your phone number"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !slugAvailable || !formData.slug}
              className={isSubmitting || !slugAvailable || !formData.slug ? 'disabled' : ''}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </EditorContainer>
      

        <PreviewContainer>
          <div className="preview-card">
            {/* Company Logo Area with background color */}
            <div className="company-logo-container">
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
                {previewData.email && (
                  <div className="contact-button">
                    <span>Email</span>
                  </div>
                )}
                {previewData.contact?.phone && (
                  <div className="contact-button">
                    <span>Phone</span>
                  </div>
                )}
                {previewData.website && (
                  <div className="contact-button">
                    <span>Website</span>
                  </div>
                )}
              </div>

              {previewData.slug && (
                <div className="qr-code-container">
                  <ProfileQRCode 
                    slug={previewData.slug} 
                    size={80}
                    baseUrl={process.env.NODE_ENV === 'development' ? 'http://localhost:5173/' : 'https://kinvo.com/'}
                  />
                </div>
              )}
              
              {/* Kinvo Branding Section - Now INSIDE the phone screen */}
              <div className="kinvo-branding">
                <div className="brand-text">Kinvo</div>
                <div className="profile-url">
                  <span>kinvo.com/{previewData.slug || 'profile-name'}</span>
                </div>
              </div>
            </div>
          </div>
        </PreviewContainer>
      </div>
    </StyledProfileEditor>
  );
};

export default ProfileEditor;
