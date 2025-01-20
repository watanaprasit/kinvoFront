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
    console.error('Signup error:', error);
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
    console.error("Login error: ", error);
    return { 
      success: false,
      error: error.message || 'Login failed' 
    };
  }
};

export const signupWithGoogle = async (idToken) => {
  try {
    const response = await fetch(API_ROUTES.AUTH.GOOGLE_CALLBACK, {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok) {
      // Don't store the token yet if no slug is set
      if (data.slug) {
        // User already has a slug, complete the signup
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        return { 
          success: true,
          isComplete: true,
          email: data.email,
          name: data.full_name,
          slug: data.slug
        };
      } else {
        // User needs to set a slug
        return {
          success: true,
          isComplete: false,
          email: data.email,
          name: data.full_name,
          tempToken: data.access_token // Store this temporarily
        };
      }
    }

    throw new Error(data.detail || 'Google signup failed');
  } catch (error) {
    console.error('Google signup error:', error);
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
    console.error('Update slug error:', error);
    return {
      success: false,
      error: error.message || 'Failed to update slug'
    };
  }
};