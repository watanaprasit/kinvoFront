import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import LandingPage from './pages/landing/LandingPage';
import Navigation from './pages/shared/Navigation';
import SignupForm from './features/auth/components/SignupForm/index'; 
import LoginForm from './features/auth/components/LoginForm';
import SlugRegistration from './features/auth/components/SlugRegistration';
import { AuthProvider } from './features/auth/context/AuthContext'; 
import '../src/styles/tailwind/index.css';

export default function App() {
  return (
    <Router> 
      <AuthProvider> 
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/register" element={<SignupForm />} /> 
          <Route path="/auth/signin" element={<LoginForm />} /> 
          <Route path="/auth/select-slug" element={<SlugRegistration />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
