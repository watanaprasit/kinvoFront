import { useState, useEffect } from 'react';
import { useSignup } from '../../hooks/useSignup';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/common/Button/index';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const navigate = useNavigate();
  const { 
    handleSubmit, 
    handleGoogleSignup, 
    isSubmitting, 
    emailError, 
    passwordError, 
    fullNameError,
    validateEmail // Add this to your useSignup hook
  } = useSignup();

  useEffect(() => {
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        initializeGoogleSignUp();
      };

      return () => {
        document.body.removeChild(script);
      };
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleSignUp = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '756781097319-h7bgtos2krue9i7ofu0c8lml2ur2kpc0.apps.googleusercontent.com',
        callback: (response) => handleGoogleSignup(response.credential),
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignupButton'),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: '100%',
        }
      );
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsValidatingEmail(true);
    
    try {
      // First validate the email
      const isValidEmail = await validateEmail(email);
      
      if (isValidEmail) {
        // Store form data in sessionStorage for the slug registration page
        sessionStorage.setItem('registrationData', JSON.stringify({
          email,
          name,
          password,
          timestamp: Date.now() // Add timestamp for expiry checking
        }));
        
        // Redirect to slug registration
        navigate('/auth/select-slug');
      } else {
        setEmailError('Please enter a valid email address');
      }
    } catch (error) {
      setEmailError('Error validating email. Please try again.');
    } finally {
      setIsValidatingEmail(false);
    }
  };

  // Handle Google signup success
  const handleGoogleSuccess = async (credential) => {
    const response = await handleGoogleSignup(credential);
    if (response.success) {
      // Store Google data and redirect to slug selection
      sessionStorage.setItem('registrationData', JSON.stringify({
        email: response.email,
        name: response.name,
        googleCredential: credential,
        timestamp: Date.now()
      }));
      navigate('/auth/select-slug');
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Set Up Your Account</h2>

      <div id="googleSignupButton" className="mt-3"></div>

      <div className="flex items-center justify-center mt-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-400">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="mt-4">
        <label htmlFor="name" className="block text-gray-700">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
        {fullNameError && <p className="text-red-500 text-sm">{fullNameError}</p>}
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

      <Button
        type="submit"
        isLoading={isSubmitting || isValidatingEmail}
        className="primary w-full mt-6"
      >
        {isValidatingEmail ? 'Validating Email...' : isSubmitting ? 'Submitting...' : 'Create Account'}
      </Button>

      <div className="text-center mt-4 text-sm">
        By signing up, you agree to our <a href="/terms" className="text-blue-500">Terms of Service</a> and <a href="/privacy" className="text-blue-500">Privacy Policy</a>.
      </div>
    </form>
  );
};

export default SignupForm;