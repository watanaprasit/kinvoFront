import { useState, useEffect } from 'react';
import axios from 'axios';
import { QRCodeContainer } from './styles';

const ProfileQRCode = ({ slug, size = 120, downloadable = true, baseUrl = 'https://kinvo.com/' }) => {
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = 'http://127.0.0.1:8000'; // Your FastAPI URL

  // Fetch QR code from API using authenticated endpoint
  useEffect(() => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);
    
    // The API expects an authenticated request
    axios.get(`${API_URL}/me/qrcode`, {
      params: {
        base_url: baseUrl // Optional parameter your endpoint accepts
      },
      withCredentials: true, // Important for sending authentication cookies
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust according to your auth method
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
      setError('Failed to load QR code');
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
        <div className="error-message">{error}</div>
      ) : (
        <>
          <img 
            src={qrCodeImage}
            alt={`QR Code for ${slug}`}
            width={size}
            height={size}
          />
          {downloadable && (
            <button 
              className="download-button" 
              onClick={downloadQRCode}
              aria-label="Download QR Code"
            >
              <span>↓</span> Download
            </button>
          )}
        </>
      )}
    </QRCodeContainer>
  );
};

export default ProfileQRCode;