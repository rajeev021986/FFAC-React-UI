import React, { useState, useRef } from "react";
import {
  Paper,
  Box,
  ClickAwayListener,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
} from "@mui/material";
import InputWithChips from "./InputWithChips";
import { GridCloseIcon } from "@mui/x-data-grid";
import { OutlinedButton, ThemeButton } from "../Button";
const GridSearchInput = ({
  children,
  filters,
  setFilters,
  selectedIds, // Receive selected IDs
  handleApproveAllRequest, // Receive function
  setSelectedIds,
  selectedPayableIds,
  handlePayChange,
  page,
  width = "500px",
  height = "auto",
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
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
  const handleOpenApproveDialog = () => {
    setOpenApproveDialog(true);
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);

    // Reset selectedIds if setSelectedIds function is provided
    if (setSelectedIds) {
      setSelectedIds([]);
    }
  };

  const handleApproveConfirm = () => {
    handleApproveAllRequest(); // Call the approval function
    handleCloseApproveDialog(); // Close the dialog
  };
  return (
    <>
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
          <ClickAwayListener onClickAway={() => setFilterOpen(false)}>
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                zIndex: 10,
                top: "100%",
                left: 0,
                mt: 1,
                width: "500px",
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
          </ClickAwayListener>
        )}
      </Box>
      {/* Approve Button */}
      {selectedIds?.length !== 0 && page === "jobApprove" && (
        <Button
          onClick={handleOpenApproveDialog} // Open confirmation dialog
          disabled={selectedIds?.length === 0}
          variant="contained"
          size="small"
          sx={{
            padding: "6px 16px",
            boxShadow: 3,
            borderRadius: "20px 19px 19px 20px",
            textTransform: "none",
          }}
        >
          Approve
        </Button>
      )}
      {/* Confirmation Dialog */}
      <Dialog open={openApproveDialog} onClose={handleCloseApproveDialog}>
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          Do you want to approve all the selected job IDs?
        </DialogContent>
        <DialogActions>
          <Grid item xs={12} sx={{ margin: 1, padding: 0 }}>
            <Stack direction="row" spacing={2}>
              <OutlinedButton
                sx={{ fontWeight: "500" }}
                onClick={handleCloseApproveDialog}
              >
                Close
              </OutlinedButton>
              <ThemeButton
                onClick={handleApproveConfirm}
                sx={{
                  fontWeight: "500",
                  color: "white !important",
                }}
              >
                Submit
              </ThemeButton>
            </Stack>
          </Grid>
        </DialogActions>
      </Dialog>

      {/*Pay Button */}
      {selectedPayableIds?.length !== 0 && page === "pending_payments" && (
        <Button
          onClick={handlePayChange}
          disabled={selectedPayableIds?.length === 0}
          variant="contained"
          size="small"
          sx={{
            padding: "2px 1px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: 3,
            borderRadius: "20px",
            textTransform: "none",
            height: 36,
            fontSize: "12px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          Pay
        </Button>
      )}
    </>
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
