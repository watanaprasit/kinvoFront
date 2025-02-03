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

  useEffect(() => {
    if (userProfile) {
      console.log('Setting initial form data:', userProfile);  // Debug log
      setFormData({
        display_name: userProfile.display_name || user?.name || '',
        slug: userProfile.slug || user?.slug || '',
        photo_url: userProfile.photo_url || ''
      });
      setPreviewUrl(userProfile.photo_url || '');
    }
  }, [userProfile, user]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    console.log('Input changed:', name, value);  // Debug log
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('New form data:', newData);  // Debug log
      return newData;
    });

    if (name === 'slug' && value.trim()) {
      try {
        console.log('Checking slug availability for:', value);  // Debug log
        const result = await ProfileService.checkSlugAvailability(value);
        console.log('Slug availability result:', result);  // Debug log
        setSlugAvailable(result.available);
      } catch (error) {
        console.error('Slug availability check failed:', error);
        setSlugAvailable(false);
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewFile(file);
      setPreviewUrl(localPreviewUrl);
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
        // Send as a regular object instead of FormData
        const updateData = {
          display_name: formData.display_name,
          slug: formData.slug,
          photo: previewFile || null  // Include photo if exists
        };

        const updatedProfile = await updateUserProfile(updateData);
        
        // Update the preview URL with the new photo_url from the response
        if (updatedProfile.photo_url) {
          setPreviewUrl(updatedProfile.photo_url);
        }
        
        setPreviewFile(null);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Submit error:', error);  // Add this for debugging
        setSubmitError(error.message || 'Failed to update profile');
      } finally {
        setIsSubmitting(false);
      }
  };

  // Helper function to get the display image URL
  const getDisplayImageUrl = () => {
    if (previewUrl) {
      return previewUrl;
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
            <img 
              src={getDisplayImageUrl()} 
              alt="Profile"
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.src = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
              }}
            />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange} 
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
            onError={(e) => {
              e.target.src = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
            }}
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