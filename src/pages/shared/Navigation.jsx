import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-black text-white p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white hover:text-gold transition duration-200">
            Kinvo
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 items-center">
          <Link
            to="/auth/signin"
            className="text-white hover:text-blue transition duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className="text-white bg-gradient-to-r from-blue-light to-blue px-4 py-2 rounded-lg hover:from-blue hover:to-blue-dark transition duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
