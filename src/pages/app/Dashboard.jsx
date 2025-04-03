import { useState } from 'react';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import ProfileEditor from '../../features/profile/components/ProfileEditor';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileEditor />;
      case 'overview':
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Welcome to Kinvo!</h2>
            <p>Explore your dashboard and manage your profile.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
