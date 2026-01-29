'use client';

import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

/**
 * Hook for uploading images to Cloudinary via signed uploads
 * Returns upload function, loading state, progress, and result URL
 */
export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Upload a file to Cloudinary
   * @param {File} file - The file to upload
   * @returns {Promise<{url: string, publicId: string}>} - The uploaded image URL and public ID
   */
  const upload = async (file) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Get signature from backend
      const signatureResponse = await fetch(`${API_BASE_URL}/upload/signature`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const { signature, timestamp, folder, cloudName, apiKey } = await signatureResponse.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('folder', folder);
      formData.append('api_key', apiKey);
      formData.append('transformation', 'c_limit,w_1200,h_1200,q_auto:good');

      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve({
              url: response.secure_url,
              publicId: response.public_id,
            });
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        xhr.send(formData);
      });

      const result = await uploadPromise;
      setUploading(false);
      setProgress(100);
      return result;
    } catch (err) {
      setError(err.message || 'Upload failed');
      setUploading(false);
      throw err;
    }
  };

  return {
    upload,
    uploading,
    progress,
    error,
  };
}
