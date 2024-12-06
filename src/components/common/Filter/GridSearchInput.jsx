import React, { useState, useRef } from 'react';
import { Paper, Box, ClickAwayListener } from '@mui/material';
import InputWithChips from './InputWithChips';


const GridSearchInput = ({
  children,
  filters,
  setFilters,
  width = '500px',
  height = 'auto'
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const searchRef = useRef(null);

  const handleSearchFocus = () => {
    setFilterOpen(true);
  };
  const handleClickAway = () => {
    setFilterOpen(false);
  };
  const handleChipsChange = (updatedChips) => {
    setFilters(updatedChips);
  };
  const handleResetFilter = () => {
    setFilters({});
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', minWidth: '500px'}}>
        {/* Search Bar */}
        <InputWithChips
          inputRef={searchRef}
          onFocus={handleSearchFocus}
          placeholder="Search & Filters"
          onFilterChange={handleChipsChange}
          onFilterReset={handleResetFilter}
          filters={filters}
        />

        {/* Filter Popup Box */}
        {filterOpen && (
          <Paper
            elevation={3}
            sx={{...styles.paper, width, height, overflowY: 'auto'}}
          >
            {children}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

const styles = {
  paper: {
    position: 'absolute',
    top: '100%',
    left: 0,
    mt: 1,
    zIndex: 10,
    padding: 2,
    backgroundColor: 'white.main',
    borderRadius: '10px'
  }
}

export default GridSearchInput;
