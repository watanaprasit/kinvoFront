// src/features/businessCards/components/CardList/index.jsx
import { Eye, Edit, Trash } from 'lucide-react';
import { getUserFriendlyError } from '../../../../library/utils/formatters';

const CardList = ({ cards, onEdit, onDelete, onView, loading, error }) => {
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
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map(card => (
        <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`h-3 bg-${card.theme || 'blue'}-500`}></div>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{card.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{card.description}</p>
            
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>{card.views} views</span>
              <span>Last edited: {new Date(card.lastEdited).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between space-x-2">
              <button 
                onClick={() => onView(card.id)}
                className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye size={14} className="mr-1" />
                View
              </button>
              <button 
                onClick={() => onEdit(card.id)}
                className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit size={14} className="mr-1" />
                Edit
              </button>
              <button 
                onClick={() => onDelete(card.id)}
                className="flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm text-red-600 hover:bg-red-50"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;