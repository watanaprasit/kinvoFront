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
      // Check if script already exists to prevent duplicate loading
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        initializeGoogleSignUp();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignUp;
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

  const initializeGoogleSignUp = () => {
    if (window.google && document.getElementById('googleSignupButton')) {
      try {
        window.google.accounts.id.initialize({
          client_id: '756781097319-h7bgtos2krue9i7ofu0c8lml2ur2kpc0.apps.googleusercontent.com',
          callback: handleGoogleCredential,
          auto_select: false,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignupButton'),
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signup_with',
            width: '100%',
          }
        );
      } catch (error) {
        console.error("Error initializing Google Sign-Up:", error);
      }
    }
  };

  // Handler for Google credential
  const handleGoogleCredential = async (response) => {
    const result = await handleGoogleSignup(response.credential);
    
    if (result.success) {
      // Store registration data and redirect to slug selection
      sessionStorage.setItem('registrationData', JSON.stringify({
        email: result.email,
        name: result.name,
        googleCredential: response.credential,
        timestamp: Date.now()
      }));
      navigate('/auth/select-slug');
    } else {
      console.error('Google signup failed:', result.error);
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
      <p className="text-center mt-2">Already have an account? <Link to="/auth/signin" className="text-blue-500">Log in</Link></p>

      <div className="mt-4">
        <label htmlFor="name" className="block text-gray-700">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mt-2 border border-gray-300 rounded-md"
        />
        {fullNameError && <p className="text-red-500 text-sm mt-1">{fullNameError}</p>}
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
        isLoading={isSubmitting || isValidatingEmail}
        className="primary w-full mt-6"
      >
        {isValidatingEmail ? 'Validating Email...' : isSubmitting ? 'Submitting...' : 'Create Account'}
      </Button>

      <div className="flex items-center justify-center mt-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-400">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div id="googleSignupButton" className="mt-3 flex justify-center"></div>

      <div className="text-center mt-4 text-sm">
        By signing in, you agree to our <Link to="/company/terms" className="text-blue-500">Terms of Service</Link> and <Link to="/company/privacy" className="text-blue-500">Privacy Policy</Link>.
      </div>
    </form>
  );
};

export default SignupForm;