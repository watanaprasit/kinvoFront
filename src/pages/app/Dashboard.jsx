import { DashboardHeader } from '../../features/dashboard/components/DashboardHeader';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="p-6">
        WELCOME TO KINVO!
      </main>
    </div>
  );
}