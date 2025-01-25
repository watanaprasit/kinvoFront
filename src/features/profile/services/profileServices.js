import { API_ROUTES } from "../../../library/constants/routes";

export const ProfileService = {
  async getProfileByUserId(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await fetch(API_ROUTES.USERS.PROFILE_BY_USER_ID(userId), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch profile: ${errorText}`);
    }

    return response.json();
  },

  async updateProfile(formData) {
    const response = await fetch(API_ROUTES.USERS.PROFILE_UPDATE, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${errorText}`);
    }

    return response.json();
  },

  async checkSlugAvailability(slug) {
    const response = await fetch(API_ROUTES.USERS.CHECK_SLUG(slug), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slug availability check failed: ${errorText}`);
    }

    return response.json();
  }
};
