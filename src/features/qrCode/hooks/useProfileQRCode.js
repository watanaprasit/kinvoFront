import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '../../../library/constants/routes';

export const useProfileQRCode = (baseUrl = 'http://localhost:5173/', slug = null) => {
  // States
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get auth token
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('access_token');
  }, []);

  // Get profile URL
  const getProfileUrl = useCallback((profileSlug) => {
    return `${baseUrl}${profileSlug || slug || ''}`;
  }, [baseUrl, slug]);
  
  // Fetch QR code from API - handles both authenticated and public routes
  const fetchQRCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      
      // If slug is provided, use the public endpoint
      if (slug) {
        const publicEndpoint = `${API_ROUTES.BASE_URL}//${slug}/qrcode`;
        response = await axios.get(publicEndpoint, {
          params: {
            base_url: baseUrl
          }
        });
      } else {
        // Use the authenticated endpoint
        const token = getAuthToken();
        
        if (!token) {
          console.error('No authentication token found');
          setError('Authentication required');
          setIsLoading(false);
          return Promise.reject('Authentication required');
        }
        
        const endpoint = API_ROUTES.QR_CODE?.GET || `${API_ROUTES.BASE_URL}/api/v1/users/me/qrcode`;
        
        response = await axios.get(endpoint, {
          params: {
            base_url: baseUrl
          },
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
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
  }, [baseUrl, getAuthToken, slug]);
  
  // Update QR code (authenticated only)
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
      const endpoint = API_ROUTES.QR_CODE?.UPDATE || `${API_ROUTES.BASE_URL}/api/v1/users/me/qrcode`;
      
      const response = await axios.put(
        endpoint,
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
  
  // Download QR code
  const downloadQRCode = useCallback((profileSlug) => {
    if (!qrCodeImage) return Promise.reject('No QR code available');
    
    try {
      const downloadLink = document.createElement('a');
      downloadLink.href = qrCodeImage.startsWith('data:')
        ? qrCodeImage
        : `data:image/png;base64,${qrCodeImage}`;
      downloadLink.download = `profile-${profileSlug || slug || 'qrcode'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      return Promise.resolve(true);
    } catch (err) {
      console.error('Error downloading QR code:', err);
      return Promise.reject(err);
    }
  }, [qrCodeImage, slug]);

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