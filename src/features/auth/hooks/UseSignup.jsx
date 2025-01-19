import { useState } from 'react';
import { signupUser, signupWithGoogle } from '../services/AuthService';

export const useSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  
  const handleSubmit = async (email, password, fullName) => {
    setEmailError('');
    setPasswordError('');
    setFullNameError('');
    setIsSubmitting(true);

    if (!email) {
      setEmailError('Email is required');
      setIsSubmitting(false);
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      setIsSubmitting(false);
      return;
    }
    if (!fullName) {
      setFullNameError('Full name is required');
      setIsSubmitting(false);
      return;
    }

    const result = await signupUser(email, password, fullName);
    if (result.success) {
      alert('Signup successful! Please login.');
    } else {
      setEmailError(result.error);
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignup = async (idToken) => {
    setIsSubmitting(true);

    const result = await signupWithGoogle(idToken);
    if (result.success) {
      alert('Google signup successful! You are now logged in.');
      window.location.href = '/dashboard'; // Redirect to the dashboard or desired page
    } else {
      alert('Google signup failed. Please try again.');
    }

    setIsSubmitting(false);
  };

  return { handleSubmit, handleGoogleSignup, isSubmitting, emailError, passwordError, fullNameError };
};
