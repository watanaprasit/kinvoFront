import { useState } from 'react';
import { loginUser, signupWithGoogle } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (email, password) => {
    try {
      setEmailError('');
      setPasswordError('');
      setIsSubmitting(true);

      if (!email) {
        setEmailError('Email is required');
        return false;
      }
      if (!password) {
        setPasswordError('Password is required');
        return false;
      }

      const result = await loginUser(email, password);
      if (result.success) {
        login(result.user);
        navigate('/dashboard');
        return true;
      } else {
        setEmailError(result.error || 'Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setEmailError('An error occurred during login');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (idToken) => {
    try {
      setIsSubmitting(true);
      const result = await signupWithGoogle(idToken); // Using signupWithGoogle as it handles both signup and login
      
      if (result.success) {
        login({
          email: result.email,
          name: result.name,
          slug: result.slug
        });
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(result.error || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      setEmailError(error.message || 'An error occurred during Google authentication');
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    handleSubmit, 
    handleGoogleLogin, 
    isSubmitting, 
    emailError, 
    passwordError 
  };
};