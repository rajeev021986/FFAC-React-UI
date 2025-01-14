import React, { useState, useRef } from "react";
import { Paper, Box, ClickAwayListener, IconButton } from "@mui/material";
import InputWithChips from "./InputWithChips";
import { GridCloseIcon } from "@mui/x-data-grid";

const GridSearchInput = ({
  children,
  filters,
  setFilters,
  width = "500px",
  height = "auto",
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
  };

  return (
    <Box sx={{ position: "relative", minWidth: "500px" }}>
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
          sx={{
            position: "absolute",
            zIndex: 10,
            top: "100%",
            left: 0,
            mt: 1,
            width,
            height,
            overflowY: "auto",
            ...styles.paper,
          }}
        >
          {/* Close Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              // p: 1,
              borderBottom: "1px solid #e0e0e0",
              marginBottom: "10px",
            }}
          >
            <IconButton
              size="small"
              onClick={() => setFilterOpen(false)} // Close the popup
            >
              <GridCloseIcon />
            </IconButton>
          </Box>

          {/* Popup Content */}
          {React.Children.map(children, (child) =>
            React.cloneElement(child, { setFilterOpen })
          )}
        </Paper>
      )}
    </Box>
  );
};

const styles = {
  paper: {
    position: "absolute",
    top: "100%",
    left: 0,
    mt: 1,
    zIndex: 10,
    padding: 2,
    backgroundColor: "white.main",
    borderRadius: "10px",
  },
};

export default GridSearchInput;
