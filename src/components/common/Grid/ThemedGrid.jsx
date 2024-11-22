// mui components
import {
  Paper,
  Pagination
} from "@mui/material";
import { StyledDataGrid } from "./styles";



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
  


console.log(">>>>>>>>count>>>>>>>.",props);



  return (
    <Paper
      sx={{
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height : 'calc(100vh - 250px)', overflowY : 'auto',
      }}

    >
      <StyledDataGrid
        pagination
        paginationMode="server"
        sortingMode="server"
        loading={loading}
        columns={columns}
        rows={data}
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
        {...rest}
      />
    </Paper>
  );
};

export default ThemedGrid;
