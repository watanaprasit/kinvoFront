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

      if (!validateEmailFormat(email)) {
        setEmailError('Please enter a valid email address');
        return { success: false };
      }
      if (!validateKnownEmailProvider(email)) {
        setEmailError('Please use a known email provider');
        return { success: false };
      }

      const result = await signupUser(email, password, fullName, slug);
      
      if (result.success) {
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
      setEmailError('An error occurred during signup. Please try again.');
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async (credential, slug = null) => {
    try {
      setIsSubmitting(true);
      
      // Check slug availability if provided
      if (slug) {
        const isSlugAvailable = await checkSlugAvailability(slug);
        if (!isSlugAvailable) {
          return { 
            success: false, 
            error: 'Username is already taken'
          };
        }
      }
      
      const result = await signupWithGoogle(credential, slug);
      
      if (result.success) {
        return { 
          success: true,
          email: result.email,
          name: result.name,
          idToken: result.idToken || credential,
          slug: result.slug
        };
      } else {
        throw new Error(result.error || 'Google signup failed');
      }
    } catch (error) {
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