import { useState } from 'react';
import { signupUser, signupWithGoogle } from '../services/AuthService';
import { validateEmailFormat, validateRequired, validateKnownEmailProvider } from '../../../library/utils/validators';

export const useSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');

  const handleSubmit = async (email, password, fullName, slug = null) => {
    try {
      setEmailError('');
      setPasswordError('');
      setFullNameError('');
      setIsSubmitting(true);

      // Validate required fields
      if (!validateRequired(email)) {
        setEmailError('Email is required');
        return { success: false };
      }
      if (!validateRequired(password)) {
        setPasswordError('Password is required');
        return { success: false };
      }
      if (!validateRequired(fullName)) {
        setFullNameError('Full name is required');
        return { success: false };
      }

      // Validate email format and provider
      if (!validateEmailFormat(email)) {
        setEmailError('Please enter a valid email address');
        return { success: false };
      }
      if (!validateKnownEmailProvider(email)) {
        setEmailError('Please use a known email provider');
        return { success: false };
      }

      // Submit registration
      const result = await signupUser(email, password, fullName, slug);
      
      if (result.success) {
        // Instead of navigating, return the success result
        return {
          success: true,
          email: result.email,
          name: fullName
        };
      } else {
        setEmailError(result.error);
        return { success: false };
      }

    } catch (error) {
      console.error('Signup error:', error);
      setEmailError('An error occurred during signup. Please try again.');
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async (idToken) => {
    try {
      setIsSubmitting(true);
      const result = await signupWithGoogle(idToken);
      
      if (result.success) {
        // Instead of navigating, return the success result with user data
        return { 
          success: true,
          email: result.email,
          name: result.name,
          tempToken: result.tempToken
        };
      } else {
        throw new Error(result.error || 'Google signup failed');
      }
    } catch (error) {
      console.error('Google signup error:', error);
      setEmailError(error.message || 'Failed to sign up with Google');
      return { 
        success: false, 
        error: error.message || 'Failed to sign up with Google' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = async (email) => {
    // Add email validation logic if needed
    return validateEmailFormat(email) && validateKnownEmailProvider(email);
  };

  return { 
    handleSubmit, 
    handleGoogleSignup,
    validateEmail,
    isSubmitting, 
    emailError,
    setEmailError, 
    passwordError, 
    fullNameError 
  };
};