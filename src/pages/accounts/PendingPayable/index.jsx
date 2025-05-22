import { useEffect } from "react";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Link,
  Stack,
  Tooltip,
} from "@mui/material";
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

import { getPendingPaymentApprovalGridActions } from "./action";
import FilterForm from "./FilterForm";

import { useFetchPendingPaymentDatasQuery } from "../../../store/api/accountPendingApproval";
import PayCalModal from "./PayCalModal";
import toast from "react-hot-toast";
import CustomToast from "../../../components/common/Toast/CustomToast";
import ApiManager from "../../../services/ApiManager";
import PayCalMultiple from "./PayCalMultiple";
import CancelModalApprove from "../../JobEntry/CancelModalApprove";
import PayableViewModal from "../../payable/Actions/PayableViewModal";
import { getReceiveableEntryGridActionApprove } from "./actionCopy";
import AddRejectedRemarks from "../../JobEntry/RejectedRemarks";

export default function AccountsPendingPayableList({ page }) {
  //
  const paymentSelector = useSelector((s) => s?.accountsPendingPayments);
  const dispatch = useDispatch();
  const location = useLocation();
  const nav = useNavigate();
  const [firstSelectedRow, setFirstSelectedRow] = useState(null);
  const [selectedPayableIds, setSelectedPayableIds] = useState([]);
  const { pathname } = useLocation();
  const [seletectBox, setSelectedBox] = useState("");
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
    page:
      page == "pending_payments"
        ? "pending/payble/filter"
        : "pending/payble/filter",
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  ACCOUNTS_PENDING_PAYABLE[ACCOUNTS_PENDING_PAYABLE.length - 1].renderCell =
    GridActions({
      actions:
        page === "pending_payments"
          ? getPendingPaymentApprovalGridActions(nav, setModal)
          : getReceiveableEntryGridActionApprove(nav, setModal),
    });

  // handleCheckboxChange with enhanced validation
  const handleCheckboxChange = (row) => {
    setSelectedPayableIds((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(row.id);

      if (isAlreadySelected) {
        if (firstSelectedRow?.id === row.id) {
          setFirstSelectedRow(null);
          return [];
        }
        return prevSelected.filter((id) => id !== row.id);
      }

      const sameVendor =
        !firstSelectedRow || firstSelectedRow.vendorName === row.vendorName;
      const sameCurrency =
        !firstSelectedRow || firstSelectedRow.currency === row.currency;

      if (
        !sameVendor ||
        !sameCurrency ||
        row.statusCode === 100 ||
        !row.vendorName
      ) {
        return prevSelected;
      }

      if (!firstSelectedRow) {
        setFirstSelectedRow({
          id: row.id,
          vendorName: row.vendorName,
          currency: row.currency,
        });
      }

      return [...prevSelected, row.id];
    });
  };

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const PayablePendingColumns = [
    ...(page === "pending_payments" || page === "receivableEntry"
      ? [
          {
            field: "Select",
            headerName: "Select",
            width: 80,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              const isChecked = selectedPayableIds.includes(params.row.id);
              const sameVendor =
                !firstSelectedRow ||
                firstSelectedRow.vendorName === params.row.vendorName;
              const sameCurrency =
                !firstSelectedRow ||
                firstSelectedRow.currency === params.row.currency;
              const isSelectable =
                sameVendor &&
                sameCurrency &&
                params.row.statusCode !== 100 &&
                params.row.vendorName !== "";
              return (
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={!isSelectable}
                  style={{ cursor: isSelectable ? "pointer" : "not-allowed" }}
                  onChange={() =>
                    isSelectable && handleCheckboxChange(params.row)
                  }
                />
              );
            },
          },
          {
            flex: 1,
            field: "paybleRefNum",
            headerName: "Payable Ref No.",
            width: 350,
            headerAlign: "center",
            align: "center",
            editable: false,
            renderCell: (params) => {
              return (
                <Tooltip title={`${params?.value}`} arrow>
                  <div className="word-wrap-cell">
                    <Link
                      href="#"
                      underline="always"
                      style={{ color: "black" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setModal({
                          open: true,
                          type: "AccountsView",
                          data: params.row,
                        });
                      }}
                    >
                      {params.value}
                    </Link>
                  </div>
                </Tooltip>
              );
            },
          },

          ...ACCOUNTS_PENDING_PAYABLE, // Use the new columns when on "job-entry" page
        ]
      : []), // Use the default columns otherwise
  ];

  useEffect(() => {
    if (!paymentSelector.view) {
      dispatch(paymentApprovalView("card"));
    }
  }, [paymentSelector.view, dispatch]);

  const handlePayChange = async () => {
    if (selectedPayableIds.length === 0) {
      toast.custom(
        <CustomToast message="No payable entries selected!" toast="error" />
      );
      return;
    }
    const selectedData = pendingPaymentsListData?.body?.data?.filter((item) =>
      selectedPayableIds.includes(item.id)
    );

    setModal({
      open: true,
      type: "bulk",
      data: selectedData,
    });
  };

  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleCancel = async () => {
    const jobStatus = modal?.data?.statusCode;
    if (jobStatus === 100) {
      toast.custom(
        <CustomToast message="Cannot cancel a paid payable." toast="error" />
      );
      return;
    }
    try {
      const response = await ApiManager.cancelPendingPayable(
        modal?.data?.id,
        "PAYBLE_ENTRY"
      );
      const message = response.message;
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
      handleClose();
      refetch();
    } catch (error) {
      toast.custom(<CustomToast message="Failed to cancel." toast="error" />, {
        closeButton: false,
      });
    }
  };

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
                  handlePayChange={handlePayChange}
                  page={page}
                  selectedPayableIds={selectedPayableIds} // Pass selected IDs
                  setSelectedPayableIds={setSelectedPayableIds}
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
            columns={PayablePendingColumns}
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
                ? getPendingPaymentApprovalGridActions(nav, setModal)
                : getReceiveableEntryGridActionApprove(nav, setModal)
            }
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
          />
        )}
      </Card>

      {modal.type === "bulk" ? (
        <PayCalMultiple
          open={modal.open}
          data={modal.data}
          refetch={refetch}
          onClose={() => {
            setModal((prev) => ({ ...prev, open: false }));
            setSelectedPayableIds([]);
            setFirstSelectedRow(null);
          }}
        />
      ) : modal.type === "cancel" ? (
        <CancelModalApprove
          rowId={modal?.data?.id}
          sourceName={modal?.data?.paybleRefNum}
          handleOpen={modal.open && modal.type === "cancel"}
          handleClose={handleClose}
          handleCancel={handleCancel}
        />
      ) : modal.type === "AccountsView" ? (
        <PayableViewModal
          open={modal.open}
          onClose={handleClose}
          data={modal.data}
          viewType={pathname}
        />
      ) : modal.type === "reject" ? (
        <AddRejectedRemarks
          handleOpen={modal.open && modal.type === "reject"}
          handleClose={handleClose}
          rowId={modal?.data?.id}
          type="accounts_payable"
          label="Reject Reason"
        />
      ) : (
        <PayCalModal
          open={modal.open}
          data={modal.data}
          refetch={refetch}
          onClose={() => {
            setModal((prev) => ({ ...prev, open: false }));
            setSelectedPayableIds([]);
            setFirstSelectedRow(null);
          }}
        />
      )}
    </Box>
  );
}
