import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

export const Cell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.8rem",
  borderBottomColor: theme.palette.T_mediumGrey.main,
  textAlign: "left",
}));

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  width: "100%",
  minHeight: "60vh",
  border: "none",
  borderRadius: "5px !important",
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: theme.palette.primary.light,
    lineHeight: 10,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
  // "& .MuiPopper-root": {
  //   overflowY: "hidden",
  //   backgroundColor: theme.palette.primary.main,
  // },
}));
