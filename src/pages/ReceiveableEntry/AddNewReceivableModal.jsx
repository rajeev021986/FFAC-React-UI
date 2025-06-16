import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// components/AddNewReceivableModal.js
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { useFetchJobEntriesQuery } from "../../store/api/jobEntryApi";

import {
  jobEntrySetSortModel,
  setPagination,
  updateInput,
} from "../../store/freatures/JobEntrySlice";
import ClearIcon from "@mui/icons-material/Clear";
import { ThemeButton } from "../../components/common/Button";
import muiTextFieldStyles from "../../components/muiTextFieldStyles";


export default function AddNewReceivableModal({ open, onClose, data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const codeJobEntryrSelector = useSelector((s) => s?.jobEntries);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setsearchValue] = useState("");

  const handleNext = () => {
    if (selectedRows.length === 0) {
      alert("Please select a row.");
      return;
    }
    navigate(
      `/app/accounts/operations/receivableEntry/addReceiveableEntry?job_number=${selectedRows?.[0]?.jobNo}`
    );
  };
  const ReceivableEntryColumns = [
    {
      flex: 1,
      field: "jobNo",
      headerName: "Job No.",
      width: 110,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      editable: false,
      renderCell: (params) => (
        <div className="word-wrap-cell">
          {params.value?.trim() || ""} {/* Show "N/A" if empty */}
        </div>
      ),
    },
    {
      flex: 1,
      field: "customerName",
      headerName: "Customer",
      width: 140,
      headerAlign: "center",
      minWidth: 100,

      align: "center",
      editable: false,
      renderCell: (params) => (
        <div className="word-wrap-cell">
          {params.value?.trim() || ""} {/* Show "N/A" if empty */}
        </div>
      ),
    },
    {
      flex: 1,
      field: "customerRefNo",
      headerName: "Customer Ref.",
      width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
      renderCell: (params) => (
        <div className="word-wrap-cell">
          {params.value?.trim() || ""} {/* Show "N/A" if empty */}
        </div>
      ),
    },
    {
      flex: 1,
      field: "shipmentType",
      headerName: "Type",
      width: 110,
      headerAlign: "center",
      align: "center",
      editable: false,
      renderCell: (params) => (
        <div className="word-wrap-cell">
          {params.value?.trim() || ""} {/* Show "N/A" if empty */}
        </div>
      ),
    },
  ];
  const payload = Object.entries(codeJobEntryrSelector?.formData)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "cname") && (fieldname = "customerName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });
  const query = {
    page: codeJobEntryrSelector?.pagination?.page + 1,
    size: codeJobEntryrSelector?.pagination?.pageSize,
    sortBy:
      codeJobEntryrSelector.sortModel.length > 0
        ? codeJobEntryrSelector.sortModel[0].field
        : codeJobEntryrSelector?.sortBy?.split("*")[0],
    sortOrder:
      codeJobEntryrSelector.sortModel.length > 0
        ? codeJobEntryrSelector?.sortModel[0]?.sort
        : codeJobEntryrSelector?.sortBy?.split("*")[1] || "",
  };
  const handlePage = (params) => {
    let { page, pageSize } = params;
    setSelectedRows([]); // Clear selection on page change
    dispatch(setPagination({ page, pageSize }));
  };

  const {
    data: jobEntriesData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchJobEntriesQuery({
    params: query,
    payload,
    page: "job-update/filter",
  });
  const handleClose = () => {
    dispatch(updateInput({ ...codeJobEntryrSelector.formData, jobNo: "" }));
    onClose();
    refetch();
    setSelectedRows([]);
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Add New Receivable Entry
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "grey.600" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            hiddenLabel
            id="search"
            name="search"
            label="Search Job No."
            variant="outlined"
            fullWidth
            size="small"
            value={searchValue}
            onChange={(e) => {
              const value = e.target.value;
              setsearchValue(value);
              dispatch(
                updateInput({ ...codeJobEntryrSelector.formData, jobNo: value })
              );
            }}
            sx={{ ...muiTextFieldStyles.root }}
            InputProps={{
              endAdornment: searchValue && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setsearchValue("");
                      dispatch(
                        updateInput({
                          ...codeJobEntryrSelector.formData,
                          jobNo: "",
                        })
                      );
                    }}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <br />
        <ThemedGrid
          uniqueId="id"
          columns={ReceivableEntryColumns}
          count={jobEntriesData?.body?.totalElements || 0}
          handlePage={handlePage}
          data={jobEntriesData?.body?.data || []}
          onRowClick={(params) => {
            setSelectedRows([params.row]); // Store the clicked row
          }}
          columnVisibility={{}}
          columnVisibilityHandler={() => {}}
          paginationModel={codeJobEntryrSelector.pagination}
          loading={isLoading || isFetching}
          sortModel={codeJobEntryrSelector.sortModel}
          onSortModelChange={(sortModel) =>
            dispatch(jobEntrySetSortModel(sortModel))
          }
          storageKey="ReceivableDataGrid"
        />
      </DialogContent>
      <DialogActions>
        <ThemeButton
          onClick={handleNext}
          disabled={selectedRows.length === 0 ? true : false}
          sx={{ fontWeight: "500", color: "white !important" }}
        >
          Next
        </ThemeButton>
      </DialogActions>
    </Dialog>
  );
}
