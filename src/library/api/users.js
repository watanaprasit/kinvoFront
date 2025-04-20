// import { userAPI } from '../constants/axios';

// export const usersAPI = {
//   async checkSlugAvailability(slug) {
//     const response = await userAPI.checkSlug(slug);
//     return response.data;
//   },

//   async updateUserSlug(slug) {
//     const response = await userAPI.updateSlug(slug);
//     return response.data;
//   }
// };

// new below  

import { userAPI } from '../constants/axios';

export const usersAPI = {
  async checkSlugAvailability(slug) {
    const response = await userAPI.checkSlug(slug);
    return response.data;
  },

  async updateUserSlug(slug) {
    const response = await userAPI.updateSlug(slug);
    return response.data;
  },

  // Business card related API functions
  async getBusinessCards() {
    const response = await userAPI.getBusinessCards();
    return response.data;
  },

  async getPrimaryBusinessCard() {
    const response = await userAPI.getPrimaryBusinessCard();
    return response.data;
  },

  async createBusinessCard(formData) {
    const response = await userAPI.createBusinessCard(formData);
    return response.data;
  },

  async updateBusinessCard(cardId, formData) {
    const response = await userAPI.updateBusinessCard(cardId, formData);
    return response.data;
  },

  async deleteBusinessCard(cardId) {
    const response = await userAPI.deleteBusinessCard(cardId);
    return response.data;
  },

  async setPrimaryBusinessCard(cardId) {
    const response = await userAPI.setPrimaryBusinessCard(cardId);
    return response.data;
  },

  async getBusinessCardBySlug(slug) {
    const response = await userAPI.getBusinessCardBySlug(slug);
    return response.data;
  },

  async getQRCode(params) {
    const response = await userAPI.getQRCode(params);
    return response.data;
  },

  async updateQRCode(data) {
    const response = await userAPI.updateQRCode(data);
    return response.data;
  }
};