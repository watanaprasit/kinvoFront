import { useLoaderData, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const UserProfile = () => {
  const { slug } = useParams();
  const userData = useLoaderData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{userData.full_name} Profile</h1>
      {/* Add your profile content here */}
    </div>
  );
};

export default UserProfile;