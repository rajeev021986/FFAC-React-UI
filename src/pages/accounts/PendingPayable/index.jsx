import { useEffect } from "react";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardHeader, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import CardsView from "../../../components/common/Cards/CardsView";
import ScreenToolbar from "../../../components/common/ScreenToolbar";
import { useLocation, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../../components/common/Breadcrumb";
import GridSearchInput from "../../../components/common/Filter/GridSearchInput";

import {
  paymentApprovalView,
  updateInput,
  setPagination,
  paymnetApprovalSetSortModel,
} from "../../../store/freatures/paymentApprovalSlice";
import GridActions from "../../../components/common/Grid/GridActions";

import { ACCOUNTS_PENDING_PAYABLE } from "../../../data/columns/accounts";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";

import { getPayableListGridActions } from "../../payable/Actions/action";
import { getPayableListGridActionApprove } from "../../payable/Actions/appproveAction";
import FilterForm from "./FilterForm";

import { menuConfigUrl } from "../../../store/menuConfigUrl";
import { useFetchPendingPaymentDatasQuery } from "../../../store/api/accountPendingApproval";

export default function AccountsPendingPayableList({ page }) {
  //
  const paymentSelector = useSelector((s) => s?.accountsPendingPayments);
  const dispatch = useDispatch();
  const location = useLocation();
  const nav = useNavigate();

  const [seletectBox, setSelectedBox] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  console.log(modal, 3456);

  const query = {
    page: paymentSelector?.pagination?.page + 1,
    size: paymentSelector?.pagination?.pageSize,
    sortBy:
      paymentSelector.sortModel.length > 0
        ? paymentSelector.sortModel[0].field
        : paymentSelector?.sortBy?.split("*")[0],
    sortOrder:
      paymentSelector.sortModel.length > 0
        ? paymentSelector?.sortModel[0]?.sort
        : paymentSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      paymentSelector.sortModel.length > 0
        ? paymentSelector.sortModel[0].field === "cname"
        : paymentSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }
  const payload = Object.entries(paymentSelector?.formData)
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

  const {
    data: pendingPaymentsListData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchPendingPaymentDatasQuery({
    params: query,
    payload,
    page: page == "pending_payments" ? "payble/entry/filter" : "",
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  ACCOUNTS_PENDING_PAYABLE[ACCOUNTS_PENDING_PAYABLE.length - 1].renderCell =
    GridActions({
      actions:
        page == "pending_payments"
          ? getPayableListGridActions(nav, setModal)
          : "",
    });

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  useEffect(() => {
    if (!paymentSelector.view) {
      dispatch(paymentApprovalView("card"));
    }
  }, [paymentSelector.view, dispatch]);

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar leftComps={<ThemedBreadcrumb />} rightComps={<> </>} />
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          sx={{ padding: "8px" }}
          title={
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={paymentSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <FilterForm />
                </GridSearchInput>
              </Box>
              <Box>
                <IconButton
                  onClick={() => dispatch(paymentApprovalView("card"))}
                >
                  <FormatListBulletedOutlined
                    color={
                      paymentSelector.view === "card" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
                <IconButton
                  onClick={() => dispatch(paymentApprovalView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      paymentSelector.view === "grid" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        {paymentSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={ACCOUNTS_PENDING_PAYABLE}
            count={pendingPaymentsListData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={pendingPaymentsListData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={paymentSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={paymentSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(paymnetApprovalSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={ACCOUNTS_PENDING_PAYABLE}
            count={pendingPaymentsListData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={pendingPaymentsListData?.body?.data}
            paginationModel={paymentSelector?.pagination}
            loading={isLoading || isFetching}
            actions={
              page == "pending_payments"
                ? getPayableListGridActions(nav, setModal)
                : getPayableListGridActionApprove(nav, setModal)
            }
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
          />
        )}
      </Card>
    </Box>
  );
}
