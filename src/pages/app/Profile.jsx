import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileService } from '../../features/profile/services/profileServices';

const UserProfile = () => {
  const { slug } = useParams();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile by slug
        const profileData = await ProfileService.getProfileBySlug(slug);
        setUserData(profileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [slug]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{userData.full_name} Profile</h1>
      <div>
        <p>Email: {userData.email}</p>
        <p>Location: {userData.location}</p>
        {/* Add more profile fields here */}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <Suspense fallback={<div>Loading Profile...</div>}>
      <UserProfile />
    </Suspense>
  );
};

export default ProfilePage;
