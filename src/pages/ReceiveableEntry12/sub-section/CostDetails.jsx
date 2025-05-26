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
  setPagination,
  receivableEntryView,
  receivableEntrySetSortModel,
} from "../../../store/freatures/ReceivableEntrySlice";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

// Components
import CardsView from "../../../components/common/Cards/CardsView";
import ScreenToolbar from "../../../components/common/ScreenToolbar";
import GridAction from "../../../components/common/Grid/GridActions";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import { useFetchContainerQuery } from "../../../store/api/containerApi";

// import { getContaienrListGridActions } from "./containerAction";
import { CONTAINER_COLUMNS } from "../../../data/columns/jobEntry";
// import { CONTAINER_COLUMNS } from "../../../../data/columns/jobEntry";
import muiTextFieldStyles from "../../../components/muiTextFieldStyles";
import useDebounce from "../../../hooks/useDebounce";
import dayjs from "dayjs";
import AdditionalDebitNote from "./AdditionalDebitNote";
export default function CostDetails({ page, customer_id, formik }) {
  const receivableEntrySelector = useSelector(
    (state) => state?.receivableEntry
  );
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
  });
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [
        { name: "New Customer" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : "";
  const datas = [
    {
      id: 1,
      chargeName: "Freight Charges",
      voucherNo: "V1234235",
      voucherDate: "2025-05-15",
      debit: 1500.0,
      credit: 500.0,
      diff: 1000.0,
      purchaseVNo: "PV001",
      exchangeRate: 1.2,
    },
    {
      id: 2,
      chargeName: "TESTT Charges",
      voucherNo: "V123425",
      voucherDate: "2025-05-15",
      debit: 1500.0,
      credit: 500.0,
      diff: 1000.0,
      purchaseVNo: "",
      exchangeRate: 1.22,
    },
    {
      id: 3,
      chargeName: "Testing Charges",
      voucherNo: "V1234775",
      voucherDate: "2025-05-15",
      debit: 1500.0,
      credit: 500.0,
      diff: 1000.0,
      purchaseVNo: "",
      exchangeRate: 1.23,
    },
    {
      id: 4,
      chargeName: "Test Charges",
      voucherNo: "V123745",
      voucherDate: "2025-05-15",
      debit: 1500.0,
      credit: 500.0,
      diff: 1000.0,
      purchaseVNo: "",
      exchangeRate: 1.24,
    },
  ];
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
  const costDetailsColumns = [
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
      field: "date",
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
      field: "debitCost",
      headerName: "Debit",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "voucherNo",
      headerName: "Voucher No",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "voucherDate",
      headerName: "Voucher Date",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "creditCost",
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
    {
      field: "taxinvoice",
      headerName: "Tax Invoice",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <input type="checkbox" style={{ cursor: "pointer" }} />
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "debitNote",
      headerName: "Debit Note",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <input type="checkbox" style={{ cursor: "pointer" }} />
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "purchaseVNo",
      headerName: "Purchase VNo",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "exRate",
      headerName: "Exchange Rate",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <span>{params.value || ""}</span>,
      headerAlign: "center",
      align: "center",
    },
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
            count={filteredData?.length || 0}
            handlePage={handlePage}
            data={filteredData}
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
      <hr class="hr-text" data-content="Tax Invoice/Debit Note Details" />
      <AdditionalDebitNote
        customer_id={""}
        bondDetails={formik}
        page={"AdditionalDebitNote"}
      />
    </>
  );
}
