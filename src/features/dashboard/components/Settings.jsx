// src/features/dashboard/components/Settings.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useTheme } from '../../../context/ThemeContext'; // Import useTheme hook
import { Bell, Lock, Globe, CreditCard, Mail } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme(); // Use the theme context
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    receiveUpdates: true,
    receivePromotions: false,
    language: 'en',
    twoFactorAuth: false
  });

  // Initialize the theme state when component mounts
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      darkMode: theme === 'dark'
    }));
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Function to handle theme change
  const handleThemeChange = (isDark) => {
    setFormData({ ...formData, darkMode: isDark });
    setTheme(isDark ? 'dark' : 'light');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementation would save settings to backend
    alert('Settings saved successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-input"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="password">
                Change Password
              </label>
              <button
                type="button"
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-bg-secondary"
              >
                Update Password
              </button>
              <p className="mt-1 text-xs text-text-secondary">
                Password must be at least 8 characters long with a mix of letters, numbers, and symbols.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Two-Factor Authentication
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={formData.twoFactorAuth}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-accent rounded"
                />
                <label className="ml-2 text-sm text-text-secondary" htmlFor="twoFactorAuth">
                  Enable two-factor authentication
                </label>
              </div>
              <p className="mt-1 text-xs text-text-secondary">
                Add an extra layer of security to your account.
              </p>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-button-bg text-button-text rounded-md hover:bg-accent"
              >
                Save Changes
              </button>
            </div>
          </form>
        );
      
      case 'notifications':
        return (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-medium text-text-primary">Product Updates</h3>
                  <p className="text-xs text-text-secondary">Receive updates about new features and improvements</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receiveUpdates"
                    name="receiveUpdates"
                    checked={formData.receiveUpdates}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-accent rounded"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-medium text-text-primary">Marketing Emails</h3>
                  <p className="text-xs text-text-secondary">Receive promotional offers and marketing communications</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="receivePromotions"
                    name="receivePromotions"
                    checked={formData.receivePromotions}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-accent rounded"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-medium text-text-primary">Security Alerts</h3>
                  <p className="text-xs text-text-secondary">Get notified about important security updates</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="securityAlerts"
                    name="securityAlerts"
                    checked={true}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-accent rounded"
                    disabled
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-button-bg text-button-text rounded-md hover:bg-accent"
              >
                Save Preferences
              </button>
            </div>
          </form>
        );
      
      case 'appearance':
        return (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Theme
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="lightMode"
                  name="theme"
                  value="light"
                  checked={!formData.darkMode}
                  onChange={() => handleThemeChange(false)}
                  className="h-4 w-4 text-accent"
                />
                <label className="ml-2 text-sm text-text-secondary" htmlFor="lightMode">
                  Light Mode
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="darkMode"
                  name="theme"
                  value="dark"
                  checked={formData.darkMode}
                  onChange={() => handleThemeChange(true)}
                  className="h-4 w-4 text-accent"
                />
                <label className="ml-2 text-sm text-text-secondary" htmlFor="darkMode">
                  Dark Mode
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1" htmlFor="language">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent bg-input text-text-primary"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-button-bg text-button-text rounded-md hover:bg-accent"
              >
                Save Preferences
              </button>
            </div>
          </form>
        );
      
      case 'billing':
        return (
          <div>
            <div className="bg-blue-50 p-4 rounded-lg mb-6 dark:bg-blue-900 dark:text-blue-100">
              <p className="text-sm">
                <span className="font-medium">Current Plan:</span> Free
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4 mb-6 bg-card">
              <h3 className="text-lg font-medium mb-4 text-text-primary">Upgrade to Premium</h3>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-text-secondary">Unlimited business cards</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-text-secondary">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-text-secondary">Custom branding</span>
                </li>
              </ul>
              <button
                type="button"
                className="w-full px-4 py-2 text-center bg-button-bg text-button-text rounded-md hover:bg-accent"
              >
                Upgrade Now - $9.99/month
              </button>
            </div>
            
            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-medium mb-2 text-text-primary">Payment Methods</h3>
              <p className="text-xs text-text-secondary mb-4">No payment methods added yet.</p>
              <button
                type="button"
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-bg-secondary text-text-primary"
              >
                Add Payment Method
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-bg-primary rounded-lg shadow-md">
      <div className="md:grid md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-3 border-r border-border">
          <div className="p-4">
            <h2 className="text-xl font-bold text-text-primary mb-4">Settings</h2>
            <nav className="space-y-1">
              <button
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'account' ? 'bg-blue-50 text-accent dark:bg-blue-900' : 'text-text-secondary hover:bg-bg-secondary'
                }`}
                onClick={() => setActiveTab('account')}
              >
                <Lock size={18} className="mr-3" />
                <span>Account & Security</span>
              </button>
              <button
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'notifications' ? 'bg-blue-50 text-accent dark:bg-blue-900' : 'text-text-secondary hover:bg-bg-secondary'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} className="mr-3" />
                <span>Notifications</span>
              </button>
              <button
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'appearance' ? 'bg-blue-50 text-accent dark:bg-blue-900' : 'text-text-secondary hover:bg-bg-secondary'
                }`}
                onClick={() => setActiveTab('appearance')}
              >
                <Globe size={18} className="mr-3" />
                <span>Appearance</span>
              </button>
              <button
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === 'billing' ? 'bg-blue-50 text-accent dark:bg-blue-900' : 'text-text-secondary hover:bg-bg-secondary'
                }`}
                onClick={() => setActiveTab('billing')}
              >
                <CreditCard size={18} className="mr-3" />
                <span>Billing & Plans</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="md:col-span-9 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-primary">
              {activeTab === 'account' && 'Account & Security Settings'}
              {activeTab === 'notifications' && 'Notification Preferences'}
              {activeTab === 'appearance' && 'Appearance Settings'}
              {activeTab === 'billing' && 'Billing & Subscription'}
            </h3>
            <p className="text-sm text-text-secondary">
              {activeTab === 'account' && 'Manage your account details and security settings'}
              {activeTab === 'notifications' && 'Control what notifications you receive'}
              {activeTab === 'appearance' && 'Customize how Kinvo looks for you'}
              {activeTab === 'billing' && 'Manage your subscription and payment methods'}
            </p>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;