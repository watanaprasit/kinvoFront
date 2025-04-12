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
      font-weight: 600; /* Increased from 500 */
      color: #222; /* Darker text */
      font-size: 1.1rem; /* Larger font size */
      text-transform: uppercase; /* Added uppercase */
      letter-spacing: 0.5px; /* Added letter spacing */
      border-left: 3px solid #4a90e2; /* Added visual indicator */
      padding-left: 8px; /* Added padding for the border */
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
      max-height: 200px; /* Setting max height */
      max-width: 100%; /* Ensuring it doesn't break layout */
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
  position: sticky; /* Make it sticky */
  top: 20px; /* Distance from top */
  align-self: flex-start; /* Prevents stretching */
  
  .preview-card {
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 20px; /* Increased from 8px for more phone-like appearance */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Stronger shadow */
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    border: 10px solid #e0e0e0; /* Phone-like border */
    max-width: 720px; /* Doubled from 360px */
    width: 100%; /* Added to ensure it takes full available space */
    margin: 0 auto;
    
    /* Phone notch styling */
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 20px;
      background-color: #ccc;
      border-radius: 0 0 12px 12px;
    }
    
    .image-wrapper {
      width: 150px;
      height: 150px;
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
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.25rem;
      color: #333;
    }
    
    h4 {
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0 0 1rem;
      color: #555;
    }
    
    /* Bio styling updated for better readability */
    .bio-container {
      margin: 1.5rem 0;
      padding: 1rem;
      background-color: #f9f9f9;
      border-radius: 12px; /* Increased radius */
      width: 100%;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1); /* Inner shadow for depth */
      
      .bio {
        font-size: 0.9rem;
        line-height: 1.6;
        color: #444;
        text-align: left;
        margin: 0;
        font-weight: 400;
      }
    }
    
    /* Profile URL styling - positioned above the app name */
    .profile-url {
      margin-top: auto;
      padding-top: 1.5rem;
      font-size: 0.9rem;
      color: #666;
      width: 100%;
      border-top: 1px solid #eee;
      padding-bottom: 0.5rem;
      
      span {
        font-family: monospace;
      }
    }
  }
  
  .app-name {
    margin-top: 1rem;
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    text-align: center;
    /* Home button styling removed */
  }
`;