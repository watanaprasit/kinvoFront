import { useState } from 'react';
import { loginUser, loginWithGoogle } from '../services/AuthService';
import { useAuth } from '../context/AuthContext';

export const useLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (email, password) => {
    setEmailError('');
    setPasswordError('');
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

    const result = await loginUser(email, password);
    if (result.success) {
      login(result.user);
    } else {
      setEmailError('Login failed');
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async (idToken) => {
    setIsSubmitting(true);
    try {
      const result = await loginWithGoogle(idToken);
      if (result.success) {
        login(result.user);
      } else {
        setEmailError('Google login failed');
      }
    } catch (error) {
      setEmailError('An error occurred during Google login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, handleGoogleLogin, isSubmitting, emailError, passwordError };
};

