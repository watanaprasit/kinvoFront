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

        return await response.json();
    },


    async updateProfile(userId, data) {
      const formData = new FormData();
      
      // Ensure we're getting the exact values from the data object
      if (data instanceof FormData) {
          // If data is already FormData, use it directly
          return fetch(
              API_ROUTES.USERS.PROFILE_UPDATE,
              {
                  method: 'PUT',
                  headers: this.getAuthHeaders(null),
                  credentials: 'include',
                  body: data  // Use the FormData directly
              }
          ).then(async response => {
              console.log('Response status:', response.status);
              const responseText = await response.text();
              console.log('Response text:', responseText);
              
              if (!response.ok) {
                  throw new Error(`Failed to update profile (${response.status}): ${responseText}`);
              }
  
              return JSON.parse(responseText);
          });
      } else {
          // If data is a regular object, create new FormData
          if (data.display_name) formData.append('display_name', data.display_name);
          if (data.slug) formData.append('slug', data.slug);
          if (data.photo) formData.append('photo', data.photo);
          
          // Log exact values being sent
          for (let [key, value] of formData.entries()) {
              console.log(`Sending ${key}:`, value);
          }
          
          return fetch(
              API_ROUTES.USERS.PROFILE_UPDATE,
              {
                  method: 'PUT',
                  headers: this.getAuthHeaders(null),
                  credentials: 'include',
                  body: formData
              }
          ).then(async response => {
              console.log('Response status:', response.status);
              const responseText = await response.text();
              console.log('Response text:', responseText);
              
              if (!response.ok) {
                  throw new Error(`Failed to update profile (${response.status}): ${responseText}`);
              }
  
              return JSON.parse(responseText);
          });
      }
    },


    async checkSlugAvailability(slug) {
        if (!slug) {
            return { available: false };
        }

        const response = await fetch(
            API_ROUTES.USERS.CHECK_SLUG(slug),
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
