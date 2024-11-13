import React, { useEffect } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { useState } from 'react';
import Sidebar from './sidebar';
import TAppBar from './appbar';
import ContentWrapper from './content-wrapper';
import { useFetchFormatQuery } from '../../store/api/settingsApi';
import { useDispatch } from 'react-redux';

// import { Outlet } from 'react-router-dom';

const drawerWidth = 55;
const expandedDrawerWidth = 240; // Width when sidebar is expanded

export default function Main({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  const { refetch } = useFetchFormatQuery();

    useEffect(() => {
        refetch();
    }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <TAppBar handleDrawerToggle={handleDrawerToggle} />
      <Sidebar
        drawerWidth={drawerWidth}
        expandedDrawerWidth={expandedDrawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        hover={hover}
        setHover={setHover}
      />
      <ContentWrapper
        hover={hover}
        expandedDrawerWidth={expandedDrawerWidth}
        drawerWidth={drawerWidth}
      >
        {children}
      </ContentWrapper>
    </Box>
  );
}
