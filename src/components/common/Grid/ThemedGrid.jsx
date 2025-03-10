// mui components
import { Paper, Pagination, Box } from "@mui/material";
import { StyledDataGrid } from "./styles";
import { GridToolbarColumnsButton } from "@mui/x-data-grid";
import { StatusChip } from "../../utils/statusChip";

const ThemedGrid = (props) => {
  const {
    columns,
    count,
    handlePage,
    data,
    columnVisibility,
    columnVisibilityHandler,
    sortModel,
    onSortModelChange,
    paginationModel,
    loading,
    uniqueId,
    ...rest
  } = props;

  const handleDate = (date) => {
    return date.split("T")[0];
  };

  const gridData = data?.map((obj) => {
    return {
      ...obj,
      modifiedDate: obj.modifiedDate
        ? handleDate(obj.modifiedDate)
        : obj.modifiedDate,
      createdDate: obj.createdDate
        ? handleDate(obj.createdDate)
        : obj.createdDate,
    };
  });

  let modifiedColumns = columns.map((a) => {
    if (a.field === "status") {
      return {
        field: "status",
        headerName: "Status",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return StatusChip(params?.row?.status?.toLowerCase(), "status");
        },
      };
    } else if (a.field === "isDoc") {
      return {
        field: "isDoc",
        headerName: "Document",
        width: 150,
        headerAlign: "center",
        align: "center",
        renderCell: (params) => {
          return StatusChip(params.row.isDoc, "document");
        },
      };
    } else {
      return a;
    }
  });

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "calc(100vh - 190px)",
        overflowY: "auto",
      }}
    >
      <StyledDataGrid
        pagination
        paginationMode="server"
        sortingMode="server"
        loading={loading}
        columns={modifiedColumns}
        rows={gridData}
        columnHeaderHeight={42}
        // columnVisibilityModel={columnVisibility}
        // onColumnVisibilityModelChange={columnVisibilityHandler}
        sortModel={sortModel || []}
        onSortModelChange={onSortModelChange}
        pageSizeOptions={[10, 20, 50, 100]}
        rowCount={count}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePage}
        getRowId={(row) => row[uniqueId]}
        disableColumnFilter
        slots={{
          toolbar: () => (
            <Box sx={{ display: "flex", justifyContent: "flex-start", p: 0 }}>
              <GridToolbarColumnsButton />
            </Box>
          ),
        }}
        {...rest}
      />
    </Paper>
  );
};

export default ThemedGrid;
