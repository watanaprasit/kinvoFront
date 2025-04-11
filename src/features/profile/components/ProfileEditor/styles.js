// import styled from 'styled-components';

// export const StyledProfileEditor = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 400px;
//   gap: 2rem;
//   max-width: 1000px;
//   margin: 0 auto;
//   padding: 2rem;

//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//     padding: 1rem;
//   }
// `;

// export const EditorContainer = styled.div`
//   background-color: white;
//   border-radius: 10px;
//   padding: 2rem;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

//   .error-message {
//     background-color: #fff5f5;
//     color: #e53e3e;
//     padding: 1rem;
//     border-radius: 8px;
//     margin-bottom: 1rem;
//     border: 1px solid #feb2b2;
//   }

//   form {
//     display: flex;
//     flex-direction: column;
//     gap: 1.5rem;
//   }

//   .photo-upload {
//     margin-bottom: 1.5rem;

//     .image-container {
//       position: relative;
//       width: 120px;
//       height: 120px;
//       margin-bottom: 1rem;

//       img {
//         width: 100%;
//         height: 100%;
//         border-radius: 50%;
//         object-fit: cover;
//         border: 2px solid #e2e8f0;
//       }

//       .loading-spinner {
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         color: #4a5568;
//       }
//     }

//     input[type="file"] {
//       width: 100%;
//       padding: 0.5rem;
//       border: 1px solid #e2e8f0;
//       border-radius: 6px;
//     }
//   }

//   .form-group {
//     display: flex;
//     flex-direction: column;
//     gap: 0.5rem;

//     label {
//       font-weight: 500;
//       color: #4a5568;
//     }

//     input {
//       padding: 0.75rem;
//       border: 1px solid #e2e8f0;
//       border-radius: 6px;
//       font-size: 1rem;
//       transition: border-color 0.2s;

//       &:focus {
//         outline: none;
//         border-color: #4299e1;
//         box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
//       }
//     }

//     .text-red-500 {
//       color: #e53e3e;
//       font-size: 0.875rem;
//       margin-top: 0.25rem;
//     }
//   }

//   button {
//     background-color: #4299e1;
//     color: white;
//     padding: 0.75rem 1.5rem;
//     border-radius: 6px;
//     font-weight: 500;
//     transition: background-color 0.2s;
//     border: none;
//     cursor: pointer;
//     margin-top: 1rem;

//     &:hover:not(:disabled) {
//       background-color: #3182ce;
//     }

//     &:disabled,
//     &.disabled {
//       background-color: #a0aec0;
//       cursor: not-allowed;
//       opacity: 0.7;
//     }
//   }
// `;

// export const PreviewContainer = styled.div`
//   background-color: white;
//   border: 1px solid #e0e0e0;
//   border-radius: 20px;
//   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//   padding: 1rem;
//   position: relative;
//   height: 600px;
//   display: flex;
//   flex-direction: column;

//   &::before {
//     content: '';
//     position: absolute;
//     top: 10px;
//     left: 50%;
//     transform: translateX(-50%);
//     width: 60%;
//     height: 5px;
//     background-color: #e0e0e0;
//     border-radius: 5px;
//   }

//   .preview-card {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 25%;
//     margin-top: 2rem;

//     img {
//       width: 100px;
//       height: 100px;
//       border-radius: 50%;
//       object-fit: cover;
//       margin-bottom: 0.5rem;
//       border: 2px solid #e2e8f0;
//     }

//     h3 {
//       font-size: 1rem;
//       margin-bottom: 0.25rem;
//       color: #333;
//       font-weight: 600;
//     }

//     p {
//       color: #6c757d;
//       font-size: 0.8rem;
//     }
//   }

//   .app-name {
//     position: absolute;
//     bottom: 20px;
//     left: 50%;
//     transform: translateX(-50%);
//     font-size: 1.2rem;
//     font-weight: bold;
//     color: #333;
//   }

//   @media (max-width: 768px) {
//     height: 400px;
//     margin-top: 2rem;
//   }
// `;


//new below, old above
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
      font-weight: 500;
      color: #333;
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
      min-height: 120px; /* Increased height for bio */
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
  
  .preview-card {
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    
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
      border-radius: 6px;
      width: 100%;
      
      .bio {
        font-size: 1.05rem; /* Slightly larger font */
        line-height: 1.6;
        color: #444;
        text-align: left;
        margin: 0;
        font-weight: 400;
      }
    }
    
    /* Profile URL styling - positioned above the app name */
    .profile-url {
      margin-top: auto; /* Push to bottom */
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
    margin-top: 0.5rem;
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
    text-align: center;
  }
`;