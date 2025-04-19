import { userAPI } from '../constants/axios';

export const usersAPI = {
  async checkSlugAvailability(slug) {
    const response = await userAPI.checkSlug(slug);
    return response.data;
  },

  async updateUserSlug(slug) {
    const response = await userAPI.updateSlug(slug);
    return response.data;
  }
};