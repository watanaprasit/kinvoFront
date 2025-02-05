import { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { ProfileService } from '../../services/profileServices';
import { StyledProfileEditor, PreviewContainer, EditorContainer } from './styles';

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
      setFormData({
        display_name: userProfile.display_name || user?.name || '',
        slug: userProfile.slug || user?.slug || '',
        photo_url: userProfile.photo_url || ''
      });
      // Add timestamp to force image refresh when URL changes
      setPreviewUrl(userProfile.photo_url ? `${userProfile.photo_url}?t=${Date.now()}` : '');
    }
  }, [userProfile, user]);

  const handleInputChange = async (e) => {
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
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setSubmitError('Please upload a JPEG or PNG file');
        return;
      }
      
      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('File size must be less than 5MB');
        return;
      }

      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewFile(file);
      setPreviewUrl(localPreviewUrl);
      setSubmitError(null);
    }
  };

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
        // Ensure we're using the current form values
        updateFormData.append('display_name', formData.display_name.trim());
        updateFormData.append('slug', formData.slug.trim());
        
        if (previewFile) {
            updateFormData.append('photo', previewFile);
        }

        // Log exact values being sent
        for (let [key, value] of updateFormData.entries()) {
            console.log(`Submitting ${key}:`, value);
        }

        const updatedProfile = await ProfileService.updateProfile(user.id, updateFormData);
        
        if (updatedProfile) {
            // Update local state with the new values
            setFormData(prev => ({
                ...prev,
                display_name: updatedProfile.display_name,
                slug: updatedProfile.slug,
                photo_url: updatedProfile.photo_url
            }));
            
            // Update auth context
            await updateUserProfile(updatedProfile);
            
            alert('Profile updated successfully!');
        }
    } catch (error) {
        console.error('Submit error:', error);
        setSubmitError(error.message || 'Failed to update profile');
    } finally {
        setIsSubmitting(false);
    }
  };

  const getDisplayImageUrl = () => {
    if (previewUrl) {
      return previewUrl;
    }
    if (formData.photo_url) {
      return `${formData.photo_url}?t=${Date.now()}`;
    }
    return 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
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
          <div className="photo-upload">
            <div className="image-container">
              {isImageLoading && <div className="loading-spinner">Loading...</div>}
              <img 
                src={getDisplayImageUrl()} 
                alt="Profile"
                onLoad={() => setIsImageLoading(false)}
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  setIsImageLoading(false);
                  e.target.src = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
                }}
                style={{ opacity: isImageLoading ? 0.5 : 1 }}
              />
            </div>
            <input 
              type="file" 
              accept="image/jpeg,image/png" 
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
          <img 
            src={getDisplayImageUrl()} 
            alt="Profile Preview"
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => {
              setIsImageLoading(false);
              e.target.src = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
            }}
            style={{ opacity: isImageLoading ? 0.5 : 1 }}
          />
          <h3>{formData.display_name || 'Display Name'}</h3>
          <p>{formData.slug || 'Profile Slug'}</p>
        </div>
        <div className="app-name">Kinvo</div>
      </PreviewContainer>
    </StyledProfileEditor>
  );
};

export default ProfileEditor;