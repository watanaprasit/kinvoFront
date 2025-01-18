import { useState } from 'react';
import { signupUser } from '../services/AuthService';

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

    // Perform validation
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

    // Call the signup API
    const result = await signupUser(email, password, fullName);
    
    if (result.success) {
        alert('Signup successful! Please login.');
    } else {
      setEmailError(result.error);
    }

    setIsSubmitting(false);
  };

  return { handleSubmit, isSubmitting, emailError, passwordError, fullNameError };
};
