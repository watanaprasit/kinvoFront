import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { ProfileService } from '../../services/profileServices';
import { StyledProfileEditor, PreviewContainer, EditorContainer } from './styles';

const DEFAULT_AVATAR = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const VALID_TYPES = ['image/jpeg', 'image/png'];

const ProfileEditor = () => {
  const { user, userProfile, error: authError, updateUserProfile, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: ''
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: ''
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
        bio: userProfile.bio || ''
      };
      
      setFormData(newFormData);
      // Also set the original form data when loading the profile
      setOriginalFormData(newFormData);
      setSlugAvailable(true);
      
      if (userProfile.photo_url) {
        const cleanUrl = cleanImageUrl(userProfile.photo_url);
        setPreviewUrl(cleanUrl);
      } else {
        setPreviewUrl('');
      }
    }
  }, [userProfile, user, cleanImageUrl]);

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

  const getDisplayImageUrl = useCallback(() => {
    if (previewUrl) {
      return previewUrl;
    }
    
    if (userProfile?.photo_url) {
      return cleanImageUrl(userProfile.photo_url);
    }
    
    if (formData.photo_url) {
      return cleanImageUrl(formData.photo_url);
    }
    
    return DEFAULT_AVATAR;
  }, [previewUrl, formData.photo_url, userProfile, cleanImageUrl]);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
  
      const updatedProfile = await updateUserProfile(updateFormData);
      
      if (updatedProfile) {
        // Update original form data with the new values
        setOriginalFormData({
          display_name: updatedProfile.display_name || originalFormData.display_name,
          slug: updatedProfile.slug || originalFormData.slug,
          photo_url: cleanImageUrl(updatedProfile.photo_url) || originalFormData.photo_url,
          title: updatedProfile.title || originalFormData.title,
          bio: updatedProfile.bio || originalFormData.bio
        });
        
        // Also update current form data
        setFormData(prev => ({
          ...prev,
          display_name: updatedProfile.display_name || prev.display_name,
          slug: updatedProfile.slug || prev.slug,
          photo_url: cleanImageUrl(updatedProfile.photo_url) || prev.photo_url,
          title: updatedProfile.title || prev.title,
          bio: updatedProfile.bio || prev.bio
        }));
        
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

  const ImageComponent = ({ className = '' }) => {
    const [imgSrc, setImgSrc] = useState('');
    const [localLoading, setLocalLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 2;
    
    useEffect(() => {
      setLocalLoading(true);
      setRetryCount(0);
      
      const displayUrl = getDisplayImageUrl();
      
      if (displayUrl.startsWith('blob:')) {
        setImgSrc(displayUrl);
      } else {
        setImgSrc(ProfileService.formatPhotoUrl(displayUrl));
      }
    }, [getDisplayImageUrl]); 

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
          className={className}
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
  };

  return (
    <StyledProfileEditor>
      <EditorContainer>
        {(authError || submitError) && (
          <div className="error-message">
            {authError || submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="photo-upload">
            <div className="image-container">
              {isImageLoading && <div className="loading-spinner">Loading...</div>}
              <ImageComponent />
            </div>
            <input 
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
          <ImageComponent />
          <h3>{formData.display_name || 'Display Name'}</h3>
          {formData.title && <h4>{formData.title}</h4>}
          
          {/* Bio moved further down with improved styling */}
          {formData.bio && <div className="bio-container">
            <p className="bio">{formData.bio}</p>
          </div>}
          
          {/* URL display moved right above app name */}
          <div className="profile-url">
            <span>kinvo.com/{formData.slug || 'profile-slug'}</span>
          </div>
          <div className="app-name">Kinvo</div>
        </div>
      </PreviewContainer>
    </StyledProfileEditor>
  );
};

export default ProfileEditor;