import { DashboardHeader } from '../../features/dashboard/components/DashboardHeader';
import ProfilePage from './Profile';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="p-6">
        WELCOME TO KINVO!
      </main>
      <ProfilePage />
    </div>
  );
}