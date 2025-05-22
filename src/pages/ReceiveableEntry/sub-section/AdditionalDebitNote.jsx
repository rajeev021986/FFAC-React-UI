import React, { useState, useEffect, useRef } from "react";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ContainerNumberForm } from "../../UpdateJob/ContainerShipmentTables/ShipmentContainer/ContainerForm";
import {
  Box,
  IconButton,
  Stack,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
  Tooltip,
  Grid,
} from "@mui/material";
import { Card, CardHeader } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { LoaderIcon } from "react-hot-toast";
import ClearIcon from "@mui/icons-material/Clear";

// import {
//   setPagination,
//   containerView,
//   containerSetSortModel,
//   // updateInput,
// } from "../../../../store/freatures/containersSlice";
import {
  setPagination,
  containerView,
  containerSetSortModel,
} from "../../../store/freatures/containersSlice";
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
import InputBox from "../../../components/common/InputBox";
import { StyledDataGrid } from "../../../components/common/Grid/styles";
import DateTimeField from "../../../components/common/DateTime/DateTimeField";
import InputBoxForGrid from "../../../components/common/InputBoxForGrid";
export default function AdditionalDebitNote({
  page,
  customer_id,
  bondDetails,
}) {
  const containerSelector = useSelector((state) => state?.containers);
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
  const newRowRef = useRef(null);
  const setFocus = () => {
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.focus();
      }
    }, 1000);
  };

  const [open, setOpen] = React.useState(false);
  const [datas, setDatas] = useState([]);
  const actions = seletectBox
    ? [
        { name: "New Customer" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : "";
  useEffect(() => {
    setDatas([
      {
        id: 1,
        code: "CHG001",
        chargeName: "Freight Charges",
        debit: 1500.0,
        credit: 500.0,
        vat: 1.2,
      },
      {
        id: 2,
        code: "CHG001",
        chargeName: "TESTT Charges",
        debit: 1500.0,
        credit: 500.0,
        vat: 1.22,
      },
    ]);
  }, []);
  const query = {
    page: containerSelector?.pagination?.page + 1,
    size: containerSelector?.pagination?.pageSize,
    // id: customer_id,
    sortBy:
      containerSelector.sortModel.length > 0
        ? containerSelector.sortModel[0].field
        : containerSelector?.sortBy?.split("*")[0],
    sortOrder:
      containerSelector.sortModel.length > 0
        ? containerSelector?.sortModel[0]?.sort
        : containerSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      containerSelector.sortModel.length > 0
        ? containerSelector.sortModel[0].field === "cname"
        : containerSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "containerNo";
  }

  const payload = Object.entries(containerSelector?.formData)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key === "cname") && (fieldname = "containerNo");
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
    if (!containerSelector.view) {
      dispatch(containerView("card"));
    }
  }, [containerSelector.view, dispatch]);
  const TabsHosts = [
    {
      tabLable: "Bond Details",
      value: datas || [],
      addNewRow: () => {
        const newRow = {
          id: Date.now(),
          code: "",
          chargeName: "",
          debit: 0,
          credit: 0,
          vat: 0,
          new: true,
        };
        // setFocus();
        setDatas((prevRows) => [...prevRows, newRow]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[0]?.value.filter((row) => row.id !== id);
        // formik.setFieldValue("bondDetails", updatedRows);
        setDatas(updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts[0]?.value.map((row) => {
          if (row.id === newRow.id) {
            return { ...row, ...newRow };
          }
          return row;
        });
        setDatas(updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "code",
          headerName: "Code",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} value={params.value || ""} />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "chargeName",
          headerName: "Code",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} value={params.value || ""} />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "debit",
          headerName: "Debit",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} value={params.value || ""} />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "credit",
          headerName: "Credit",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} value={params.value || ""} />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "vat",
          headerName: "VAT",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} value={params.value || ""} />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "actions",
          sortable: false,
          flex: 0,
          renderHeader: () => (
            <IconButton color="white" onClick={TabsHosts[0].addNewRow}>
              <AddCircleIcon />
            </IconButton>
          ),
          renderCell: (params) => (
            <IconButton
              color="error"
              onClick={() => TabsHosts[0].deleteRow(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      ],
    },
  ];
  useEffect(() => {
    if (debounceValue.trim()) {
      const lowerSearch = debounceValue.toLowerCase();
      const filtered = datas?.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(datas);
    }
  }, [debounceValue, containerListData]);
  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          sx={{ padding: "8px" }}
          title={
            <Stack direction="row" justifyContent="space-between">
              <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                    marginTop={2}
                  >
                    <Tooltip title={""} arrow>
                      <InputBox
                        label="Customer Name*"
                        id="customerName"
                        //   value={formik.values.customerName}
                        //   disabled={disabled}
                        //   error={formik.errors.customerName}
                        //   onChange={formik.handleChange}
                        //   inputRef={customerNameRef}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                    marginTop={2}
                  >
                    <InputBox
                      label="Exchange Rate"
                      id="tinNo"
                      // value={formik.values.tinNo}
                      // error={formik.errors.tinNo}
                      // onChange={formik.handleChange}
                      // disabled={disabled}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                    marginTop={2}
                  >
                    <InputBox
                      label="Amount"
                      id="vatNo"
                      // value={formik.values.vatNo}
                      // error={formik.errors.vatNo}
                      // onChange={formik.handleChange}
                      // disabled={disabled}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                    marginTop={2}
                  >
                    <InputBox
                      label="Vat"
                      id="status"
                      //   value={formik.values.status}
                      //   error={formik.errors.status}
                      //   onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                    marginTop={2}
                  >
                    <InputBox
                      label="Rec/Pay Amount"
                      id="vatNo"
                      // value={formik.values.vatNo}
                      // error={formik.errors.vatNo}
                      // onChange={formik.handleChange}
                      // disabled={disabled}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                    marginTop={2}
                  >
                    <InputBox
                      label="WIP JV"
                      id="vatNo"
                      // value={formik.values.vatNo}
                      // error={formik.errors.vatNo}
                      // onChange={formik.handleChange}
                      // disabled={disabled}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                    marginTop={2}
                  >
                    <DateTimeField
                      name="date"
                      label="Date"
                      id="date"
                      //  value={formik.values.date}
                      //  error={formik.errors.date}
                      //  onChange={formik.setFieldValue}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Stack>
          }
        />
        {TabsHosts?.map((ob, index) => (
          <Box sx={{ width: "100%" }}>
            <Box>
              <StyledDataGrid
                rows={ob.value}
                columns={ob?.columns?.map((column) => ({
                  ...column,
                  headerAlign: "center",
                  align: "center",
                }))}
                disableSelectionOnClick
                processRowUpdate={ob.handleProcessRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                getRowId={(row) => row.id}
                disableColumnMenu
                disablePagination
                paginationMode="client"
                hideFooterPagination
              />
            </Box>
          </Box>
        ))}
      </Card>

      <hr style={{ margin: "16px 0", border: "1px solid #ccc" }} />
      <Grid item xs={12}>
        <TextField
          label="Remark"
          name="rejectRemarks"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />
      </Grid>
    </Box>
  );
}
