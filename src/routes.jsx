import { createBrowserRouter } from 'react-router-dom';
import UserProfile from './pages/app/UserProfile';
import { ROUTES } from './lib/constants/routes';

export const router = createBrowserRouter([
  {
    path: ROUTES.PROFILE,
    element: <UserProfile />,
    loader: async ({ params }) => {
      // Fetch user data based on slug
      const response = await fetch(`/api/v1/users/${params.slug}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      return response.json();
    },
  },
 
]);