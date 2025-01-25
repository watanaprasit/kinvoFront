import { useLogout } from '../hooks/useLogout';
import Button from '../../../components/common/Button'; 


export const DashboardHeader = () => {
  const { handleLogout } = useLogout();

  return (
    <header className="flex items-center p-4 bg-white shadow-sm">
      <h1 className="text-xl font-semibold flex-grow">Kinvo</h1>
      <Button 
        onClick={handleLogout}
        className="secondary" 
      >
        Logout
      </Button>
    </header>
  );
};