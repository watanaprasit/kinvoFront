import styled from 'styled-components';

export const StyledCardList = styled.div`
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 16rem;
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
    border-radius: 9999px;
    height: 2.5rem;
    width: 2.5rem;
    border-width: 2px;
    border-style: solid;
    border-color: transparent;
    border-bottom-color: ${props => props.theme.colors.primary.main};
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .error-container {
    background-color: ${props => props.theme.colors.error.light};
    padding: 1rem;
    border-radius: 0.5rem;
    color: ${props => props.theme.colors.error.dark};
  }

  .retry-button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: ${props => props.theme.colors.error.lighter};
    color: ${props => props.theme.colors.error.dark};
    border-radius: 0.375rem;
    cursor: pointer;
    
    &:hover {
      background-color: ${props => props.theme.colors.error.light};
    }
  }

  .empty-state {
    background-color: white;
    padding: 2.5rem;
    border-radius: 0.5rem;
    box-shadow: ${props => props.theme.shadows.md};
    text-align: center;
  }

  .empty-icon {
    color: ${props => props.theme.colors.text.disabled};
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.125rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5rem;
  }

  .empty-description {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .card-item {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: ${props => props.theme.shadows.md};
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.lg};
    }
  }

  .card-indicator {
    height: 0.75rem;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5rem;
  }

  .card-description {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: ${props => props.theme.colors.text.tertiary};
    margin-bottom: 1rem;
  }

  .card-actions {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${props => props.theme.colors.border.default};
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: ${props => props.theme.colors.text.secondary};
    flex: 1;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${props => props.theme.colors.background.secondary};
    }

    svg {
      margin-right: 0.25rem;
    }
  }

  .delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.75rem;
    border: 1px solid ${props => props.theme.colors.error.main};
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: ${props => props.theme.colors.error.main};
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${props => props.theme.colors.error.lighter};
    }
  }
`;