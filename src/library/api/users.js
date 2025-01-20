import axios from 'axios';
import { API_ROUTES } from '../constants/routes';

export const usersAPI = {
  async checkSlugAvailability(slug) {
    const response = await axios.get(API_ROUTES.USERS.CHECK_SLUG(slug));
    return response.data;
  },

  async updateUserSlug(slug) {
    const response = await axios.put(API_ROUTES.USERS.UPDATE_SLUG, { slug });
    return response.data;
  }
};