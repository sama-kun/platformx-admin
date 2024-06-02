import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import axiosInstance from '@/service/axiosInstance';

function UploadModal({ open, handleClose }) {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // setFile(selectedFile);
    const formData = new FormData();
    // formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axiosInstance.post('/cloud/image', {file: selectedFile}, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setImageUrl(response.data.data.url);  // Ensure this path matches the response structure
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imageUrl).then(() => {
      alert('URL copied to clipboard!');
    }, (err) => {
      console.error('Unable to copy text: ', err);
    });
  };

  return (
    <Modal open={open} onClose={() => {
      handleClose()
      setImageUrl('')
    }}>
      <Box sx={{ position: 'absolute', top: '10%', right: '10%', bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
        <input type="file" onChange={handleFileChange} disabled={loading} style={{ display: 'block', marginBottom: '20px' }} />
        {loading ? (
          <CircularProgress />
        ) : imageUrl ? (
          <>
            <TextField fullWidth value={imageUrl} variant="outlined" />
            <Button onClick={copyToClipboard} variant="contained" sx={{ mt: 2 }}>
              Copy URL
            </Button>
          </>
        ) : null}
      </Box>
    </Modal>
  );
}

export default UploadModal;
