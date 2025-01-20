import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import { useSlugRegistration } from '../../hooks/useSlugRegistration';
import { useDebounce } from '../../hooks/useDebounce';

const SlugRegistration = () => {
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const debouncedSlug = useDebounce(slug, 500);
  
  const {
    isChecking,
    isAvailable,
    error,
    checkSlugAvailability,
    updateUserSlug
  } = useSlugRegistration();

  // Check availability when slug changes
  useEffect(() => {
    if (debouncedSlug && debouncedSlug.length >= 3) {
      checkSlugAvailability(debouncedSlug);
    }
  }, [debouncedSlug, checkSlugAvailability]);

  const validateSlug = (value) => {
    // Only allow lowercase letters, numbers, and hyphens
    return /^[a-z0-9-]+$/.test(value);
  };

  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase();
    if (value === '' || validateSlug(value)) {
      setSlug(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Final availability check before submission
      const isSlugAvailable = await checkSlugAvailability(slug);
      
      if (isSlugAvailable) {
        const result = await updateUserSlug(slug);
        if (result.success) {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Error during slug registration:', err);
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Your Custom URL</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="slug" className="block text-gray-700">Custom URL:</label>
          <div className="flex items-center mt-2">
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
              className={`flex-1 p-3 border rounded-r-md focus:outline-none focus:ring-2 transition-colors ${getStatusColor()}`}
              placeholder="your-custom-url"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mt-1 min-h-[20px]">
            {slug && (
              <p className={`text-sm ${
                isChecking ? 'text-blue-500' :
                isAvailable ? 'text-green-500' :
                error ? 'text-red-500' :
                'text-gray-500'
              }`}>
                {isChecking ? 'Checking availability...' :
                 isAvailable ? 'This URL is available!' :
                 error ? error :
                 'Only lowercase letters, numbers, and hyphens are allowed'}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!isAvailable || isChecking || isSubmitting || !slug}
          className={`w-full mt-6 ${
            isAvailable && !isChecking && !isSubmitting && slug
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
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