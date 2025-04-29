import { createBrowserRouter } from 'react-router-dom';
import UserProfile from './pages/app/UserProfile';
import BusinessCards from './pages/app/BusinessCards';
import EditBusinessCard from './pages/app/EditBusinessCard';
import { ROUTES } from './lib/constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.PROFILE,
    element: <UserProfile />,
    loader: async ({ params }) => {
      const response = await fetch(`/api/v1/users/${params.slug}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    },
  },
  {
    path: ROUTES.BUSINESS_CARDS,
    element: <BusinessCards />,
    loader: async () => {
      const response = await fetch('/api/v1/business-cards');
      if (!response.ok) {
        throw new Error('Failed to load business cards');
      }
      return response.json();
    },
  },
  {
    path: ROUTES.EDIT_BUSINESS_CARD,
    element: <EditBusinessCard />,
    loader: async ({ params }) => {
      if (params.id === 'new') {
        return { isNew: true };
      }
      const response = await fetch(`/api/v1/business-cards/${params.id}`);
      if (!response.ok) {
        throw new Error('Business card not found');
      }
      return response.json();
    },
  },
]);