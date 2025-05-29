import React, { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Box, IconButton, Stack } from "@mui/material";
import { Card, CardHeader } from "@mui/material";
import dayjs from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";

// Components
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import muiTextFieldStyles from "../../../components/muiTextFieldStyles";
import AddPayableEntryModal from "../AddDetails/AddDebitInvoiceModal";
import useDebounce from "../../../hooks/useDebounce";

export default function CostDetails({ formik, selectedInvoiceType }) {
  const getButtonText = () => {
    if (selectedInvoiceType === "tax_invoice") return "Add Invoice";
    if (selectedInvoiceType === "debit_note") return "Add Debit";
    return "Add";
  };
  const [localPagination, setLocalPagination] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setsearchValue] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
    readOnly: false,
  });
  const debounceValue = useDebounce(searchValue, 500);
  const handleAdd = (params) => {
    const rowData = params?.row;
    setModal({
      open: true,
      type: "cost_details",
      data: rowData,
      readOnly: false,
    });
  };

  const costDetailsColumns = [
    {
      field: "add",
      headerName: "Add Entry",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <button
          disabled={selectedInvoiceType === "Add" ? true : false}
          onClick={() => handleAdd(params)}
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            backgroundColor: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {getButtonText()}
        </button>
      ),
    },
    {
      field: "chargeName",
      headerName: "Charge Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paybleRefNo",
      headerName: "Ref No",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paybleCreatedDate",
      headerName: "Date",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return dayjs(params?.value)?.format("DD/MM/YYYY"); // Format date
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paybleAmount",
      headerName: "Debit",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receivableRefNo",
      headerName: "Ref No",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receivableCreatedDate",
      headerName: "Date",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return dayjs(params?.value)?.format("DD/MM/YYYY"); // Format date
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receivableAmount",
      headerName: "Credit",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "diff",
      headerName: "Diff",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "purchaseVNo",
    //   headerName: "Purchase VNo",
    //   flex: 1,
    //   minWidth: 200,
    //   renderCell: (params) => <span>{params.value || ""}</span>,
    //   headerAlign: "center",
    //   align: "center",
    // },
  ];

  useEffect(() => {
    if (debounceValue.trim()) {
      const lowerSearch = debounceValue.toLowerCase();
      const filtered = formik.values.costDetails?.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(formik.values.costDetails);
    }
  }, [debounceValue, formik.values.costDetails]);

  const paginatedCostDetails = React.useMemo(() => {
    const start = localPagination.page * localPagination.pageSize;
    const end = start + localPagination.pageSize;
    return filteredData.slice(start, end) || [];
  }, [filteredData, localPagination]);

  const handleSearchBar = (e) => {
    setsearchValue(e.target.value);
  };

  return (
    <>
      <Box sx={{ backgroundColor: "white.main" }}>
        <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
          <CardHeader
            sx={{ padding: "8px" }}
            title={
              <Stack direction="row" justifyContent="space-between">
                <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
                  <TextField
                    hiddenLabel
                    id="search"
                    name="search"
                    label="Search"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={searchValue}
                    onChange={handleSearchBar}
                    sx={{ ...muiTextFieldStyles.root }}
                    InputProps={{
                      endAdornment: searchValue && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setsearchValue("")}
                            edge="end"
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Stack>
            }
          />
          <ThemedGrid
            uniqueId="id"
            columns={costDetailsColumns}
            count={filteredData.length || 0}
            handlePage={(model) =>
              setLocalPagination({
                page: model.page,
                pageSize: model.pageSize,
              })
            }
            data={paginatedCostDetails || []}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={localPagination}
          />
        </Card>
      </Box>
      <AddPayableEntryModal
        togglePayEntry={modal.open}
        handleTogglePayEntry={() =>
          setModal((prev) => ({ ...prev, open: false }))
        }
        selectedPayEntry={modal.data}
        setSelectedPayEntry={(entry) =>
          setModal((prev) => ({ ...prev, data: entry }))
        }
        formik={formik}
        onAddPayEntry={(entry) => {
          const updatedList = [...(formik.values.details || []), entry];
          formik.setFieldValue("details", updatedList);
        }}
        type={modal.type}
        disabled={false}
      />
    </>
  );
}
