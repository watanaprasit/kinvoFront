import { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { ProfileService } from '../../services/profileServices';
import { StyledProfileEditor, PreviewContainer, EditorContainer } from './styles';

const ProfileEditor = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    display_name: user?.name || user?.display_name || '',
    slug: user?.slug || '',
    photo_url: user?.photo_url || ''
  });
  const [previewFile, setPreviewFile] = useState(null);
  const [slugAvailable, setSlugAvailable] = useState(true);

  useEffect(() => {
    console.log('User from AuthContext:', user);
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Log the entire user object to see its structure
        console.log('FULL USER OBJECT:', user);

        // Try to extract user ID from different possible fields
        const userId = user?.id || user?.userId || user?.user_id;
        
        if (userId) {
          const profileData = await ProfileService.getProfileByUserId(userId);
          console.log('Fetched Profile Data:', profileData);
          setProfile(prev => ({
            ...prev,
            ...profileData
          }));
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));

    // Check slug availability if slug is being changed
    if (name === 'slug') {
      try {
        const result = await ProfileService.checkSlugAvailability(value);
        setSlugAvailable(result.available);
      } catch (error) {
        console.error('Slug availability check failed:', error);
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewFile(file);
      setProfile(prev => ({
        ...prev,
        photo_url: previewUrl
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!slugAvailable) {
      alert('Slug is not available');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('display_name', profile.display_name);
      formData.append('slug', profile.slug);
      
      if (previewFile) {
        formData.append('photo', previewFile);
      }

      const updatedProfile = await ProfileService.updateProfile(formData);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <StyledProfileEditor>
      <EditorContainer>
        <form onSubmit={handleSubmit}>
          <div className="photo-upload">
            <img 
              src={profile.photo_url || 'https://api.dicebear.com/6.x/personas/svg?seed=dude'} 
              alt="Profile" 
            />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange} 
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="display_name"
              value={profile.display_name}
              onChange={handleInputChange}
              placeholder="Display Name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="slug"
              value={profile.slug}
              onChange={handleInputChange}
              placeholder="Profile Slug"
              required
            />
            {!slugAvailable && (
              <p className="text-red-500">
                This slug is already taken. Please choose another.
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={!slugAvailable}
          >
            Save Changes
          </button>
        </form>
      </EditorContainer>

      <PreviewContainer>
        <div className="preview-card">
          <img 
            src={profile.photo_url || 'https://api.dicebear.com/6.x/personas/svg?seed=dude'} 
            alt="Profile Preview" 
          />
          <h3>{profile.display_name || 'Display Name'}</h3>
          <p>{profile.slug || 'Profile Slug'}</p>
        </div>
        <div className="app-name">Kinvo</div>
      </PreviewContainer>
    </StyledProfileEditor>
  );
};

export default ProfileEditor;