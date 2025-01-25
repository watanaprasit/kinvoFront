import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      position: ${props => props.isMobileMenuOpen ? 'fixed' : 'static'};
      z-index: 20;
    }

    .content-area {
      margin-left: ${props => props.isMobileMenuOpen ? '0' : 'auto'};
    }
  }
`;

export const Sidebar = styled.nav`
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;