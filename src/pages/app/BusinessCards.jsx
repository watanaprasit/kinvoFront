// src/pages/app/BusinessCards.jsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { getUserFriendlyError } from '../../library/utils/formatters';
import CardList from '../../features/businessCards/components/CardList';
import CardCreator from '../../features/businessCards/components/CardCreator';

const BusinessCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { user } = useAuth();

  // Fetch business cards
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
        setError(getUserFriendlyError(error.message));
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Create new card handler
  const handleCreateCard = () => {
    setIsTemplateModalOpen(true);
  };

  // Handle template selection
  const handleTemplateSelect = (newCardData) => {
    console.log('Selected template data:', newCardData);
    // Here you would typically:
    // 1. Create the card in the database or local state
    // 2. Navigate to an editor for this specific card
    // 3. Or show a more detailed form to complete the card creation
    
    // For now, let's just add it to our cards array with a dummy ID
    const newCard = {
      id: Date.now(), // Use a timestamp as a temporary ID
      name: newCardData.name,
      description: newCardData.description,
      theme: newCardData.theme,
      views: 0,
      lastEdited: new Date().toISOString().split('T')[0],
      templateId: newCardData.templateId,
      userData: newCardData.userData
    };
    
    setCards([...cards, newCard]);
    setIsTemplateModalOpen(false);
    
    // You could also navigate to an edit page:
    // navigate(`/app/cards/edit/${newCard.id}`);
  };

  // Edit card handler
  const handleEditCard = (id) => {
    alert(`Edit card with ID: ${id}`);
    // This would typically navigate to editor: navigate(`/app/cards/edit/${id}`);
  };

  // Delete card handler
  const handleDeleteCard = (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        // API call would go here
        setCards(cards.filter(card => card.id !== id));
      } catch (error) {
        setError(getUserFriendlyError(error.message));
      }
    }
  };

  // View card handler
  const handleViewCard = (id) => {
    alert(`View card with ID: ${id}`);
    // This would typically navigate to preview: navigate(`/app/cards/view/${id}`);
  };

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

      <CardList 
        cards={cards}
        loading={loading}
        error={error}
        onEdit={handleEditCard}
        onDelete={handleDeleteCard}
        onView={handleViewCard}
      />

      {cards.length > 0 && (
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
      )}

      {/* Template selection modal */}
      <CardCreator 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default BusinessCards;