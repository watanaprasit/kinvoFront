import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter, Route, and Routes
import LandingPage from './pages/landing/LandingPage';
import Navigation from './pages/shared/Navigation';
import SignupForm from './features/auth/components/SignupForm/SignupForm'; // Import the SignupForm component
import { AuthProvider } from './features/auth/context/AuthContext'; // Import the AuthProvider
import '../src/styles/tailwind/index.css';

export default function App() {
  return (
    <Router> {/* Wrap your app in Router */}
      <AuthProvider> {/* Wrap your entire app in the AuthProvider */}
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/register" element={<SignupForm />} /> {/* Route for Register page */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}
