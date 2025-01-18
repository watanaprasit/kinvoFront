import { useState } from 'react';
import { loginUser } from '../services/AuthService';
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

    // Perform email and password validation
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
      login(result.user);  // Save user data to context
    } else {
      setEmailError('Login failed');
    }

    setIsSubmitting(false);
  };

  return { handleSubmit, isSubmitting, emailError, passwordError };
};
