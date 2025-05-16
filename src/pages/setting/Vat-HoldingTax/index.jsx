import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardHeader, Grid, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  paymentApprovalView,
  setPagination,
  paymnetApprovalSetSortModel,
} from "../../../store/freatures/paymentApprovalSlice";
import GridActions from "../../../components/common/Grid/GridActions";

import { TAX_COLUMNS } from "./Columns";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";

import { Delete as DeleteIcon } from "@mui/icons-material";

import { getPendingPaymentApprovalGridActions } from "../../accounts/PendingPayable/action";
import { OutlinedButton, ThemeButton } from "../../../components/common/Button";
import AddEditFormModal from "./AddEditFormModal";
import { useFetchVatAndHoldingQuery } from "../../../store/api/settingAuditAPI";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import CustomToast from "../../../components/common/Toast/CustomToast";

export default function VatAndHoldingTaxSettings({ page }) {
  const vatAndHoldingTaxSelector = useSelector((s) => s?.vatAndHolding);
  const dispatch = useDispatch();
  const location = useLocation();
  const nav = useNavigate();
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });

  const query = {
    page: vatAndHoldingTaxSelector?.pagination?.page + 1,
    size: vatAndHoldingTaxSelector?.pagination?.pageSize,
    sortBy:
      vatAndHoldingTaxSelector.sortModel.length > 0
        ? vatAndHoldingTaxSelector.sortModel[0].field
        : vatAndHoldingTaxSelector?.sortBy?.split("*")[0],
    sortOrder:
      vatAndHoldingTaxSelector.sortModel.length > 0
        ? vatAndHoldingTaxSelector?.sortModel[0]?.sort
        : vatAndHoldingTaxSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      vatAndHoldingTaxSelector.sortModel.length > 0
        ? vatAndHoldingTaxSelector.sortModel[0].field === "cname"
        : vatAndHoldingTaxSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }
  const payload = Object.entries(vatAndHoldingTaxSelector?.formData)
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
    data: vatAndHoldingTaxSettingData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchVatAndHoldingQuery({
    params: { type: "VAT" },
    page: "settings/api",
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
    if (!vatAndHoldingTaxSelector.view) {
      dispatch(paymentApprovalView("card"));
    }
  }, [vatAndHoldingTaxSelector.view, dispatch]);

  const toggleModal = (type = "", data = {}) => {
    setModal({
      open: true,
      type,
      data,
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDeleteRow = (id) => {
    toast.custom(
      <CustomToast message="Click Save to confirm deletion" toast="info" />,
      {
        closeButton: false,
      }
    );
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {};

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "value",
      headerName: "Value",
      align: "center",
      headerAlign: "center",
      width: 150,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      width: 100,
      renderCell: (params) => (
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => handleDeleteRow(params.id)}
        />
      ),
    },
  ];

  console.log(vatAndHoldingTaxSettingData, "vatAndHoldingTaxSettingData");
  return (
    <div style={{ padding: "1rem" }}>
      <Box sx={{ backgroundColor: "white.main" }}>
        <Grid container spacing={2} flexWrap={"wrap"}>
          <Grid item xs={12} md={4} sm={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "50px",
              }}
            >
              <h3>{"VAT Rate"}</h3>
              <OutlinedButton
                color="primary"
                size="small"
                onClick={() => toggleModal()}
              >
                Add
              </OutlinedButton>
            </div>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={vatAndHoldingTaxSettingData?.body?.vatSettings}
                columns={columns}
                processRowUpdate={handleProcessRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                disableRowSelectionOnClick
                autoHeight={false}
                hideFooter
                sx={{
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "primary.main",
                    lineHeight: 10,
                    height: "38px !important",
                  },
                  "& .MuiDataGrid-cell": {
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    fontSize: "14px",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "#fff",
                    fontSize: "14px",
                  },
                  "& .MuiDataGrid-sortIcon": {
                    color: "#fff",
                  },
                  "& .MuiDataGrid-menuIconButton .MuiSvgIcon-root": {
                    fill: "#fff",
                  },
                }}
              />
            </div>
          </Grid>

          <Grid item xs={12} md={4} sm={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "50px",
              }}
            >
              <h3>{"With Holding Tax"}</h3>
              <OutlinedButton
                color="primary"
                size="small"
                onClick={() => toggleModal()}
              >
                Add
              </OutlinedButton>
            </div>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={vatAndHoldingTaxSettingData?.body?.withHoldingTaxSettings}
                columns={columns}
                processRowUpdate={handleProcessRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                disableRowSelectionOnClick
                autoHeight={false}
                hideFooter
                sx={{
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "primary.main",
                    lineHeight: 10,
                    height: "38px !important",
                  },
                  "& .MuiDataGrid-cell": {
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    fontSize: "14px",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "#fff",
                    fontSize: "14px",
                  },
                  "& .MuiDataGrid-sortIcon": {
                    color: "#fff",
                  },
                  "& .MuiDataGrid-menuIconButton .MuiSvgIcon-root": {
                    fill: "#fff",
                  },
                }}
              />
            </div>
          </Grid>
        </Grid>

        <AddEditFormModal
          modal={modal?.open}
          toggleModal={toggleModal}
          closeModal={closeModal}
        />
      </Box>
    </div>
  );
}
