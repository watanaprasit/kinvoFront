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

  useEffect(() => {
    if (userProfile) {
        console.log('ProfileEditor - Complete UserProfile:', userProfile);
        
        const newFormData = {
            display_name: userProfile.display_name || user?.full_name || '',
            slug: userProfile.slug || user?.slug || '',
            photo_url: userProfile.photo_url || ''
        };
        
        console.log('ProfileEditor - Setting form data:', newFormData);
        setFormData(newFormData);
        
        if (userProfile.photo_url) {
            console.log('ProfileEditor - Setting photo URL:', userProfile.photo_url);
            setPreviewUrl(userProfile.photo_url);
        } else {
            console.log('ProfileEditor - No photo URL found');
            setPreviewUrl('');
        }
    }
  }, [userProfile, user]);

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
    console.log('ProfileEditor - Getting display image URL');
    console.log('- Preview URL:', previewUrl);
    console.log('- Form Data photo_url:', formData.photo_url);
    
    if (previewUrl) {
        console.log('Returning preview URL:', previewUrl);
        return previewUrl;
    }
    
    if (formData.photo_url) {
        try {
            console.log('Returning form data photo URL:', formData.photo_url);
            return formData.photo_url;
        } catch (e) {
            console.error('Error with photo URL:', e);
            console.log('Falling back to default avatar');
            return DEFAULT_AVATAR;
        }
    }
    
    console.log('Returning default avatar');
    return DEFAULT_AVATAR;
  }, [previewUrl, formData.photo_url]);

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
            console.log('Updated profile response:', updatedProfile);
            
            const newProfile = {
                ...updatedProfile,
                photo_url: updatedProfile.photo_url || formData.photo_url
            };

            setFormData(prev => ({
                ...prev,
                ...newProfile
            }));
            
            await updateUserProfile(newProfile);
            alert('Profile updated successfully!');
        }
    } catch (error) {
        console.error('Submit error:', error);
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

  const ImageComponent = ({ className = '' }) => (
    <img 
        src={getDisplayImageUrl()} 
        alt="Profile"
        className={className}
        onLoad={() => {
            setIsImageLoading(false);
            console.log('ProfileEditor - Image loaded successfully. URL:', getDisplayImageUrl());
        }}
        onError={(e) => {
            console.error('ProfileEditor - Image failed to load:', {
                attemptedUrl: e.target.src,
                formDataUrl: formData.photo_url,
                previewUrl: previewUrl,
                userProfileUrl: userProfile?.photo_url
            });
            setIsImageLoading(false);
            if (!e.target.src.includes('dicebear')) {
                e.target.src = DEFAULT_AVATAR;
            }
        }}
        style={{ 
            opacity: isImageLoading ? 0.5 : 1,
            maxWidth: '100%',
            height: 'auto'
        }}
    />
  );

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