import styled from 'styled-components';

export const StyledProfileEditor = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const EditorContainer = styled.div`
  // Your existing styles...
`;

export const PreviewContainer = styled.div`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 1rem;
  position: relative;
  height: 600px;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 5px;
    background-color: #e0e0e0;
    border-radius: 5px;
  }

  .preview-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 25%; 
    margin-top: 2rem;

    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 0.5rem;
    }

    h3 {
      font-size: 1rem;
      margin-bottom: 0.25rem;
      color: #333;
    }

    p {
      color: #6c757d;
      font-size: 0.8rem;
    }
  }

  .app-name {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
  }
`;