import { API_ROUTES } from "../../../library/constants/routes";

export const ProfileService = {
    getAuthHeaders(contentType = 'application/json') {
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
    },

    formatPhotoUrl(url) {
        if (!url) return url;
        
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
    },

    // New method for fetching a public profile by slug - no auth required
    async getProfileBySlug(slug) {
        if (!slug) {
            throw new Error('Slug is required');
        }
    
        try {
            // Make sure this points to your actual API endpoint, not just the base URL
            const response = await fetch(
                `${API_ROUTES.BASE_URL}/api/v1/users/by-slug/${slug}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Profile not found');
                }
                const errorData = await response.text();
                throw new Error(`Failed to fetch profile (${response.status}): ${errorData}`);
            }
    
            // Process response
            const responseText = await response.text();
            
            try {
                const data = JSON.parse(responseText);
                
                // Format URLs with cache busting
                if (data.photo_url) {
                    data.photo_url = this.formatPhotoUrl(data.photo_url);
                }
                
                if (data.company_logo_url) {
                    data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
                }
                
                return data;
            } catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }
        } catch (error) {
            console.error('Error fetching profile by slug:', error);
            throw error;
        }
    },

    async getUserByEmail(email) {
        if (!email) {
            throw new Error('Email is required');
        }

        const response = await fetch(
            `${API_ROUTES.USERS.BY_EMAIL}?email=${encodeURIComponent(email)}`,
            {
                method: 'GET',
                headers: this.getAuthHeaders(),
                credentials: 'include'
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found');
            }
            throw new Error(data.detail || 'Failed to fetch user');
        }

        return {
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            username: data.username,
            slug: data.slug,
            profile: data.profile
        };
    },

    async getProfileByUserId(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }
    
        const response = await fetch(
            API_ROUTES.USERS.PROFILE_BY_USER_ID(userId),
            {
                method: 'GET',
                headers: this.getAuthHeaders(),
                credentials: 'include'
            }
        );
    
        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            const errorData = await response.text();
            throw new Error(`Failed to fetch profile (${response.status}): ${errorData}`);
        }
    
        let data;
        const responseText = await response.text();
        
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Invalid JSON response: ${responseText}`);
        }
        
        // Ensure photo_url is properly formatted using the formatPhotoUrl function
        if (data.photo_url) {
            data.photo_url = this.formatPhotoUrl(data.photo_url);
        }
        
        // Format company_logo_url to ensure it has cache busting
        if (data.company_logo_url) {
            data.company_logo_url = this.formatPhotoUrl(data.company_logo_url);
        }
        
        return data;
    },

    async updateProfile(userId, data) {
        // Add debouncing mechanism with a unique request identifier
        const requestId = `profile_update_${Date.now()}`;
        
        // Check if there's an ongoing request and prevent duplicate submission
        if (this._updateInProgress) {
          return Promise.reject(new Error('Another update is in progress'));
        }
        
        this._updateInProgress = requestId;
        
        try {
          // FormData will handle all fields including company_logo
          
          const response = await fetch(
            API_ROUTES.USERS.PROFILE_UPDATE,
            {
              method: 'PUT',
              headers: this.getAuthHeaders(null),
              credentials: 'include',
              body: data // FormData can include title, bio, and company_logo now
            }
          );
          
          const responseText = await response.text();
          
          if (!response.ok) {
            console.error('Update profile failed:', response.status, responseText);
            throw new Error(`Failed to update profile (${response.status}): ${responseText}`);
          }
      
          try {
            const jsonData = JSON.parse(responseText);
            
            // Format the photo_url if it exists
            if (jsonData.photo_url) {
              jsonData.photo_url = this.formatPhotoUrl(jsonData.photo_url);
            }
            
            // Format the company_logo_url if it exists
            if (jsonData.company_logo_url) {
              jsonData.company_logo_url = this.formatPhotoUrl(jsonData.company_logo_url);
            }
            
            return jsonData;
          } catch (e) {
            throw new Error(`Invalid JSON response: ${responseText}`);
          }
        } finally {
          // Only clear flag if this is the current request
          if (this._updateInProgress === requestId) {
            this._updateInProgress = null;
          }
        }
    },

    // The updateDisplayName method remains unchanged as it only updates display_name
    async updateDisplayName(userId, displayName) {
        // Code remains the same as it's a specialized method
        // for a single field update
        const requestId = `display_name_update_${Date.now()}`;
        
        if (this._updateInProgress) {
            return Promise.reject(new Error('Another update is in progress'));
        }
        
        this._updateInProgress = requestId;
        
        try {
            const formData = new FormData();
            formData.append('display_name', displayName);
            
            const response = await fetch(
                `${API_ROUTES.BASE_URL}/api/v1/users/me/display-name`,
                {
                    method: 'PUT',
                    headers: this.getAuthHeaders(null),
                    credentials: 'include',
                    body: formData
                }
            );
            
            const responseText = await response.text();
            
            if (!response.ok) {
                throw new Error(`Failed to update display name (${response.status}): ${responseText}`);
            }

            try {
                const jsonData = JSON.parse(responseText);
                
                if (jsonData.photo_url) {
                    jsonData.photo_url = this.formatPhotoUrl(jsonData.photo_url);
                }
                
                // Format company_logo_url if present in response
                if (jsonData.company_logo_url) {
                    jsonData.company_logo_url = this.formatPhotoUrl(jsonData.company_logo_url);
                }
                
                return jsonData;
            } catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }
        } finally {
            if (this._updateInProgress === requestId) {
                this._updateInProgress = null;
            }
        }
    },

    // You may want to add specialized methods for title and bio if needed
    async updateProfileField(field, value) {
        const requestId = `${field}_update_${Date.now()}`;
        
        if (this._updateInProgress) {
            return Promise.reject(new Error('Another update is in progress'));
        }
        
        this._updateInProgress = requestId;
        
        try {
            const formData = new FormData();
            formData.append(field, value);
            
            const response = await fetch(
                API_ROUTES.USERS.PROFILE_UPDATE,
                {
                    method: 'PUT',
                    headers: this.getAuthHeaders(null),
                    credentials: 'include',
                    body: formData
                }
            );
            
            const responseText = await response.text();
            
            if (!response.ok) {
                throw new Error(`Failed to update ${field} (${response.status}): ${responseText}`);
            }

            try {
                const jsonData = JSON.parse(responseText);
                
                if (jsonData.photo_url) {
                    jsonData.photo_url = this.formatPhotoUrl(jsonData.photo_url);
                }
                
                // Format company_logo_url if present in response
                if (jsonData.company_logo_url) {
                    jsonData.company_logo_url = this.formatPhotoUrl(jsonData.company_logo_url);
                }
                
                return jsonData;
            } catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }
        } finally {
            if (this._updateInProgress === requestId) {
                this._updateInProgress = null;
            }
        }
    },

    // Add a specialized method for updating company logo
    async updateCompanyLogo(companyLogoFile) {
        const requestId = `company_logo_update_${Date.now()}`;
        
        if (this._updateInProgress) {
            return Promise.reject(new Error('Another update is in progress'));
        }
        
        this._updateInProgress = requestId;
        
        try {
            const formData = new FormData();
            formData.append('company_logo', companyLogoFile);
            
            const response = await fetch(
                API_ROUTES.USERS.PROFILE_UPDATE,
                {
                    method: 'PUT',
                    headers: this.getAuthHeaders(null),
                    credentials: 'include',
                    body: formData
                }
            );
            
            const responseText = await response.text();
            
            if (!response.ok) {
                throw new Error(`Failed to update company logo (${response.status}): ${responseText}`);
            }

            try {
                const jsonData = JSON.parse(responseText);
                
                if (jsonData.photo_url) {
                    jsonData.photo_url = this.formatPhotoUrl(jsonData.photo_url);
                }
                
                if (jsonData.company_logo_url) {
                    jsonData.company_logo_url = this.formatPhotoUrl(jsonData.company_logo_url);
                }
                
                return jsonData;
            } catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }
        } finally {
            if (this._updateInProgress === requestId) {
                this._updateInProgress = null;
            }
        }
    },

    // New method for updating contact info using the dedicated endpoint
    async updateContactInfo(contactData) {
        const requestId = `contact_update_${Date.now()}`;
        
        if (this._updateInProgress) {
            return Promise.reject(new Error('Another update is in progress'));
        }
        
        this._updateInProgress = requestId;
        
        try {
            const formData = new FormData();
            
            // Add email and website as separate fields
            if (contactData.email !== undefined) {
                formData.append('email', contactData.email);
            }
            
            if (contactData.website !== undefined) {
                formData.append('website', contactData.website);
            }
            
            // Add the contact JSON object if provided
            if (contactData.contact !== undefined) {
                formData.append('contact', JSON.stringify(contactData.contact));
            }
            
            const response = await fetch(
                API_ROUTES.USERS.CONTACT_INFO_UPDATE,
                {
                    method: 'PUT',
                    headers: this.getAuthHeaders(null),
                    credentials: 'include',
                    body: formData
                }
            );
            
            const responseText = await response.text();
            
            if (!response.ok) {
                throw new Error(`Failed to update contact info (${response.status}): ${responseText}`);
            }

            try {
                const jsonData = JSON.parse(responseText);
                return jsonData;
            } catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }
        } finally {
            if (this._updateInProgress === requestId) {
                this._updateInProgress = null;
            }
        }
    },

    async checkSlugAvailability(slug) {
        if (!slug) {
            return { available: false };
        }
    
        // Get the current user ID from localStorage or context
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const currentUserId = userData.id || null;
    
        const response = await fetch(
            // Pass the current user ID as a query parameter
            `${API_ROUTES.USERS.CHECK_SLUG(slug)}${currentUserId ? `?current_user_id=${currentUserId}` : ''}`,
            {
                method: 'GET',
                headers: this.getAuthHeaders(),
                credentials: 'include'
            }
        );
    
        if (!response.ok) {
            throw new Error(`Slug check failed (${response.status})`);
        }
    
        return await response.json();
    }
};

// profileServices.js
export const getProfileBySlug = async (slug) => {
    try {
      const response = await fetch(`/api/v1/profiles/${slug}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile by slug:', error);
      throw error;
    }
  };