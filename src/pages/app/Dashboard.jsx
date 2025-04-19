// src/pages/app/Dashboard.jsx
import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import ProfileEditor from '../../features/profile/components/ProfileEditor';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cleanImageUrl, formatPhotoUrl } from '../../library/utils/formatters'; // Import formatters

// Import or create these components as needed
import BusinessCards from './BusinessCards';
import Settings from '../../features/dashboard/components/Settings';
import HelpSupport from '../../features/dashboard/components/HelpSupport';

export default function Dashboard() {
  // Get initial section from localStorage
  const getInitialSection = () => {
    const savedSection = localStorage.getItem('dashboardActiveSection');
    return savedSection || 'overview';
  };

  const [activeSection, setActiveSection] = useState(getInitialSection);
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  
  // Check authentication status and redirect if needed
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Save active section to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardActiveSection', activeSection);
  }, [activeSection]);

  // Format profile photo URL when user data is available
  useEffect(() => {
    if (user?.profile?.photo_url) {
      // Update the photo URL with proper formatting
      const formattedUrl = formatPhotoUrl(cleanImageUrl(user.profile.photo_url));
      if (formattedUrl !== user.profile.photo_url) {
        // This would typically update the user profile in context or make an API call
        console.log('Photo URL formatted:', formattedUrl);
      }
    }
  }, [user]);

  // Profile completion percentage calculation
  const calculateProfileCompletion = () => {
    if (!user?.profile) return 0;
    
    const profile = user.profile;
    const fields = [
      'display_name', 
      'title', 
      'bio', 
      'phone', 
      'email', 
      'photo_url'
    ];
    
    const completedFields = fields.filter(field => !!profile[field]).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  // Content renderer based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileEditor />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <HelpSupport />;
      case 'cards':
        return <BusinessCards />;
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
              
              {/* Profile completion card */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Profile Completion</h3>
                  <span className="text-sm font-semibold">{calculateProfileCompletion()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${calculateProfileCompletion()}%` }}
                  ></div>
                </div>
                {calculateProfileCompletion() < 100 && (
                  <button 
                    className="mt-3 text-sm text-blue-600 hover:underline"
                    onClick={() => setActiveSection('profile')}
                  >
                    Complete your profile
                  </button>
                )}
              </div>
              
              {/* User profile details */}
              {user?.profile && (
                <div className="mb-6">
                  <div className="flex items-center space-x-4">
                    {user.profile.photo_url && (
                      <img 
                        src={formatPhotoUrl(cleanImageUrl(user.profile.photo_url))} 
                        alt={user.profile.display_name || 'User'} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user.profile.display_name || 'Your Name'}
                      </h3>
                      <p className="text-gray-600">{user.profile.title || 'Add your title'}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick access cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition duration-200"
                  onClick={() => setActiveSection('profile')}
                >
                  <h3 className="font-medium mb-2">Edit Profile</h3>
                  <p className="text-sm text-gray-600">Update your personal information</p>
                </div>
                
                <div 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition duration-200"
                  onClick={() => setActiveSection('cards')}
                >
                  <h3 className="font-medium mb-2">Business Cards</h3>
                  <p className="text-sm text-gray-600">Create and manage your digital cards</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Render loading state or dashboard content
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        <p>An error occurred: {error}</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}