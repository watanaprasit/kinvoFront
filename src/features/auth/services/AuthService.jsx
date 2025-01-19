import { BASE_URL } from "../../../library/constants/routes";

export const signupUser = async (email, password, fullName) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ email, password, full_name: fullName }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (response.ok) {
    return { success: true, data };
  } else {
    return { success: false, error: data.detail || 'Signup failed' };
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Login failed. Please check your email and password.');
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      return { success: true, user: { email } };
    }

    return { success: false };
  } catch (error) {
    console.error("Login error: ", error);
    return { success: false };
  }
};

export const loginWithGoogle = async (idToken) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/google/callback`, {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Google login failed.');
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      return { success: true, user: { email: data.email } };
    }

    return { success: false };
  } catch (error) {
    console.error('Google login error:', error);
    return { success: false };
  }
};

export const signupWithGoogle = async (idToken) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/google/callback`, {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Google signup failed.');
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      return { success: true, user: { email: data.email } };
    }

    return { success: false };
  } catch (error) {
    console.error('Google signup error:', error);
    return { success: false };
  }
};
