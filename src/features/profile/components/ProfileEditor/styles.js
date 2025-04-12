import styled from 'styled-components';

export const StyledProfileEditor = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CompanyLogoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
  
  img {
    max-height: 40px;
    max-width: 180px;
  }
`;

export const SlugLinkContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f8ff;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 3px solid #4a90e2;
  font-size: 1rem;
  
  .slug-message {
    font-weight: 600;
    color: #333;
    margin-right: 0.5rem;
  }
  
  .slug-link {
    color: #4a90e2;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    display: inline-flex;
    align-items: baseline;
    
    &:hover {
      text-decoration: underline;
    }
    
    /* Ensure the domain and slug appear visually connected */
    .domain {
      font-weight: 500;
    }
    
    .slug-value {
      font-family: monospace;
      font-weight: 600;
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    
    .slug-message {
      margin-bottom: 0.5rem;
    }
  }
`;

export const EditorContainer = styled.div`
  flex: 2;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #222;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-left: 3px solid #4a90e2;
      padding-left: 8px;
    }
    
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
      }
    }
    
    textarea {
      resize: vertical;
      min-height: 120px;
      max-height: 200px;
      max-width: 100%;
    }

    .character-count {
      display: block;
      text-align: right;
      font-size: 0.8rem;
      color: #666;
      margin-top: 0.25rem;
    }
  }
  
  .photo-upload {
    margin-bottom: 1.5rem;
    
    .image-container {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1rem;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .loading-spinner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.7);
      }
    }
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #3a80d2;
    }
    
    &.disabled {
      background-color: #a0a0a0;
      cursor: not-allowed;
    }
  }
  
  .error-message {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background-color: #fff0f0;
    border-left: 3px solid #ff4d4f;
    color: #cf1322;
  }
`;

export const PreviewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  min-width: 420px; /* Increased by 50% from 280px */
  
  @media (max-width: 1100px) {
    /* Middle section (editor) shrinks first */
    ${EditorContainer} {
      flex: 1.5;
    }
  }
  
  @media (max-width: 900px) {
    ${EditorContainer} {
      flex: 1.2;
    }
  }
  
  @media (max-width: 850px) {
    min-width: 380px; /* Allow some phone width reduction before column layout */
  }
  
  @media (max-width: 768px) {
    min-width: unset; /* Reset min-width when in column layout */
  }
  
  .preview-card {
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    border: 10px solid #e0e0e0;
    width: 420px; /* Increased by 50% from 280px */
    margin: 0 auto;
    
    /* Phone notch styling */
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px; /* Proportionally increased */
      height: 25px; /* Slightly increased for better proportion */
      background-color: #ccc;
      border-radius: 0 0 12px 12px;
    }
    
    .image-wrapper {
      width: 180px; /* Proportionally increased from 150px */
      height: 180px; /* Proportionally increased from 150px */
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    h3 {
      font-size: 1.8rem; /* Slightly increased from 1.5rem */
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #333;
    }
    
    h4 {
      font-size: 1.3rem; /* Slightly increased from 1.1rem */
      font-weight: 500;
      margin: 0 0 1rem;
      color: #555;
    }
    
    .bio-container {
      margin: 1.5rem 0;
      padding: 1rem 1.5rem; /* Horizontal padding increased */
      background-color: #f9f9f9;
      border-radius: 12px;
      width: 100%;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
      
      .bio {
        font-size: 1rem; /* Slightly increased from 0.9rem */
        line-height: 1.6;
        color: #444;
        text-align: left;
        margin: 0;
        font-weight: 400;
      }
    }
    
    .profile-url {
      margin-top: auto;
      padding-top: 1.5rem;
      font-size: 1rem; /* Slightly increased from 0.9rem */
      color: #666;
      width: 100%;
      border-top: 1px solid #eee;
      padding-bottom: 0.5rem;
      
      span {
        font-family: monospace;
      }
    }
    
    @media (max-width: 850px) {
      width: 380px; /* Allow some width reduction before column layout */
      
      .image-wrapper {
        width: 160px;
        height: 160px;
      }
    }
    
    @media (max-width: 768px) {
      width: 420px; /* Return to full width in column layout */
      
      .image-wrapper {
        width: 180px;
        height: 180px;
      }
    }
    
    @media (max-width: 480px) {
      width: 100%; /* Full width on very small screens */
      padding: 1.5rem;
      
      .image-wrapper {
        width: 140px;
        height: 140px;
      }
    }
  }
  
  .app-name {
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    text-align: center;
  }
`;