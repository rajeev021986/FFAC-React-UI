import * as React from "react";
import { Box, Drawer, Card, InputAdornment, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Close, Search } from "@mui/icons-material";
import InputBox from "./InputBox";
import {useLazyFetchAuditQuery } from "../../store/api/common";

export default function ReusableRightDrawer({ open, data, table, column, onClose, isFrontmost }) {
  
  const [drawerOpen, setDrawerOpen] = React.useState(open);
  const [searchTerm, setSearchTerm] = React.useState("");

  const {
    data: AuditData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useLazyFetchAuditQuery({
    userId: data.id,
  });

  function removeUnderscores(str) {
    return str.replace(/_/g, ' ');
  }

  const result = removeUnderscores(table);

  // Sync drawer open/close state with parent prop
  React.useEffect(() => {
    setDrawerOpen(open);
  }, [open]);

  // Filter the AuditData based on the search term
  const filteredData = React.useMemo(() => {
    if (!AuditData || !searchTerm) return AuditData?.data;

    return AuditData.data.filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [AuditData, searchTerm]);

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={onClose}
      sx={{
        width: "50vw",
        maxWidth: "50vw",
        display: "flex",
        flexDirection: "column",
        zIndex: isFrontmost ? 1301 : 1300, // Adjust z-index based on isFrontmost
      }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title and close button */}
        <Box
          sx={{
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f9fafb", // Slight background tint
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              marginLeft: 2,
              color: "#1f2937", // Darker color for the title
              fontWeight: "bold",
            }}
          >
            Audit: {result}
          </Typography>

          {/* Close button */}
          <Close
            onClick={onClose}
            sx={{
              cursor: "pointer",
              fontSize: "28px", // Bigger size similar to image
              color: "#6b7280", // Gray shade for close icon
              marginRight: 2,
            }}
          />
        </Box>

        {/* Search input */}
        <Box
          sx={{
            borderBottom: "1px solid #ddd",
            backgroundColor: "#fff",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <InputBox
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "25px",
                width: "400px", // Similar width for search box
              },
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <DataGrid
            rows={filteredData || []} // Use filtered data for the DataGrid
            getRowId={(rows) => `${rows.serial_id}`}
            columns={column}
            disableColumnMenu
            disableRowSelectionOnClick
            disableColumnResize
            hideFooterPagination
            loading={isLoading}
            // sx={{
            //   "& .MuiDataGrid-root": {
            //     border: "none", // Hide borders around the grid
            //     fontSize: "14px", // Font size adjustment
            //   },
            //   "& .MuiDataGrid-cell": {
            //     padding: "8px", // Cell padding similar to image
            //   },
            // }}
          />
        </Box>
      </Card>
    </Drawer>
  );
}
