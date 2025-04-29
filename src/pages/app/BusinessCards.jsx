import { useState, useEffect } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { getUserFriendlyError } from '../../library/utils/formatters';
import CardList from '../../features/businessCards/components/CardList';
import CardCreator from '../../features/businessCards/components/CardCreator';
import axios from 'axios'; 

const BusinessCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { user } = useAuth();
  
  // Subscription tier card limits
  const CARD_LIMITS = {
    free: 1,
    basic: 3,
    premium: 10,
    enterprise: 25
  };

  // Get user's card limit based on subscription tier
  const getUserCardLimit = () => {
    const tier = user?.subscription_tier || 'free';
    return CARD_LIMITS[tier] || CARD_LIMITS.free;
  };

  // Calculate remaining cards allowed
  const remainingCards = getUserCardLimit() - cards.length;
  const canCreateCard = remainingCards > 0;

  // Fetch business cards from the backend API
  useEffect(() => {
    const fetchCards = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Call the FastAPI endpoint to get business cards
        const response = await axios.get(`/api/v1/users/${user.id}/business-cards`);
        
        setCards(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching business cards:', error);
        setError(getUserFriendlyError(error.response?.data?.detail || error.message));
        setLoading(false);
      }
    };

    fetchCards();
  }, [user]);

  // Create new card handler
  const handleCreateCard = () => {
    if (!canCreateCard) {
      alert(`You've reached your limit of ${getUserCardLimit()} business cards. Upgrade your subscription to create more cards.`);
      return;
    }
    setIsTemplateModalOpen(true);
  };

  // Handle template selection
  const handleTemplateSelect = async (newCardData) => {
    try {
      // Create a FormData object to send file uploads and form data
      const formData = new FormData();
      
      // Add all the text fields to the form data
      formData.append('display_name', newCardData.display_name || user?.display_name || '');
      formData.append('slug', newCardData.slug || `${user?.username}-${Date.now()}`);
      
      if (newCardData.title) formData.append('title', newCardData.title);
      if (newCardData.bio) formData.append('bio', newCardData.bio); 
      if (newCardData.email) formData.append('email', newCardData.email || user?.email || '');
      if (newCardData.website) formData.append('website', newCardData.website || '');
      
      // Handle contact information as JSON
      if (newCardData.contact) {
        formData.append('contact', JSON.stringify(newCardData.contact));
      }
      
      // Set as primary if it's the first card
      formData.append('is_primary', cards.length === 0);
      
      // Add file uploads if they exist
      if (newCardData.photo) {
        formData.append('photo', newCardData.photo);
      }
      if (newCardData.company_logo) {
        formData.append('company_logo', newCardData.company_logo);
      }
      
      // Send the request to create a new business card
      const response = await axios.post('/api/v1/users/business-card', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add the new card to the state
      if (response.data) {
        setCards([...cards, response.data]);
      }
      
      setIsTemplateModalOpen(false);
      
      // In a real implementation, navigate to editor:
      // navigate(`/app/cards/edit/${response.data.id}`);
    } catch (error) {
      console.error('Error creating business card:', error);
      setError(getUserFriendlyError(error.response?.data?.detail || error.message));
    }
  };

  // Edit card handler
  const handleEditCard = (id) => {
    alert(`Edit card with ID: ${id}`);
    // This would typically navigate to editor: navigate(`/app/cards/edit/${id}`);
  };

  // Delete card handler
  const handleDeleteCard = async (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        // Check if this is the primary card
        const cardToDelete = cards.find(card => card.id === id);
        if (cardToDelete?.is_primary && cards.length > 1) {
          alert("You cannot delete your primary card. Please set another card as primary first.");
          return;
        }
        
        // Call the FastAPI endpoint to delete the card
        await axios.delete(`/api/v1/users/business-card/${id}`);
        
        // Update local state
        setCards(cards.filter(card => card.id !== id));
      } catch (error) {
        console.error('Error deleting business card:', error);
        setError(getUserFriendlyError(error.response?.data?.detail || error.message));
      }
    }
  };

  // View card handler
  const handleViewCard = (id) => {
    const card = cards.find(c => c.id === id);
    if (card && card.slug) {
      window.open(`/profile/${card.slug}`, '_blank');
    } else {
      alert(`View card with ID: ${id}`);
    }
  };

  // Set card as primary
  const handleSetPrimary = async (id) => {
    try {
      // Call the FastAPI endpoint to set the card as primary
      const response = await axios.put(`/api/v1/users/business-card/${id}/set-primary`);
      
      if (response.data) {
        // Update local state
        setCards(cards.map(card => ({
          ...card,
          is_primary: card.id === id
        })));
        
        alert(`Card #${id} set as primary`);
      }
    } catch (error) {
      console.error('Error setting card as primary:', error);
      setError(getUserFriendlyError(error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Cards</h2>
          <p className="text-gray-600">
            You have used {cards.length} of {getUserCardLimit()} available cards
          </p>
        </div>
        <button 
          onClick={handleCreateCard}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            canCreateCard 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!canCreateCard}
        >
          <Plus size={16} className="mr-2" />
          Create New Card
        </button>
      </div>

      {!canCreateCard && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start">
          <AlertCircle size={20} className="text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Subscription limit reached</h3>
            <p className="text-yellow-700">
              You've reached your limit of {getUserCardLimit()} business cards. 
              <a href="/app/subscription" className="text-blue-600 hover:underline ml-1">
                Upgrade your subscription
              </a> to create more cards.
            </p>
          </div>
        </div>
      )}

      <CardList 
        cards={cards}
        loading={loading}
        error={error}
        onEdit={handleEditCard}
        onDelete={handleDeleteCard}
        onView={handleViewCard}
        onSetPrimary={handleSetPrimary}
        showPrimaryIndicator={true}
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
              <p className="text-xl font-bold">{cards.reduce((sum, card) => sum + (card.views || 0), 0)}</p>
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
        userData={user}
      />
    </div>
  );
};

export default BusinessCards;