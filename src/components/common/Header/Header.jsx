// src/components/common/Header/Header.jsx
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Header = ({ variant = 'default', onMenuToggle }) => {
  // Dashboard-specific header
  if (variant === 'dashboard') {
    return (
      <header className="flex items-center p-4 bg-white shadow-sm">
        {/* Mobile menu toggle button */}
        <button 
          className="mr-3 md:hidden" 
          onClick={onMenuToggle}
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        
        <Link to="/dashboard" className="text-xl font-semibold flex-grow">Kinvo</Link>
      </header>
    );
  }

  // Default public header
  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-2xl font-bold">
          <Link to="/" className="text-black hover:text-blue-500 transition duration-200">
            Kinvo
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;