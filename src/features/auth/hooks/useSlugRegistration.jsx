import { useState } from 'react';
import { API_ROUTES } from '../../../library/constants/routes';

export const useSlugRegistration = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState(null);

  const checkSlugAvailability = async (slug) => {
    if (!slug) {
      setIsAvailable(false);
      setError('Username is required');
      return false;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.USERS.BY_SLUG(slug));
      
      // If we get a user back, the slug is taken
      const data = await response.json();
      const available = !data || response.status === 404;
      
      setIsAvailable(available);
      if (!available) {
        setError('This username is already taken');
      }

      return available;
    } catch (error) {
      // If we get a 404, the slug is available
      if (error.response?.status === 404) {
        setIsAvailable(true);
        return true;
      }
      
      setError('Error checking username availability');
      setIsAvailable(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const updateUserSlug = async (slug) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ROUTES.USERS.UPDATE_SLUG, {
        method: 'PUT', // Changed to PUT to match backend
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ slug })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update username');
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to update username'
      };
    }
  };

  return {
    isChecking,
    isAvailable,
    error,
    checkSlugAvailability,
    updateUserSlug
  };
};