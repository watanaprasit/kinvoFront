// src/features/businessCards/components/CardCreator/index.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../../auth/context/AuthContext';
import { StyledCardCreator } from './styles';

// Define preset templates
const CARD_TEMPLATES = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean and corporate design for business professionals',
    theme: 'blue',
    previewImage: '/card-templates/professional.png', // Replace with actual path
    layout: 'standard'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant design for creative professionals',
    theme: 'purple',
    previewImage: '/card-templates/creative.png', // Replace with actual path
    layout: 'modern'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple and elegant design with focus on content',
    theme: 'gray',
    previewImage: '/card-templates/minimalist.png', // Replace with actual path
    layout: 'minimal'
  }
];

const CardCreator = ({ isOpen, onClose, onTemplateSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { userProfile } = useAuth();

  if (!isOpen) return null;

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    
    // Create a new card object with the selected template and user profile data
    const newCard = {
      templateId: template.id,
      theme: template.theme,
      layout: template.layout,
      name: `${userProfile?.display_name || 'My'} ${template.name} Card`,
      description: template.description,
      // Pre-fill with user profile data if available
      userData: {
        displayName: userProfile?.display_name || '',
        title: userProfile?.title || '',
        email: userProfile?.email || '',
        photoUrl: userProfile?.photo_url || '',
        companyLogoUrl: userProfile?.company_logo_url || '',
        website: userProfile?.website || '',
        bio: userProfile?.bio || '',
        phone: userProfile?.contact?.phone || ''
      }
    };
    
    // Pass the new card data to the parent component
    onTemplateSelect(newCard);
  };

  return (
    <StyledCardCreator className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        
        <p className="text-gray-600 mb-6">
          Select a template for your new digital business card. You can customize all elements after selection.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARD_TEMPLATES.map(template => (
            <div 
              key={template.id}
              className="border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => handleTemplateSelect(template)}
            >
              <div className={`h-3 bg-${template.theme}-500`}></div>
              <div className="p-4">
                <div className="h-48 bg-gray-100 mb-4 flex items-center justify-center">
                  {/* In a real app, use actual template preview images */}
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
    </StyledCardCreator>
  );
};

export default CardCreator;