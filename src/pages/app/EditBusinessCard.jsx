import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, ImagePlus, Trash } from 'lucide-react';
import { BusinessCardService } from '../../features/businessCards/services/businessCardServices';
import { useAuth } from '../../features/auth/context/AuthContext';

// Define card themes and layouts
const CARD_THEMES = [
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'purple', name: 'Purple', color: '#8b5cf6' },
  { id: 'gray', name: 'Gray', color: '#6b7280' },
  { id: 'green', name: 'Green', color: '#10b981' },
  { id: 'red', name: 'Red', color: '#ef4444' },
  { id: 'orange', name: 'Orange', color: '#f97316' },
];

const CARD_LAYOUTS = [
  { id: 'standard', name: 'Standard' },
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' }
];

const EditBusinessCard = () => {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);
  
  // Card form state
  const [formData, setFormData] = useState({
    display_name: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    bio: '',
    theme: 'blue',
    layout: 'standard',
    slug: '',
    is_primary: false
  });
  
  // File upload states
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  
  // Load card data
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If no cardId, this is a new card creation
        if (!cardId) {
          // Pre-fill with user profile data if available
          if (userProfile) {
            setFormData({
              display_name: userProfile.display_name || '',
              title: userProfile.title || '',
              email: userProfile.email || '',
              phone: userProfile.contact?.phone || '',
              website: userProfile.website || '',
              bio: userProfile.bio || '',
              theme: 'blue',
              layout: 'standard',
              slug: generateSlug(userProfile.display_name || ''),
              is_primary: false
            });
            
            if (userProfile.photo_url) {
              setProfileImagePreview(userProfile.photo_url);
            }
            
            if (userProfile.company_logo_url) {
              setCompanyLogoPreview(userProfile.company_logo_url);
            }
          }
          setLoading(false);
          return;
        }
        
        // Fetch existing card data
        const response = await BusinessCardService.getBusinessCardBySlug(cardId);
        const cardData = response.card;
        
        setFormData({
          display_name: cardData.display_name || '',
          title: cardData.title || '',
          email: cardData.email || '',
          phone: cardData.phone || '',
          website: cardData.website || '',
          bio: cardData.bio || '',
          theme: cardData.theme || 'blue',
          layout: cardData.layout || 'standard',
          slug: cardData.slug || '',
          is_primary: cardData.is_primary || false
        });
        
        if (cardData.profile_image_url) {
          setProfileImagePreview(cardData.profile_image_url);
        }
        
        if (cardData.company_logo_url) {
          setCompanyLogoPreview(cardData.company_logo_url);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading card data:', err);
        setError('Failed to load card data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchCardData();
  }, [cardId, userProfile]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Check slug availability when slug changes
    if (name === 'slug') {
      checkSlugAvailability(value);
    }
  };
  
  // Generate slug from display name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .trim();
  };
  
  // Auto-generate slug when display name changes
  const handleDisplayNameChange = (e) => {
    const displayName = e.target.value;
    setFormData({
      ...formData,
      display_name: displayName,
      slug: generateSlug(displayName)
    });
    
    // Check slug availability
    checkSlugAvailability(generateSlug(displayName));
  };
  
  // Check if slug is available
  const checkSlugAvailability = async (slug) => {
    if (!slug) return;
    
    try {
      setCheckingSlug(true);
      const response = await BusinessCardService.checkSlugAvailability(slug);
      setSlugAvailable(response.available || (cardId && response.current_user_slug));
      setCheckingSlug(false);
    } catch (err) {
      console.error('Error checking slug availability:', err);
      setCheckingSlug(false);
    }
  };
  
  // Handle profile image selection
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };
  
  // Handle company logo selection
  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogo(file);
      setCompanyLogoPreview(URL.createObjectURL(file));
    }
  };
  
  // Remove profile image
  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    // If editing, set a flag to remove the current image
    if (cardId) {
      setFormData({ ...formData, remove_profile_image: true });
    }
  };
  
  // Remove company logo
  const removeCompanyLogo = () => {
    setCompanyLogo(null);
    setCompanyLogoPreview(null);
    // If editing, set a flag to remove the current logo
    if (cardId) {
      setFormData({ ...formData, remove_company_logo: true });
    }
  };
  
  // Save card data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!slugAvailable) {
      setError('This URL is already taken. Please choose a different one.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Create FormData object for file uploads
      const cardFormData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          cardFormData.append(key, formData[key]);
        }
      });
      
      // Add files if selected
      if (profileImage) {
        cardFormData.append('profile_image', profileImage);
      }
      
      if (companyLogo) {
        cardFormData.append('company_logo', companyLogo);
      }
      
      let response;
      if (cardId) {
        // Update existing card
        response = await BusinessCardService.updateBusinessCard(cardId, cardFormData);
      } else {
        // Create new card
        response = await BusinessCardService.createBusinessCard(cardFormData);
      }
      
      // Navigate back to business cards list
      navigate('/app/business-cards');
      
    } catch (err) {
      console.error('Error saving business card:', err);
      setError('Failed to save business card. Please try again.');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/app/business-cards')}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold">
          {cardId ? 'Edit Business Card' : 'Create New Business Card'}
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleDisplayNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your job title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio / About
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Write a short bio about yourself"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              
              {profileImagePreview ? (
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remove image"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <span>No Image</span>
                </div>
              )}
              
              <div>
                <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer">
                  <ImagePlus size={16} className="mr-2" />
                  <span>{profileImagePreview ? 'Change Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image, at least 300x300px
                </p>
              </div>
            </div>
            
            {/* Company Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              
              {companyLogoPreview ? (
                <div className="relative w-32 h-32 mb-4">
                  <img
                    src={companyLogoPreview}
                    alt="Company Logo Preview"
                    className="w-full h-full object-contain rounded-md border border-gray-200 p-2"
                  />
                  <button
                    type="button"
                    onClick={removeCompanyLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Remove logo"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 mb-4 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                  <span>No Logo</span>
                </div>
              )}
              
              <div>
                <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 cursor-pointer">
                  <ImagePlus size={16} className="mr-2" />
                  <span>{companyLogoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyLogoChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square or landscape, transparent background (PNG)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Appearance & URL */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium mb-4">Appearance & URL</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {CARD_THEMES.map(theme => (
                  <div
                    key={theme.id}
                    onClick={() => setFormData({ ...formData, theme: theme.id })}
                    className={`p-3 rounded-md cursor-pointer border ${
                      formData.theme === theme.id 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div 
                      className="h-4 mb-2 rounded" 
                      style={{ backgroundColor: theme.color }}
                    ></div>
                    <span className="text-xs">{theme.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Layout Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Layout
              </label>
              <div className="grid grid-cols-3 gap-3">
                {CARD_LAYOUTS.map(layout => (
                  <div
                    key={layout.id}
                    onClick={() => setFormData({ ...formData, layout: layout.id })}
                    className={`p-3 rounded-md cursor-pointer border ${
                      formData.layout === layout.id 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="h-12 mb-2 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                      {layout.name}
                    </div>
                    <span className="text-xs">{layout.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Custom URL */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom URL
              </label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-l-md text-gray-600">
                  yourdomain.com/card/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className={`flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 ${
                    !slugAvailable ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="your-name"
                  required
                />
              </div>
              
              {checkingSlug && (
                <p className="text-sm text-gray-500 mt-1">Checking availability...</p>
              )}
              
              {!checkingSlug && !slugAvailable && (
                <p className="text-sm text-red-500 mt-1">
                  This URL is already taken. Please choose a different one.
                </p>
              )}
              
              {!checkingSlug && slugAvailable && formData.slug && (
                <p className="text-sm text-green-500 mt-1">
                  URL is available!
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                This will be the public URL for your business card. Use only letters, numbers, and hyphens.
              </p>
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-between items-center">
          <button 
            type="button"
            onClick={() => navigate('/app/business-cards')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            disabled={saving || !slugAvailable}
            className={`flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {saving && (
              <span className="mr-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            <Save size={18} className="mr-2" />
            {cardId ? 'Save Changes' : 'Create Card'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBusinessCard;