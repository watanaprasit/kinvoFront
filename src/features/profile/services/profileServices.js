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
  
      const data = await response.json();
      console.log('ProfileService - Raw profile data:', data); 
      return data; 
  
    },

    async updateProfile(userId, data) {
      const formData = new FormData();
      
      if (data instanceof FormData) {
          const photo = data.get('photo');
          if (photo instanceof File) {
              const fileExt = photo.name.split('.').pop();
              const uniqueId = crypto.randomUUID().replace(/-/g, '');
              const fileName = `${uniqueId}.${fileExt}`;
              
              const renamedFile = new File([photo], fileName, {
                  type: photo.type
              });
              
              data.delete('photo');
              data.append('photo', renamedFile);
              data.append('file_path', fileName);
              
              console.log('Uploading photo:', fileName);
          }
          
          return fetch(
              API_ROUTES.USERS.PROFILE_UPDATE,
              {
                  method: 'PUT',
                  headers: this.getAuthHeaders(null),
                  credentials: 'include',
                  body: data
              }
          ).then(async response => {
              const responseText = await response.text();
              console.log('Profile update response:', responseText);
              
              if (!response.ok) {
                  throw new Error(`Failed to update profile (${response.status}): ${responseText}`);
              }

              try {
                  return JSON.parse(responseText);
              } catch (e) {
                  throw new Error(`Invalid JSON response: ${responseText}`);
              }
          });
      } else {
          // Handle regular object data
          if (data.display_name) formData.append('display_name', data.display_name);
          if (data.slug) formData.append('slug', data.slug);
          if (data.photo) {
              const fileExt = data.photo.name.split('.').pop();
              const uniqueId = crypto.randomUUID().replace(/-/g, '');
              const fileName = `${uniqueId}.${fileExt}`;
              
              const renamedFile = new File([data.photo], fileName, {
                  type: data.photo.type
              });
              
              formData.append('photo', renamedFile);
              formData.append('file_path', fileName);
              
              console.log('Uploading photo:', fileName);
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
              const responseText = await response.text();
              console.log('Profile update response:', responseText);
              
              if (!response.ok) {
                  throw new Error(`Failed to update profile (${response.status}): ${responseText}`);
              }

              try {
                  const data = JSON.parse(responseText);
                  
                  // Clean up the photo_url if it exists
                  if (data.photo_url) {
                      data.photo_url = data.photo_url.replace(/\?$/, ''); // Remove trailing question mark
                  }
                  
                  return data;
              } catch (e) {
                  throw new Error(`Invalid JSON response: ${responseText}`);
              }
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