// components/Layout.js
import React, { useState } from 'react';
import UploadModal from './UploadModal';
import { IconButton } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

function ButtonLayout({ children }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setModalOpen(true)} sx={{ position: 'fixed', top: 100, right: 50, bgcolor: 'black', color: 'white', borderRadius: '50%', zIndex: 1000 }}>
        <AddAPhotoIcon />
      </IconButton>
      <UploadModal open={modalOpen} handleClose={() => setModalOpen(false)} />
      <main>{children}</main>
    </>
  );
}

export default ButtonLayout;
