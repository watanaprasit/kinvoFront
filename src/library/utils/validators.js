// src/utils/validators.js

/**
 * Known email providers for validation
 */
const knownProviders = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'aol.com',
  'zoho.com',
  'protonmail.com',
  'mail.com',
  'yandex.com',
];

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email format is valid
 */
export const validateEmailFormat = (email) => {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

/**
 * Validates that a field is not empty
 * @param {string} value - Value to check
 * @returns {boolean} - True if value is not empty
 */
export const validateRequired = (value) => {
  if (value === undefined || value === null) return false;
  return String(value).trim() !== '';
};

/**
 * Validates that an email uses a known provider
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email uses a known provider
 */
export const validateKnownEmailProvider = (email) => {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1];
  return knownProviders.includes(domain);
};

/**
 * Checks if email is already in use (async)
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - Promise resolving to true if email is unique
 */
export const validateEmailUniqueness = async (email) => {
  try {
    const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.isUnique;
  } catch (error) {
    console.error('Error checking email uniqueness:', error);
    return false;
  }
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL format is valid
 */
export const validateUrlFormat = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validates phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone number format is valid
 */
export const validatePhoneFormat = (phone) => {
  if (!phone) return false;
  // Basic phone validation - adapt for your region/requirements
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result and strength score
 */
export const validatePasswordStrength = (password) => {
  if (!password) return { valid: false, score: 0, message: 'Password is required' };
  
  let score = 0;
  const messages = [];
  
  // Length check
  if (password.length < 8) {
    messages.push('Password must be at least 8 characters');
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Add messages based on missing criteria
  if (!/[A-Z]/.test(password)) messages.push('Add uppercase letter');
  if (!/[a-z]/.test(password)) messages.push('Add lowercase letter');
  if (!/[0-9]/.test(password)) messages.push('Add number');
  if (!/[^A-Za-z0-9]/.test(password)) messages.push('Add special character');
  
  // Determine validation result
  const valid = score >= 3 && password.length >= 8;
  
  // Get appropriate message
  let strengthMessage = '';
  if (score <= 1) strengthMessage = 'Weak';
  else if (score <= 3) strengthMessage = 'Moderate';
  else strengthMessage = 'Strong';
  
  return {
    valid,
    score,
    message: messages.length > 0 ? messages.join(', ') : strengthMessage
  };
};

/**
 * Validates maximum character length
 * @param {string} value - Value to check
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} - True if value is within max length
 */
export const validateMaxLength = (value, maxLength) => {
  if (!value) return true; // Empty value is valid for length check
  return String(value).length <= maxLength;
};

/**
 * Validates minimum character length
 * @param {string} value - Value to check
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - True if value meets min length
 */
export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  return String(value).length >= minLength;
};

/**
 * Validate file size
 * @param {File} file - File object to validate
 * @param {number} maxSizeInMB - Maximum file size in MB
 * @returns {boolean} - True if file size is valid
 */
export const validateFileSize = (file, maxSizeInMB) => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validate file type
 * @param {File} file - File object to validate
 * @param {Array<string>} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - True if file type is allowed
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file || !allowedTypes || !allowedTypes.length) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validates a form object with multiple fields
 * @param {Object} formData - Form data to validate
 * @param {Object} validationRules - Rules for validation
 * @returns {Object} - Object containing validation errors
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    // Required check
    if (rules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
      return; // Skip other validations if required fails
    }
    
    // Other validations only if value exists
    if (value) {
      // Email format
      if (rules.email && !validateEmailFormat(value)) {
        errors[field] = `Please enter a valid email address`;
      }
      
      // URL format
      if (rules.url && !validateUrlFormat(value)) {
        errors[field] = `Please enter a valid URL`;
      }
      
      // Min length
      if (rules.minLength && !validateMinLength(value, rules.minLength)) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`;
      }
      
      // Max length
      if (rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
        errors[field] = `${field} must be no more than ${rules.maxLength} characters`;
      }
      
      // Custom validator
      if (rules.custom && typeof rules.custom.validator === 'function') {
        const isValid = rules.custom.validator(value);
        if (!isValid) {
          errors[field] = rules.custom.message || `${field} is invalid`;
        }
      }
    }
  });
  
  return errors;
};