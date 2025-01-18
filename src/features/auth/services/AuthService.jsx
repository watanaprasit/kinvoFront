export const signupUser = async (email) => {
  const response = await fetch('/api/signup', {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
};

  