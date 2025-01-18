import { useState } from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { signupUser } from '../../services/AuthService'; 

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setFormError('');

    setIsSubmitting(true);

    // Validation checks
    if (!email) {
      setEmailError('Email is required');
      setIsSubmitting(false);
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      setIsSubmitting(false);
      return;
    }
    if (!name) {
      setNameError('Name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Call the signup API function
      const result = await signupUser(email, password, name);

      if (result.success) {
        // Handle successful signup, such as navigating to the login page or showing a success message
        alert('Signup successful! Please login.');
        // Optionally, redirect to the login page
        window.location.href = '/auth/login';
      } else {
        setFormError(result.error || 'An error occurred during signup.');
      }
    } catch (error) {
      setFormError('An error occurred during signup.');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-black shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Set Up Your Account</h2>
      
      <button className="w-full mt-3 p-3 bg-blue-500 text-white font-semibold rounded-md flex items-center justify-center">
        <FaGoogle className="mr-3" /> Sign up with Google
      </button>
      <button className="w-full mt-3 p-3 bg-black text-white font-semibold rounded-md flex items-center justify-center">
        <FaApple className="mr-3" /> Sign up with Apple
      </button>

      <div className="text-center mt-6">Or</div>

      <div className="mt-4">
        <label htmlFor="name" className="block text-gray-700">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
        {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="email" className="block text-gray-700">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>

      <div className="mt-4">
        <label htmlFor="password" className="block text-gray-700">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
      </div>

      {formError && <p className="text-red-500 text-sm text-center mt-3">{formError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-md"
      >
        {isSubmitting ? 'Submitting...' : 'Create Account'}
      </button>

      <div className="text-center mt-4">
        Already have an account? <a href="/auth/login" className="text-blue-500">Sign In</a>
      </div>

      <div className="text-center mt-4 text-sm">
        By signing up, you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a> and <a href="/privacy" className="text-blue-500">Privacy Policy</a>.
        This site is protected by reCAPTCHA and the Google <a href="/terms" className="text-blue-500">Terms of Service</a> and <a href="/privacy" className="text-blue-500">Privacy Policy</a> apply.
      </div>
    </form>
  );
};

export default SignupForm;
