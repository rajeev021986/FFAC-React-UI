import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TMenu from '../TMenu';

const GridActions = ({ actions }) => {
  return (params) => (
    <div>
        <TMenu 
        buttonIcon={<MoreVertIcon />} 
        buttonProps={{ color: 'text.secondary' }} 
        menuItems={actions} 
        params={params}
        action={true}
        />
    </div>
  );
};

export default GridActions;
