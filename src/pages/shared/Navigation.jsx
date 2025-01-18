import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-semibold">
          <Link to="/">Kinvo</Link>
        </div>
        <div className="flex space-x-6">
          <Link to="/auth/signin" className="hover:text-accent">Sign In</Link>
          <Link to="/auth/register" className="hover:text-accent">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

