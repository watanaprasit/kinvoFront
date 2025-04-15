import { useState, useEffect } from 'react';
import { useSignup } from '../../hooks/useSignup';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/common/Button/index';
import { Link } from 'react-router-dom';

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
    setEmailError,  
    passwordError, 
    fullNameError,
    validateEmail 
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
        callback: handleGoogleCredential,
        auto_select: false,
      });
    }
  };

  // New handler for Google credential
  const handleGoogleCredential = async (response) => {
    
    const result = await handleGoogleSignup(response.credential);
    
    if (result.success) {
      // Store registration data and redirect to slug selection
      sessionStorage.setItem('registrationData', JSON.stringify({
        email: result.email,
        name: result.name,
        googleCredential: response.credential, // Store the original credential
        timestamp: Date.now()
      }));
      navigate('/auth/select-slug');
    } else {
      console.error('Google signup failed:', result.error);
    }
  };

  const handleCustomGoogleSignup = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsValidatingEmail(true);
    
    try {
      // First validate the email
      const isValidEmail = await validateEmail(email);
      
      if (isValidEmail) {
        // Call the handleSubmit from useSignup
        const result = await handleSubmit(email, password, name);
        
        if (result.success) {
          // Store form data in sessionStorage for the slug registration page
          sessionStorage.setItem('registrationData', JSON.stringify({
            email,
            name,
            password,
            timestamp: Date.now()
          }));
          
          // Redirect to slug registration
          navigate('/auth/select-slug');
        }
      } else {
        setEmailError('Please enter a valid email address');
      }
    } catch (error) {
      setEmailError('Error validating email. Please try again.');
    } finally {
      setIsValidatingEmail(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Set Up Your Account</h2>

      {/* Custom Google button that matches login component */}
      <button
        type="button"
        onClick={handleCustomGoogleSignup}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-all mt-4"
      >
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
        </svg>
        <span>Sign up with Google</span>
      </button>

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

      {/* Add this new section */}
      <div className="text-center mt-4 text-sm">
        Already have an account? <Link to="/auth/signin" className="text-blue-500 font-medium">Log in</Link>
      </div>

      <div className="text-center mt-4 text-sm">
        By signing in, you agree to our <Link to="/company/terms" className="text-blue-500">Terms of Service</Link> and <Link to="/company/privacy" className="text-blue-500">Privacy Policy</Link>.
      </div>
    </form>
  );
};

export default SignupForm;