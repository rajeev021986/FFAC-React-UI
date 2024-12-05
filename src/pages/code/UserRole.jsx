import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";
import React, { useState } from "react";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { replace, useLocation, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import { useFetchCustomerDatasQuery } from "../../store/api/codeDataApi";
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
import { getCustomerListGridActionsCustomerApprovel } from "../../components/screen/code/customer/action copy";
import UserCard from "../../components/common/Cards/UserCard";
import UserFilter from "../../components/screen/code/User/UserFilter";
import UserFilterForm from "../../components/screen/code/User/UserFilterForm";

export default function CustomerScreen({ page }) {
  const codeCustomerSelector = useSelector((state) => state.codeCustomer);
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [seletectBox, setSelectedBox] = useState([
    
  ]);
  const [field, setField] = useState();
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [{ name: "New Customer" }, { name: "Copy" }, { name: "Export" }]
    : [{ name: "New Customer" }, { name: "Export" }];
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

  const cards = [
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
    { avatar: "H", title: "Work", subheader: "Dev" },
  ];

  const handleDownload = () => {
    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(cards);

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cards");

    // Export the workbook to Excel
    XLSX.writeFile(workbook, "cards_data.xlsx");
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
    isFetching,
    refetch,
  } = useFetchCustomerDatasQuery({
    params: query,
    payload,
    page: page == "customer" ? "filter" : "approval",
  });
  useEffect(() => {
    refetch();
  }, [location.pathname]);
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };


  // CODE_CUSTOMER_COLUMNS[CODE_CUSTOMER_COLUMNS.length - 1].renderCell =
  //   GridActions({
  //     actions:
  //       page == "customer"
  //         ? getCustomerListGridActions(nav, setModal)
  //         : getCustomerListGridActionsCustomerApprovel((nav, setModal)),
  //   });
  // CODE_CUSTOMER_COLUMNS[CODE_CUSTOMER_COLUMNS.length - 1].renderCell =
  //   GridActions({
  //     actions: getCustomerListGridActions(nav, setModal),
  //   });
  // CODE_CUSTOMER_COLUMNS[CODE_CUSTOMER_COLUMNS.length - 1].renderCell =
  // GridActions({
  //   actions: getCustomerListGridActionsCustomerApprovel((nav, setModal)),
  // });
  
  const handleAddAction = () => {
    console.log('Navigating to /admin/users/add');
    nav('/app/admin/users/add');
  };

  // useEffect(() => {
  //   if (!codeCustomerSelector.view) {
  //     dispatch(customerSetView("card"));
  //   }
  // }, [codeCustomerSelector.view, dispatch]);

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Box style={{ display: "flex", gap: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddAction}
                sx={{borderRadius: '17px 18px 18px 17px'}}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDownload}
                sx={{borderRadius: '17px 18px 18px 17px'}}
              >
                Export
              </Button>
            </Box>
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
                  width="500px"
                  height="170px"
                >
                  <UserFilter filterInfo={CustomerData?.counts || []} />
                </GridSearchInput>
                {/* <UserFilterForm /> */}
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
            columnVisibilityHandler={() => {}}
            paginationModel={codeCustomerSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={codeCustomerSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(customerSetSortModel(sortModel))
            }
          />
        ) : (
          <UserCard user={cards} />
        )}
      </Card>
    </Box>
  );
}
