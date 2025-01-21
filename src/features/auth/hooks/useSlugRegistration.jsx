import { useState, useCallback } from 'react';
import { API_ROUTES } from '../../../library/constants/routes';

export const useSlugRegistration = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState(null);

  const checkSlugAvailability = useCallback(async (slugToCheck) => {
    if (!slugToCheck) {
      setIsAvailable(false);
      setError('Username is required');
      return false;
    }

    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.USERS.CHECK_SLUG(slugToCheck));
      const data = await response.json();
      
      if (response.ok) {
        setIsAvailable(data.available);
        setError(data.available ? null : 'This username is already taken');
        return data.available;
      }
      
      throw new Error('Unexpected response from server');
    } catch (error) {
      setError('Error checking username availability');
      setIsAvailable(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const updateUserSlug = async (slugToUpdate) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(API_ROUTES.USERS.UPDATE_SLUG, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug: slugToUpdate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update username');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Update slug error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update username',
      };
    }
  };

  return {
    isChecking,
    isAvailable,
    error,
    checkSlugAvailability,
    updateUserSlug,
  };
};