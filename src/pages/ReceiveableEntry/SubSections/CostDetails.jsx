import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Card, CardHeader } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoaderIcon } from "react-hot-toast";
import ClearIcon from "@mui/icons-material/Clear";
import {
  receivableEntrySetSortModel,
  setPagination,
  receivableEntryView,
} from "../../../store/freatures/ReceivableEntrySlice";

import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

// Components
import ScreenToolbar from "../../../components/common/ScreenToolbar";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import { useFetchContainerQuery } from "../../../store/api/containerApi";
import { CONTAINER_COLUMNS } from "../../../data/columns/jobEntry";
import muiTextFieldStyles from "../../../components/muiTextFieldStyles";
import useDebounce from "../../../hooks/useDebounce";
import dayjs from "dayjs";
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
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [exportLoader, setExportLoader] = useState(false);
  const [seletectBox, setSelectedBox] = useState("");

  const [searchValue, setsearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const debounceValue = useDebounce(searchValue, 500);

  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
    readOnly: false,
  });
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [
        { name: "New Customer" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : "";

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
  const containerColumns = CONTAINER_COLUMNS((rowData) => {
    setModal({
      open: true,
      type: "edit", // or "view" or whatever your types are
      data: rowData,
    });
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

  const handleActionClick = async (actionName) => {
    if (actionName === "New Customer") {
      nav("newcustomer", {
        replace: true,
        state: { formAction: "add" },
      });
    }
    if (actionName === "Export") {
      setExportLoader(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  const handleSearchBar = (e) => {
    setsearchValue(e.target.value);
  };

  // CONTAINER_COLUMNS[CONTAINER_COLUMNS.length - 1].renderCell = GridActions({
  //   actions: getContaienrListGridActions(setModal),
  // });

  useEffect(() => {
    if (!receivableEntrySelector.view) {
      dispatch(receivableEntryView("card"));
    }
  }, [receivableEntrySelector.view, dispatch]);

  useEffect(() => {
    if (debounceValue.trim()) {
      const lowerSearch = debounceValue.toLowerCase();
      const filtered = formik?.values?.paybleDetails?.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(formik?.values?.paybleDetails);
    }
  }, [debounceValue, formik?.values?.paybleDetails]);
  return (
    <>
      <Box sx={{ backgroundColor: "white.main" }}>
        <ScreenToolbar
          rightComps={
            <>
              <Backdrop open={open} />
              {(page === "customer" || page === "customerApprove") && (
                <SpeedDial
                  ariaLabel="Text-only  SpeedDial"
                  sx={{
                    "& .MuiFab-root": {
                      width: 50,
                      height: 50,
                      minHeight: 50,
                    },
                  }}
                  icon={<SpeedDialIcon sx={{ fontSize: 20 }} />}
                  direction="left"
                >
                  {actions.map((action) => (
                    <SpeedDialAction
                      key={action.name}
                      tooltipTitle=""
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                        // borderRadius: 1,
                        boxShadow: 3,
                        borderRadius: "20px 19px 19px 20px",
                        width: 72,
                        minWidth: 92,
                        "& .MuiSvgIcon-root": {
                          fontSize: 16,
                        },
                      }}
                      icon={
                        <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                          {action.name}
                        </span>
                      }
                      onClick={() => handleActionClick(action.name)}
                    ></SpeedDialAction>
                  ))}
                </SpeedDial>
              )}
            </>
          }
        />

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
            handlePage={handlePage}
            data={formik.values.costDetails || []}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={receivableEntrySelector.pagination}
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
