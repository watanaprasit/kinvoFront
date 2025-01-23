// src/features/profile/components/ProfileEditor/index.jsx
import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ProfileService } from '../../services/profile.service';
import { StyledProfileEditor, PreviewContainer, EditorContainer } from './styles';

const ProfileEditor = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    jobTitle: user?.jobTitle || '',
    photoUrl: user?.photoUrl || ''
  });
  const [previewFile, setPreviewFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewFile(URL.createObjectURL(file));
      // Will be handled in form submission
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('displayName', profile.displayName);
      formData.append('jobTitle', profile.jobTitle);
      if (previewFile) {
        formData.append('photo', previewFile);
      }

      const updatedProfile = await ProfileService.updateProfile(formData);
      updateUser(updatedProfile);
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
              src={previewFile || profile.photoUrl || '/default-avatar.png'} 
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
              name="displayName"
              value={profile.displayName}
              onChange={handleInputChange}
              placeholder="Display Name"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="jobTitle"
              value={profile.jobTitle}
              onChange={handleInputChange}
              placeholder="Job Title"
            />
          </div>

          <button type="submit">Save Changes</button>
        </form>
      </EditorContainer>

      <PreviewContainer>
        <div className="preview-card">
          <img 
            src={previewFile || profile.photoUrl || '/default-avatar.png'} 
            alt="Profile Preview" 
          />
          <h3>{profile.displayName || 'Display Name'}</h3>
          <p>{profile.jobTitle || 'Job Title'}</p>
        </div>
      </PreviewContainer>
    </StyledProfileEditor>
  );
};

export default ProfileEditor;