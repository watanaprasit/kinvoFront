import { API_ROUTES } from "../../../library/constants/routes";

export const ProfileService = {
    getAuthHeaders(contentType = 'application/json') {
        const token = localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        
        // For FormData requests, only return Authorization header
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

        try {
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
        } catch (error) {
            console.error('getUserByEmail error:', error);
            throw error;
        }
    },

    async getProfileByUserId(userId) {
        if (!userId) {
            throw new Error('User ID is required');
        }

        try {
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
        } catch (error) {
            console.error('getProfileByUserId error:', error);
            throw error;
        }
    },

    async updateProfile(userId, data) {
      try {
          const formData = new FormData();
          
          // More detailed logging
          console.log('Raw update data:', {
              userId,
              data,
              display_name: data.display_name,
              slug: data.slug,
              photo: data.photo
          });
          
          if (data.display_name) {
              formData.append('display_name', data.display_name);
          }
          if (data.slug) {
              formData.append('slug', data.slug);
          }
          if (data.photo) {
              formData.append('photo', data.photo);
          }
          
          // Log the actual FormData entries
          console.log('FormData entries:');
          for (let pair of formData.entries()) {
              console.log(pair[0], pair[1]);
          }
          
          const response = await fetch(
              API_ROUTES.USERS.PROFILE_UPDATE,
              {
                  method: 'PUT',
                  headers: this.getAuthHeaders(null),
                  credentials: 'include',
                  body: formData
              }
          );
  
          // Log the complete response
          console.log('Response status:', response.status);
          const responseText = await response.text();
          console.log('Raw response:', responseText);
          
          if (!response.ok) {
              try {
                  const errorJson = JSON.parse(responseText);
                  throw new Error(`Failed to update profile (${response.status}): ${errorJson.detail || responseText}`);
              } catch {
                  throw new Error(`Failed to update profile (${response.status}): ${responseText}`);
              }
          }
  
          return JSON.parse(responseText);
          } catch (error) {
              console.error('updateProfile error:', error);
              throw error;
          }
      },

    async checkSlugAvailability(slug) {
        if (!slug) {
            return { available: false };
        }

        try {
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
        } catch (error) {
            console.error('checkSlugAvailability error:', error);
            throw error;
        }
    }
};