import React, { useState, ChangeEvent } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import axiosInstance from '@/service/axiosInstance';

interface UploadModalProps {
  open: boolean;
  handleClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ open, handleClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axiosInstance.post('/cloud/image', formData, {
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
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setImageUrl('');
      }}
    >
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
