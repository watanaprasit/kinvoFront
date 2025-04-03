import { API_ROUTES } from "../../../library/constants/routes";

export const signupUser = async (email, password, fullName, slug = null) => {
  try {
    const response = await fetch(API_ROUTES.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        full_name: fullName,
        ...(slug && { slug }) 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      return { 
        success: true, 
        data,
        email: data.email,
        name: data.full_name,
        slug: data.slug 
      };
    } else {
      throw new Error(data.detail || 'Signup failed');
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'An error occurred during signup' 
    };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(API_ROUTES.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok && data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      return { 
        success: true, 
        user: { 
          email, 
          slug: data.slug,
          name: data.full_name 
        } 
      };
    }

    throw new Error('Login failed. Please check your email and password.');
  } catch (error) {
    return { 
      success: false,
      error: error.message || 'Login failed' 
    };
  }
};

export const loginWithGoogle = async (idToken) => {
  try {
    if (!idToken) {
      throw new Error('ID token is required');
    }

    const response = await fetch(API_ROUTES.AUTH.GOOGLE_CALLBACK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: idToken,
        auth_type: 'google',
        is_login: true  
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Google login failed');
    }

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }

    return {
      success: true,
      user: {
        email: data.email || data.user?.email,
        name: data.name || data.user?.full_name,
        slug: data.slug || data.user?.slug
      }
    };

  } catch (error) {
    return { 
      success: false,
      error: error.message || 'Failed to login with Google'
    };
  }
};

export const signupWithGoogle = async (idToken, slug = null) => {
  try {
    if (!idToken) {
      throw new Error('ID token is required');
    }

    const requestBody = {
      id_token: idToken,
      auth_type: 'google',
      ...(slug && { slug })
    };

    const response = await fetch(API_ROUTES.AUTH.GOOGLE_CALLBACK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.error?.message || 
                          data.detail?.message ||
                          data.detail ||
                          'Google signup failed';
                          
      if (errorMessage.includes('violates not-null constraint')) {
        throw new Error('Server configuration error: Please contact support');
      }
      
      throw new Error(errorMessage);
    }

    if (!slug) {
      sessionStorage.setItem('registrationData', JSON.stringify({
        email: data.email,
        googleCredential: idToken,
        name: data.name
      }));

      return {
        success: true,
        isComplete: false,
        email: data.email,
        name: data.name,
        idToken
      };
    }

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }

    return {
      success: true,
      isComplete: true,
      user: {
        email: data.email || data.user?.email,
        full_name: data.name || data.user?.full_name,
        slug: data.slug || data.user?.slug
      }
    };

  } catch (error) {
    return { 
      success: false,
      error: error.message || 'Failed to signup with Google'
    };
  }
};

export const updateUserSlug = async (slug) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(API_ROUTES.USERS.UPDATE_SLUG, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ slug })
    });

    const data = await response.json();
    return {
      success: response.ok,
      data: response.ok ? data : null,
      error: !response.ok ? data.detail : null
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to update slug'
    };
  }
};

