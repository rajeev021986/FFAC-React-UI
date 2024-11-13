import React, { useState } from 'react';
import { TextField, Chip, Box, InputAdornment, IconButton, Typography } from '@mui/material';
import { Search, Clear, FilterAltOutlined } from '@mui/icons-material';


const InputWithChips = ({
  placeholder,
  filters = [],
  onFilterChange,
  onFilterReset,
  inputRef,
  onFocus,
}) => {


  const formattedFilter = Object.entries(filters).map(([key, value]) => {
    if (value) return `${key}: ${value}`;
    return null;
  }).filter(filter => filter);

  // Clear the filter when the end button is clicked
  const endButtonHandler = () =>{
    formattedFilter.length > 0 ? onFilterReset() : onFocus();
  }

  const handleDeleteChip = (index) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[Object.keys(updatedFilters)[index]];
    onFilterChange(updatedFilters);
  }

  return (
    <Box sx={styles.input} ref={inputRef} onClick={onFocus} >
      <Box sx={styles.field} >
        <Box sx={styles.startIcon}>
          <Search color="primary" />
        </Box>
        <Box>
          {formattedFilter.map((chip, index) => (
            <Chip 
            key={index} 
            variant='outlined' 
            color="primary" 
            size="small"
            label={chip} 
            onDelete={() => handleDeleteChip(index)} />
          ))}
          {
            formattedFilter.length === 0 &&
            <Typography variant="body2" color="textSecondary">
              {placeholder}
            </Typography>
          }
        </Box>
      </Box>
      <Box>
        <IconButton aria-label="" onClick={endButtonHandler} sx={{padding : '5px'}}>
          {formattedFilter.length > 0 ? <Clear /> : <FilterAltOutlined />}
        </IconButton>
      </Box>
    </Box>
  );
};

const styles = {
  input: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '5px',
    alignItems: 'center',
    padding: '2px',
    border: '1px solid #ccc',
    borderRadius: '25px',
    cursor: 'text',
    '& .MuiTextField-root': {
      flex: '1',
    },
    '& .MuiChip-root': {
      margin: '2px',
    }
  },
  field: {
    display: 'flex',
    flex: '1',
    alignItems: 'center',

  },
  startIcon: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
  }
}

export default InputWithChips;
