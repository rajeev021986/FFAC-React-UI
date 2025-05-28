import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Card, CardHeader } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import {
  receivableEntrySetSortModel,
  receivableEntryView,
} from "../../../store/freatures/ReceivableEntrySlice";

// Components
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import { useFetchContainerQuery } from "../../../store/api/containerApi";
import muiTextFieldStyles from "../../../components/muiTextFieldStyles";
import AddPayableEntryModal from "../AddDetails/AddDebitInvoiceModal";

export default function CostDetails({
  page,
  customer_id,
  formik,
  selectedInvoiceType,
}) {
  const receivableEntrySelector = useSelector(
    (state) => state?.receivableEntry
  );
  const getButtonText = () => {
    if (selectedInvoiceType === "tax_invoice") return "Add Invoice";
    if (selectedInvoiceType === "debit_note") return "Add Debit";
    return "Add";
  };
  const location = useLocation();
  const dispatch = useDispatch();
  const [localPagination, setLocalPagination] = useState({
    page: 0,
    pageSize: 10,
  });

  const [searchValue, setsearchValue] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
    readOnly: false,
  });

  const query = {
    page: receivableEntrySelector?.pagination?.page + 1,
    size: receivableEntrySelector?.pagination?.pageSize,
    // id: customer_id,
    sortBy:
      receivableEntrySelector.sortModel.length > 0
        ? receivableEntrySelector.sortModel[0].field
        : receivableEntrySelector?.sortBy?.split("*")[0],
    sortOrder:
      receivableEntrySelector.sortModel.length > 0
        ? receivableEntrySelector?.sortModel[0]?.sort
        : receivableEntrySelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      receivableEntrySelector.sortModel.length > 0
        ? receivableEntrySelector.sortModel[0].field === "cname"
        : receivableEntrySelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "chargeName";
  }

  const payload = Object.entries(receivableEntrySelector?.formData)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key === "cname") && (fieldname = "chargeName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });
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
      headerName: "Voucher No",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "paybleCreatedDate",
      headerName: "Voucher Date",
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
      headerName: "Voucher No",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "receivableCreatedDate",
      headerName: "Voucher Date",
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
  const {
    data: containerListData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchContainerQuery({
    params: query,
    payload,
    page:
      page === "containerNo"
        ? `job-update/container/filter/${customer_id}`
        : "",
  });
  const paginatedCostDetails = React.useMemo(() => {
    const start = localPagination.page * localPagination.pageSize;
    const end = start + localPagination.pageSize;
    return formik.values.costDetails?.slice(start, end) || [];
  }, [formik.values.costDetails, localPagination]);

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const handleSearchBar = (e) => {
    setsearchValue(e.target.value);
  };
  useEffect(() => {
    if (!receivableEntrySelector.view) {
      dispatch(receivableEntryView("card"));
    }
  }, [receivableEntrySelector.view, dispatch]);

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
            count={formik.values.costDetails?.length || 0}
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
            loading={isLoading || isFetching}
            sortModel={receivableEntrySelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(receivableEntrySetSortModel(sortModel))
            }
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
