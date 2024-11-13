import React, { useState } from 'react';
import { AppBar, Box, IconButton, MenuItem, Select } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import UserCard from './usercard';
// import LOGO from '../../assets/images/TransmodalBlackLogo.png';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from "../../config/theme";
import LOGO from '../../assets/images/tflLogo.png'

export default function TAppBar({ handleDrawerToggle }) {
  const [primaryColor, setPrimaryColor] = useState('#026de0'); // Default color
  const theme = getTheme(primaryColor); // Get the theme with updated primary color

  const handleColorChange = (event) => {
    setPrimaryColor(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: 'width 0.3s ease-in-out',
          backgroundColor: 'white.main',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'border.main',
        }}
      >
        <Box px={2} py={1} display="flex" sx={styles.navRoot}>
          <Box sx={styles.logoContainer}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuOutlined />
            </IconButton>
            <img src={LOGO} alt="logo" height={40} width="auto" />
          </Box>

          {/* UserCard and Dropdown for color selection on the right */}
          <Box display="flex" alignItems="center">
            <UserCard />
            <Select
              value={primaryColor}
              onChange={handleColorChange}
              displayEmpty
              sx={{ ml: 2, width: 180, height: 40 }}
              size="small"
            >
              <MenuItem value="#026de0">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#026de0', marginRight: 1 }} />
                  Default Blue
                </Box>
              </MenuItem>
              <MenuItem value="#20cb67">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#20cb67', marginRight: 1 }} />
                  Green
                </Box>
              </MenuItem>
              <MenuItem value="#f44336">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#f44336', marginRight: 1 }} />
                  Red
                </Box>
              </MenuItem>
              <MenuItem value="#ff9800">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#ff9800', marginRight: 1 }} />
                  Orange
                </Box>
              </MenuItem>
              <MenuItem value="#22c55e">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#22c55e', marginRight: 1 }} />
                  Light Green
                </Box>
              </MenuItem>
            </Select>
          </Box>
        </Box>
      </AppBar>
    </ThemeProvider>
  );
}

const styles = {
  navRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
