import {
  Backdrop,
  Box,
  Card,
  CardHeader,
  Drawer,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  useDeleteExchangeRateMutation,
  useFetchExchangeRateDatasQuery,
  useLazyGetExchangeRateAuditQuery,
} from "../../store/api/exchangeRateDataApi";
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
import DeleteDialog from "../../components/common/DeleteDialog";
import toast, { LoaderIcon } from "react-hot-toast";
import ApiManager from "../../services/ApiManager";
import AuditTimeLine from "../../components/AuditTimeLine";
import CustomToast from "../../components/common/Toast/CustomToast";

export function ExchangeRate({ page }) {
  const exchangeRateSelector = useSelector((state) => state.exchangeRateStore);
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [seletectBox, setSelectedBox] = useState("");
  const [exportLoader, setExportLoader] = useState(false);
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = React.useState(false);
  const actions = [
    { name: "New Exchange" },
    { name: exportLoader ? <LoaderIcon /> : "Export" },
  ];

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
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "currency") && (fieldname = "currency");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
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
    if (actionName === "Export") {
      setExportLoader(true);
      try {
        const blob = await ApiManager.fetchDatasExcel({
          query: query,
          payload: payload,
          service: "admin-service",
          page: "exchange-rate",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "exchangerate-data.xlsx"); // or whatever filename you want
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {}
      setExportLoader(false);
    }
  };

  const [deleteExchangeRate] = useDeleteExchangeRateMutation();

  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deleteExchangeRate(modal.data.id).unwrap();
      toast.custom(
        <CustomToast
          message="Exchange Rate deleted successfully!"
          toast="success"
        />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to delete exchange rate." toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };

  const [getPortAudit, { data: AuditData, isLoading: isLoadingAudit }] =
    useLazyGetExchangeRateAuditQuery();
  const fetchUserAudit = () => {
    getPortAudit({
      id: modal.data.id,
    });
  };

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
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                      borderRadius: 1,
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
          sx={{ margin: 0, padding: 1 }}
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={exchangeRateSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <ExchangeRateFilters />
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
            columnVisibilityHandler={() => {}}
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
      {modal.type === "audit" && (
        <Drawer
          anchor="right"
          open={modal?.open}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          sx={{
            width: "50vw",
            display: "flex",
            flexDirection: "column",
            zIndex: 1301,
          }}
        >
          <Box>
            <Typography variant="h6" component="div" margin="8px">
              Exchange Rate Audit Logs
            </Typography>
            <AuditTimeLine
              auditDetails={AuditData}
              reloadDataHandler={fetchUserAudit}
              loading={isLoadingAudit}
            />
          </Box>
        </Drawer>
      )}
      <DeleteDialog
        source="exchangerate"
        sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
    </Box>
  );
}
