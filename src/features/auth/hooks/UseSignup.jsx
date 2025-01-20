import { useState } from 'react';
import { signupUser, signupWithGoogle } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { validateEmailFormat, validateRequired, validateKnownEmailProvider } from '../../../library/utils/validators';

export const useSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (email, password, fullName, slug = null) => {
    try {
      setEmailError('');
      setPasswordError('');
      setFullNameError('');
      setIsSubmitting(true);

      // Validate required fields
      if (!validateRequired(email)) {
        setEmailError('Email is required');
        return false;
      }
      if (!validateRequired(password)) {
        setPasswordError('Password is required');
        return false;
      }
      if (!validateRequired(fullName)) {
        setFullNameError('Full name is required');
        return false;
      }

      // Validate email format and provider
      if (!validateEmailFormat(email)) {
        setEmailError('Please enter a valid email address');
        return false;
      }
      if (!validateKnownEmailProvider(email)) {
        setEmailError('Please use a known email provider');
        return false;
      }

      // Submit registration
      const result = await signupUser(email, password, fullName, slug);
      
      if (result.success) {
        navigate('/dashboard');
        return true;
      } else {
        setEmailError(result.error);
        return false;
      }

    } catch (error) {
      console.error('Signup error:', error);
      setEmailError('An error occurred during signup. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async (idToken) => {
    try {
      setIsSubmitting(true);
      const result = await signupWithGoogle(idToken);
      
      if (result.success) {
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error(result.error || 'Google signup failed');
      }
    } catch (error) {
      console.error('Google signup error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign up with Google' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { 
    handleSubmit, 
    handleGoogleSignup,
    isSubmitting, 
    emailError, 
    passwordError, 
    fullNameError 
  };
};