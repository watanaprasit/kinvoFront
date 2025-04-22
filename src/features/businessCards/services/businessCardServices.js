import api from '../../../library/constants/axios';

export class BusinessCardService {
  // Get all business cards for the current user
  static async getBusinessCards() {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await api.get(`/api/v1/users/${userId}/business-cards`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business cards:', error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      const response = await api.get(`/api/v1/users/by-email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }

  static async getBusinessCardsByUserId(userId) {
    try {
      const response = await api.get(`/api/v1/users/${userId}/business-cards`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business cards by user ID:', error);
      throw error;
    }
  }

  // Get the primary business card
  static async getPrimaryBusinessCard() {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await api.get(`/api/v1/users/${userId}/business-card`);
      return response.data;
    } catch (error) {
      console.error('Error fetching primary business card:', error);
      throw error;
    }
  }

  // Create a new business card
  static async createBusinessCard(formData) {
    try {
      const response = await api.post('/api/v1/users/business-card', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating business card:', error);
      throw error;
    }
  }

  // Update an existing business card
  static async updateBusinessCard(cardId, formData) {
    try {
      const response = await api.put(`/api/v1/users/business-card/${cardId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating business card:', error);
      throw error;
    }
  }

  // Delete a business card
  static async deleteBusinessCard(cardId) {
    try {
      const response = await api.delete(`/api/v1/users/business-card/${cardId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting business card:', error);
      throw error;
    }
  }

  // Set a business card as primary
  static async setPrimaryBusinessCard(cardId) {
    try {
      const response = await api.put(`/api/v1/users/business-card/${cardId}/set-primary`);
      return response.data;
    } catch (error) {
      console.error('Error setting primary business card:', error);
      throw error;
    }
  }

  // Get a business card by slug
  static async getBusinessCardBySlug(slug) {
    try {
      const response = await api.get(`/api/v1/users/business-card/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business card by slug:', error);
      throw error;
    }
  }

  // Check if a slug is available
  static async checkSlugAvailability(slug) {
    try {
      const response = await api.get(`/api/v1/users/check-slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error checking slug availability:', error);
      throw error;
    }
  }

  // Get QR code for a business card
  static async getQRCode(params) {
    try {
      const response = await api.get('/api/v1/users/me/qrcode', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching QR code:', error);
      throw error;
    }
  }

  // Update QR code settings
  static async updateQRCode(data) {
    try {
      const response = await api.put('/api/v1/users/me/qrcode', data);
      return response.data;
    } catch (error) {
      console.error('Error updating QR code:', error);
      throw error;
    }
  }
}