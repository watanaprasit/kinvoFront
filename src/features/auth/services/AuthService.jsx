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

  // Handle success or failure based on response
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
      // Store the token in localStorage if login is successful
      localStorage.setItem('access_token', data.access_token);
      return { success: true, user: { email } };  // Return success and user info
    }

    return { success: false };  // Return failure if no access token
  } catch (error) {
    console.error("Login error: ", error);
    return { success: false };
  }
};
