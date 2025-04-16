import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeContainer } from './styles';
import { API_ROUTES } from '../../../../library/constants/routes';

const ProfileQRCode = ({ slug, size = 120, downloadable = true, baseUrl = 'https://kinvo.com/' }) => {
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch QR code from API using authenticated endpoint
  useEffect(() => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);
    
    // Use the correct key to get the token
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('Authentication token not found');
      setError('Authentication required. Please login again.');
      setIsLoading(false);
      return;
    }
    
    // The API expects an authenticated request
    axios.get(`${API_ROUTES.QR_CODE.GET}`, {
      params: {
        base_url: baseUrl 
      },
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}` // Now using the correct token key
      }
    })
    .then(response => {
      if (response.data && response.data.qr_image) {
        setQrCodeImage(response.data.qr_image);
      } else {
        throw new Error('Invalid QR code response');
      }
      setIsLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch QR code:', err);
      // Better error handling
      if (err.response) {
        if (err.response.status === 401) {
          setError('Your session has expired. Please login again.');
        } else {
          setError(`Error ${err.response.status}: ${err.response.data?.detail || 'Failed to load QR code'}`);
        }
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Failed to load QR code');
      }
      setIsLoading(false);
    });
  }, [slug, baseUrl]);

  // Download the QR code image
  const downloadQRCode = () => {
    if (!qrCodeImage) return;
    
    try {
      // For a data URI (base64 image)
      const downloadLink = document.createElement('a');
      downloadLink.href = qrCodeImage.startsWith('data:') 
        ? qrCodeImage 
        : `data:image/png;base64,${qrCodeImage}`;
      downloadLink.download = `kinvo-${slug}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Failed to download QR code:', err);
      setError('Failed to download QR code');
    }
  };

  if (!slug) return null;

  return (
    <QRCodeContainer>
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">Loading QR Code...</div>
        </div>
      ) : error ? (
        <div className="error-message">
          {error}
          {(error.includes('login') || error.includes('session')) && (
            <button 
              className="login-button" 
              onClick={() => window.location.href = '/login'}
              style={{ marginTop: '10px', padding: '5px 10px' }}
            >
              Login Again
            </button>
          )}
        </div>
      ) : (
        <>
          <img 
            src={qrCodeImage}
            alt={`QR Code for ${slug}`}
            width={size}
            height={size}
          />

        </>
      )}
    </QRCodeContainer>
  );
};

export default ProfileQRCode;