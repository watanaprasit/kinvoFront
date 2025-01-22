import { useLogout } from '../hooks/useLogout';
import Button from '../../../components/common/Button'; // Adjust path as needed

export const DashboardHeader = () => {
  const { handleLogout } = useLogout();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <Button 
        onClick={handleLogout}
        className="secondary" // Assuming you have secondary style
      >
        Logout
      </Button>
    </header>
  );
};