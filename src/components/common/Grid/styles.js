import { Padding } from "@mui/icons-material";
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
  minHeight: "100%",
  border: "none",
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "white",
    lineHeight: 10,
    height: "38px !important",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: "#000",
    fontSize: "14px",
    fontWeight: "bold"
  },
  "& .MuiDataGrid-iconButtonContainer": {
    color: "white",
  },
  "& .MuiDataGrid-sortIcon": {
    color: "white",
  },
  "& .MuiDataGrid-row": {
    fontSize: "14px",
    height: "44px",
    minHeight: "44px !important",
    maxHeight: "44px !important",
  },
  "& .MuiDataGrid-cell": {
    height: "44px",
    minHeight: "44px !important",
    maxHeight: "44px !important",
    lineHeight: "44px !important",
    display: "flex", // make it a flexbox
    justifyContent: "center", // horizontal center
    alignItems: "center", // vertical center
    textAlign: "center",
  },
  "& .css-18qmpb9-MuiButtonBase-root-MuiIconButton-root":{
    padding: "0px",
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiDataGrid-menuIconButton .MuiSvgIcon-root": {
    fill: "#fff",
  },
}));
