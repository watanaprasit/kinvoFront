import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'; 
import { useAuth } from './features/auth/context/AuthContext';
import LandingPage from './pages/landing/LandingPage';
import SignupForm from './features/auth/components/SignupForm/index'; 
import LoginForm from './features/auth/components/LoginForm';
import SlugRegistration from './features/auth/components/SlugRegistration';
import Dashboard from './pages/app/Dashboard';
import SlugProfile from './pages/public/SlugProfile/index'
import { AuthProvider } from './features/auth/context/AuthContext'; 
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/common/Header/Header';
import '../src/styles/tailwind/index.css';
// Import company section components
import AboutSection from './components/company/AboutSection';
import CareersSection from './components/company/CareersSection';
import PrivacySection from './components/company/PrivacySection';
import TermsSection from './components/company/TermsSection';
// Import resources components
import BlogComponent from './components/resources/BlogSection';
import HelpCenterComponent from './components/resources/HelpCenterSection';
import SupportComponent from './components/resources/SupportSection';
import APIComponent from './components/resources/APISection';

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if the current path is an auth page
  const isAuthPage = ['/auth/signin', '/auth/register', '/auth/select-slug'].includes(location.pathname);
  // Check if current path is landing page
  const isLandingPage = location.pathname === '/';
  
  // Determine which header to display
  const renderHeader = () => {
    if (user) {
      // User dashboard will likely have its own header/navigation
      return null;
    } else if (isLandingPage) {
      // No header for landing page as it has its own header
      return null;
    } else {
      // Show Header on other pages when not logged in
      return <Header />;
    }
  };

  return (
    <>
      {renderHeader()}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/register" element={<SignupForm />} /> 
        <Route path="/auth/signin" element={<LoginForm />} /> 
        <Route path="/auth/select-slug" element={<SlugRegistration />} />
        {/* Company pages */}
        <Route path="/company/about" element={<AboutSection />} />
        <Route path="/company/careers" element={<CareersSection />} />
        <Route path="/company/privacy" element={<PrivacySection />} />
        <Route path="/company/terms" element={<TermsSection />} />
        {/* Resources pages */}
        <Route path="/resources/blog" element={<BlogComponent />} />
        <Route path="/resources/help" element={<HelpCenterComponent />} />
        <Route path="/resources/support" element={<SupportComponent />} />
        <Route path="/resources/api" element={<APIComponent />} />
        {/* Public profile route - accessible to everyone */}
        <Route path="/:slug" element={<SlugProfile />} />
        
        {user ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router> 
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}