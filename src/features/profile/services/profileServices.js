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
        
        // Remove any trailing question mark
        let formattedUrl = url.replace(/\?$/, '');
        
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
            console.error("Failed to parse JSON:", responseText);
            throw new Error(`Invalid JSON response: ${responseText}`);
        }
        
        console.log('ProfileService - Raw profile data:', data);
        
        // Ensure photo_url is properly formatted using the formatPhotoUrl function
        if (data.photo_url) {
            data.photo_url = this.formatPhotoUrl(data.photo_url);
            console.log('Formatted photo URL:', data.photo_url);
        }
        
        return data;
    },

    async updateProfile(userId, data) {
        // Add debouncing mechanism with a unique request identifier
        const requestId = `profile_update_${Date.now()}`;
        
        // Check if there's an ongoing request and prevent duplicate submission
        if (this._updateInProgress) {
            console.log('Update already in progress, skipping duplicate request');
            return Promise.reject(new Error('Another update is in progress'));
        }
        
        this._updateInProgress = requestId;
        
        try {
            const formData = new FormData();
            
            if (data instanceof FormData) {
                // Handle photo upload if it exists
                const photo = data.get('photo');
                if (photo instanceof File && photo.size > 0) {
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
                
                // Only check slug availability if a slug is provided and it's not empty
                const currentSlug = data.get('slug');
                if (currentSlug && currentSlug.trim() !== '') {
                    try {
                        // Get current profile
                        const currentProfile = await this.getProfileByUserId(userId);
                        
                        // Only check availability if the slug changed
                        if (currentProfile && currentSlug !== currentProfile.slug) {
                            const slugCheck = await this.checkSlugAvailability(currentSlug);
                            if (!slugCheck.available) {
                                return Promise.reject(new Error('Slug is already in use'));
                            }
                        }
                    } catch (error) {
                        console.error('Error checking current profile:', error);
                    }
                } else {
                    // Remove slug from FormData if it's empty or not provided
                    data.delete('slug');
                }
                
                const response = await fetch(
                    API_ROUTES.USERS.PROFILE_UPDATE,
                    {
                        method: 'PUT',
                        headers: this.getAuthHeaders(null),
                        credentials: 'include',
                        body: data
                    }
                );
                
                const responseText = await response.text();
                console.log('Profile update response:', responseText);
                
                if (!response.ok) {
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
                    console.error("JSON Parse Error:", e);
                    throw new Error(`Invalid JSON response: ${responseText}`);
                }
            } else {
                // Handle regular object data
                if (data.display_name) formData.append('display_name', data.display_name);
                
                // Only process slug if it's provided and not empty
                // if (data.slug && data.slug.trim() !== '') {
                //     try {
                //         // Get current profile
                //         const currentProfile = await this.getProfileByUserId(userId);
                        
                //         // Only check availability if the slug changed
                //         if (currentProfile && data.slug !== currentProfile.slug) {
                //             const slugCheck = await this.checkSlugAvailability(data.slug);
                //             if (!slugCheck.available) {
                //                 return Promise.reject(new Error('Slug is already taken'));
                //             }
                //         }
                        
                //         formData.append('slug', data.slug);
                //     } catch (error) {
                //         console.error('Error checking current profile:', error);
                //     }
                // }
                
                if (data.photo && data.photo instanceof File && data.photo.size > 0) {
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
                console.log('Profile update response:', responseText);
                
                if (!response.ok) {
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
                    console.error("JSON Parse Error:", e);
                    throw new Error(`Invalid JSON response: ${responseText}`);
                }
            }
        } finally {
            // Only clear flag if this is the current request
            if (this._updateInProgress === requestId) {
                this._updateInProgress = null;
            }
        }
    },

    // Add this to your ProfileService.js

async updateDisplayName(userId, displayName) {
    // Add debouncing mechanism with a unique request identifier
    const requestId = `display_name_update_${Date.now()}`;
    
    // Check if there's an ongoing request and prevent duplicate submission
    if (this._updateInProgress) {
        console.log('Update already in progress, skipping duplicate request');
        return Promise.reject(new Error('Another update is in progress'));
    }
    
    this._updateInProgress = requestId;
    
    try {
        const formData = new FormData();
        formData.append('display_name', displayName);
        
        const response = await fetch(
            `${API_ROUTES.BASE_URL}/api/v1/users/me/display-name`,  // Update this with your actual route
            {
                method: 'PUT',
                headers: this.getAuthHeaders(null),
                credentials: 'include',
                body: formData
            }
        );
        
        const responseText = await response.text();
        console.log('Display name update response:', responseText);
        
        if (!response.ok) {
            throw new Error(`Failed to update display name (${response.status}): ${responseText}`);
        }

        try {
            const jsonData = JSON.parse(responseText);
            
            // Format the photo_url if it exists
            if (jsonData.photo_url) {
                jsonData.photo_url = this.formatPhotoUrl(jsonData.photo_url);
            }
            
            return jsonData;
        } catch (e) {
            console.error("JSON Parse Error:", e);
            throw new Error(`Invalid JSON response: ${responseText}`);
        }
    } finally {
        // Only clear flag if this is the current request
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