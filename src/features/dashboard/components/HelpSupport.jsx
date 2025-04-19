// src/features/dashboard/components/HelpSupport.jsx
import { useState } from 'react';
import { Search, BookOpen, MessageSquare, Phone, FileText, HelpCircle, User, CreditCard, DollarSign } from 'lucide-react';
import { validateEmailFormat, validateRequired } from '../../../library/utils/validators';
import { getUserFriendlyError, cleanImageUrl, formatPhotoUrl } from '../../../library/utils/formatters';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [contactForm, setContactForm] = useState({
    email: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // FAQ data
  const faqs = [
    {
      category: 'account',
      title: 'How do I reset my password?',
      content: 'You can reset your password by clicking the "Forgot Password" link on the login page. You\'ll receive an email with instructions to create a new password.'
    },
    {
      category: 'account',
      title: 'How do I change my email address?',
      content: 'To change your email address, go to Settings > Account & Security. From there, you can update your email address after verifying your identity.'
    },
    {
      category: 'cards',
      title: 'How do I create a new business card?',
      content: 'You can create a new business card by navigating to the Business Cards section and clicking the "Create New Card" button. You\'ll be guided through a step-by-step process to customize your card.'
    },
    {
      category: 'cards',
      title: 'How do I share my business card?',
      content: 'You can share your business card by generating a QR code, sending a direct link, or sharing via email. These options are available from the "View" screen of any card you\'ve created.'
    },
    {
      category: 'billing',
      title: 'What payment methods do you accept?',
      content: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal for subscription payments.'
    },
    {
      category: 'billing',
      title: 'How do I cancel my subscription?',
      content: 'You can cancel your subscription by going to Settings > Billing & Plans and clicking the "Cancel Subscription" button. Your premium features will remain active until the end of your billing period.'
    }
  ];
  
  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter(faq => {
    if (selectedCategory && faq.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      return faq.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             faq.content.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });
  
  const categories = [
    { id: 'account', label: 'Account Management', icon: User },
    { id: 'cards', label: 'Business Cards', icon: CreditCard },
    { id: 'billing', label: 'Billing & Subscription', icon: DollarSign }
  ];
  
  // Form validation using validators
  const validateContactForm = () => {
    const errors = {};
    
    if (!validateRequired(contactForm.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmailFormat(contactForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!validateRequired(contactForm.message)) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Support action handlers with error handling using formatters
  const handleContactSupport = async () => {
    if (!validateContactForm()) {
      return;
    }
    
    setSubmitStatus('loading');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success
      setSubmitStatus('success');
      setContactForm({ email: '', message: '' });
      
    } catch (error) {
      // Use formatter to display friendly error message
      const errorMessage = getUserFriendlyError(error.message);
      setSubmitStatus({ error: errorMessage });
    }
  };
  
  const handleScheduleCall = () => {
    try {
      // Simulate opening scheduler
      alert('Opening call scheduling form...');
    } catch (error) {
      alert(getUserFriendlyError(error.message));
    }
  };
  
  const handleSubmitTicket = () => {
    try {
      // Simulate ticket submission
      alert('Opening support ticket form...');
    } catch (error) {
      alert(getUserFriendlyError(error.message));
    }
  };
  
  const handleViewDocumentation = () => {
    try {
      // Simulate opening docs
      alert('Opening documentation center...');
    } catch (error) {
      alert(getUserFriendlyError(error.message));
    }
  };
  
  // Clean and format resource images
  const supportResources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of creating and managing your business cards.',
      icon: BookOpen,
      imageUrl: cleanImageUrl('https://example.com/getting-started.jpg?t=123456')
    },
    {
      title: 'Advanced Card Features',
      description: 'Discover how to leverage premium features for your business cards.',
      icon: BookOpen,
      imageUrl: cleanImageUrl('https://example.com/advanced-features.jpg?')
    },
    {
      title: 'Analytics Guide',
      description: 'Learn how to track and analyze your business card performance.',
      icon: BookOpen,
      imageUrl: cleanImageUrl('https://example.com/analytics.jpg?t=789012')
    },
    {
      title: 'Team Management',
      description: 'How to manage team members and permissions effectively.',
      icon: BookOpen,
      imageUrl: cleanImageUrl('https://example.com/team-management.jpg')
    }
  ];
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Help & Support</h2>
        
        {/* Search box */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for help..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === null ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedCategory === category.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        {/* FAQs */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <details 
                key={index} 
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                <summary className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer">
                  <span className="font-medium text-gray-800">{faq.title}</span>
                  <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 py-3 text-sm text-gray-600">
                  <p>{faq.content}</p>
                </div>
              </details>
            ))
          ) : (
            <div className="text-center py-8">
              <HelpCircle size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No FAQs match your search. Try another query or contact support.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Contact form with validation */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Support</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-md ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your email address"
              value={contactForm.email}
              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className={`w-full px-3 py-2 border rounded-md ${formErrors.message ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="How can we help you?"
              value={contactForm.message}
              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
            ></textarea>
            {formErrors.message && (
              <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
            )}
          </div>
          
          <button
            onClick={handleContactSupport}
            disabled={submitStatus === 'loading'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
          
          {submitStatus === 'success' && (
            <div className="p-3 bg-green-50 text-green-800 rounded-md">
              Your message has been sent. We'll get back to you soon.
            </div>
          )}
          
          {submitStatus && submitStatus.error && (
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              {submitStatus.error}
            </div>
          )}
        </div>
      </div>
      
      {/* Support options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Phone size={32} className="mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-medium mb-2">Schedule a Call</h3>
          <p className="text-sm text-gray-600 mb-4">Book a call with our product specialists</p>
          <button
            onClick={handleScheduleCall}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Book Call
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FileText size={32} className="mx-auto text-purple-500 mb-3" />
          <h3 className="text-lg font-medium mb-2">Submit a Ticket</h3>
          <p className="text-sm text-gray-600 mb-4">Create a support ticket for complex issues</p>
          <button
            onClick={handleSubmitTicket}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create Ticket
          </button>
        </div>
      </div>
      
      {/* Documentation section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Documentation</h2>
          <button
            onClick={handleViewDocumentation}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            View All
            <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportResources.map((resource, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <resource.icon size={24} className="text-blue-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  {resource.imageUrl && (
                    <img 
                      src={formatPhotoUrl(resource.imageUrl)} 
                      alt={resource.title}
                      className="mt-2 rounded w-full h-24 object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact information */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Need more help?</h3>
          <p className="text-sm text-blue-700 mb-4">Our support team is available Monday-Friday, 9AM-6PM EST</p>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center text-blue-800">
              <Phone size={16} className="mr-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center text-blue-800">
              <MessageSquare size={16} className="mr-2" />
              <span>support@businesscards.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;