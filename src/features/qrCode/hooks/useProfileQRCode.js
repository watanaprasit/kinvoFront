import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../library/constants/routes'; // Assuming this is available

export const useProfileQRCode = (baseUrl = 'http://localhost:5173/') => {
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth token consistent with ProfileService
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('access_token');
  }, []);

  // Get profile URL
  const getProfileUrl = useCallback((slug) => {
    return `${baseUrl}${slug}`;
  }, [baseUrl]);
  
  // Fetch QR code from API
  const fetchQRCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const token = getAuthToken();
    
    if (!token) {
      console.error('No authentication token found');
      setError('Authentication required');
      setIsLoading(false);
      return Promise.reject('Authentication required');
    }
    
    try {
      // Updated endpoint path to match what the server expects
      const response = await axios.get(`${API_ROUTES.BASE_URL}/api/v1/users/me/qrcode`, {
        params: {
          base_url: baseUrl
        },
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setQrCodeData(response.data.qr_data);
        setQrCodeImage(response.data.qr_image);
      }
      setIsLoading(false);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch QR code:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch QR code');
      setIsLoading(false);
      throw err;
    }
  }, [baseUrl, getAuthToken]);
  
  // Update QR code
  const updateQRCode = useCallback(async (newQRData) => {
    setIsLoading(true);
    setError(null);
    
    const token = getAuthToken();
    
    if (!token) {
      console.error('No authentication token found');
      setError('Authentication required');
      setIsLoading(false);
      return Promise.reject('Authentication required');
    }
    
    try {
      const response = await axios.put(
        `${API_ROUTES.BASE_URL}/api/v1/users/me/qrcode`, 
        { qr_data: newQRData },
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setQrCodeData(response.data.qr_data);
        setQrCodeImage(response.data.qr_image);
      }
      setIsLoading(false);
      return response.data;
    } catch (err) {
      console.error('Error updating QR code:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to update QR code');
      setIsLoading(false);
      throw err;
    }
  }, [getAuthToken]);
  
  // Download QR code remains the same
  const downloadQRCode = useCallback((slug) => {
    if (!qrCodeImage) return Promise.reject('No QR code available');
    
    try {
      const downloadLink = document.createElement('a');
      downloadLink.href = qrCodeImage.startsWith('data:') 
        ? qrCodeImage 
        : `data:image/png;base64,${qrCodeImage}`;
      downloadLink.download = `profile-${slug}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      return Promise.resolve(true);
    } catch (err) {
      console.error('Error downloading QR code:', err);
      return Promise.reject(err);
    }
  }, [qrCodeImage]);

  return {
    qrCodeData,
    qrCodeImage,
    isLoading,
    error,
    getProfileUrl,
    fetchQRCode,
    updateQRCode,
    downloadQRCode
  };
};