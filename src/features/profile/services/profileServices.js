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
          // The same code as before, FormData will handle new fields automatically
          
          const response = await fetch(
            API_ROUTES.USERS.PROFILE_UPDATE,
            {
              method: 'PUT',
              headers: this.getAuthHeaders(null),
              credentials: 'include',
              body: data // FormData can include title and bio now
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