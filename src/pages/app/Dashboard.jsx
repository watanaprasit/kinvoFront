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

// import { useState } from 'react';
// import { DashboardHeader } from '../../features/dashboard/components/DashboardHeader';
// import ProfileEditor from '../../features/profile/components/ProfileEditor';

// export default function Dashboard() {
//   const [activeSection, setActiveSection] = useState('overview');

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'profile':
//         return <ProfileEditor />;
//       case 'overview':
//       default:
//         return (
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-4">Welcome to Kinvo!</h2>
//             <p>Explore your dashboard and manage your profile.</p>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <DashboardHeader />
//       <div className="flex">
//         <nav className="w-64 bg-white p-4 shadow-md">
//           <ul>
//             <li 
//               className={`p-2 cursor-pointer ${activeSection === 'overview' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
//               onClick={() => setActiveSection('overview')}
//             >
//               Dashboard
//             </li>
//             <li 
//               className={`p-2 cursor-pointer ${activeSection === 'profile' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
//               onClick={() => setActiveSection('profile')}
//             >
//               Profile
//             </li>
//           </ul>
//         </nav>
//         <main className="flex-1 p-6">
//           {renderContent()}
//         </main>
//       </div>
//     </div>
//   );
// }