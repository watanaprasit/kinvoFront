import styled from 'styled-components';

export const StyledProfileEditor = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
`;

export const EditorContainer = styled.div`
  .photo-upload {
    margin-bottom: 1.5rem;
    
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  .form-group {
    margin-bottom: 1rem;
    
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 4px;
    }
  }
`;

export const PreviewContainer = styled.div`
  .preview-card {
    padding: 2rem;
    border-radius: 12px;
    background: ${props => props.theme.colors.background};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;

    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 1rem;
    }

    h3 {
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
    }

    p {
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;