// src/pages/app/BusinessCards.jsx
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';

const BusinessCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Mock fetch business cards (replace with actual API call)
  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Sample data - replace with actual API response
          setCards([
            {
              id: 1,
              name: 'Default Card',
              description: 'My professional business card',
              theme: 'blue',
              views: 12,
              lastEdited: '2025-04-15'
            }
          ]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching business cards:', error);
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Create new card handler
  const handleCreateCard = () => {
    // This would typically navigate to a card creator or open a modal
    alert('Create new business card functionality would open here');
  };

  // Edit card handler
  const handleEditCard = (id) => {
    alert(`Edit card with ID: ${id}`);
  };

  // Delete card handler
  const handleDeleteCard = (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  // View card handler
  const handleViewCard = (id) => {
    alert(`View card with ID: ${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Business Cards</h2>
        <button 
          onClick={handleCreateCard}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Create New Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Business Cards Yet</h3>
          <p className="text-gray-600 mb-4">Create your first digital business card to share with your network.</p>
          <button 
            onClick={handleCreateCard}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Create Your First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`h-3 bg-blue-500`}></div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{card.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                
                <div className="flex justify-between text-xs text-gray-500 mb-4">
                  <span>{card.views} views</span>
                  <span>Last edited: {new Date(card.lastEdited).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between space-x-2">
                  <button 
                    onClick={() => handleViewCard(card.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </button>
                  <button 
                    onClick={() => handleEditCard(card.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCard(card.id)}
                    className="flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Card Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Cards</p>
            <p className="text-xl font-bold">{cards.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-xl font-bold">{cards.reduce((sum, card) => sum + card.views, 0)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Saved Contacts</p>
            <p className="text-xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCards;