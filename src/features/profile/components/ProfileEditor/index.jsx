// import { useState, useEffect, useCallback, useRef, memo } from 'react';
// import { useAuth } from '../../../auth/context/AuthContext';
// import { ProfileService } from '../../services/profileServices';
// import ProfileQRCode from '../../../qrCode/components/ProfileQRCode';
// import { StyledProfileEditor, PreviewContainer, EditorContainer, SlugLinkContainer, ErrorToast } from './styles';
// // Import the formatters
// import { cleanImageUrl, formatPhotoUrl, getUserFriendlyError, isValidSlugFormat, formatProfileUrl, formatQrCodeBaseUrl } from '../../../../library/utils/formatters';

// const DEFAULT_AVATAR = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
// const MAX_FILE_SIZE = 5 * 1024 * 1024; 
// const VALID_TYPES = ['image/jpeg', 'image/png'];

// // Profile Image component updated to use imported formatters
// const ProfileImage = memo(({ isPreview, previewUrl, userProfile, savedPreviewUrl }) => {
//   const [imgSrc, setImgSrc] = useState('');
//   const [localLoading, setLocalLoading] = useState(true);
//   const [retryCount, setRetryCount] = useState(0);
//   const maxRetries = 2;
  
//   const getDisplayImageUrl = useCallback(() => {
//     if (savedPreviewUrl) {
//       return savedPreviewUrl;
//     }
    
//     if (userProfile?.photo_url) {
//       return cleanImageUrl(userProfile.photo_url);
//     }
    
//     return DEFAULT_AVATAR;
//   }, [savedPreviewUrl, userProfile?.photo_url]);
  
//   useEffect(() => {
//     setLocalLoading(true);
//     setRetryCount(0);
    
//     // Use different image source logic based on whether this is for the form or preview
//     const displayUrl = isPreview 
//       ? getDisplayImageUrl() 
//       : (previewUrl || (userProfile?.photo_url ? cleanImageUrl(userProfile.photo_url) : DEFAULT_AVATAR));
    
//     if (displayUrl.startsWith('blob:')) {
//       setImgSrc(displayUrl);
//     } else {
//       setImgSrc(formatPhotoUrl(displayUrl));
//     }
//   }, [isPreview, previewUrl, getDisplayImageUrl, userProfile]);

//   const handleImageError = (e) => {
//     if (retryCount < maxRetries) {
//       setTimeout(() => {
//         if (imgSrc.startsWith('blob:')) {
//           setRetryCount(prevCount => prevCount + 1);
//         } else {
//           setImgSrc(formatPhotoUrl(cleanImageUrl(imgSrc)));
//           setRetryCount(prevCount => prevCount + 1);
//         }
//       }, 500);
//     } else {
//       setLocalLoading(false);
//       if (!e.target.src.includes('dicebear')) {
//         e.target.src = DEFAULT_AVATAR;
//       }
//     }
//   };

//   return (
//     <div className="image-wrapper">
//       {localLoading && <div className="loading-spinner">Loading...</div>}
//       <img 
//         src={imgSrc} 
//         alt="Profile"
//         onLoad={() => {
//           setLocalLoading(false);
//         }}
//         onError={handleImageError}
//         style={{ 
//           opacity: localLoading ? 0.5 : 1,
//           maxWidth: '100%',
//           height: 'auto'
//         }}
//       />
//     </div>
//   );
// });

// // Company Logo component updated to use imported formatters
// const CompanyLogo = memo(({ previewUrl, userProfile, savedPreviewUrl }) => {
//   const [imgSrc, setImgSrc] = useState('');
//   const [localLoading, setLocalLoading] = useState(true);
//   const [retryCount, setRetryCount] = useState(0);
//   const maxRetries = 2;
  
//   useEffect(() => {
//     setLocalLoading(true);
//     setRetryCount(0);
    
//     const displayUrl = previewUrl || 
//       (userProfile?.company_logo_url ? cleanImageUrl(userProfile.company_logo_url) : '');
    
//     if (!displayUrl) {
//       setLocalLoading(false);
//       setImgSrc('');
//       return;
//     }
    
//     if (displayUrl.startsWith('blob:')) {
//       setImgSrc(displayUrl);
//     } else {
//       setImgSrc(formatPhotoUrl(displayUrl));
//     }
//   }, [previewUrl, userProfile]);

//   const handleImageError = (e) => {
//     if (retryCount < maxRetries) {
//       setTimeout(() => {
//         if (imgSrc.startsWith('blob:')) {
//           setRetryCount(prevCount => prevCount + 1);
//         } else {
//           setImgSrc(formatPhotoUrl(cleanImageUrl(imgSrc)));
//           setRetryCount(prevCount => prevCount + 1);
//         }
//       }, 500);
//     } else {
//       setLocalLoading(false);
//       // No default fallback for company logo
//     }
//   };

//   if (!imgSrc) {
//     return null; // Don't render anything if no logo
//   }

//   return (
//     <div className="image-wrapper company-logo-wrapper">
//       {localLoading && <div className="loading-spinner">Loading...</div>}
//       <img 
//         src={imgSrc} 
//         alt="Company Logo"
//         onLoad={() => {
//           setLocalLoading(false);
//         }}
//         onError={handleImageError}
//         style={{ 
//           opacity: localLoading ? 0.5 : 1,
//           maxWidth: '100%',
//           height: 'auto'
//         }}
//       />
//     </div>
//   );
// });


// ProfileImage.displayName = 'ProfileImage';
// CompanyLogo.displayName = 'CompanyLogo';

// const ProfileEditor = () => {
//   const { user, userProfile, error: authError, updateUserProfile, isLoading } = useAuth();
  
//   // Fix 1: Use useRef instead of the non-standard useCallback implementation
//   const photoInputRef = useRef(null);
//   const companyLogoInputRef = useRef(null);
  
//   const [formData, setFormData] = useState({
//     display_name: '',
//     slug: '',
//     photo_url: '',
//     title: '',
//     bio: '',
//     company_logo_url: '',
//     email: '',
//     website: '',
//     contact: {} // For storing contact information
//   });
  
//   // Separate state for the preview that only updates after saving
//   const [previewData, setPreviewData] = useState({
//     display_name: '',
//     slug: '',
//     photo_url: '',
//     title: '',
//     bio: '',
//     company_logo_url: '',
//     email: '',
//     website: '',
//     contact: {} // For storing contact information
//   });
  
//   const [previewFile, setPreviewFile] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [savedPreviewUrl, setSavedPreviewUrl] = useState('');
  
//   // New state for company logo
//   const [companyLogoFile, setCompanyLogoFile] = useState(null);
//   const [companyLogoPreviewUrl, setCompanyLogoPreviewUrl] = useState('');
//   const [savedCompanyLogoUrl, setSavedCompanyLogoUrl] = useState('');
  
//   const [slugAvailable, setSlugAvailable] = useState(true);
//   const [submitError, setSubmitError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // Fixed unused variable warning
//   const [isImageLoading] = useState(false);
//   const [originalFormData, setOriginalFormData] = useState({
//     display_name: '',
//     slug: '',
//     photo_url: '',
//     title: '',
//     bio: '',
//     company_logo_url: '',
//     email: '',
//     website: '',
//     contact: {} // For storing contact information
//   });
  
//   // New state for error toast visibility
//   const [showErrorToast, setShowErrorToast] = useState(false);
  
//   useEffect(() => {
//     if (userProfile) {
//       const newFormData = {
//         display_name: userProfile.display_name || user?.full_name || '',
//         slug: userProfile.slug || user?.slug || '',
//         photo_url: cleanImageUrl(userProfile.photo_url) || '',
//         title: userProfile.title || '',
//         bio: userProfile.bio || '',
//         company_logo_url: cleanImageUrl(userProfile.company_logo_url) || '',
//         email: userProfile.email || user?.email || '',
//         website: userProfile.website || '',
//         contact: userProfile.contact || {}  
//       };
      
//       setFormData(newFormData);
//       setPreviewData(newFormData); 
//       setOriginalFormData(newFormData);
//       setSlugAvailable(true);
      
//       if (userProfile.photo_url) {
//         const cleanUrl = cleanImageUrl(userProfile.photo_url);
//         setPreviewUrl(cleanUrl);
//         setSavedPreviewUrl(cleanUrl);
//       } else {
//         setPreviewUrl('');
//         setSavedPreviewUrl('');
//       }
      
//       if (userProfile.company_logo_url) {
//         const cleanLogoUrl = cleanImageUrl(userProfile.company_logo_url);
//         setCompanyLogoPreviewUrl(cleanLogoUrl);
//         setSavedCompanyLogoUrl(cleanLogoUrl);
//       } else {
//         setCompanyLogoPreviewUrl('');
//         setSavedCompanyLogoUrl('');
//       }
//     }
//   }, [userProfile, user]);

//   // Effect to show error toast when error changes
//   useEffect(() => {
//     if (submitError || authError) {
//       setShowErrorToast(true);
      
//       // Auto hide after 5 seconds
//       const timer = setTimeout(() => {
//         setShowErrorToast(false);
//       }, 5000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [submitError, authError]);

//   // Fix 2: Simplified handlePencilClick to directly access the ref 
//   const handlePencilClick = (inputRef) => {
//     if (inputRef && inputRef.current) {
//       inputRef.current.click();
//     }
//   };

//   const copyToClipboard = (slug) => {
//     navigator.clipboard.writeText(formatProfileUrl(slug, true))
//       .then(() => {
//         // Show a temporary success message
//         const copySuccess = document.getElementById('copy-success');
//         copySuccess.style.opacity = '1';
//         setTimeout(() => {
//           copySuccess.style.opacity = '0';
//         }, 2000);
//       })
//       .catch(err => {
//         console.error('Failed to copy: ', err);
//         alert('Failed to copy URL to clipboard');
//       });
//   };

//   // Modified handleInputChange to use a debounced slug validation
//   const handleInputChange = useCallback(async (e) => {
//     const { name, value } = e.target;
    
//     // Clear previous errors
//     setSubmitError(null);
    
//     // Special validation for slug
//     if (name === 'slug') {
//       if (value && !isValidSlugFormat(value)) {
//         setSubmitError('Your profile name can only contain letters, numbers, and hyphens.');
//         setSlugAvailable(false);
        
//         // Still update the form data to show what the user typed
//         setFormData(prev => ({
//           ...prev,
//           [name]: value
//         }));
//         return;
//       }
//     }
        
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
  
//     // Only check slug availability if it's different from current slug
//     if (name === 'slug' && value.trim()) {
//       // Skip validation if the slug is unchanged from user's current slug
//       if (userProfile && value === userProfile.slug) {
//         setSlugAvailable(true); // User's own slug is always "available" to them
//         return;
//       }
      
//       try {
//         const result = await ProfileService.checkSlugAvailability(value);
//         setSlugAvailable(result.available);
        
//         if (!result.available) {
//           setSubmitError('This profile name is already being used by someone else. Please choose another one.');
//         }
//       } catch (error) {
//         setSlugAvailable(false);
//         setSubmitError('We couldn\'t check if this profile name is available. Please try again.');
//       }
//     }
//   }, [userProfile]);

//   const handlePhotoChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!VALID_TYPES.includes(file.type)) {
//       setSubmitError('Please upload a JPG or PNG image file for your profile photo.');
//       return;
//     }
    
//     if (file.size > MAX_FILE_SIZE) {
//       setSubmitError('Your profile photo is too large. Please choose an image under 5MB.');
//       return;
//     }

//     // Clean up previous blob URL if exists
//     if (previewUrl && previewUrl.startsWith('blob:')) {
//       URL.revokeObjectURL(previewUrl);
//     }

//     const localPreviewUrl = URL.createObjectURL(file);
//     setPreviewFile(file);
//     setPreviewUrl(localPreviewUrl);
//     setSubmitError(null);
//   }, [previewUrl]);

//   // New handler for company logo uploads
//   const handleCompanyLogoChange = useCallback((e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!VALID_TYPES.includes(file.type)) {
//       setSubmitError('Please upload a JPG or PNG image file for your company logo.');
//       return;
//     }
    
//     if (file.size > MAX_FILE_SIZE) {
//       setSubmitError('Your company logo is too large. Please choose an image under 5MB.');
//       return;
//     }

//     // Clean up previous blob URL if exists
//     if (companyLogoPreviewUrl && companyLogoPreviewUrl.startsWith('blob:')) {
//       URL.revokeObjectURL(companyLogoPreviewUrl);
//     }

//     const localPreviewUrl = URL.createObjectURL(file);
//     setCompanyLogoFile(file);
//     setCompanyLogoPreviewUrl(localPreviewUrl);
//     setSubmitError(null);
//   }, [companyLogoPreviewUrl]);

//   // Close error toast handler
//   const handleCloseErrorToast = () => {
//     setShowErrorToast(false);
//   };

//   // Clean up blob URLs when component unmounts
//   useEffect(() => {
//     return () => {
//       if (previewUrl && previewUrl.startsWith('blob:')) {
//         URL.revokeObjectURL(previewUrl);
//       }
//       if (companyLogoPreviewUrl && companyLogoPreviewUrl.startsWith('blob:')) {
//         URL.revokeObjectURL(companyLogoPreviewUrl);
//       }
//     };
//   }, [previewUrl, companyLogoPreviewUrl]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     setIsSubmitting(true);
//     setSubmitError(null);
  
//     try {
//       const updateFormData = new FormData();
      
//       // Only include fields that have changed
//       if (formData.display_name.trim() !== originalFormData.display_name) {
//           updateFormData.append('display_name', formData.display_name.trim());
//       }
      
//       // Include slug if it has changed - backend will validate
//       if (formData.slug.trim() !== originalFormData.slug) {
//         updateFormData.append('slug', formData.slug.trim());
//       }
      
//       // Add the new fields to the form data
//       if (formData.title.trim() !== originalFormData.title) {
//         updateFormData.append('title', formData.title.trim());
//       }
      
//       if (formData.bio.trim() !== originalFormData.bio) {
//         updateFormData.append('bio', formData.bio.trim());
//       }

//       // Add new contact fields
//       if (formData.email !== originalFormData.email) {
//         updateFormData.append('email', formData.email);
//       }
      
//       if (formData.website !== originalFormData.website) {
//         updateFormData.append('website', formData.website);
//       }
      
//       // Handle contact object - only if it's changed
//       if (JSON.stringify(formData.contact) !== JSON.stringify(originalFormData.contact)) {
//         updateFormData.append('contact', JSON.stringify(formData.contact));
//       }
      
//       // Only include photo if there's a new one
//       if (previewFile) {
//           updateFormData.append('photo', previewFile);
//       }

//       // Add company logo if there's a new one
//       if (companyLogoFile) {
//           updateFormData.append('company_logo', companyLogoFile);
//       }

//       if (formData.email !== originalFormData.email || 
//         formData.website !== originalFormData.website ||
//         JSON.stringify(formData.contact) !== JSON.stringify(originalFormData.contact)) {
      
//       // Optional: You can use the specialized endpoint for contact info
//       const contactData = {
//         email: formData.email,
//         website: formData.website,
//         contact: formData.contact
//       };
      
//       await ProfileService.updateContactInfo(contactData);
//     }
  
//       const updatedProfile = await updateUserProfile(updateFormData);
      
//       if (updatedProfile) {
//         const updatedFormData = {
//           display_name: updatedProfile.display_name || originalFormData.display_name,
//           slug: updatedProfile.slug || originalFormData.slug,
//           photo_url: cleanImageUrl(updatedProfile.photo_url) || originalFormData.photo_url,
//           title: updatedProfile.title || originalFormData.title,
//           bio: updatedProfile.bio || originalFormData.bio,
//           company_logo_url: cleanImageUrl(updatedProfile.company_logo_url) || originalFormData.company_logo_url
//         };
        
//         // Update original form data with the new values
//         setOriginalFormData(updatedFormData);
        
//         // Also update current form data
//         setFormData(prev => ({
//           ...prev,
//           ...updatedFormData
//         }));
        
//         // IMPORTANT: Only now update the preview data
//         setPreviewData(updatedFormData);
        
//         // Update the saved preview URL if there was a new photo
//         if (previewFile) {
//           setSavedPreviewUrl(previewUrl);
//         } else if (updatedProfile.photo_url) {
//           setSavedPreviewUrl(cleanImageUrl(updatedProfile.photo_url));
//         }
        
//         // Update the saved company logo URL if there was a new one
//         if (companyLogoFile) {
//           setSavedCompanyLogoUrl(companyLogoPreviewUrl);
//         } else if (updatedProfile.company_logo_url) {
//           setSavedCompanyLogoUrl(cleanImageUrl(updatedProfile.company_logo_url));
//         }
        
//         // More friendly success message
//         alert('Your profile has been updated successfully!');
//       }

//       setIsSubmitting(false);
  
//     } catch (error) {
//       console.error('Profile update error:', error); // Log the full error for debugging
//       // Extract error message, handling different error object structures
//       let errorMessage = 'Unknown error';
//       if (typeof error === 'string') {
//         errorMessage = error;
//       } else if (error.message) {
//         errorMessage = error.message;
//       } else if (error.response && error.response.data) {
//         // Handle API error responses
//         errorMessage = typeof error.response.data === 'string' 
//           ? error.response.data 
//           : error.response.data.message || JSON.stringify(error.response.data);
//       }
      
//       // Convert to user-friendly message and set in state
//       setSubmitError(getUserFriendlyError(errorMessage));
//       setShowErrorToast(true); // Explicitly show the toast

//       setIsSubmitting(false);
//     }
//   };

//   if (!user) {
//     return <div>Please log in to view your profile.</div>;
//   }

//   if (isLoading) {
//     return <div>Loading your profile...</div>;
//   }
  

//   return (
//     <StyledProfileEditor>
//       {/* Error Toast Component with user-friendly messages */}
//       {showErrorToast && (authError || submitError) && (
//         <ErrorToast>
//           <div className="error-content">
//             <span className="error-icon">⚠️</span>
//             <p>{authError ? getUserFriendlyError(authError) : submitError}</p>
//           </div>
//           <button className="close-button" onClick={handleCloseErrorToast}>×</button>
//         </ErrorToast>
//       )}
      
//       {formData.slug && (
//         <SlugLinkContainer className="standalone-slug-link">
//           <div className="slug-message">Your Kinvo is Live:</div>
//           <div className="slug-link-container">
//             <a 
//               href={formatProfileUrl(formData.slug)} 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="slug-link"
//             >
//               <span className="domain">kinvo.com/</span>
//               <span className="slug-value">{formData.slug}</span>
//             </a>
//             <button 
//               className="copy-button"
//               onClick={() => copyToClipboard(formData.slug)}
//             >
//               Copy your Kinvo URL
//             </button>
//             <span id="copy-success" className="copy-success">URL copied!</span>
//           </div>
//         </SlugLinkContainer>
//       )}
      
//       <div className="editor-preview-container">
//         <EditorContainer>
//           <form onSubmit={handleSubmit}>
//               <div className="photo-upload company-logo-upload">
//                 {/* Label moved to the top */}
//                 <label htmlFor="company-logo-upload">Company Branding</label>
//                 <div className="image-container">
//                   <CompanyLogo 
//                     previewUrl={companyLogoPreviewUrl}
//                     userProfile={userProfile}
//                     savedPreviewUrl={savedCompanyLogoUrl}
//                   />
//                   {!companyLogoPreviewUrl && !userProfile?.company_logo_url && (
//                     <div className="no-logo-placeholder">No company logo</div>
//                   )}
//                   {/* Added pencil icon with attribution */}
//                   <div 
//                     className="edit-icon" 
//                     onClick={() => handlePencilClick(companyLogoInputRef)}
//                     title="Edit Image (Icon by alkhalifi design - Flaticon)"
//                   >
//                     {/* SVG pencil icon */}
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
//                       <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
//                       <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <input 
//                   id="company-logo-upload"
//                   type="file" 
//                   accept={VALID_TYPES.join(',')}
//                   onChange={handleCompanyLogoChange}
//                   aria-label="Upload company logo"
//                   ref={companyLogoInputRef}
//                   style={{ display: 'none' }} // Hide the input
//                 />
//             </div>

//             {/* Profile Photo Upload - Now below company logo */}
//             <div className="photo-upload">
//               {/* Label moved to the top */}
//               <label htmlFor="photo-upload">Profile Picture</label>
//               <div className="image-container">
//                 {isImageLoading && <div className="loading-spinner">Loading...</div>}
//                 <ProfileImage 
//                   isPreview={false}
//                   previewUrl={previewUrl}
//                   userProfile={userProfile}
//                   savedPreviewUrl={savedPreviewUrl}
//                 />
//                 {/* Added pencil icon with attribution */}
//                 <div 
//                   className="edit-icon" 
//                   onClick={() => handlePencilClick(photoInputRef)}
//                   title="Edit Image (Icon by alkhalifi design - Flaticon)"
//                 >
//                   {/* SVG pencil icon */}
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
//                     <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
//                     <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
//                   </svg>
//                 </div>
//               </div>
//               <input 
//                 id="photo-upload"
//                 type="file" 
//                 accept={VALID_TYPES.join(',')}
//                 onChange={handlePhotoChange}
//                 aria-label="Upload profile photo"
//                 ref={photoInputRef}
//                 style={{ display: 'none' }} // Hide the input
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="display_name">Display Name</label>
//               <input
//                 id="display_name"
//                 type="text"
//                 name="display_name"
//                 value={formData.display_name}
//                 onChange={handleInputChange}
//                 placeholder="Your name as shown on your profile"
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="slug">Profile Name</label>
//               <input
//                 id="slug"
//                 type="text"
//                 name="slug"
//                 value={formData.slug}
//                 onChange={handleInputChange}
//                 placeholder="Choose a unique profile name (letters, numbers, hyphens only)"
//                 required
//               />
//               {!slugAvailable && formData.slug && (
//                 <p className="text-red-500">
//                   This profile name is already being used by someone else. Please choose another one.
//                 </p>
//               )}
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="title">Professional Title</label>
//               <input
//                 id="title"
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="Your job title or professional role"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="bio">Bio</label>
//               <textarea
//                 id="bio"
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleInputChange}
//                 placeholder="Tell visitors about yourself, your experience, and what you do"
//                 rows="6"
//               />
//             </div>

//             {/* Add after the bio field */}
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Your contact email"
//               />
//             </div>

//             <div className="form-group">
//               <label htmlFor="website">Website</label>
//               <input
//                 id="website"
//                 type="url"
//                 name="website"
//                 value={formData.website}
//                 onChange={handleInputChange}
//                 placeholder="Your website or portfolio (https://...)"
//               />
//             </div>

//             {/* Optional: Add phone number field using the contact object */}
//             <div className="form-group">
//               <label htmlFor="phone">Phone Number</label>
//               <input
//                 id="phone"
//                 type="tel"
//                 name="phone"
//                 value={formData.contact?.phone || ''}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setFormData(prev => ({
//                     ...prev,
//                     contact: {
//                       ...prev.contact,
//                       phone: value
//                     }
//                   }));
//                 }}
//                 placeholder="Your phone number"
//               />
//             </div>

//             <button 
//               type="submit" 
//               disabled={isSubmitting || !slugAvailable || !formData.slug}
//               className={isSubmitting || !slugAvailable || !formData.slug ? 'disabled' : ''}
//             >
//               {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
//             </button>
//           </form>
//         </EditorContainer>
      

//         <PreviewContainer>
//           <div className="preview-card">
//             {/* Company Logo Area with background color */}
//             <div className="company-logo-container">
//               <CompanyLogo 
//                 previewUrl={companyLogoPreviewUrl}
//                 userProfile={userProfile}
//                 savedPreviewUrl={savedCompanyLogoUrl}
//               />
//               {!companyLogoPreviewUrl && !userProfile?.company_logo_url && (
//                 <div className="no-logo-placeholder">No company logo</div>
//               )}
//             </div>
            
//             {/* Profile Content Section */}
//             <div className="profile-content">
//               {/* Profile Image */}
//               <ProfileImage 
//                 isPreview={true}
//                 previewUrl={previewUrl}
//                 userProfile={userProfile}
//                 savedPreviewUrl={savedPreviewUrl}
//               />
              
//               <h3>{previewData.display_name || 'Display Name'}</h3>
//               {previewData.title && <h4>{previewData.title}</h4>}
              
//               {previewData.bio && 
//                 <p className="bio-text">{previewData.bio}</p>
//               }
              
//               {/* Contact Buttons Section */}
//               <div className="contact-buttons">
//                 {previewData.email && (
//                   <div className="contact-button">
//                     <span>Email</span>
//                   </div>
//                 )}
//                 {previewData.contact?.phone && (
//                   <div className="contact-button">
//                     <span>Phone</span>
//                   </div>
//                 )}
//                 {previewData.website && (
//                   <div className="contact-button">
//                     <span>Website</span>
//                   </div>
//                 )}
//               </div>

//               {previewData.slug && (
//                 <div className="qr-code-container">
//                   <ProfileQRCode 
//                     slug={previewData.slug} 
//                     size={80}
//                     baseUrl={formatQrCodeBaseUrl(previewData.slug, process.env.NODE_ENV)}
//                   />
//                 </div>
//               )}
              
//               {/* Kinvo Branding Section - Now INSIDE the phone screen */}
//               <div className="kinvo-branding">
//                 <div className="brand-text">Kinvo</div>
//                 <div className="profile-url">
//                   <span>{formatProfileUrl(previewData.slug || 'profile-name', false)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </PreviewContainer>
//         </div>
//         </StyledProfileEditor>
//         );
//         };

// export default ProfileEditor;


// new below 

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useAuth } from '../../../auth/context/AuthContext';
import { BusinessCardService } from "../../../businessCards/services/businessCardServices";
import ProfileQRCode from '../../../qrCode/components/ProfileQRCode';
import { StyledProfileEditor, PreviewContainer, EditorContainer, SlugLinkContainer, ErrorToast, CardSelector } from './styles';
// Import the formatters
import { cleanImageUrl, formatPhotoUrl, getUserFriendlyError, isValidSlugFormat, formatProfileUrl, formatQrCodeBaseUrl } from '../../../../library/utils/formatters';

const DEFAULT_AVATAR = 'https://api.dicebear.com/6.x/personas/svg?seed=dude';
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const VALID_TYPES = ['image/jpeg', 'image/png'];
const maxPossibleCards = 25; // Maximum cards allowed on highest tier

// Profile Image component updated to use imported formatters
const ProfileImage = memo(({ isPreview, previewUrl, businessCard, savedPreviewUrl }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  
  const getDisplayImageUrl = useCallback(() => {
    if (savedPreviewUrl) {
      return savedPreviewUrl;
    }
    
    if (businessCard?.photo_url) {
      return cleanImageUrl(businessCard.photo_url);
    }
    
    return DEFAULT_AVATAR;
  }, [savedPreviewUrl, businessCard?.photo_url]);
  
  useEffect(() => {
    setLocalLoading(true);
    setRetryCount(0);
    
    // Use different image source logic based on whether this is for the form or preview
    const displayUrl = isPreview 
      ? getDisplayImageUrl() 
      : (previewUrl || (businessCard?.photo_url ? cleanImageUrl(businessCard.photo_url) : DEFAULT_AVATAR));
    
    if (displayUrl.startsWith('blob:')) {
      setImgSrc(displayUrl);
    } else {
      setImgSrc(formatPhotoUrl(displayUrl));
    }
  }, [isPreview, previewUrl, getDisplayImageUrl, businessCard]);

  const handleImageError = (e) => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        if (imgSrc.startsWith('blob:')) {
          setRetryCount(prevCount => prevCount + 1);
        } else {
          setImgSrc(formatPhotoUrl(cleanImageUrl(imgSrc)));
          setRetryCount(prevCount => prevCount + 1);
        }
      }, 500);
    } else {
      setLocalLoading(false);
      if (!e.target.src.includes('dicebear')) {
        e.target.src = DEFAULT_AVATAR;
      }
    }
  };

  return (
    <div className="image-wrapper">
      {localLoading && <div className="loading-spinner">Loading...</div>}
      <img 
        src={imgSrc} 
        alt="Profile"
        onLoad={() => {
          setLocalLoading(false);
        }}
        onError={handleImageError}
        style={{ 
          opacity: localLoading ? 0.5 : 1,
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
});

// Company Logo component updated to use imported formatters
const CompanyLogo = memo(({ previewUrl, businessCard, savedPreviewUrl }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [localLoading, setLocalLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  
  useEffect(() => {
    setLocalLoading(true);
    setRetryCount(0);
    
    const displayUrl = previewUrl || 
      (businessCard?.company_logo_url ? cleanImageUrl(businessCard.company_logo_url) : '');
    
    if (!displayUrl) {
      setLocalLoading(false);
      setImgSrc('');
      return;
    }
    
    if (displayUrl.startsWith('blob:')) {
      setImgSrc(displayUrl);
    } else {
      setImgSrc(formatPhotoUrl(displayUrl));
    }
  }, [previewUrl, businessCard]);

  const handleImageError = (e) => {
    if (retryCount < maxRetries) {
      setTimeout(() => {
        if (imgSrc.startsWith('blob:')) {
          setRetryCount(prevCount => prevCount + 1);
        } else {
          setImgSrc(formatPhotoUrl(cleanImageUrl(imgSrc)));
          setRetryCount(prevCount => prevCount + 1);
        }
      }, 500);
    } else {
      setLocalLoading(false);
      // No default fallback for company logo
    }
  };

  if (!imgSrc) {
    return null; // Don't render anything if no logo
  }

  return (
    <div className="image-wrapper company-logo-wrapper">
      {localLoading && <div className="loading-spinner">Loading...</div>}
      <img 
        src={imgSrc} 
        alt="Company Logo"
        onLoad={() => {
          setLocalLoading(false);
        }}
        onError={handleImageError}
        style={{ 
          opacity: localLoading ? 0.5 : 1,
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
});

ProfileImage.displayName = 'ProfileImage';
CompanyLogo.displayName = 'CompanyLogo';

const ProfileEditor = () => {
  const { user, businessCards, error: authError, updateBusinessCard, isLoading, userSubscription } = useAuth();
  
  // Keep track of the currently selected card
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  
  // State for displaying subscription information
  const [cardLimit, setCardLimit] = useState(1);
  const [cardsRemaining, setCardsRemaining] = useState(0); 
  
  // Fix 1: Use useRef instead of the non-standard useCallback implementation
  const photoInputRef = useRef(null);
  const companyLogoInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: '',
    company_logo_url: '',
    email: '',
    website: '',
    contact: {},
    is_primary: false
  });
  
  // Separate state for the preview that only updates after saving
  const [previewData, setPreviewData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: '',
    company_logo_url: '',
    email: '',
    website: '',
    contact: {},
    is_primary: false
  });
  
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [savedPreviewUrl, setSavedPreviewUrl] = useState('');
  
  // New state for company logo
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoPreviewUrl, setCompanyLogoPreviewUrl] = useState('');
  const [savedCompanyLogoUrl, setSavedCompanyLogoUrl] = useState('');
  
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fixed unused variable warning
  const [isImageLoading] = useState(false);
  const [originalFormData, setOriginalFormData] = useState({
    display_name: '',
    slug: '',
    photo_url: '',
    title: '',
    bio: '',
    company_logo_url: '',
    email: '',
    website: '',
    contact: {},
    is_primary: false
  });
  
  // New state for error toast visibility
  const [showErrorToast, setShowErrorToast] = useState(false);
  
  // State for the "create new card" mode
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Set up subscription limits based on user's plan
  useEffect(() => {
    if (userSubscription) {
      const tier = userSubscription.tier || 'free';
      
      // Set card limit based on subscription tier
      switch (tier) {
        case 'premium':
          setCardLimit(5);
          break;
        case 'professional':
          setCardLimit(10);
          break;
        case 'enterprise':
          setCardLimit(25);
          break;
        case 'free':
        default:
          setCardLimit(1);
      }
      
      // Calculate remaining cards
      if (businessCards) {
        const remaining = Math.max(0, cardLimit - businessCards.length);
        setCardsRemaining(remaining);
      }
    }
  }, [userSubscription, businessCards, cardLimit]);
  
  // Handle card selection and loading data
  useEffect(() => {
    if (businessCards && businessCards.length > 0) {
      // Default to primary card if no card is selected
      if (!selectedCardId) {
        const primaryCard = businessCards.find(card => card.is_primary) || businessCards[0];
        setSelectedCardId(primaryCard.id);
        setCurrentCard(primaryCard);
      } else {
        const card = businessCards.find(card => card.id === selectedCardId);
        if (card) {
          setCurrentCard(card);
        }
      }
      
      // Set active card based on activeCardIndex
      if (businessCards[activeCardIndex]) {
        setActiveCard(businessCards[activeCardIndex]);
      }
    } else if (businessCards && businessCards.length === 0) {
      // If there are no cards, go into creation mode
      setIsCreatingNew(true);
      setCurrentCard(null);
      setActiveCard(null);
    }
  }, [businessCards, selectedCardId, activeCardIndex]);

  // Update form data when current card changes
  useEffect(() => {
    if (currentCard) {
      const newFormData = {
        display_name: currentCard.display_name || user?.full_name || '',
        slug: currentCard.slug || '',
        photo_url: cleanImageUrl(currentCard.photo_url) || '',
        title: currentCard.title || '',
        bio: currentCard.bio || '',
        company_logo_url: cleanImageUrl(currentCard.company_logo_url) || '',
        email: currentCard.email || user?.email || '',
        website: currentCard.website || '',
        contact: currentCard.contact || {},
        is_primary: currentCard.is_primary || false  
      };
      
      setFormData(newFormData);
      setPreviewData(newFormData); 
      setOriginalFormData(newFormData);
      setSlugAvailable(true);
      
      if (currentCard.photo_url) {
        const cleanUrl = cleanImageUrl(currentCard.photo_url);
        setPreviewUrl(cleanUrl);
        setSavedPreviewUrl(cleanUrl);
      } else {
        setPreviewUrl('');
        setSavedPreviewUrl('');
      }
      
      if (currentCard.company_logo_url) {
        const cleanLogoUrl = cleanImageUrl(currentCard.company_logo_url);
        setCompanyLogoPreviewUrl(cleanLogoUrl);
        setSavedCompanyLogoUrl(cleanLogoUrl);
      } else {
        setCompanyLogoPreviewUrl('');
        setSavedCompanyLogoUrl('');
      }
    } else if (isCreatingNew) {
      // If creating a new card, initialize with empty values
      const newFormData = {
        display_name: user?.full_name || '',
        slug: '',
        photo_url: '',
        title: '',
        bio: '',
        company_logo_url: '',
        email: user?.email || '',
        website: '',
        contact: {},
        is_primary: businessCards?.length === 0 || false 
      };
      
      setFormData(newFormData);
      setPreviewData(newFormData);
      setOriginalFormData(newFormData);
      setPreviewUrl('');
      setSavedPreviewUrl('');
      setCompanyLogoPreviewUrl('');
      setSavedCompanyLogoUrl('');
    }
  }, [currentCard, user, isCreatingNew, businessCards]);

  // Effect to show error toast when error changes
  useEffect(() => {
    if (submitError || authError) {
      setShowErrorToast(true);
      
      // Auto hide after 5 seconds
      const timer = setTimeout(() => {
        setShowErrorToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [submitError, authError]);

  // Change handler for card selection 
  const handleCardChange = (e) => {
    const cardId = Number(e.target.value);
    if (cardId === -1) {
      // Special value for "Create New Card"
      setIsCreatingNew(true);
      setCurrentCard(null);
      setSelectedCardId(null);
    } else {
      setIsCreatingNew(false);
      setSelectedCardId(cardId);
    }
  };

  // Fix 2: Simplified handlePencilClick to directly access the ref 
  const handlePencilClick = (inputRef) => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const copyToClipboard = (slug) => {
    navigator.clipboard.writeText(formatProfileUrl(slug, true))
      .then(() => {
        // Show a temporary success message
        const copySuccess = document.getElementById('copy-success');
        copySuccess.style.opacity = '1';
        setTimeout(() => {
          copySuccess.style.opacity = '0';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy URL to clipboard');
      });
  };

  // Modified handleInputChange to use a debounced slug validation
  const handleInputChange = useCallback(async (e) => {
    const { name, value } = e.target;
    
    // Clear previous errors
    setSubmitError(null);
    
    // Special validation for slug
    if (name === 'slug') {
      if (value && !isValidSlugFormat(value)) {
        setSubmitError('Your profile name can only contain letters, numbers, and hyphens.');
        setSlugAvailable(false);
        
        // Still update the form data to show what the user typed
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        return;
      }
    }
        
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    // Only check slug availability if it's different from current slug
    if (name === 'slug' && value.trim()) {
      // Skip validation if the slug is unchanged from user's current slug
      if (currentCard && value === currentCard.slug) {
        setSlugAvailable(true); // User's own slug is always "available" to them
        return;
      }
      
      try {
        const result = await BusinessCardService.checkSlugAvailability(value);
        setSlugAvailable(result.available);
        
        if (!result.available) {
          setSubmitError('This profile name is already being used by someone else. Please choose another one.');
        }
      } catch (error) {
        setSlugAvailable(false);
        setSubmitError('We couldn\'t check if this profile name is available. Please try again.');
      }
    }
  }, [currentCard]);

  const handlePrimaryToggle = (e) => {
    setFormData(prev => ({
      ...prev,
      is_primary: e.target.checked
    }));
  };

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      setSubmitError('Please upload a JPG or PNG image file for your profile photo.');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setSubmitError('Your profile photo is too large. Please choose an image under 5MB.');
      return;
    }

    // Clean up previous blob URL if exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewFile(file);
    setPreviewUrl(localPreviewUrl);
    setSubmitError(null);
  }, [previewUrl]);

  // New handler for company logo uploads
  const handleCompanyLogoChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      setSubmitError('Please upload a JPG or PNG image file for your company logo.');
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setSubmitError('Your company logo is too large. Please choose an image under 5MB.');
      return;
    }

    // Clean up previous blob URL if exists
    if (companyLogoPreviewUrl && companyLogoPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(companyLogoPreviewUrl);
    }

    const localPreviewUrl = URL.createObjectURL(file);
    setCompanyLogoFile(file);
    setCompanyLogoPreviewUrl(localPreviewUrl);
    setSubmitError(null);
  }, [companyLogoPreviewUrl]);

  // Add missing handlers
  const handleAddNewCard = () => {
    // Check if we've reached the card limit
    if (businessCards && businessCards.length >= cardLimit) {
      setSubmitError(`You've reached your limit of ${cardLimit} business cards. Please upgrade your plan or delete an existing card.`);
      setShowErrorToast(true);
      return;
    }
    
    setIsCreatingNew(true);
    setSelectedCardId(null);
    setCurrentCard(null);
    setActiveCard(null);
  };

  const handleSetPrimaryCard = async () => {
    if (!activeCard) return;
    
    try {
      setIsSubmitting(true);
      await BusinessCardService.setPrimaryBusinessCard(activeCard.id);
      
      // Update the local state
      if (businessCards) {
        const updatedCards = businessCards.map(card => ({
          ...card,
          is_primary: card.id === activeCard.id
        }));
        
        // You'll need to update the business cards in your auth context here
        // updateBusinessCards(updatedCards);
        
        // Update the active card
        setActiveCard({
          ...activeCard,
          is_primary: true
        });
      }
      
      setIsSubmitting(false);
      alert('Primary card updated successfully!');
    } catch (error) {
      setSubmitError('Failed to set primary card. Please try again.');
      setShowErrorToast(true);
      setIsSubmitting(false);
    }
  };

  const handleUpgradeClick = () => {
    // Redirect to upgrade page or open a modal
    window.location.href = '/account/upgrade';
  };

  // Close error toast handler
  const handleCloseErrorToast = () => {
    setShowErrorToast(false);
  };

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      if (companyLogoPreviewUrl && companyLogoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(companyLogoPreviewUrl);
      }
    };
  }, [previewUrl, companyLogoPreviewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsSubmitting(true);
    setSubmitError(null);
  
    try {
      const updateFormData = new FormData();
      
      // Include all required fields when creating a new card
      if (isCreatingNew) {
        updateFormData.append('display_name', formData.display_name.trim());
        updateFormData.append('slug', formData.slug.trim());
        updateFormData.append('is_primary', formData.is_primary);
        
        // For new cards, include these fields if they exist
        if (formData.title.trim()) {
          updateFormData.append('title', formData.title.trim());
        }
        
        if (formData.bio.trim()) {
          updateFormData.append('bio', formData.bio.trim());
        }
        
        if (formData.email) {
          updateFormData.append('email', formData.email);
        }
        
        if (formData.website) {
          updateFormData.append('website', formData.website);
        }
        
        // Handle contact object
        if (Object.keys(formData.contact).length > 0) {
          updateFormData.append('contact', JSON.stringify(formData.contact));
        }
        
        // Include photo if there's one
        if (previewFile) {
          updateFormData.append('photo', previewFile);
        }
        
        // Include company logo if there's one
        if (companyLogoFile) {
          updateFormData.append('company_logo', companyLogoFile);
        }
      } else {
        // Only include fields that have changed for updates
        if (formData.display_name.trim() !== originalFormData.display_name) {
          updateFormData.append('display_name', formData.display_name.trim());
        }
        
        // Include slug if it has changed - backend will validate
        if (formData.slug.trim() !== originalFormData.slug) {
          updateFormData.append('slug', formData.slug.trim());
        }
        
        if (formData.is_primary !== originalFormData.is_primary) {
          updateFormData.append('is_primary', formData.is_primary);
        }
        
        // Add the new fields to the form data
        if (formData.title.trim() !== originalFormData.title) {
          updateFormData.append('title', formData.title.trim());
        }
        
        if (formData.bio.trim() !== originalFormData.bio) {
          updateFormData.append('bio', formData.bio.trim());
        }

        // Add new contact fields
        if (formData.email !== originalFormData.email) {
          updateFormData.append('email', formData.email);
        }
        
        if (formData.website !== originalFormData.website) {
          updateFormData.append('website', formData.website);
        }
        
        // Handle contact object - only if it's changed
        if (JSON.stringify(formData.contact) !== JSON.stringify(originalFormData.contact)) {
          updateFormData.append('contact', JSON.stringify(formData.contact));
        }
        
        // Only include photo if there's a new one
        if (previewFile) {
          updateFormData.append('photo', previewFile);
        }

        // Add company logo if there's a new one
        if (companyLogoFile) {
          updateFormData.append('company_logo', companyLogoFile);
        }
      }

      let updatedCard;
      
      if (isCreatingNew) {
        // Check if user is at their card limit
        if (businessCards && businessCards.length >= cardLimit) {
          setSubmitError(`You've reached your limit of ${cardLimit} business cards. Please upgrade your plan or delete an existing card.`);
          setIsSubmitting(false);
          return;
        }
        
        // Create a new business card
        updatedCard = await BusinessCardService.createBusinessCard(updateFormData);
        
        // Update the create mode
        setIsCreatingNew(false);
        setSelectedCardId(updatedCard.id);
      } else {
        // Update an existing card
        updatedCard = await BusinessCardService.updateBusinessCard(selectedCardId, updateFormData);
      }
      
      // Update the card in the Auth context
      updateBusinessCard(updatedCard);
      
      if (updatedCard) {
        const updatedFormData = {
          display_name: updatedCard.display_name || originalFormData.display_name,
          slug: updatedCard.slug || originalFormData.slug,
          photo_url: cleanImageUrl(updatedCard.photo_url) || originalFormData.photo_url,
          title: updatedCard.title || originalFormData.title,
          bio: updatedCard.bio || originalFormData.bio,
          company_logo_url: cleanImageUrl(updatedCard.company_logo_url) || originalFormData.company_logo_url,
          email: updatedCard.email || originalFormData.email,
          website: updatedCard.website || originalFormData.website,
          contact: updatedCard.contact || originalFormData.contact,
          is_primary: updatedCard.is_primary || originalFormData.is_primary
        };
        
        // Update original form data with the new values
        setOriginalFormData(updatedFormData);
        
        // Also update current form data
        setFormData(prev => ({
          ...prev,
          ...updatedFormData
        }));
        
        // IMPORTANT: Only now update the preview data
        setPreviewData(updatedFormData);
        
        // Update the saved preview URL if there was a new photo
        if (previewFile) {
          setSavedPreviewUrl(previewUrl);
          setPreviewFile(null);
        } else if (updatedCard.photo_url) {
          setSavedPreviewUrl(cleanImageUrl(updatedCard.photo_url));
        }
        
        // Update the saved company logo URL if there was a new one
        if (companyLogoFile) {
          setSavedCompanyLogoUrl(companyLogoPreviewUrl);
          setCompanyLogoFile(null);
        } else if (updatedCard.company_logo_url) {
          setSavedCompanyLogoUrl(cleanImageUrl(updatedCard.company_logo_url));
        }
        
        // More friendly success message
        alert(isCreatingNew ? 'Your business card has been created successfully!' : 'Your business card has been updated successfully!');
        
        // Reset the creation state
        setIsCreatingNew(false);
      }

      setIsSubmitting(false);
  
    } catch (error) {
      console.error('Business card update error:', error); // Log the full error for debugging
      // Extract error message, handling different error object structures
      let errorMessage = 'Unknown error';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.response && error.response.data) {
        // Handle API error responses
        errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || JSON.stringify(error.response.data);
      }
      
      // Convert to user-friendly message and set in state
      setSubmitError(getUserFriendlyError(errorMessage));
      setShowErrorToast(true); // Explicitly show the toast

      setIsSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    // Check if we've reached the card limit
    if (businessCards && businessCards.length >= cardLimit) {
      setSubmitError(`You've reached your limit of ${cardLimit} business cards. Please upgrade your plan or delete an existing card.`);
      setShowErrorToast(true);
      return;
    }
    
    setIsCreatingNew(true);
    setSelectedCardId(null);
    setCurrentCard(null);
  };

  const handleDeleteCard = async () => {
    if (!selectedCardId) return;
    
    if (window.confirm('Are you sure you want to delete this business card? This action cannot be undone.')) {
      try {
        await BusinessCardService.deleteBusinessCard(selectedCardId);
        
        // Select another card if available, or go to create mode
        if (businessCards.length > 1) {
          const remainingCards = businessCards.filter(card => card.id !== selectedCardId);
          setSelectedCardId(remainingCards[0].id);
        } else {
          setIsCreatingNew(true);
          setSelectedCardId(null);
        }
        
        // Success message
        alert('Business card deleted successfully.');
      } catch (error) {
        setSubmitError('Failed to delete the business card. Please try again.');
        setShowErrorToast(true);
      }
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <div>Loading your profile...</div>;
  }
  
  return (
    <StyledProfileEditor>
      {/* Error Toast Component with user-friendly messages */}
      {showErrorToast && (authError || submitError) && (
        <ErrorToast>
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <p>{authError ? getUserFriendlyError(authError) : submitError}</p>
          </div>
          <button className="close-button" onClick={handleCloseErrorToast}>×</button>
        </ErrorToast>
      )}
      
      {/* Card Selection Controls */}
      <CardSelector className="card-controls">
        <h2>Your Business Cards</h2>
        <div className="card-selector">
          {businessCards && businessCards.map((card, index) => (
            <button 
              key={card.id} 
              className={`card-select-button ${activeCardIndex === index ? 'active' : ''}`}
              onClick={() => setActiveCardIndex(index)}
            >
              {card.display_name || 'Unnamed Card'} {card.is_primary && '(Primary)'}
            </button>
          ))}
          {businessCards && businessCards.length < cardLimit && (
            <button 
              className="card-add-button" 
              onClick={handleAddNewCard}
              disabled={isSubmitting}
            >
              + Add Card {businessCards && businessCards.length > 0 && `(${businessCards.length}/${cardLimit})`}
            </button>
          )}
        </div>
        {businessCards && businessCards.length > 0 && activeCard && (
          <div className="card-actions">
            {!activeCard.is_primary && (
              <button 
                className="set-primary-button" 
                onClick={handleSetPrimaryCard}
                disabled={isSubmitting}
              >
                Set as Primary
              </button>
              )}
              <button 
                className="delete-button" 
                onClick={handleDeleteCard}
                disabled={isSubmitting}
              >
                Delete Card
              </button>
            </div>
          )}
        </CardSelector>
        
        <div className="editor-preview-container">
          {/* Preview Container */}
          <PreviewContainer>
            <h2>Preview</h2>
            <div className="card-preview">
              <div className="profile-header">
                <ProfileImage 
                  isPreview={true}
                  previewUrl={previewUrl}
                  businessCard={currentCard}
                  savedPreviewUrl={savedPreviewUrl}
                />
                <div className="header-info">
                  <h3>{previewData.display_name || 'Your Name'}</h3>
                  <p className="title">{previewData.title || 'Your Title'}</p>
                </div>
              </div>
              
              {/* Company Logo */}
              {savedCompanyLogoUrl && (
                <CompanyLogo 
                  previewUrl={companyLogoPreviewUrl}
                  businessCard={currentCard}
                  savedPreviewUrl={savedCompanyLogoUrl}
                />
              )}
              
              <div className="profile-bio">
                <p>{previewData.bio || 'Your professional bio will appear here.'}</p>
              </div>
              
              <div className="contact-info">
                {previewData.email && (
                  <div className="contact-item">
                    <span className="icon">✉️</span>
                    <span>{previewData.email}</span>
                  </div>
                )}
                {previewData.website && (
                  <div className="contact-item">
                    <span className="icon">🌐</span>
                    <span>{previewData.website}</span>
                  </div>
                )}
                {previewData.contact && Object.entries(previewData.contact).map(([key, value]) => (
                  value && (
                    <div className="contact-item" key={key}>
                      <span className="icon">{key === 'phone' ? '📱' : key === 'linkedin' ? 'in' : key.charAt(0).toUpperCase()}</span>
                      <span>{value}</span>
                    </div>
                  )
                ))}
              </div>
              
              {/* QR Code Preview */}
              {previewData.slug && (
                <div className="qr-preview">
                  <h4>QR Code</h4>
                  <div className="qr-container">
                    <ProfileQRCode slug={previewData.slug} baseUrl={formatQrCodeBaseUrl()} />
                  </div>
                  <SlugLinkContainer>
                    <span className="profile-url">{formatProfileUrl(previewData.slug)}</span>
                    <button 
                      className="copy-button"
                      onClick={() => copyToClipboard(previewData.slug)}
                    >
                      📋 Copy
                    </button>
                    <span id="copy-success" className="copy-success">Copied!</span>
                  </SlugLinkContainer>
                </div>
              )}
            </div>
          </PreviewContainer>
          
          {/* Editor Container */}
          <EditorContainer>
            <h2>{isCreatingNew ? 'Create New Business Card' : 'Edit Business Card'}</h2>
            
            {/* Subscription information */}
            {cardsRemaining < 3 && businessCards && businessCards.length > 0 && (
              <div className="subscription-info">
                <p>
                  {cardsRemaining === 0 
                    ? `You've reached your limit of ${cardLimit} business cards.` 
                    : `You can create ${cardsRemaining} more business card${cardsRemaining !== 1 ? 's' : ''}.`
                  }
                  {cardsRemaining === 0 && (
                    <button className="upgrade-button" onClick={handleUpgradeClick}>
                      Upgrade Plan
                    </button>
                  )}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="displayName">Name</label>
                <input
                  id="displayName"
                  name="display_name"
                  type="text"
                  value={formData.display_name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="slug">
                  Profile URL 
                  {formData.slug && slugAvailable && (
                    <span className="slug-available">✓ Available</span>
                  )}
                  {formData.slug && !slugAvailable && (
                    <span className="slug-unavailable">✗ Unavailable</span>
                  )}
                </label>
                <div className="slug-input-container">
                  <span className="slug-prefix">{window.location.origin}/</span>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="your-name"
                    required
                    className={formData.slug && !slugAvailable ? 'invalid' : ''}
                  />
                </div>
                <p className="help-text">
                  This will be your public profile URL. Use only letters, numbers, and hyphens.
                </p>
              </div>
              
              <div className="form-group">
                <label>Profile Photo</label>
                <div className="photo-upload">
                  <div className="preview-wrapper">
                    <ProfileImage 
                      isPreview={false}
                      previewUrl={previewUrl}
                      businessCard={currentCard}
                      savedPreviewUrl={savedPreviewUrl}
                    />
                    <button 
                      type="button" 
                      className="edit-photo-button"
                      onClick={() => handlePencilClick(photoInputRef)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <p className="help-text">
                  Upload a professional photo (JPG or PNG, max 5MB)
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Your professional title"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Write a short professional bio"
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>Company Logo</label>
                <div className="photo-upload">
                  <div className="preview-wrapper">
                    <CompanyLogo 
                      previewUrl={companyLogoPreviewUrl}
                      businessCard={currentCard}
                      savedPreviewUrl={savedCompanyLogoUrl}
                    />
                    <button 
                      type="button" 
                      className="edit-photo-button"
                      onClick={() => handlePencilClick(companyLogoInputRef)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                  <input
                    ref={companyLogoInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleCompanyLogoChange}
                    style={{ display: 'none' }}
                  />
                </div>
                <p className="help-text">
                  Upload your company logo (JPG or PNG, max 5MB)
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://your-website.com"
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handlePrimaryToggle}
                  />
                  Set as primary business card
                </label>
                <p className="help-text">
                  Your primary card will be shown by default when someone visits your profile.
                </p>
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting || (formData.slug && !slugAvailable)}
                >
                  {isSubmitting ? 'Saving...' : (isCreatingNew ? 'Create Card' : 'Save Changes')}
                </button>
                
                {!isCreatingNew && (
                  <button
                    type="button"
                    className="create-new-button"
                    onClick={handleCreateNew}
                    disabled={isSubmitting || (businessCards && businessCards.length >= cardLimit)}
                  >
                    Create New Card
                  </button>
                )}
              </div>
            </form>
          </EditorContainer>
        </div>
      </StyledProfileEditor>
    );
  };
  
  export default ProfileEditor;