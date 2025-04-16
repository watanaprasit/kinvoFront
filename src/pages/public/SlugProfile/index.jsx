import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StyledSlugProfile } from './styles';
import { ProfileService } from '../../../features/profile/services/profileServices';
import ProfileQRCode from '../../../features/qrCode/components/ProfileQRCode';

const DEFAULT_AVATAR = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';

// Profile Image component
const ProfileImage = memo(({ profileData, cleanImageUrl }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  
  useEffect(() => {
    setLocalLoading(true);
    setRetryCount(0);
    
    const photoUrl = profileData?.profile?.photo_url;

    if (!photoUrl) {
      setImgSrc(DEFAULT_AVATAR);
      setLocalLoading(false);
    } else {
      const formattedUrl = ProfileService.formatPhotoUrl(cleanImageUrl(photoUrl));
      setImgSrc(formattedUrl);
    }
  }, [profileData, cleanImageUrl]);

  const handleImageError = (e) => {
    if (retryCount < maxRetries) {
      // Don't use imgSrc here as it might be the already-failing URL
      const photoUrl = profileData?.profile?.photo_url;
      if (photoUrl) {
        setTimeout(() => {
          // Add a cache-busting parameter to force reload
          const newUrl = ProfileService.formatPhotoUrl(cleanImageUrl(photoUrl)) + `?retry=${retryCount}`;
          setImgSrc(newUrl);
          setRetryCount(prevCount => prevCount + 1);
        }, 500);
      } else {
        setImgSrc(DEFAULT_AVATAR);
        setLocalLoading(false);
      }
    } else {
      setLocalLoading(false);
      e.target.src = DEFAULT_AVATAR;
    }
  };

  return (
    <div className="image-wrapper">
      {localLoading && <div className="loading-spinner">Loading...</div>}
      <img 
        src={imgSrc} 
        alt={`${profileData?.profile?.display_name || 'User'}'s profile`}
        onLoad={() => setLocalLoading(false)}
        onError={handleImageError}
        style={{ opacity: localLoading ? 0.5 : 1 }}
      />
    </div>
  );
});

// Company Logo component
const CompanyLogo = memo(({ profileData, cleanImageUrl }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  
  useEffect(() => {
    setLocalLoading(true);
    setRetryCount(0);
    
    const logoUrl = profileData?.profile?.company_logo_url;
    if (!logoUrl) {
      setLocalLoading(false);
      setImgSrc('');
      return;
    }
    
    setImgSrc(ProfileService.formatPhotoUrl(cleanImageUrl(logoUrl)));
  }, [profileData, cleanImageUrl]);

  const handleImageError = (e) => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setImgSrc(ProfileService.formatPhotoUrl(cleanImageUrl(imgSrc)));
        setRetryCount(prevCount => prevCount + 1);
      }, 500);
    } else {
      setLocalLoading(false);
    }
  };

  if (!imgSrc) {
    return null;
  }

  return (
    <div className="image-wrapper company-logo-wrapper">
      {localLoading && <div className="loading-spinner">Loading...</div>}
      <img 
        src={imgSrc} 
        alt="Company Logo"
        onLoad={() => setLocalLoading(false)}
        onError={handleImageError}
        style={{ opacity: localLoading ? 0.5 : 1 }}
      />
    </div>
  );
});

// Add proper display names
ProfileImage.displayName = 'ProfileImage';
CompanyLogo.displayName = 'CompanyLogo';

const SlugProfile = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch profile data using the API endpoint
        const response = await fetch(`/api/v1/profiles/${slug}`);
        
        if (!response.ok) {
          // Handle different HTTP errors
          if (response.status === 404) {
            throw new Error('Profile not found');
          } else {
            throw new Error(`Error fetching profile: ${response.status}`);
          }
        }
        
        const data = await response.json();
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        
        // Handle different types of errors
        if (error.message === 'Profile not found') {
          setError('Profile not found. This page may have been moved or doesn\'t exist.');
        } else {
          setError('Something went wrong while loading this profile. Please try again later.');
        }
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchProfileData();
    }
  }, [slug]);

  if (loading) {
    return (
      <StyledSlugProfile>
        <div className="loading-container">
          <div>Loading profile...</div>
        </div>
      </StyledSlugProfile>
    );
  }

  if (error) {
    return (
      <StyledSlugProfile>
        <div className="error-container">
          <h3>Oops!</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </StyledSlugProfile>
    );
  }

  return (
    <StyledSlugProfile>
      <div className="profile-card">
        {/* Company Logo Area */}
        <div className="company-logo-container">
          <CompanyLogo 
            profileData={profileData} 
            cleanImageUrl={cleanImageUrl} 
          />
          {!profileData?.profile?.company_logo_url && (
            <div className="no-logo-placeholder">No company logo</div>
          )}
        </div>
        
        {/* Profile Content Section */}
        <div className="profile-content">
          {/* Profile Image */}
          <ProfileImage 
            profileData={profileData} 
            cleanImageUrl={cleanImageUrl} 
          />
          
          <h1>{profileData?.profile?.display_name || profileData?.full_name}</h1>
          {profileData?.profile?.title && <h2>{profileData.profile.title}</h2>}
          
          {profileData?.profile?.bio && (
            <p className="bio-text">{profileData.profile.bio}</p>
          )}
          
          {/* Contact Buttons Section */}
          <div className="contact-buttons">
            {profileData?.profile?.website && (
              <div className="contact-button">
                <a 
                  href={profileData.profile.website.startsWith('http') ? 
                    profileData.profile.website : 
                    `https://${profileData.profile.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Website
                </a>
              </div>
            )}
            
            {profileData?.profile?.contact?.phone && (
              <div className="contact-button">
                <a href={`tel:${profileData.profile.contact.phone}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call
                </a>
              </div>
            )}
            
            {profileData?.profile?.email && (
              <div className="contact-button">
                <a href={`mailto:${profileData.profile.email}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email
                </a>
              </div>
            )}
          </div>

          <div className="share-section">

            <ProfileQRCode 
              slug={profileData.slug} 
              size={100}
              downloadable={true}
              baseUrl={process.env.NODE_ENV === 'development' ? 'http://localhost:5173/' : 'https://kinvo.com/'}
            />
          </div>
          
          {/* Kinvo Branding Section */}
          <div className="kinvo-branding">
            <div className="brand-text">Kinvo</div>
            <div className="profile-url">
              <span>kinvo.com/{profileData?.slug}</span>
            </div>
          </div>
        </div>
      </div>
    </StyledSlugProfile>
  );
};

export default SlugProfile;