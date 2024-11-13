import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import {InfoOutlined} from '@mui/icons-material'; // Example icon, replace with desired one

export default function AppDrawer({ children, open, onClose, title = 'Drawer Title', Icon = InfoOutlined }) {
  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        transitionDuration={300} // Animation duration in ms
        sx={{
          width: "50vw",
          maxWidth: "50vw",
          display: "flex",
          flexDirection: "column",
          zIndex: 1300,
        }}
      >
        {/* Header with icon, title, and close button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: 'primary.main',
            color : 'white.main'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon sx={{ mr: 1 }} /> {/* Icon on the left */}
            <Typography variant="h6">{title}</Typography> {/* Title next to the icon */}
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon color="white" />
          </IconButton>
        </Box>

        {/* Drawer content */}
        <Box sx={{ padding: '16px', flex: 1 }}>
          {children}
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
