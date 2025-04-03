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
    photo_url: ''
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

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
        photo_url: cleanImageUrl(userProfile.photo_url) || ''
      };
      
      setFormData(newFormData);
      
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
        
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'slug' && value.trim()) {
      try {
        const result = await ProfileService.checkSlugAvailability(value);
        setSlugAvailable(result.available);
      } catch (error) {
        setSlugAvailable(false);
      }
    }
  }, []);

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

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(localPreviewUrl);
    setSubmitError(null);
  }, []);

  const getDisplayImageUrl = useCallback(() => {
    if (previewUrl) {
      return previewUrl;
    }
    
    if (userProfile?.photo_url) {
      // Use the URL directly from the profile context
      return cleanImageUrl(userProfile.photo_url);
    }
    
    if (formData.photo_url) {
      return cleanImageUrl(formData.photo_url);
    }
    
    return DEFAULT_AVATAR;
  }, [previewUrl, formData.photo_url, userProfile, cleanImageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!slugAvailable) {
      setSubmitError('Please choose an available slug');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const updateFormData = new FormData();
      updateFormData.append('display_name', formData.display_name.trim());
      updateFormData.append('slug', formData.slug.trim());
      
      if (previewFile) {
        updateFormData.append('photo', previewFile);
      }

      const updatedProfile = await ProfileService.updateProfile(user.id, updateFormData);
      
      if (updatedProfile) {
        const newProfile = {
          ...updatedProfile,
          photo_url: cleanImageUrl(updatedProfile.photo_url) || formData.photo_url
        };

        setFormData(prev => ({
          ...prev,
          ...newProfile
        }));
        
        await updateUserProfile(newProfile);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to update profile');
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
      // Reset states when the image source changes
      setLocalLoading(true);
      setRetryCount(0);
      
      const displayUrl = getDisplayImageUrl();
      console.log('Setting image src to:', displayUrl);
      
      // Add a timestamp to prevent caching
      const urlWithTimestamp = displayUrl.includes('?') 
        ? `${displayUrl}&_=${Date.now()}` 
        : `${displayUrl}?_=${Date.now()}`;
        
      setImgSrc(urlWithTimestamp);
    }, [getDisplayImageUrl]); 

    useEffect(() => {
      if (userProfile?.photo_url) {
        const url = cleanImageUrl(userProfile.photo_url);
        console.log('Validating image URL:', url);
        
        // Create a test image to check if the URL is valid
        const testImg = new Image();
        testImg.onload = () => console.log('TEST IMAGE LOADED SUCCESSFULLY:', url);
        testImg.onerror = () => console.log('TEST IMAGE FAILED TO LOAD:', url);
        testImg.src = url;
      }
    }, [userProfile, cleanImageUrl]);

    const handleImageError = (e) => {
      console.log(`Image failed to load (attempt ${retryCount + 1}):`, imgSrc);
      
      if (retryCount < maxRetries) {
        // Try again with a delay (in case it's a timing issue)
        setTimeout(() => {
          console.log(`Retrying image load (attempt ${retryCount + 1})...`);
          const newUrl = `${cleanImageUrl(imgSrc)}?_=${Date.now()}`;
          setImgSrc(newUrl);
          setRetryCount(prevCount => prevCount + 1);
        }, 500);
      } else {
        setLocalLoading(false);
        // Only change to default if not already using default
        if (!e.target.src.includes('dicebear')) {
          console.log('Falling back to default avatar');
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
            console.log('Image loaded successfully:', imgSrc);
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
          <p>{formData.slug || 'Profile Slug'}</p>
        </div>
        <div className="app-name">Kinvo</div>
      </PreviewContainer>
    </StyledProfileEditor>
  );
};

export default ProfileEditor;