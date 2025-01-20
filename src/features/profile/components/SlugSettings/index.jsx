import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';

const SlugSettings = () => {
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/v1/users/me/slug', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail);
      }

      // Handle success (e.g., show notification, update user context)
    } catch (err) {
      setError(err.message);
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
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
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