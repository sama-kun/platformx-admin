import React, { useEffect, useState } from 'react';
import { Button as MuiButton, Card, CardMedia, CircularProgress, IconButton } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '@/service/axiosInstance';
import toast from 'react-hot-toast';

const ImageUpload = ({ courseId, initialImage }: any) => {
   // Лог для отладки
   console.log('Initial Image:', initialImage);
   const [image, setImage] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
 
   // Лог для отладки
   console.log('State Image:', image);
   useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }
  }, [initialImage]);
  const handleFileChange = async (event: { target: { files: any; }; }) => {
    const files = event.target.files;
    if (files.length > 1) {
      toast.error('You can only upload one file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);

    setLoading(true);

    try {
      const res = await axiosInstance.post('/cloud/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status >= 300) {
        toast.error('File not uploaded, please retry.');
        setLoading(false);
        return;
      }
      await axiosInstance.patch('course/' + courseId, { image: res.data.data.url });
      setImage(res.data.data.url);
    } catch (error) {
      toast.error('An error occurred while uploading the file.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.patch(`/course/${courseId}` , {
        image: '',
      });
      if (res.status >= 300) {
        toast.error('Failed to delete file, please try again.');
      } else {
        toast.success('File deleted successfully.');
        setImage(null);
      }
    } catch (error) {
      toast.error('An error occurred while deleting the file.');
    }
  };

  return (
    <div className="p-4">
      
      {!image ? (
        <>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            name='file'
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <MuiButton variant="contained" component="span" className="mb-2 bg-blue-500 hover:bg-blue-700 text-white">
              Upload File
            </MuiButton>
          </label>
        </>
      ) : (
        <Card className="mx-2" style={{ width: 200, position: 'relative' }}>
          <CardMedia
            component="img"
            image={image}
            alt="Uploaded file preview"
            style={{ height: 200, width: 200, objectFit: 'cover' }}
          />
          <IconButton
            onClick={handleDelete}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              zIndex: 1000,
              color: 'red',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              padding: '5px'
            }}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Card>
      )}
      {loading && <CircularProgress />}
      {/* {image && (
        <Card className="mx-2" style={{ width: 200, position: 'relative' }}>
          <CardMedia
            component="img"
            image={image}
            alt="Uploaded file preview"
            style={{ height: 200, width: 200, objectFit: 'cover' }}
          />
          <IconButton
            onClick={handleDelete}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              zIndex: 1000,
              color: 'red',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              padding: '5px'
            }}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Card>
      )} */}
    </div>
  );
};

export default ImageUpload;
