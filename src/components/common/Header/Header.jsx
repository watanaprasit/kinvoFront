import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white p-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
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