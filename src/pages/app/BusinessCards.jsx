import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle, Star, StarOff, Eye, Edit, Trash, X } from 'lucide-react';

// STEP 1: Define a consistent card limit across the app
const CARD_LIMITS = {
  free: 1,
  basic: 3,
  premium: 5,
  business: 10,
  enterprise: 25
};

const BusinessCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  
  // Add navigate hook from react-router-dom
  const navigate = useNavigate();
  
  // Mock user state for demonstration
  const [user, setUser] = useState({
    id: 'user-123',
    email: 'user@example.com',
    display_name: 'Example User',
    subscription_tier: 'basic'
  });
  
  // STEP 2: Consolidate functions for fetching cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        // In a real app, this would call your API service
        // const fetchedCards = await BusinessCardService.getBusinessCardsByUserId(user.id);
        
        // Mock data for demonstration
        const mockCards = [
          {
            id: 'card-1',
            display_name: 'Professional Card',
            title: 'Software Engineer',
            email: 'user@example.com',
            theme: 'blue',
            is_primary: true,
            created_at: '2024-05-01T00:00:00Z',
            updated_at: '2024-05-01T00:00:00Z',
            views: 12,
            slug: 'professional-card' // Added slug for view functionality
          },
          {
            id: 'card-2',
            display_name: 'Creative Card',
            title: 'Designer',
            email: 'designer@example.com',
            theme: 'purple',
            is_primary: false,
            created_at: '2024-05-02T00:00:00Z',
            updated_at: '2024-05-02T00:00:00Z',
            views: 5,
            slug: 'creative-card' // Added slug for view functionality
          }
        ];
        
        setCards(mockCards);
        setError(null);
      } catch (err) {
        console.error('Error fetching business cards:', err);
        setError('Failed to load your business cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [user.id]);
  
  // STEP 3: Define clear card management functions
  const getUserCardLimit = () => {
    const tier = user?.subscription_tier || 'free';
    return CARD_LIMITS[tier] || CARD_LIMITS.free;
  };
  
  const canCreateCard = cards.length < getUserCardLimit();
  
  const handleCreateCard = () => {
    if (!canCreateCard) {
      alert(`You've reached your limit of ${getUserCardLimit()} business cards. Upgrade your subscription to create more cards.`);
      return;
    }
    setIsTemplateModalOpen(true);
  };
  
  const handleTemplateSelect = async (newCardData) => {
    try {
      // In a real app, call your API service
      // const newCard = await BusinessCardService.createBusinessCard(user.id, newCardData);
      
      // Mock creating a new card
      const newCard = {
        id: `card-${Date.now()}`,
        display_name: newCardData.name || 'New Card',
        title: newCardData.userData?.title || '',
        email: newCardData.userData?.email || user.email,
        theme: newCardData.theme || 'blue',
        is_primary: cards.length === 0, // First card is primary
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        slug: `${newCardData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}` // Generate a simple slug
      };
      
      // Update state with the new card
      setCards([...cards, newCard]);
      setIsTemplateModalOpen(false);
      
      // If this is the first card, update user profile
      if (cards.length === 0) {
        // In a real app: updateUserProfile(newCard)
      }
    } catch (err) {
      console.error('Error creating card:', err);
      setError('Failed to create new business card');
    }
  };
  
  const handleDeleteCard = async (id) => {
    try {
      const cardToDelete = cards.find(card => card.id === id);
      
      // STEP 4: Fix the delete functionality
      // Cannot delete if it's the only card
      if (cards.length <= 1) {
        alert("You must have at least one business card.");
        return;
      }
      
      // Cannot delete the primary card
      if (cardToDelete?.is_primary) {
        alert("You cannot delete your primary card. Please set another card as primary first.");
        return;
      }
      
      if (!window.confirm('Are you sure you want to delete this card?')) {
        return;
      }
      
      // In a real app, call your API service
      // await BusinessCardService.deleteBusinessCard(id);
      
      // Update local state
      setCards(cards.filter(card => card.id !== id));
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Failed to delete business card');
    }
  };
  
  const handleSetPrimary = async (id) => {
    try {
      // In a real app, call your API service
      // await BusinessCardService.setPrimaryBusinessCard(id);
      
      // Update local state to mark selected card as primary and others as non-primary
      setCards(cards.map(card => ({
        ...card,
        is_primary: card.id === id
      })));
    } catch (err) {
      console.error('Error setting primary card:', err);
      setError('Failed to set primary business card');
    }
  };
  
  // Updated to use navigate instead of alert
  const handleEditCard = (id) => {
    navigate(`/business-cards/${id}`);
  };
  
  // Updated to use navigate or open in new tab based on preference
  const handleViewCard = (id) => {
    const card = cards.find(c => c.id === id);
    if (card && card.slug) {
      // Option 1: Open in new tab
      window.open(`/${card.slug}`, '_blank');
      
      // Option 2: Navigate within the app
      // navigate(`/${card.slug}`);
    } else {
      alert('This card does not have a public URL yet.');
    }
  };
  
  // STEP 5: Create the modal component
  const CardCreatorModal = ({ isOpen, onClose, onTemplateSelect }) => {
    if (!isOpen) return null;
    
    const templates = [
      {
        id: 'professional',
        name: 'Professional',
        description: 'Clean and corporate design for business professionals',
        theme: 'blue'
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Vibrant design for creative professionals',
        theme: 'purple'
      },
      {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Simple and elegant design with focus on content',
        theme: 'gray'
      }
    ];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Choose a Template</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>
          
          {!canCreateCard && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 flex items-start">
              <AlertCircle size={20} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">Card limit reached</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  Your {user.subscription_tier} plan allows {getUserCardLimit()} business {getUserCardLimit() === 1 ? 'card' : 'cards'}.
                  Upgrade your subscription to create more cards.
                </p>
                <button 
                  className="mt-2 text-sm font-medium text-yellow-800 bg-yellow-100 px-3 py-1 rounded hover:bg-yellow-200"
                  onClick={() => navigate('/app/settings/subscription')}
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            Select a template for your new digital business card. You can customize all elements after selection.
            <span className="block text-sm mt-1">
              Card usage: {cards.length}/{getUserCardLimit()} ({user.subscription_tier} plan)
            </span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map(template => (
              <div 
                key={template.id}
                className={`border rounded-lg overflow-hidden transition-colors ${
                  canCreateCard 
                    ? "cursor-pointer hover:border-blue-500" 
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => canCreateCard && onTemplateSelect(template)}
              >
                <div className={`h-3 bg-${template.theme}-500`}></div>
                <div className="p-4">
                  <div className="h-48 bg-gray-100 mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className={`text-${template.theme}-500 mb-2`}>
                        {template.name} Template
                      </div>
                      <div className="text-sm">Preview Image</div>
                    </div>
                  </div>
                  <h4 className="font-medium mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-right">
            <button
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // STEP 6: Create the card list component
  const CardListComponent = ({ cards, onEdit, onDelete, onView, onSetPrimary }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg text-red-800">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!cards || cards.length === 0) {
      return (
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Your First Card
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div key={card.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${card.is_primary ? 'ring-2 ring-blue-500' : ''}`}>
            <div className={`h-3 bg-${card.theme || 'blue'}-500`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{card.display_name || 'Untitled Card'}</h3>
                {card.is_primary && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Primary
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-2">{card.title || 'No title'}</p>
              <p className="text-gray-500 text-xs truncate mb-4">{card.email || 'No email'}</p>
              
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Created: {new Date(card.created_at).toLocaleDateString()}</span>
                <span>Last updated: {new Date(card.updated_at).toLocaleDateString()}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <button 
                  onClick={() => onView(card.id)}
                  className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  title="View card"
                >
                  <Eye size={14} className="mb-1" />
                  <span className="text-xs">View</span>
                </button>
                <button 
                  onClick={() => onEdit(card.id)}
                  className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  title="Edit card"
                >
                  <Edit size={14} className="mb-1" />
                  <span className="text-xs">Edit</span>
                </button>
                {!card.is_primary && (
                  <button 
                    onClick={() => onSetPrimary(card.id)}
                    className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    title="Make primary"
                  >
                    <Star size={14} className="mb-1" />
                    <span className="text-xs">Primary</span>
                  </button>
                )}
                {card.is_primary && (
                  <button 
                    disabled
                    className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                    title="This is your primary card"
                  >
                    <StarOff size={14} className="mb-1" />
                    <span className="text-xs">Primary</span>
                  </button>
                )}
                {!card.is_primary && (
                  <button 
                    onClick={() => onDelete(card.id)}
                    className="flex flex-col items-center justify-center p-2 border border-red-300 rounded-md text-sm text-red-600 hover:bg-red-50"
                    title="Delete card"
                  >
                    <Trash size={14} className="mb-1" />
                    <span className="text-xs">Delete</span>
                  </button>
                )}
                {card.is_primary && (
                  <button 
                    disabled
                    className="flex flex-col items-center justify-center p-2 border border-gray-300 rounded-md text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                    title="Cannot delete primary card"
                  >
                    <Trash size={14} className="mb-1" />
                    <span className="text-xs">Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start mb-6">
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

      <CardListComponent 
        cards={cards}
        onEdit={handleEditCard}
        onDelete={handleDeleteCard}
        onView={handleViewCard}
        onSetPrimary={handleSetPrimary}
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

      <CardCreatorModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default BusinessCards;