import { useState } from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import { useLogin } from '../../hooks/UseLogin';
import Button from '../../../../components/common/Button/index';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSubmit, isSubmitting, emailError, passwordError } = useLogin();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(email, password);
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6 relative z-10">Welcome Back!</h2>
      <p className="text-center mt-2">New to Kinvo? <a href="/auth/signup" className="text-blue-500">Create an Account</a></p>

      <div className="mt-4">
        <label htmlFor="email" className="block text-gray-700">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
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
        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
      </div>

      <div className="text-center mt-6">Or</div>

      <Button
        onClick={() => console.log('Google login clicked')}
        className="primary w-full mt-3 flex items-center justify-center"
      >
        <FaGoogle className="mr-3" /> Sign in with Google
      </Button>

      <Button
        onClick={() => console.log('Apple login clicked')}
        className="secondary w-full mt-3 flex items-center justify-center"
      >
        <FaApple className="mr-3" /> Sign in with Apple
      </Button>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="primary w-full mt-6"
      >
        Sign In
      </Button>

      <div className="text-center mt-4 text-sm">
        By signing in, you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a> and <a href="/privacy" className="text-blue-500">Privacy Policy</a>.
      </div>
    </form>
  );
};

export default LoginForm;
