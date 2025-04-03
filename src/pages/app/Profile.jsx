import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext'; 
import { ProfileService } from '../../features/profile/services/profileServices';
import ProfileEditor from '../../features/profile/components/ProfileEditor';

const UserProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileUserId = userId || user?.id;

        
        if (!profileUserId) {
          throw new Error('No user ID available');
        }

        const profileData = await ProfileService.getProfileByUserId(profileUserId);
        
        setUserData(profileData);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [userId, user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;

  return <ProfileEditor 
    initialProfile={{
      displayName: userData.display_name,
      slug: userData.slug,
      photoUrl: userData.photo_url,
      userId: userData.user_id
    }} 
    />; 
  };

const ProfilePage = () => {
  return (
    <Suspense fallback={<div>Loading Profile...</div>}>
      <UserProfile />
    </Suspense>
  );
};

export default ProfilePage;