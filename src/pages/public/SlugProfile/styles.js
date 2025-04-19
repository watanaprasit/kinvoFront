import styled from 'styled-components';

export const StyledSlugProfile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f5f7fa;
  
  .profile-card {
    position: relative;
    width: 100%;
    max-width: 500px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .company-logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fc;
    height: 80px;
    overflow: hidden;
    
    .company-logo-wrapper {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        max-height: 50px;
        max-width: 200px;
        object-fit: contain;
      }
    }
    
    .no-logo-placeholder {
      color: #c4c9d4;
      font-size: 0.9rem;
    }
  }
  
  .profile-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    text-align: center;
    
    .image-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1.5rem;
      border: 3px solid #f3f4f8;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.3s ease;
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
        font-size: 0.8rem;
        color: #888;
        background-color: rgba(255, 255, 255, 0.7);
      }
    }
    
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #333;
    }
    
    h2 {
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0 0 1rem;
      color: #666;
    }
    
    .bio-text {
      font-size: 0.95rem;
      color: #555;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    
    .contact-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
      width: 100%;
      margin-bottom: 1.5rem;
      
      .contact-button {
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          background-color: #f5f7fa;
          color: #444;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          
          svg {
            width: 18px;
            height: 18px;
            stroke-width: 2;
          }
          
          &:hover {
            background-color: #e8ebf2;
          }
        }
      }
      
      /* Style specifically for the save contact button */
      .save-contact-button a {
        background-color: #4a6cf7;
        color: white;
        
        svg {
          stroke: white;
        }
        
        &:hover {
          background-color: #3a5be6;
        }
      }
    }
    
    /* Confirmation message styles */
    .confirmation-message {
      position: relative;
      width: 100%;
      padding: 0.75rem;
      background-color: #e2f7e8;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      animation: fadeIn 0.3s ease;
      
      p {
        margin: 0;
        font-size: 0.9rem;
        color: #0d7a3f;
        text-align: center;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    }
    
    .share-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1.5rem;
      
      .qr-code-wrapper {
        margin-bottom: 0.5rem;
      }
      
      .scan-text {
        font-size: 0.85rem;
        color: #777;
      }
    }
    
    .kinvo-branding {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      
      .brand-text {
        font-size: 1rem;
        font-weight: 600;
        color: #4a6cf7;
        margin-bottom: 0.25rem;
      }
      
      .profile-url {
        font-size: 0.8rem;
        color: #999;
      }
    }
  }
  
  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    width: 100%;
    max-width: 500px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    text-align: center;
    
    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #444;
    }
    
    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    button {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      background-color: #4a6cf7;
      color: white;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: #3a5be6;
      }
    }
  }
  
  /* Media queries for responsive design */
  @media (max-width: 480px) {
    .profile-content {
      padding: 1rem;
      
      .image-wrapper {
        width: 100px;
        height: 100px;
      }
      
      h1 {
        font-size: 1.3rem;
      }
      
      h2 {
        font-size: 1rem;
      }
    }
    
    .contact-buttons {
      grid-template-columns: 1fr !important;
    }
  }
`;