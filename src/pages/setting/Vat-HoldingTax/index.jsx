import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Drawer, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { paymentApprovalView } from "../../../store/freatures/paymentApprovalSlice";
import GridActions from "../../../components/common/Grid/GridActions";

import { TAX_COLUMNS } from "./Columns";
import { Delete as DeleteIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import BiotechIcon from "@mui/icons-material/Biotech";

import { getPendingPaymentApprovalGridActions } from "../../accounts/PendingPayable/action";
import { OutlinedButton } from "../../../components/common/Button";
import AddEditFormModal from "./AddEditFormModal";
import {
  useDeleteVatAndHoldingTaxMutation,
  useFetchVatAndHoldingQuery,
} from "../../../store/api/settingAuditAPI";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import CustomToast from "../../../components/common/Toast/CustomToast";
import { menuConfigUrl } from "../../../store/menuConfigUrl";
import AuditTimeLine from "../../../components/AuditTimeLine";

export default function VatAndHoldingTaxSettings({ page }) {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const vatAndHoldingTaxSelector = useSelector((s) => s?.vatAndHolding);
  const [deleteVatAndHoldingTax] = useDeleteVatAndHoldingTaxMutation();

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

  const { data: vatAndHoldingTaxSettingData, refetch } =
    useFetchVatAndHoldingQuery({
      params: { type: "VAT" },
      page: "settings/api",
    });

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

  const handleDeleteRow = async (data) => {
    try {
      await deleteVatAndHoldingTax(data).unwrap();
      toast.custom(
        <CustomToast
          message="Setting data deleted successfully!"
          toast="success"
        />
      );
    } catch (error) {
      toast.custom(<CustomToast message="Failed to delete." toast="error" />);
    }
  };

  const handleAudit = (data) => {
    setModal({
      open: true,
      type: "audit",
      data,
    });
  };

  console.log(modal, 345678);
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
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      width: 120,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <DeleteIcon
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDeleteRow(params.row)}
            />
            <EditIcon
              style={{ cursor: "pointer" }}
              onClick={() =>
                toggleModal("edit", {
                  id: params.row?.id,
                  value: params.row?.value,
                  type: params.row?.type || "VAT",
                })
              }
            />
          </div>
        );
      },
    },
  ];

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

              <OutlinedButton
                color="primary"
                size="small"
                onClick={() => handleAudit("VAT")}
              >
                Audit
              </OutlinedButton>
            </div>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={vatAndHoldingTaxSettingData?.body?.vatSettings}
                columns={columns}
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
              <h3>{"Holding Tax"}</h3>
              <OutlinedButton
                color="primary"
                size="small"
                onClick={() => toggleModal()}
              >
                Add
              </OutlinedButton>
              <OutlinedButton
                color="primary"
                size="small"
                onClick={() => handleAudit("HOLDING_TAX")}
              >
                Audit
              </OutlinedButton>
            </div>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={vatAndHoldingTaxSettingData?.body?.withHoldingTaxSettings}
                columns={columns}
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
      </Box>

      {modal.type === "audit" ? (
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
              Settings Audit Logs
            </Typography>
            <AuditTimeLine
              id={modal.data}
              page="settings/api"
              service={menuConfigUrl.admin}
            />
          </Box>
        </Drawer>
      ) : (
        <AddEditFormModal
          modal={modal}
          toggleModal={toggleModal}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
