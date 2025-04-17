import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export const Sidebar = styled.nav`
  transition: all 0.3s ease;
  overflow-y: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  @media (max-width: 768px) {
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;
