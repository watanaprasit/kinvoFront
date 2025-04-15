import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import { useAuth } from './features/auth/context/AuthContext';
import Navigation from './pages/shared/Navigation';
import LandingPage from './pages/landing/LandingPage';
import SignupForm from './features/auth/components/SignupForm/index'; 
import LoginForm from './features/auth/components/LoginForm';
import SlugRegistration from './features/auth/components/SlugRegistration';
import Dashboard from './pages/app/Dashboard';
import SlugProfile from './pages/public/SlugProfile/index'
import { AuthProvider } from './features/auth/context/AuthContext'; 
import '../src/styles/tailwind/index.css';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {!user && <Navigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/register" element={<SignupForm />} /> 
        <Route path="/auth/signin" element={<LoginForm />} /> 
        <Route path="/auth/select-slug" element={<SlugRegistration />} />

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
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
