import styled from 'styled-components';

export const StyledCardCreator = styled.div`
  /* Modal base styling */
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;

  .modal-content {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    width: 100%;
    max-width: 56rem;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text.primary};
  }

  .close-button {
    color: ${props => props.theme.colors.text.secondary};
    padding: 0.25rem;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.colors.text.primary};
    }
  }

  .modal-description {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .template-card {
    border: 1px solid ${props => props.theme.colors.border.default};
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: ${props => props.theme.colors.primary.main};
    }
  }

  .template-indicator {
    height: 0.75rem;
  }

  .template-content {
    padding: 1rem;
  }

  .template-preview {
    height: 12rem;
    background-color: ${props => props.theme.colors.background.secondary};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .template-preview-text {
    text-align: center;
  }

  .template-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
    color: ${props => props.theme.colors.text.primary};
  }

  .template-description {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.text.secondary};
  }

  .modal-footer {
    margin-top: 1.5rem;
    text-align: right;
  }

  .cancel-button {
    padding: 0.5rem 1rem;
    color: ${props => props.theme.colors.text.secondary};
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;