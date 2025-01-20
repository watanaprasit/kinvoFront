// features/profile/components/SlugSettings/index.jsx
import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import userApi from '../../../../services/api/user';

const SlugSettings = () => {
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userApi.updateSlug(slug);
      setSuccess('Custom URL updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update custom URL');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Custom URL</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Custom URL
          </label>
          <div className="flex items-center">
            <span className="text-gray-500">kinvo.com/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              pattern="[a-z0-9-]+"
              minLength={3}
              maxLength={50}
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="your-custom-url"
            />
          </div>
          {user?.slug && (
            <p className="text-sm text-gray-500 mt-1">
              Current URL: kinvo.com/{user.slug}
            </p>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-4">{success}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Save Custom URL
        </button>
      </form>
    </div>
  );
};

export default SlugSettings;