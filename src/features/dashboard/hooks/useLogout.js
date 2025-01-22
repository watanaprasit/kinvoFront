import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { logoutUser } from '../services/authService';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming your AuthContext has a logout method

  const handleLogout = () => {
    logoutUser();
    logout(); 
    navigate('/auth/signin');
  };

  return { handleLogout };
};