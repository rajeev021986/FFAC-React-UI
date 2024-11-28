import {
  FormatListBulletedOutlined,
  GridOnOutlined,
  AddCircleOutlineOutlined,
  FileDownloadOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CardsView from "../../components/common/Cards/CardsView";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import { replace, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import * as XLSX from "xlsx";
import {
  useFetchCustomerDatasQuery,
  useFetchCustomerQuery,
} from "../../store/api/codeDataApi";
import CustomerFilters from "../../components/screen/code/customer/CustomerFilters";
import { useDispatch, useSelector } from "react-redux";
import {
  setPagination,
  setSortBy,
  customerSetView,
  customerSetSortModel,
  updateInput,
} from "../../store/freatures/CustomerSlice";
import SelectBox from "../../components/common/SelectBox";
import { CUSTOMER_SORT_OPTIONS } from "../../data/options";
import GridActions from "../../components/common/Grid/GridActions";

import { CODE_CUSTOMER_COLUMNS } from "../../data/columns/code";
import { getCustomerListGridActions } from "../../components/screen/code/customer/action";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { useEffect } from "react";

import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { getCustomerListGridActionsCustomerApprovel } from "../../components/screen/code/customer/action copy";

const ADD_NEW_CUSTOMER_PATH = "new";

// const actions = [{ name: "Copy" }, { name: "Export" }, { name: "New Client" }];

export default function CustomerScreen({ page }) {
  const codeCustomerSelector = useSelector((state) => state.codeCustomer);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [seletectBox, setSelectedBox] = useState('');
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = React.useState(false);
  const actions =
    seletectBox
      ? [{ name: "New Customer" }, { name: "Copy" }, { name: "Export" }]
      : [{ name: "New Customer" }];
  const query = {
    page: codeCustomerSelector?.pagination?.page + 1,
    size: codeCustomerSelector?.pagination?.pageSize,
    sortBy:
      codeCustomerSelector.sortModel.length > 0
        ? codeCustomerSelector.sortModel[0].field
        : codeCustomerSelector?.sortBy?.split("*")[0],
    sortOrder:
      codeCustomerSelector.sortModel.length > 0
        ? codeCustomerSelector?.sortModel[0]?.sort
        : codeCustomerSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      codeCustomerSelector.sortModel.length > 0
        ? codeCustomerSelector.sortModel[0].field === "cname"
        : codeCustomerSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }
  const payload = Object.entries(codeCustomerSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "cname") && (fieldname = "customerName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "or",
      };
    });

  const {
    data: CustomerData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useFetchCustomerDatasQuery({
    params: query,
    payload,
  });
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  CODE_CUSTOMER_COLUMNS[CODE_CUSTOMER_COLUMNS.length - 1].renderCell =
    GridActions({
      actions:
        page == "customer"
          ? getCustomerListGridActions(nav, setModal)
          : getCustomerListGridActionsCustomerApprovel((nav, setModal)),
    });
  // CODE_CUSTOMER_COLUMNS[CODE_CUSTOMER_COLUMNS.length - 1].renderCell =
  //   GridActions({
  //     actions: getCustomerListGridActions(nav, setModal),
  //   });
  // CODE_CUSTOMER_COLUMNS[CODE_CUSTOMER_COLUMNS.length - 1].renderCell =
  // GridActions({
  //   actions: getCustomerListGridActionsCustomerApprovel((nav, setModal)),
  // });

  useEffect(() => {
    if (!codeCustomerSelector.view) {
      dispatch(customerSetView("card"));
    }
  }, [codeCustomerSelector.view, dispatch]);

  const handleActionClick = (actionName) => {
    // if (actionName === "Export") {
      const worksheet = XLSX.utils.json_to_sheet(CustomerData?.body?.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "exported_data.xlsx");
    // }
    if (actionName === "New Customer") {
      nav(ADD_NEW_CUSTOMER_PATH, {
        replace: true,
        state: { formAction: "add" },
      });
    }
    if (actionName === "Copy") {
      nav(`editcustomer`, {
        state: { formAction: "edit", initialValues: { id: seletectBox }, type: "copy" },

      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            {/* <OutlinedButton
              color="primary"
              size="small"
              onClick={() =>
                nav(ADD_NEW_CUSTOMER_PATH,  { replace :true , state: { formAction: "add" } })
              }
            >
              <AddCircleOutlineOutlined fontSize="small" /> New Client
            </OutlinedButton> */}
            <Backdrop open={open} />
            {page == "customer" && (
              <SpeedDial
                ariaLabel="Text-only  SpeedDial"
                sx={{
                  "& .MuiFab-root": {
                    width: 50, // Adjust main button width
                    height: 50, // Adjust main button height
                    minHeight: 50, // Set minimum height
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
                      // width: "150px",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                      borderRadius: 1,
                      backgroundColor: "#f0f0f0",
                      color: "black",
                      boxShadow: 3,
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                      width: 72, // Reduce action button width
                      minWidth: 92, // Ensure consistent sizing
                      "& .MuiSvgIcon-root": {
                        fontSize: 16, // Adjust icon size
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
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={codeCustomerSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <CustomerFilters filterInfo={CustomerData?.counts || []} />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={CUSTOMER_SORT_OPTIONS}
                  value={codeCustomerSelector.sortBy}
                  onChange={(event) => {
                    console.log(event);

                    dispatch(setSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>
              <Box>
                <IconButton onClick={() => dispatch(customerSetView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      codeCustomerSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(customerSetView("grid"))}>
                  <GridOnOutlined
                    color={
                      codeCustomerSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />
        {codeCustomerSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={CODE_CUSTOMER_COLUMNS}
            count={CustomerData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={CustomerData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => { }}
            paginationModel={codeCustomerSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={codeCustomerSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(customerSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={CODE_CUSTOMER_COLUMNS}
            count={CustomerData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={CustomerData?.body?.data}
            paginationModel={codeCustomerSelector?.pagination}
            loading={isLoading || isFetching}
            actions={
              page == "customer"
                ? getCustomerListGridActions(nav, setModal)
                : getCustomerListGridActionsCustomerApprovel(nav, setModal)
            }
            // actions={getCustomerListGridActions(nav, setModal)}
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
            page={page}
          />
        )}
      </Card>
    </Box>
  );
}
