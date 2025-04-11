import { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/UseLogin';
import Button from '../../../../components/common/Button/index';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleSubmit, handleGoogleLogin, isSubmitting, emailError, passwordError } = useLogin();

  useEffect(() => {
    const loadGoogleScript = () => {
      // Check if script already exists to prevent duplicate loading
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        initializeGoogleSignIn();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);

      return () => {
        // Only remove if we added it
        const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (scriptElement) {
          document.body.removeChild(scriptElement);
        }
      };
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google && document.getElementById('googleButton')) {
      try {
        window.google.accounts.id.initialize({
          client_id: '756781097319-h7bgtos2krue9i7ofu0c8lml2ur2kpc0.apps.googleusercontent.com',
          callback: (response) => handleGoogleLogin(response.credential),
          auto_select: false,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleButton'),
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            width: 240, // Fixed width in pixels instead of percentage
          }
        );
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
      }
    }
  };

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

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="primary w-full mt-6"
      >
        Sign In
      </Button>

      <div className="flex items-center justify-center mt-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-400">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div id="googleButton" className="mt-3 flex justify-center"></div>

      <div className="text-center mt-4 text-sm">
        By signing in, you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a> and <a href="/privacy" className="text-blue-500">Privacy Policy</a>.
      </div>
    </form>
  );
};

export default LoginForm;