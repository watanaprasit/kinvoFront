import styled from 'styled-components';

export const StyledSlugProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;

  .profile-card {
    width: 100%;
    max-width: 480px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #fff;
    display: flex;
    flex-direction: column;
  }

  .company-logo-container {
    background-color: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    min-height: 100px;
    width: 100%;
    
    .image-wrapper {
      max-width: 200px;
      max-height: 80px;
      
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
    
    .no-logo-placeholder {
      color: #adb5bd;
      font-size: 14px;
      font-style: italic;
    }
    
    .loading-spinner {
      color: #6c757d;
      font-size: 14px;
    }
  }

  .profile-content {
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    
    .image-wrapper {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 24px;
      border: 3px solid #fff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 8px;
      color: #212529;
    }
    
    h2 {
      font-size: 18px;
      font-weight: 500;
      margin: 0 0 16px;
      color: #495057;
    }
    
    .bio-text {
      margin: 16px 0 24px;
      color: #495057;
      font-size: 16px;
      line-height: 1.6;
      max-width: 100%;
      word-break: break-word;
    }
  }

  .contact-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
    width: 100%;
    
    .contact-button {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 12px 20px;
      min-width: 120px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background-color: #e9ecef;
      }
      
      a {
        color: #212529;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
      }
      
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  .kinvo-branding {
    margin-top: 16px;
    text-align: center;
    
    .brand-text {
      font-weight: 600;
      color: #6c757d;
      font-size: 16px;
    }
    
    .profile-url {
      font-size: 14px;
      color: #adb5bd;
      margin-top: 4px;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    width: 100%;
  }

  .error-container {
    text-align: center;
    padding: 40px;
    color: #dc3545;
    
    h3 {
      font-size: 20px;
      margin-bottom: 12px;
    }
    
    p {
      color: #6c757d;
      margin-bottom: 24px;
    }
    
    button {
      background-color: #0d6efd;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      
      &:hover {
        background-color: #0b5ed7;
      }
    }
  }
`;