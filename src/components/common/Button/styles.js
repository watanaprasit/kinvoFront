import styled from 'styled-components';

export const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$isLoading', // Prevent `$isLoading` from being passed to the DOM
})`
  padding: 12px;
  width: 100%;
  font-weight: 600;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, opacity 0.2s ease;
  cursor: ${({ $isLoading }) => ($isLoading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isLoading }) => ($isLoading ? 0.5 : 1)};

  &.primary {
    background: linear-gradient(to right, #3b82f6, #2563eb);
    color: white;
  }

  &.secondary {
    background: #000;
    color: white;
  }

  &:hover {
    background-color: ${({ $isLoading }) =>
      $isLoading ? '' : 'rgba(59, 130, 246, 0.8)'};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

