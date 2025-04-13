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
  display: inline-flex; /* Changed to inline-flex */
  justify-content: flex-start;
  margin-bottom: 1.5rem;
  background-color: #c0b8ae;
  padding: 1rem;
  border-radius: 6px;
  border: 2px solid #8c7e73;
  border-left: 3px solid #8c7e73;
  align-self: flex-start; /* Add this to prevent stretching */
  max-width: fit-content; /* Make container only as wide as content */
  
  img {
    max-height: 40px;
    max-width: 180px;
    border-radius: 8px;
  }
`;

export const SlugLinkContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #c0b8ae; /* Taupe color for slug area */
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border-left: 3px solid #8c7e73; /* Darker taupe border */
  font-size: 1rem;
  border: 2px solid #8c7e73; /* Complete border around slug container */
  
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* Enhanced shadow */
  border: 2px solid #ddd; /* Adding obvious border */
  
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
      border: 1px solid #bbb; /* Darker border for input fields */
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
      border: 3px solid #ddd; /* Adding border to image container */
      
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
    border: 1px solid #ff4d4f; /* Complete border for error message */
    border-radius: 4px;
  }
`;

export const PreviewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 20px;
  align-self: flex-start;
  min-width: 420px;
  
  @media (max-width: 1100px) {
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
    min-width: 380px;
  }
  
  @media (max-width: 768px) {
    min-width: unset;
  }
  
  .preview-card {
    padding: 0;
    background-color: #ffffff;
    border-radius: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    border: 10px solid #222;
    width: 420px;
    margin: 0 auto;
    overflow: hidden;
    
    /* Phone notch styling */
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 25px;
      background-color: #222;
      border-radius: 0 0 12px 12px;
      z-index: 2;
    }
    
    /* Company logo area */
    .company-logo-container {
      width: 100%;
      background-color: #aa9f94; /* Taupe color for logo area */
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0;
      border-bottom: 3px solid #8c7e73; /* Adding border */
      
      img {
        max-height: 80px;
        max-width: 240px;
        object-fit: contain;
        border-radius: 8px;
      }
    }

    .company-logo-wrapper {
        width: auto;
        height: auto;
        border-radius: 0;
        overflow: visible;
        box-shadow: none;
        border: none;
        margin-top: 0;
        
        img {
          max-height: 80px;
          max-width: 240px;
          border-radius: 8px;
          object-fit: contain;
        }
      }
    }
    
    /* Container for profile info */
    .profile-content {
      width: 100%;
      padding: 20px;
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top: 2px solid #ddd; /* Adding subtle border */
    }
    
    .image-wrapper {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border: 4px solid white;
      margin-top: -20px;
      z-index: 1;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    h3 {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #333;
    }
    
    h4 {
      font-size: 1.3rem;
      font-weight: 500;
      margin: 0 0 0.5rem;
      color: #555;
    }
    
    .bio-text {
      font-size: 0.9rem;
      line-height: 1.4;
      color: #666;
      margin: 0.5rem 0 1.5rem;
      max-width: 90%;
    }
    
    /* Contact buttons */
    .contact-buttons {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 1rem;
      
      .contact-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        background-color: #f1f1f1;
        color: #333;
        border-radius: 30px;
        font-size: 1rem;
        font-weight: 500;
        margin: 0 10px;
        width: calc(100% - 20px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border: 1px solid #ddd; /* Adding border to buttons */
        
        svg {
          margin-right: 8px;
        }
      }
    }
    
    /* Kinvo branding at bottom */
    .kinvo-branding {
      width: 100%;
      padding: 18px 0;
      background-color: #aa9f94; /* Changed to taupe color */
      border-top: 2px solid #8c7e73; /* Darker taupe border */
      margin-top: 15px;
      
      .brand-text {
        font-size: 1.4rem;
        font-weight: 700;
        color: white;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      
      .profile-url {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 6px;
        
        span {
          font-family: monospace;
          font-weight: 600;
          background-color: rgba(255, 255, 255, 0.15);
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
    }
  }
`;