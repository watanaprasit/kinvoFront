import { DashboardHeader } from '../../../features/dashboard/components/DashboardHeader';
import { DashboardWrapper, Sidebar } from './styles';

export const DashboardLayout = ({ 
    children, 
    activeSection, 
    setActiveSection,
    isMobileMenuOpen = false 
  }) => {
    return (
      <DashboardWrapper 
        className="min-h-screen bg-gray-50 flex flex-col"
        $isMobileMenuOpen={isMobileMenuOpen}  // Note the $ prefix for transient props
      >
        <DashboardHeader />
        <div className="flex flex-1">
          <Sidebar 
            className={`
              w-64 md:w-64 bg-white p-4 shadow-md 
              ${isMobileMenuOpen 
                ? 'fixed inset-y-0 left-0 z-50 w-full' 
                : 'hidden md:block'}
            `}
            $isOpen={isMobileMenuOpen}
          >
            <ul>
              <li 
                className={`p-2 cursor-pointer ${activeSection === 'overview' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveSection('overview')}
              >
                Dashboard
              </li>
              <li 
                className={`p-2 cursor-pointer ${activeSection === 'profile' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => setActiveSection('profile')}
              >
                Profile
              </li>
            </ul>
            </Sidebar>
          <main className={`
            flex-1 p-6 overflow-y-auto 
            ${isMobileMenuOpen ? 'md:ml-64' : ''}
          `}>
            {children}
          </main>
        </div>
      </DashboardWrapper>
    );
  };