import { useState, useEffect } from 'react';
import Header from '../../common/Header/Header';
import { DashboardWrapper, Sidebar } from './styles';
import { Home, User, Settings, HelpCircle, LogOut, CreditCard } from 'lucide-react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useLogout } from '../../../features/dashboard/hooks/useLogout';

export const DashboardLayout = ({ 
  children, 
  activeSection, 
  setActiveSection,
}) => {
  const { user, avatarKey } = useAuth();
  const { handleLogout } = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (isDesktop) {
      setIsMobileMenuOpen(false);
    }
  }, [isDesktop]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Menu items configuration
  const mainMenuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'cards', label: 'Business Cards', icon: CreditCard },
  ];

  const accountMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  // Determine profile photo or default avatar
  const renderProfilePhoto = () => {
    if (user?.profile?.photo_url) {
      return (
        <img 
          src={`${user.profile.photo_url}?key=${avatarKey}`} 
          alt={user.profile.display_name || "Profile"} 
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }
    
    return (
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
        {user?.profile?.display_name?.charAt(0) || user?.full_name?.charAt(0) || 'U'}
      </div>
    );
  };

  return (
    <DashboardWrapper className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        variant="dashboard" 
        onMenuToggle={toggleMobileMenu}
      />
      
      <div className="flex flex-1">
        {/* Fixed sidebar */}
        <Sidebar 
          className={`
            fixed top-0 pt-16 h-full bg-white shadow-md z-10
            ${isDesktop ? 'w-64 left-0' : 
              isMobileMenuOpen ? 'w-full left-0' : '-left-full'}
          `}
          $isOpen={isMobileMenuOpen || isDesktop}
        >
          {/* User info section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {renderProfilePhoto()}
              <div>
                <p className="font-medium text-gray-800">
                  {user?.profile?.display_name || user?.full_name || 'Username'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.subscription_tier || 'Free Account'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="py-4 h-[calc(100vh-180px)] overflow-y-auto">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
            <ul className="space-y-1">
              {mainMenuItems.map(item => (
                <li 
                  key={item.id}
                  className={`flex items-center px-4 py-2 cursor-pointer rounded-md ${
                    activeSection === item.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (!isDesktop) setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
            
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">Account</p>
            <ul className="space-y-1">
              {accountMenuItems.map(item => (
                <li 
                  key={item.id}
                  className={`flex items-center px-4 py-2 cursor-pointer rounded-md ${
                    activeSection === item.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (!isDesktop) setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                </li>
              ))}
              <li 
                className="flex items-center px-4 py-2 cursor-pointer rounded-md hover:bg-gray-100 text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-3" />
                <span>Log Out</span>
              </li>
            </ul>
          </div>
          
          {/* Footer/upgrade prompt */}
          {!user?.subscription_tier || user.subscription_tier === 'free' ? (
            <div className="p-4 bg-blue-50 rounded-lg mx-3 mb-4">
              <p className="text-sm font-medium text-blue-800">Upgrade your account</p>
              <p className="text-xs text-blue-600 mb-3">Get access to premium features</p>
              <button 
                className="w-full bg-blue-600 text-white text-sm py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => setActiveSection('subscription')}
              >
                Upgrade Now
              </button>
            </div>
          ) : null}
        </Sidebar>

        {/* Mobile menu toggle button */}
        {!isDesktop && (
          <button 
            className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        )}

        {/* Main content area */}
        <main className={`w-full ${isDesktop ? 'ml-64' : ''} flex-1 p-6 pt-20`}>
          {children}
        </main>
      </div>
    </DashboardWrapper>
  );
};