import { API_ROUTES } from "../../../library/constants/routes"; // Import API_ROUTES

export const ProfileService = {
  async updateProfile(formData) {
    const response = await fetch(API_ROUTES.USERS.PROFILE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },

  // New method to fetch profile by slug
  async getProfileBySlug(slug) {
    const response = await fetch(API_ROUTES.USERS.BY_SLUG(slug));

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },
};
