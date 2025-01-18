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
  
  export const validateEmailFormat = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };
  
  export const validateRequired = (value) => {
    return value.trim() !== '';
  };
  
  export const validateKnownEmailProvider = (email) => {
    const domain = email.split('@')[1];
    return knownProviders.includes(domain);
  };
  
  export const validateEmailUniqueness = async (email) => {
    const response = await fetch(`/api/check-email?email=${email}`);
    const data = await response.json();
    return data.isUnique;
  };
  