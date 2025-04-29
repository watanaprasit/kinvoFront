// Enhanced BusinessCardService.js - Migration from ProfileService to BusinessCardService
import api from '../../../library/constants/axios';
import { API_ROUTES } from "../../../library/constants/routes";

export class BusinessCardService {
  // Track in-progress updates to prevent concurrent modifications
  static _updateInProgress = null;

  // Format photo URL helper with cache busting
  static formatPhotoUrl(url) {
    if (!url) return null;
    
    // Skip cache busting for blob URLs
    if (url.startsWith('blob:')) {
      return url;
    }
    
    // Remove any trailing question mark
    let formattedUrl = url.replace(/\?$/, '');
    
    // Clean any existing cache busting parameters
    if (formattedUrl.includes('?t=')) {
      formattedUrl = formattedUrl.split('?t=')[0];
    }
    
    // Add cache busting parameter
    const timestamp = new Date().getTime();
    
    // If URL contains parameters already, add cache busting with &
    if (formattedUrl.includes('?')) {
      return `${formattedUrl}&t=${timestamp}`;
    } else {
      // Otherwise add cache busting with ?
      return `${formattedUrl}?t=${timestamp}`;
    }
  }

  // Get authentication headers
  static getAuthHeaders(contentType = 'application/json') {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    if (contentType === null) {
      return {
        'Authorization': `Bearer ${token}`
      };
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': contentType
    };
  }

  // Get current user ID from localStorage
  static getUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id;
    } catch (e) {
      console.error('Error getting user ID:', e);
      return null;
    }
  }

  // Get all business cards for the current user
  static async getBusinessCards() {
    try {
      const userId = this.getUserId();
      if (!userId) throw new Error('User ID not found');
      
      const response = await api.get(`/api/v1/users/${userId}/business-cards`);
      
      // Format all card URLs with cache busting
      return response.data.map(card => ({
        ...card,
        photo_url: card.photo_url ? this.formatPhotoUrl(card.photo_url) : null,
        company_logo_url: card.company_logo_url ? this.formatPhotoUrl(card.company_logo_url) : null
      }));
    } catch (error) {
      console.error('Error fetching business cards:', error);
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const response = await api.get(`/api/v1/users/by-email?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  }

  // Get business cards by user ID
  static async getBusinessCardsByUserId(userId) {
    try {
      const response = await api.get(`/api/v1/users/${userId}/business-cards`);
      
      // Format all card URLs with cache busting
      return response.data.map(card => ({
        ...card,
        photo_url: card.photo_url ? this.formatPhotoUrl(card.photo_url) : null,
        company_logo_url: card.company_logo_url ? this.formatPhotoUrl(card.company_logo_url) : null
      }));
    } catch (error) {
      console.error('Error fetching business cards by user ID:', error);
      throw error;
    }
  }

  // Get primary business card for the current user
  static async getPrimaryBusinessCard() {
    try {
      const userId = this.getUserId();
      if (!userId) throw new Error('User ID not found');
      
      const response = await api.get(`/api/v1/users/${userId}/business-card`);
      
      // Format URLs with cache busting
      const data = response.data;
      if (data.photo_url) {
        data.photo_url = this.formatPhotoUrl(data.photo_url);
      }
      
      if (data.company_logo_url) {
        data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
      }
      
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // No primary card found
      }
      console.error('Error fetching primary business card:', error);
      throw error;
    }
  }

  // Get a specific business card by ID
  static async getBusinessCardById(cardId) {
    if (!cardId) {
      throw new Error('Business card ID is required');
    }

    try {
      const response = await api.get(`/api/v1/users/business-card/${cardId}`);
      
      // Format URLs with cache busting
      const data = response.data;
      if (data.photo_url) {
        data.photo_url = this.formatPhotoUrl(data.photo_url);
      }
      
      if (data.company_logo_url) {
        data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
      }
      
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Business card not found');
      }
      console.error('Error fetching business card by ID:', error);
      throw error;
    }
  }

  // Create a new business card
  static async createBusinessCard(formData) {
    const requestId = `card_create_${Date.now()}`;
    
    if (this._updateInProgress) {
      return Promise.reject(new Error('Another update is in progress'));
    }
    
    this._updateInProgress = requestId;
    
    try {
      const userId = this.getUserId();
      if (!userId) throw new Error('User ID not found');
      
      // Handle both FormData and regular objects
      let dataToSend = formData;
      let headers = {};
      
      if (!(formData instanceof FormData)) {
        // Convert object to FormData
        dataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'contact' && typeof value === 'object') {
              dataToSend.append(key, JSON.stringify(value));
            } else if (typeof value === 'object' && !(value instanceof File)) {
              dataToSend.append(key, JSON.stringify(value));
            } else {
              dataToSend.append(key, value);
            }
          }
        });
      }
      
      headers['Content-Type'] = 'multipart/form-data';
      
      const response = await api.post(`/api/v1/users/${userId}/business-card`, dataToSend, { headers });
      
      // Format URLs with cache busting
      const data = response.data;
      if (data.photo_url) {
        data.photo_url = this.formatPhotoUrl(data.photo_url);
      }
      
      if (data.company_logo_url) {
        data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating business card:', error);
      throw error;
    } finally {
      if (this._updateInProgress === requestId) {
        this._updateInProgress = null;
      }
    }
  }

  // Update an existing business card
  static async updateBusinessCard(cardId, formData) {
    const requestId = `card_update_${Date.now()}`;
    
    if (this._updateInProgress) {
      return Promise.reject(new Error('Another update is in progress'));
    }
    
    this._updateInProgress = requestId;
    
    try {
      // Handle both FormData and regular objects
      let dataToSend = formData;
      let headers = {};
      
      if (!(formData instanceof FormData)) {
        // Convert object to FormData
        dataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'contact' && typeof value === 'object') {
              dataToSend.append(key, JSON.stringify(value));
            } else if (typeof value === 'object' && !(value instanceof File)) {
              dataToSend.append(key, JSON.stringify(value));
            } else {
              dataToSend.append(key, value);
            }
          }
        });
      }
      
      headers['Content-Type'] = 'multipart/form-data';
      
      const response = await api.put(`/api/v1/users/business-card/${cardId}`, dataToSend, { headers });
      
      // Format URLs with cache busting
      const data = response.data;
      if (data.photo_url) {
        data.photo_url = this.formatPhotoUrl(data.photo_url);
      }
      
      if (data.company_logo_url) {
        data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating business card:', error);
      throw error;
    } finally {
      if (this._updateInProgress === requestId) {
        this._updateInProgress = null;
      }
    }
  }

  // Update a specific field in a business card
  static async updateBusinessCardField(cardId, field, value) {
    const requestId = `${field}_update_${Date.now()}`;
    
    if (this._updateInProgress) {
      return Promise.reject(new Error('Another update is in progress'));
    }
    
    this._updateInProgress = requestId;
    
    try {
      const formData = new FormData();
      
      if (field === 'contact' && typeof value === 'object') {
        formData.append(field, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(field, value);
      } else {
        formData.append(field, value);
      }
      
      const headers = { 'Content-Type': 'multipart/form-data' };
      
      const response = await api.put(`/api/v1/users/business-card/${cardId}/${field}`, formData, { headers });
      
      // Format URLs with cache busting
      const data = response.data;
      if (data.photo_url) {
        data.photo_url = this.formatPhotoUrl(data.photo_url);
      }
      
      if (data.company_logo_url) {
        data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
      }
      
      return data;
    } catch (error) {
      console.error(`Error updating business card field ${field}:`, error);
      throw error;
    } finally {
      if (this._updateInProgress === requestId) {
        this._updateInProgress = null;
      }
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

  // Get a business card by slug (public endpoint - no auth required)
  static async getBusinessCardBySlug(slug) {
    if (!slug) {
      throw new Error('Slug is required');
    }

    try {
      const response = await api.get(`/api/v1/users/business-card/${slug}`);
      
      // Format URLs with cache busting
      const data = response.data;
      if (data.photo_url) {
        data.photo_url = this.formatPhotoUrl(data.photo_url);
      }
      
      if (data.company_logo_url) {
        data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
      }
      
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error('Business card not found');
      }
      console.error('Error fetching business card by slug:', error);
      throw error;
    }
  }

  // Check if a slug is available
  static async checkSlugAvailability(slug) {
    if (!slug) {
      return { available: false };
    }

    try {
      // Get the current user ID from localStorage or context
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = userData.id || null;
      
      const response = await api.get(
        `/api/v1/users/check-slug/${slug}${currentUserId ? `?current_user_id=${currentUserId}` : ''}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error checking slug availability:', error);
      throw error;
    }
  }

  // Get QR code for a business card
  static async getQRCode(cardId, baseUrl = window.location.origin) {
    try {
      const response = await api.get(
        `/api/v1/users/me/qrcode`, 
        { params: { card_id: cardId, base_url: baseUrl } }
      );
      
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

  // Get subscription tier information
  static async getSubscriptionTier() {
    try {
      const response = await api.get('/api/v1/users/me/subscription');
      return response.data;
    } catch (error) {
      console.error('Error getting subscription tier:', error);
      throw error;
    }
  }

  // Get primary business card for another user by ID
  static async getPrimaryBusinessCardByUserId(userId) {
    try {
      const response = await api.get(`/api/v1/users/${userId}/primary-card`);
      
      // Format URLs with cache busting
      const data = response.data;
      if (data.photo_url) {
        data.photo_url = this.formatPhotoUrl(data.photo_url);
      }
      
      if (data.company_logo_url) {
        data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
      }
      
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // No primary card found
      }
      console.error('Error fetching primary card by user ID:', error);
      throw error;
    }
  }

  // Backward compatibility methods
  static async getProfileBySlug(slug) {
    return this.getBusinessCardBySlug(slug);
  }
  
  static async getProfileByUserId(userId) {
    return this.getPrimaryBusinessCardByUserId(userId);
  }
  
  static async updateProfile(userId, data) {
    try {
      const primaryCard = await this.getPrimaryBusinessCard();
      if (!primaryCard) {
        throw new Error("No primary business card found");
      }
      
      return this.updateBusinessCard(primaryCard.id, data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
  
  static async updateDisplayName(userId, displayName) {
    try {
      const primaryCard = await this.getPrimaryBusinessCard();
      if (!primaryCard) {
        throw new Error("No primary business card found");
      }
      
      return this.updateBusinessCardField(primaryCard.id, 'display_name', displayName);
    } catch (error) {
      console.error('Error updating display name:', error);
      throw error;
    }
  }
  
  static async updateProfileField(field, value) {
    try {
      const primaryCard = await this.getPrimaryBusinessCard();
      if (!primaryCard) {
        throw new Error("No primary business card found");
      }
      
      return this.updateBusinessCardField(primaryCard.id, field, value);
    } catch (error) {
      console.error('Error updating profile field:', error);
      throw error;
    }
  }
  
  static async updateCompanyLogo(companyLogoFile) {
    try {
      const primaryCard = await this.getPrimaryBusinessCard();
      if (!primaryCard) {
        throw new Error("No primary business card found");
      }
      
      return this.updateBusinessCardField(primaryCard.id, 'company_logo', companyLogoFile);
    } catch (error) {
      console.error('Error updating company logo:', error);
      throw error;
    }
  }
  
  static async updateContactInfo(contactData) {
    try {
      const primaryCard = await this.getPrimaryBusinessCard();
      if (!primaryCard) {
        throw new Error("No primary business card found");
      }
      
      // Convert contact data to format expected by business card API
      const cardData = {};
      
      if (contactData.email !== undefined) {
        cardData.email = contactData.email;
      }
      
      if (contactData.website !== undefined) {
        cardData.website = contactData.website;
      }
      
      if (contactData.contact !== undefined) {
        cardData.contact = contactData.contact;
      }
      
      return this.updateBusinessCard(primaryCard.id, cardData);
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  }
  
  static async fetchQRCode(baseUrl = window.location.origin) {
    try {
      const primaryCard = await this.getPrimaryBusinessCard();
      if (!primaryCard) {
        throw new Error("No primary business card found");
      }
      
      return this.getQRCode(primaryCard.id, baseUrl);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      throw error;
    }
  }
}

// Backward compatibility exports
export const getProfileBySlug = async (slug) => {
  try {
    return await BusinessCardService.getBusinessCardBySlug(slug);
  } catch (error) {
    console.error('Error fetching profile by slug:', error);
    throw error;
  }
};