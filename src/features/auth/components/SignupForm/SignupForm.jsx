import { useState } from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
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
      </div>

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
