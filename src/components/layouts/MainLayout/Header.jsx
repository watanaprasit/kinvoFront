import { useState } from "react";
import Container from "../../common/Container/Container";
import Button from "../../common/Button/index";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Templates", href: "#templates" },
    { name: "Help", href: "#help" },
  ];

  return (
    <header className="bg-white py-4 border-b border-gray-100 sticky top-0 z-10">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#" className="font-bold text-xl">Kinvo</a>
            <nav className="hidden md:flex ml-10 space-x-8">
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              Log in
            </a>
            <Button>Sign up free</Button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  {item.name}
                </a>
              ))}
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
                Log in
              </a>
              <Button>Sign up free</Button>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;