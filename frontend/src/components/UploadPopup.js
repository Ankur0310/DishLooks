import React, { useState } from 'react';
import axios from 'axios';
import '../styles/UploadPopup.css'; // Import the CSS file for styling

const UploadPopup = ({ restaurantId, togglePopup }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false); // To track upload state
  const [uploadSuccess, setUploadSuccess] = useState(false); // To track if upload was successful

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadSuccess(false); // Reset success status if a new file is selected
    setUploadStatus(''); // Reset any previous status
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file before uploading.');
      return;
    }

    setIsUploading(true); // Start uploading
    const formData = new FormData();
    formData.append('template', selectedFile);

    try {
      const response = await axios.post(`http://localhost:5000/api/restaurant/${restaurantId}/upload-template`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        setUploadStatus('Template uploaded successfully!');
        setUploadSuccess(true); // Set success to true
      } else {
        setUploadStatus('Error uploading template.');
      }
    } catch (error) {
      console.error('Error uploading template:', error);
      setUploadStatus('Error uploading template.');
    } finally {
      setIsUploading(false); // Stop uploading
    }
  };

  return (
    <div className="upload-popup">
      <div className="popup-content">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button className='upload-button' onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Template'}
        </button>

        {isUploading && (
          <div className="upload-status">
            <img src="/images/upload.png" alt="Uploading..." width="30" />
            <p>Uploading...</p>
          </div>
        )}

        {uploadSuccess && (
          <div className="upload-status">
            <img src="/images/success.png" alt="Success" width="30" />
            <p>Upload Successful!</p>
          </div>
        )}

        {uploadStatus && <p className="status-message">{uploadStatus}</p>}

        <button className="close-button" onClick={togglePopup}>Close</button>
      </div>
    </div>
  );
};

export default UploadPopup;
