import styled from 'styled-components';

export const StyledProfileEditor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 100%; // Changed from 1200px to allow full width usage
  margin: 0 auto;
  position: relative;
  
  /* Updated layout to position editor on left and preview on far right */
  .editor-preview-container {
    display: flex;
    justify-content: space-between; // This will push items to the edges
    gap: 2rem;
    position: relative; // Added for positioning context
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .section-divider {
    margin: 30px 0 20px;
    border-top: 1px solid #e0e0e0;
    padding-top: 15px;
  }

  .section-divider h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
  }

  .contact-buttons .contact-button {
    padding: 8px 16px;
    background-color: #f5f5f5;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 14px;
    border: 1px solid #e0e0e0;
    transition: all 0.2s ease;
  }

  .contact-buttons .contact-button:hover {
    background-color: #eaeaea;
    cursor: pointer;
  }
`;

export const ErrorToast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #fff0f0;
  border-left: 3px solid #ff4d4f;
  color: #cf1322;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 350px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .error-content {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    
    .error-icon {
      font-size: 1.2rem;
    }
    
    p {
      margin: 0;
      flex: 1;
    }
  }
  
  .close-button {
    background: transparent;
    border: none;
    color: #cf1322;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    margin-left: 0.5rem;
    
    &:hover {
      color: #a8071a;
    }
  }
`;

export const SlugLinkContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #c0b8ae;
  padding: 1rem;
  border-radius: 6px;
  margin: 1.5rem auto;
  border-left: 3px solid #8c7e73;
  font-size: 1rem;
  border: 2px solid #8c7e73;
  max-width: 600px;
  width: calc(100% - 3rem);
  
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
  .slug-link-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .copy-button {
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
    color: black;
    
    &:hover {
      background-color: #e0e0e0;
    }
  }
  
  .copy-success {
    color: #4caf50;
    font-size: 0.9rem;
    opacity: 0;
    transition: opacity 0.3s;
    margin-left: 5px;
  }
`;

export const EditorContainer = styled.div`
  flex: 0 1 600px; /* Fixed width of 600px, won't grow but can shrink */
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #ddd;
  align-self: flex-start; /* Align to top */
  
  @media (max-width: 768px) {
    align-self: center;
    margin-bottom: 2rem;
    width: 100%;
  }
  
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
      border: 1px solid #bbb;
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
    
    .image-container {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1rem;
      position: relative;
      border: 3px solid #ddd;
      
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

      .edit-icon {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background-color: #fff;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        cursor: pointer;
        border: 1px solid #ddd;
        z-index: 2;
        
        &:hover {
          background-color: #f0f0f0;
        }
        
        svg {
          width: 16px;
          height: 16px;
          color: #555;
        }
      }
    }
  }
  
  .company-logo-upload {
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
    
    .image-container {
      width: 200px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 1rem;
      position: relative;
      border: 3px solid #ddd;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        background-color: #f5f5f5;
      }
      
      .no-logo-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        color: #aaa;
        font-style: italic;
      }
      
      .edit-icon {
        position: absolute;
        bottom: 5px;
        right: 5px;
        background-color: #fff;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        cursor: pointer;
        border: 1px solid #ddd;
        z-index: 2;
        
        &:hover {
          background-color: #f0f0f0;
        }
        
        svg {
          width: 16px;
          height: 16px;
          color: #555;
        }
      }
        
      span {
        font-size: 12px;
        color: #aaa;
        transform: rotate(-45deg);
        display: block;
        transition: color 0.2s ease;
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
`;

export const PreviewContainer = styled.div`
  flex: 0 0 336px; /* Fixed width of 336px, won't grow or shrink */
  position: fixed; /* Changed from sticky to fixed */
  top: 80px; /* Adjust based on your header height */
  right: 40px; /* Position from the right edge of the viewport */
  height: fit-content;
  display: flex;
  justify-content: center;
  z-index: 10; /* Ensure it's above other content if needed */
  
  @media (max-width: 1200px) {
    /* For medium screens, stick to right side but avoid overlap */
    position: sticky;
    top: 20px;
    right: auto;
    align-self: flex-end;
  }
  
  @media (max-width: 768px) {
    /* For mobile screens, revert to normal flow */
    position: static;
    align-self: center;
    margin-top: 2rem;
    width: 100%;
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
    width: 336px;
    margin: 0 auto;
    overflow: hidden;
    
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
    

    
    .company-logo-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      
      > div {
        display: inline-flex;
        background-color: #c0b8ae;
        padding: 1rem;
        border-radius: 6px;
        border: 2px solid #8c7e73;
        border-left: 3px solid #8c7e73;
        max-width: 100%;
        width: auto;
      }
      
      .no-logo-placeholder {
        width: 240px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
        color: #aaa;
        font-style: italic;
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
        max-width: 100%;
        width: auto;
        border-radius: 8px;
        object-fit: contain;
      }
    }
    
    .profile-content {
      width: 100%;
      padding: 20px;
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top: 2px solid #ddd;
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
        border: 1px solid #ddd;
        
        svg {
          margin-right: 8px;
        }
      }
    }

    .qr-code-container {
      display: flex;
      justify-content: center;
      margin: 15px 0;
      padding: 5px;
    }
    
    .kinvo-branding {
      width: 100%;
      padding: 18px 0;
      background-color: #aa9f94;
      border-top: 2px solid #8c7e73;
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

export const CardSelector = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
  }
  
  .card-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .card-select-button {
    padding: 0.5rem 1rem;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    
    &.active {
      background-color: #4a90e2;
      color: white;
      border-color: #3a80d2;
    }
    
    &:hover {
      background-color: ${props => props.active ? '#3a80d2' : '#e0e0e0'};
    }
  }
  
  .card-add-button {
    padding: 0.5rem 1rem;
    background-color: #f5f5f5;
    border: 1px dashed #aaa;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #555;
    
    &:hover {
      background-color: #e8e8e8;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .card-actions {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    
    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      border-radius: 4px;
      cursor: pointer;
      
      &.set-primary-button {
        background-color: #52c41a;
        color: white;
        border: none;
        
        &:hover {
          background-color: #49ad15;
        }
      }
      
      &.delete-button {
        background-color: transparent;
        border: 1px solid #ff4d4f;
        color: #ff4d4f;
        
        &:hover {
          background-color: #fff0f0;
        }
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;