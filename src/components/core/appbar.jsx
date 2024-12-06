import React, { useState } from 'react';
import { AppBar, Box, IconButton, MenuItem, Select, Avatar, Typography, FormControlLabel } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import UserCard from './usercard';
import { styled } from '@mui/material/styles';
// import LOGO from '../../assets/images/TransmodalBlackLogo.png';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from "../../config/theme";
import LOGO from '../../assets/images/tflLogo.png';
import { useSelector, useDispatch } from 'react-redux';
import { setMode, setTheme } from '../../store/freatures/dashboardSlice';
import AppDrawer from '../common/AppDrawer';
import Switch, { SwitchProps } from '@mui/material/Switch';
export default function TAppBar({ handleDrawerToggle }) {
  const dispatch = useDispatch();
  const primaryColor = useSelector((state) => state.dashboard.theme);
  const theme = getTheme(primaryColor); // Get the theme with updated primary color
  const [drawer, setDraweropen] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    dispatch(setMode(event.target.checked))
  };
  const handleColorChange = (event) => {
    dispatch(setTheme(event.target.value));
  };

  return (
    <>
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
            <UserCard setDraweropen={setDraweropen} />

            {/*  */}
            {/* <div onClick={() => setDraweropen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff6f6", padding: "1px 15px 1px 6px", borderRadius: "50px" }}> */}

            {/* </div> */}
          </Box>
        </Box>
      </AppBar>
      <AppDrawer sx={{ backgroundColor: 'white.main' }} open={drawer} onClose={() => setDraweropen(false)} title='Setting'>
        <div style={{ width: "15vw", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>Color Theme</div>
            <Select
              value={primaryColor}
              onChange={handleColorChange}
              displayEmpty
              sx={{ width: 180, height: 40 }}
              size="small"
            >
              <MenuItem value="#026de0">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#026de0' }} />
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
              <MenuItem value="#800080">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#800080', marginRight: 1 }} />
                  Purple
                </Box>
              </MenuItem>
            </Select>
          </div>
          <div>
            <FormControlLabel
              control={
                <MaterialUISwitch
                  sx={{ m: 1 }}
                  checked={useSelector((state) => state.dashboard.mode)}
                  onChange={handleChange}
                />
              }
              label={useSelector((state) => state.dashboard.mode) ? 'Dark Mode is ON' : 'Dark Mode is OFF'}
            />
          </div>
        </div>
      </AppDrawer></>
  );
}

const styles = {
  navRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white.main',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));