import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import { useSlugRegistration } from '../../hooks/useSlugRegistration';
import { useDebounce } from '../../hooks/useDebounce';
import { CheckCircle } from 'lucide-react';
import { signupWithGoogle } from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';

const SlugRegistration = () => {
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const debouncedSlug = useDebounce(slug, 1000);
  const { login } = useAuth();
  
  const {
    isChecking,
    isAvailable,
    checkSlugAvailability,
  } = useSlugRegistration();

  useEffect(() => {
    // Validate registration data exists
    const regData = sessionStorage.getItem('registrationData');
    if (!regData) {
      navigate('/auth/signup');
      return;
    }

    try {
      const parsedData = JSON.parse(regData);
      if (!parsedData.email || (!parsedData.googleCredential && !parsedData.password)) {
        navigate('/auth/signup');
      }
    } catch (e) {
      navigate('/auth/signup');
    }
  }, [navigate]);
  
  useEffect(() => {
    if (debouncedSlug && debouncedSlug.length >= 3) {
      checkSlugAvailability(debouncedSlug);
    }
  }, [debouncedSlug, checkSlugAvailability]);

  const validateSlug = (value) => {
    return /^[a-z0-9-]+$/.test(value);
  };

  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase();
    if (value === '' || validateSlug(value)) {
      setSlug(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
  
    try {
      const registrationData = JSON.parse(sessionStorage.getItem('registrationData'));
      
      if (!registrationData) {
        throw new Error('Registration data not found');
      }
  
      // Final availability check
      const isSlugAvailable = await checkSlugAvailability(slug);
      
      if (!isSlugAvailable) {
        throw new Error('This URL is no longer available');
      }
  
      let result;
      
      if (registrationData.googleCredential) {
        // Complete Google signup
        result = await signupWithGoogle(registrationData.googleCredential, slug);
        console.log("Google signup result:", result);
      } else {
        throw new Error('Email signup is currently unavailable');
      }
  
      if (result?.success) {
        // Get user data from the result
        const userData = result.user || {
          email: registrationData.email,
          slug: slug,
          full_name: registrationData.name
        };
        
        // Update AuthContext with the new user data
        await login(userData);
        
        // Clear registration data
        sessionStorage.removeItem('registrationData');
        
        // Force a page reload to ensure all authentication state is updated
        console.log('Registration successful, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error(result?.error || 'Failed to complete registration');
      }
    } catch (err) {
      console.error('Error during slug registration:', err);
      setError(err.message || 'Failed to complete registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputStatus = () => {
    if (!slug) return 'neutral';
    if (isChecking) return 'checking';
    if (error) return 'error';
    if (isAvailable) return 'success';
    return 'neutral';
  };

  const getStatusColor = () => {
    const status = getInputStatus();
    switch (status) {
      case 'success':
        return 'ring-green-500 border-green-500';
      case 'error':
        return 'ring-red-500 border-red-500';
      case 'checking':
        return 'ring-blue-300 border-blue-300';
      default:
        return 'ring-gray-300 border-gray-300';
    }
  };

  const getStatusMessage = () => {
    if (isChecking) return 'Checking availability...';
    if (error) return error;
    if (!isAvailable && slug.length >= 3) return 'This URL is already taken';
    if (isAvailable) return 'This URL is available!';
    return 'Only lowercase letters, numbers, and hyphens are allowed';
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Your Custom URL</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="slug" className="block text-gray-700">Custom URL:</label>
          <div className="flex items-center mt-2 relative">
            <span className="text-gray-500 bg-gray-100 px-3 py-3 rounded-l-md border border-r-0">
              kinvo.com/
            </span>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={handleSlugChange}
              minLength={3}
              maxLength={50}
              className={`flex-1 p-3 border rounded-r-md focus:outline-none focus:ring-2 transition-colors pr-10 ${getStatusColor()}`}
              placeholder="your-custom-url"
              required
              disabled={isSubmitting}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <CheckCircle 
                className={`w-5 h-5 transition-all duration-200 ${
                  isAvailable && !isChecking 
                    ? 'text-green-500'
                    : 'text-gray-300'
                }`}
              />
            </div>
          </div>
          <div className="mt-1 min-h-[20px]">
            {slug && (
              <p className={`text-sm ${
                isChecking ? 'text-blue-500' :
                isAvailable ? 'text-green-500' :
                error || (!isAvailable && slug.length >= 3) ? 'text-red-500' :
                'text-gray-500'
              }`}>
                {getStatusMessage()}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isAvailable || isChecking || isSubmitting || !slug}
          className={`w-full mt-6 transition-all duration-200 ${
            isAvailable && !isChecking && !isSubmitting && slug
              ? 'bg-blue-600 hover:bg-blue-700 opacity-100'
              : 'bg-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
          {isSubmitting ? 'Setting up your profile...' : 'Continue'}
        </Button>

        <div className="text-center mt-4 text-sm text-gray-600">
          This will be your public profile URL. You can change it later in your settings.
        </div>
      </form>
    </div>
  );
};

export default SlugRegistration;