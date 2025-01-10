import {
  Backdrop,
  Box,
  Card,
  CardHeader,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useFetchExchangeRateDatasQuery } from "../../store/api/exchangeRateDataApi";
import {
  exchangeRateSetSortModel,
  exchangeRateSetView,
  setPagination,
  setSortBy,
  updateInput,
} from "../../store/freatures/ExchangeRateSlice";
import { EXCHANGE_RATE_COLUMNS } from "../../data/columns/exchangeRate";
import { getExchangeRateListGridActions } from "../../components/screen/code/exchange/action";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import SelectBox from "../../components/common/SelectBox";
import { EXCHANGE_RATE_SORT_OPTIONS } from "../../data/options";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import ExchangeRateFilters from "../../components/screen/code/exchange/ExchangeRateFilters";
import GridActions from "../../components/common/Grid/GridActions";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import CardsView from "../../components/common/Cards/CardsView";

export function ExchangeRate({ page }) {
  const exchangeRateSelector = useSelector((state) => state.exchangeRateStore);
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [seletectBox, setSelectedBox] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [{ name: "New Exchange" }, { name: "Copy" }, { name: "Export" }]
    : [{ name: "New Exchange" }, { name: "Export" }];

  const query = {
    page: exchangeRateSelector?.pagination?.page + 1,
    size: exchangeRateSelector?.pagination?.pageSize,
    sortBy:
      exchangeRateSelector.sortModel.length > 0
        ? exchangeRateSelector.sortModel[0].field
        : exchangeRateSelector?.sortBy?.split("*")[0],
    sortOrder:
      exchangeRateSelector.sortModel.length > 0
        ? exchangeRateSelector?.sortModel[0]?.sort
        : exchangeRateSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      exchangeRateSelector.sortModel.length > 0
        ? exchangeRateSelector.sortModel[0].field === "currency"
        : exchangeRateSelector?.sortBy?.split("*")[0] === "currency"
    )
  ) {
    query.sortBy = "currency";
  }
  const payload = Object.entries(exchangeRateSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "currency") && (fieldname = "currency");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "or",
      };
    });

  const {
    data: ExchangeRateData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useFetchExchangeRateDatasQuery({
    params: query,
    payload,
    page: "exchange-rate/filter",
  });
  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  EXCHANGE_RATE_COLUMNS[EXCHANGE_RATE_COLUMNS.length - 1].renderCell =
    GridActions({
      actions: getExchangeRateListGridActions(nav, setModal),
    });

  useEffect(() => {
    if (!exchangeRateSelector.view) {
      dispatch(exchangeRateSetView("card"));
    }
  }, [exchangeRateSelector.view, dispatch]);

  const handleActionClick = async (actionName) => {
    if (actionName === "New Exchange") {
      nav("newexchangerate", {
        replace: true,
        state: { id: null, type: "new" },
      });
    }
    if (actionName === "Copy") {
      nav("newexchangerate", {
        state: {
          formAction: "edit",
          initialValues: { id: seletectBox },
          type: "copy",
        },
      });
    }
    // if (actionName === "Export") {
    //   try {
    //     const blob = await ApiManager.fetchCustomerDatasExcel(
    //       query,
    //       payload,
    //       "customer"
    //     );
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "customer-data.xlsx"); // or whatever filename you want
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //   }
    // }
  };

  //   const [deleteCustomer] = useDeleteCustomerMutation();

  //   const handleClose = () => {
  //     setModal({
  //       open: false,
  //       type: "",
  //       data: {},
  //     });
  //   };

  //   const handleDelete = async () => {
  //     try {
  //       await deleteCustomer(modal.data.id).unwrap();
  //       toast.success("Customer deleted successfully!");
  //       handleClose();
  //     } catch (error) {
  //       toast.error("Failed to delete customer.");
  //     }
  //   };

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            {page == "exchangeRate" && (
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
                      // width: "150px",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                      borderRadius: 1,
                      backgroundColor: "#f0f0f0",
                      color: "black",
                      boxShadow: 3,
                      borderRadius: "20px 19px 19px 20px",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
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
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={exchangeRateSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <ExchangeRateFilters
                    filterInfo={ExchangeRateData?.counts || []}
                  />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={EXCHANGE_RATE_SORT_OPTIONS}
                  value={exchangeRateSelector.sortBy}
                  onChange={(event) => {

                    dispatch(setSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>
              <Box>
                <IconButton
                  onClick={() => dispatch(exchangeRateSetView("card"))}
                >
                  <FormatListBulletedOutlined
                    color={
                      exchangeRateSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton
                  onClick={() => dispatch(exchangeRateSetView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      exchangeRateSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />
        {exchangeRateSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={EXCHANGE_RATE_COLUMNS}
            count={ExchangeRateData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={ExchangeRateData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => { }}
            paginationModel={exchangeRateSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={exchangeRateSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(exchangeRateSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={EXCHANGE_RATE_COLUMNS}
            count={ExchangeRateData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={ExchangeRateData?.body?.data}
            paginationModel={exchangeRateSelector?.pagination}
            loading={isLoading || isFetching}
            actions={getExchangeRateListGridActions(nav, setModal)}
            // actions={getCustomerListGridActions(nav, setModal)}
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
            page={"customer"}
          />
        )}
      </Card>
      {/* <DeleteDialog
          modal={modal}
          handleClose={handleClose}
          handleDelete={handleDelete}
        /> */}
    </Box>
  );
}
