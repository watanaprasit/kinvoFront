/**
 * Formats and sanitizes image URLs by removing trailing question marks and cache parameters
 * @param {string} url - The image URL to clean
 * @returns {string|null} - The cleaned URL or null if no URL provided
 */
export const cleanImageUrl = (url) => {
    if (!url) return null;
    
    // First, remove any trailing question mark
    let cleaned = url.endsWith('?') ? url.slice(0, -1) : url;
    
    // Then, remove any existing cache-busting parameters
    if (cleaned.includes('?t=')) {
      cleaned = cleaned.split('?t=')[0];
    }
    
    return cleaned;
  };
  
  /**
   * Formats an image URL according to the application's requirements
   * This is a wrapper for ProfileService.formatPhotoUrl that could include additional logic
   * @param {string} url - The image URL to format
   * @returns {string} - The formatted URL
   */
  export const formatPhotoUrl = (url) => {
    // Assuming ProfileService.formatPhotoUrl exists elsewhere
    // You could incorporate that logic directly here if appropriate
    if (!url) return '';
    
    // This is a placeholder for your existing photo URL formatting logic
    // Consider moving the logic from ProfileService directly into this function
    return url;
  };
  
  /**
   * Converts technical error messages to user-friendly versions
   * @param {string} error - The technical error message
   * @returns {string} - A user-friendly error message
   */
  export const getUserFriendlyError = (error) => {
    if (!error) return 'An unknown error occurred';
    
    // Check for specific error patterns and return user-friendly alternatives
    if (error.includes('violates check constraint')) {
      return 'Your profile name can only contain letters, numbers, and hyphens.';
    } else if (error.includes('Slug is already taken')) {
      return 'This profile name is already being used by someone else. Please choose another one.';
    } else if (error.includes('maximum size')) {
      return 'Your file is too large. Please choose a smaller image (under 5MB).';
    } else if (error.includes('JPEG or PNG')) {
      return 'Please upload a photo in JPG or PNG format only.';
    } else if (error.includes('network error') || error.includes('timeout')) {
      return 'We couldn\'t connect to our servers. Please check your internet connection and try again.';
    } else if (error.includes('validation')) {
      return 'Something doesn\'t look right with your information. Please double-check what you\'ve entered.';
    } else if (error.includes('unauthorized') || error.includes('401')) {
      return 'Your session has expired. Please refresh the page and log in again.';
    } else if (error.includes('30 characters or less')) {
      return 'Your display name must be 30 characters or less.';
    } else if (error.includes('Display name must be')) {
      return 'Your display name must be 30 characters or less.';
    } else if (error.includes('email')) {
      return 'Please enter a valid email address.';
    } else if (error.includes('website')) {
      return 'Website must be a valid URL starting with http:// or https://';
    }
    
    // Parse JSON errors if present
    try {
      if (error.includes('{') && error.includes('}')) {
        const jsonMatch = error.match(/\{.*\}/);
        if (jsonMatch) {
          const errorObj = JSON.parse(jsonMatch[0]);
          if (errorObj.detail) {
            return errorObj.detail; // Return the specific error message from the API
          }
        }
      }
    } catch (e) {
      // If JSON parsing fails, continue to default message
    }
    
    // Default user-friendly message
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  };
  
  /**
   * Validates a slug format
   * @param {string} slug - The slug to validate
   * @returns {boolean} - True if the slug format is valid
   */
  export const isValidSlugFormat = (slug) => {
    if (!slug) return false;
    const slugRegex = /^[a-zA-Z0-9-]+$/;
    return slugRegex.test(slug);
  };
  
  /**
   * Formats a profile URL given a slug
   * @param {string} slug - The profile slug
   * @param {boolean} includeProtocol - Whether to include https:// in the URL
   * @returns {string} - The complete profile URL
   */
  export const formatProfileUrl = (slug, includeProtocol = true) => {
    if (!slug) return '';
    const base = includeProtocol ? 'https://kinvo.com/' : 'kinvo.com/';
    return `${base}${slug}`;
  };
  
  /**
   * Formats a profile QR code URL
   * @param {string} slug - The profile slug 
   * @param {string} environment - The current environment
   * @returns {string} - The base URL for the QR code
   */
  export const formatQrCodeBaseUrl = (slug, environment) => {
    if (!slug) return '';
    return environment === 'development' ? 'http://localhost:5173/' : 'https://kinvo.com/';
  };