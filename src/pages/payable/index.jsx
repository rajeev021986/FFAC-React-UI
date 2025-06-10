import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import { Drawer, IconButton, Stack } from "@mui/material";

import CardsView from "../../components/common/Cards/CardsView";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { useLocation, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import {
  payableDashboardView,
  updateInput,
  setPagination,
  payableSetSortModal,
} from "../../store/freatures/payableEntrySlice";

import GridActions from "../../components/common/Grid/GridActions";
import { PAYABLE_COLUMNS } from "../../data/columns/paybleColumn";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";

import Backdrop from "@mui/material/Backdrop";
// import SpeedDial from "@mui/material/SpeedDial";
// import SpeedDialIcon from "@mui/material/SpeedDialIcon";
// import SpeedDialAction from "@mui/material/SpeedDialAction";

import { getPayableListGridActions } from "./Actions/action";
import { getPayableListGridActionApprove } from "./Actions/appproveAction";

import DeleteDialog from "../../components/common/DeleteDialog";
import toast, { LoaderIcon } from "react-hot-toast";
import AuditTimeLine from "../../components/AuditTimeLine";
import CustomToast from "../../components/common/Toast/CustomToast";
import FilterForm from "./Actions/FilterForm";

import { menuConfigUrl } from "../../store/menuConfigUrl";
import { downloadBase64PDF, downloadExcel } from "../../utils/downloadExcel";

import {
  useFetchPaybleEntryDatasQuery,
  useDeletePaybleEntryMutation,
  usePrintPayableEntryMutation,
} from "../../store/api/payableApi";
import CancelModalApprove from "../JobEntry/CancelModalApprove";
import ApiManager from "../../services/ApiManager";
import ApprovePayableModal from "./AddPayableForm/ApprovePayableModal";
import PayableViewModal from "./Actions/PayableViewModal";

export default function PayableListScreen({ page }) {
  const payableActionSelector = useSelector((state) => state.payableAction);
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const [exportLoader, setExportLoader] = useState(false);
  const [seletectBox, setSelectedBox] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });

  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [
      { name: "New Entry" },
      { name: "Copy" },
      { name: exportLoader ? <LoaderIcon /> : "Export" },
    ]
    : page === "payable_approve"
      ? [{ name: exportLoader ? <LoaderIcon /> : "Export" }]
      : [
        { name: "New Entry" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ];

  const query = {
    page: payableActionSelector?.pagination?.page + 1,
    size: payableActionSelector?.pagination?.pageSize,
    sortBy:
      payableActionSelector.sortModel.length > 0
        ? payableActionSelector.sortModel[0].field
        : payableActionSelector?.sortBy?.split("*")[0],
    sortOrder:
      payableActionSelector.sortModel.length > 0
        ? payableActionSelector?.sortModel[0]?.sort
        : payableActionSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      payableActionSelector.sortModel.length > 0
        ? payableActionSelector.sortModel[0].field === "cname"
        : payableActionSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }
  const payload = Object.entries(payableActionSelector?.formData)
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
    data: payableLisData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchPaybleEntryDatasQuery({
    params: query,
    payload,
    page:
      page == "payable_list"
        ? "payble/entry/filter"
        : "approval/filter/PAYBLE_ENTRY",
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  PAYABLE_COLUMNS[PAYABLE_COLUMNS.length - 1].renderCell = GridActions({
    actions:
      page == "payable_list"
        ? getPayableListGridActions(nav, setModal)
        : getPayableListGridActionApprove(nav, setModal),
  });

  const handleActionClick = async (actionName) => {
    if (actionName === "New Entry") {
      nav("addpayable", {
        replace: true,
        state: { formAction: "add" },
      });
    }
    if (actionName === "Export") {
      setExportLoader(true);
      try {
        await downloadExcel({
          query: query,
          payload: payload,
          service: `${menuConfigUrl.entity}`,
          page: "payable_list",
          filename: "payable_list-data.xlsx",
        });
      } catch (error) {
        toast.custom(
          <CustomToast message="Something went wrong" toast="error" />,
          {
            closeButton: false,
          }
        );
      }
      setExportLoader(false);
    }
  };

  const [deletePaybleEntry] = useDeletePaybleEntryMutation();
  const [printPayableEntry] = usePrintPayableEntryMutation();

  const handleApprove = async () => {
    // Validation logic
    if (modal?.data?.vendorInvoiceNo && !modal?.data?.isDoc) {
      toast.custom(
        <CustomToast
          message="Please submit document as invoice type"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
      return; // Prevent approval
    }
    if (modal?.data?.noOfCharges === 0) {
      toast.custom(
        <CustomToast
          message="Please add charge details before approving"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
      return; // Prevent approval
    }

    const jobStatus = modal?.data?.label;
    if (jobStatus === "Cancelled Successfully") {
      toast.custom(
        <CustomToast
          message="Cannot approve a cancelled payable entry."
          toast="error"
        />
      );
      return;
    }

    try {
      const response = await ApiManager.approveJobEntryRequest(
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
      toast.custom(<CustomToast message="Failed to approve." toast="error" />, {
        closeButton: false,
      });
    }
  };

  const handleCancel = async () => {
    const statusCode = modal?.data?.statusCode;
    if (statusCode === 100) {
      toast.custom(
        <CustomToast
          message="Cannot cancel paid payable entry."
          toast="error"
        />
      );
      return;
    }

    try {
      const response = await ApiManager.canceljobEntryApprove(
        modal?.data?.id,
        "PAYBLE_ENTRY"
      );
      const message = response.message;
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
      handleClose();
    } catch (error) {
      toast.custom(<CustomToast message="Failed to cancel." toast="error" />, {
        closeButton: false,
      });
    }
  };

  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deletePaybleEntry(modal.data.id)
        .unwrap()
        .then(() => refetch());
      toast.custom(
        <CustomToast
          message="Customer deleted successfully!"
          toast="success"
        />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to delete customer." toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };

  const handlePrintPDF = async () => {
    try {
      const resp = await printPayableEntry(modal?.data?.data?.id).unwrap();
      downloadBase64PDF(resp?.body, modal?.data?.data?.payableRefNo);
      toast.custom(
        <CustomToast message="Download PDF successfully!" toast="success" />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to download PDF!" toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };

  useEffect(() => {
    if (modal?.type === "print") {
      handlePrintPDF();
    }
  }, [modal]);

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  useEffect(() => {
    if (!payableActionSelector.view) {
      dispatch(payableDashboardView("card"));
    }
  }, [payableActionSelector.view, dispatch]);

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            {(page === "payable_list" || page === "payable_approve") && (
              <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                <Button
                  variant="outlined"
                  startIcon={<svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    width="20"
                    height="20"
                    fill="currentColor"  // uses text color of the button
                  >
                    <path d="M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z" />
                  </svg>}
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                  onClick={() => handleActionClick("Export Data")}
                >
                  Export Data
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#fff"
                  }}
                  startIcon={<AddIcon />}
                  onClick={() => handleActionClick("New Entry")}
                >
                  New Entry
                </Button>

              </div>
            )}
          </>
        }
      />

      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          sx={{ padding: "10px 15px", borderBottom: "1px solid #ECECEC" }}
          title={
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <h3 style={{ margin: 0 }}>Payable List</h3>
                <Box sx={{ display: "flex", }}>
                  <GridSearchInput
                    filters={payableActionSelector?.formData}
                    setFilters={(filters) => dispatch(updateInput(filters))}

                  >
                    <FilterForm />
                  </GridSearchInput>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  border: "1px solid",
                  borderColor: "primary.main",
                  borderRadius: "6px",
                  overflow: "hidden",
                  width: "fit-content",
                }}
              >
                <IconButton
                  onClick={() => dispatch(payableDashboardView("card"))}
                  sx={{
                    backgroundColor:
                      payableActionSelector.view === "card" ? "primary.main" : "common.white",
                    color:
                      payableActionSelector.view === "card" ? "common.white" : "primary.main",
                    borderRadius: 0,
                    padding: "6px 8px",
                    "&:hover": {
                      backgroundColor:
                        payableActionSelector.view === "card"
                          ? "primary.dark"
                          : "primary.light",
                      color:
                        payableActionSelector.view === "card"
                          ? "common.white"
                          : "primary.dark",
                    },
                  }}
                >
                  <FormatListBulletedOutlined />
                </IconButton>

                <IconButton
                  onClick={() => dispatch(payableDashboardView("grid"))}
                  sx={{
                    backgroundColor:
                      payableActionSelector.view === "grid" ? "primary.main" : "common.white",
                    color:
                      payableActionSelector.view === "grid" ? "common.white" : "primary.main",
                    borderRadius: 0,
                    padding: "6px 8px",
                    "&:hover": {
                      backgroundColor:
                        payableActionSelector.view === "grid"
                          ? "primary.dark"
                          : "primary.light",
                      color:
                        payableActionSelector.view === "grid"
                          ? "common.white"
                          : "primary.dark",
                    },
                  }}
                >
                  <GridOnOutlined />
                </IconButton>
              </Box>

            </Stack>
          }
        />
        {payableActionSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={PAYABLE_COLUMNS}
            count={payableLisData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={payableLisData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => { }}
            paginationModel={payableActionSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={payableActionSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(payableSetSortModal(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={PAYABLE_COLUMNS}
            count={payableLisData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={payableLisData?.body?.data}
            paginationModel={payableActionSelector?.pagination}
            loading={isLoading || isFetching}
            actions={
              page == "payable_list"
                ? getPayableListGridActions(nav, setModal)
                : getPayableListGridActionApprove(nav, setModal)
            }
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
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
              Payable Audit Logs
            </Typography>

            <AuditTimeLine
              id={modal.data.id}
              page="payble/entry"
              service={menuConfigUrl.document}
            />
          </Box>
        </Drawer>
      )}

      <CancelModalApprove
        rowId={modal?.data?.id}
        sourceName={modal?.data?.payableRefNo}
        handleOpen={modal.open && modal.type === "cancel"}
        handleClose={handleClose}
        handleCancel={handleCancel}
      />
      <ApprovePayableModal
        rowId={modal?.data?.id}
        sourceName={modal?.data?.payableRefNo}
        handleOpen={modal.open && modal.type === "approve"}
        handleClose={handleClose}
        handleApprove={handleApprove}
      />
      <DeleteDialog
        source={modal?.data?.deleteName?.payableRefNo}
        // sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
      {modal.open && modal.type === "document" && (
        <PayableViewModal
          open={modal.open}
          data={modal.data}
          onClose={() => setModal((prev) => ({ ...prev, open: false }))}
          viewType={"view"}
        />
      )}
    </Box>
  );
}
