import React, { useState, useEffect } from 'react';
import { Button as MuiButton, Card, CardContent, CardMedia, Typography, CircularProgress, IconButton } from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import AudioFileIcon from '@mui/icons-material/Audiotrack';
import axiosInstance from '@/service/axiosInstance';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCallback } from 'react';


interface FileType {
  id: number;
  type: string;
  url: string;
  public_id: string;
}

const FileInput = () => {
  const {flagId} = useParams();
  const [files, setFiles] =  useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async() => {
    setLoading(true);
    console.log(flagId)
    await axiosInstance.get(`/cloud/getByTask/${flagId}`)
    .then((response) => {
      setFiles(response.data.data);
      // else setFiles([])
      })
      .catch(error => console.error('Error fetching files:', error))
      .finally(() => setLoading(false));
  }, [flagId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      toast.error('No files selected');
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('taskFlag', flagId as string);

    setLoading(true); // Устанавливаем загрузку на true до начала всех загрузок

    try {
      const res = await axiosInstance.post('/cloud/upload-multiply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status >= 300) {
        toast.error('Files do not uploaded, retry please');
        setLoading(false);
        return;
      }

      fetchFiles();
    } catch (error) {
      toast.error('An error occurred while uploading the files');
    } finally {
      setLoading(false);
    }
  };
  

  const filePreview = (file: FileType) => {
    if (file.type === 'image') {
      return <CardMedia 
          component="img"
          image={file.url}
          alt={file.public_id}
          style={{ height: 200, width: 200, objectFit: 'cover' }} 
      />;
    } else if (file.type === 'video'){
      return <AudioFileIcon style={{ fontSize: 64, height: 200, width: 200 }}/>;
    } else {
      return <UploadIcon style={{ fontSize: 64, height: 200, width: 200 }} />;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await axiosInstance.delete(`/cloud/${id}`);
      if (res.status >= 300) {
        toast.error('Failed to delete file, please try again.');
      } else {
        toast.success('File deleted successfully.');
        // Удаляем файл из массива files
        setFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));
      }
    } catch (error) {
      toast.error('An error occurred while deleting the file.');
    }
  };

  return (
    <div className="p-4">
      <input
        accept="image/*,audio/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        name='files'
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <MuiButton variant="contained" component="span" className="mb-2 bg-blue-500 hover:bg-blue-700 text-white">
          Upload Files
        </MuiButton>
      </label>
      <div className="flex overflow-x-auto py-2">
        {loading && <CircularProgress />}
        {files.map((file: FileType, index) => (
          <Card key={index} className="mx-2" style={{ width: 200, position: 'relative' }}>
            {filePreview(file)}
            <IconButton
              onClick={() => handleDelete(file.id)}
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
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {file.public_id}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FileInput;

