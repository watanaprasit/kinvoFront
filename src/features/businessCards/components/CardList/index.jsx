// // src/features/businessCards/components/CardList/index.jsx
// import { Eye, Edit, Trash } from 'lucide-react';
// import { getUserFriendlyError } from '../../../../library/utils/formatters';
// import { BiVolumeLow } from 'react-icons/bi';

// const CardList = ({ cards, onEdit, onDelete, onView, loading, error }) => {
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 p-4 rounded-lg text-red-800">
//         <p>Error: {error}</p>
//         <button 
//           onClick={() => window.location.reload()}
//           className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!cards || cards.length === 0) {
//     return (
//       <div className="bg-white p-10 rounded-lg shadow-md text-center">
//         <div className="text-gray-400 mb-4">
//           <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
//           </svg>
//         </div>
//         <h3 className="text-lg font-medium text-gray-900 mb-2">No Business Cards Yet</h3>
//         <p className="text-gray-600 mb-4">Create your first digital business card to share with your network.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {cards.map(card => (
//         <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className={`h-3 bg-${card.theme || 'blue'}-500`}></div>
//           <div className="p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">{card.name}</h3>
//             <p className="text-gray-600 text-sm mb-4">{card.description}</p>
            
//             <div className="flex justify-between text-xs text-gray-500 mb-4">
//               <span>{card.views} views</span>
//               <span>Last edited: {new Date(card.lastEdited).toLocaleDateString()}</span>
//             </div>
            
//             <div className="flex justify-between space-x-2">
//               <button 
//                 onClick={() => onView(card.id)}
//                 className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
//               >
//                 <Eye size={14} className="mr-1" />
//                 View
//               </button>
//               <button 
//                 onClick={() => onEdit(card.id)}
//                 className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
//               >
//                 <Edit size={14} className="mr-1" />
//                 Edit
//               </button>
//               <button 
//                 onClick={() => onDelete(card.id)}
//                 className="flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm text-red-600 hover:bg-red-50"
//               >
//                 <Trash size={14} />
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default CardList;


// new Below    

// src/features/businessCards/components/CardList/index.jsx
import { useState } from 'react';
import { Eye, Edit, Trash, Star, StarOff, PlusCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../auth/context/AuthContext';

// Define card limits by subscription tier
const CARD_LIMITS = {
  basic: 1,
  premium: 3,
  business: 10,
  enterprise: 50
};

const CardList = ({ 
  cards = [], 
  onEdit, 
  onDelete, 
  onView, 
  onSetPrimary, 
  onCreateNew,
  loading, 
  error 
}) => {
  const { userProfile } = useAuth();
  const subscriptionTier = userProfile?.subscription_tier || 'basic';
  const cardLimit = CARD_LIMITS[subscriptionTier];
  const canCreateCard = cards.length < cardLimit;
  
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Business Cards</h2>
          <p className="text-gray-600">
            Card usage: {cards.length}/{cardLimit} ({subscriptionTier} plan)
          </p>
        </div>
        <button
          onClick={onCreateNew}
          disabled={!canCreateCard}
          className={`flex items-center px-4 py-2 rounded-md text-white 
            ${canCreateCard ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          <PlusCircle size={18} className="mr-2" />
          Create New Card
        </button>
      </div>
      
      {!canCreateCard && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 flex items-start">
          <AlertCircle size={20} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-800">Card limit reached</h4>
            <p className="text-yellow-700 text-sm mt-1">
              Your {subscriptionTier} plan allows {cardLimit} business {cardLimit === 1 ? 'card' : 'cards'}.
              Upgrade your subscription to create more cards.
            </p>
            <button 
              className="mt-2 text-sm font-medium text-yellow-800 bg-yellow-100 px-3 py-1 rounded hover:bg-yellow-200"
              onClick={() => window.location.href = '/app/settings/subscription'}
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      {!cards || cards.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-md text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Business Cards Yet</h3>
          <p className="text-gray-600 mb-4">Create your first digital business card to share with your network.</p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Your First Card
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default CardList;