import { useEffect } from "react";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardHeader, IconButton, Stack } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  paymentApprovalView,
  setPagination,
  paymnetApprovalSetSortModel,
} from "../../../store/freatures/paymentApprovalSlice";
import GridActions from "../../../components/common/Grid/GridActions";

import { TAX_COLUMNS } from "./Columns";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";

import { getPendingPaymentApprovalGridActions } from "../../accounts/PendingPayable/action";
import { useFetchPendingPaymentDatasQuery } from "../../../store/api/accountPendingApproval";
import { ThemeButton } from "../../../components/common/Button";

export default function VatAndHoldingTaxSettings({ page }) {
  //
  const paymentSelector = useSelector((s) => s?.accountsPendingPayments);
  const dispatch = useDispatch();
  const location = useLocation();
  const nav = useNavigate();
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
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
    page: page == "pending_payments" ? "pending/payble/filter" : "",
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  TAX_COLUMNS[TAX_COLUMNS.length - 1].renderCell = GridActions({
    actions:
      page == "pending_payments"
        ? getPendingPaymentApprovalGridActions(nav, setModal)
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
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          sx={{ padding: "8px" }}
          title={
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <ThemeButton
                  //   onClick={() => toggleRateModal()}
                  sx={{
                    fontWeight: "500",
                    color: "white !important",
                    height: "44px",
                    padding: "5px 20px",
                    te,
                  }}
                >
                  Add Setting
                </ThemeButton>
              </Box>
            </Stack>
          }
        />

        <ThemedGrid
          uniqueId="id"
          columns={TAX_COLUMNS}
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
      </Card>
    </Box>
  );
}
