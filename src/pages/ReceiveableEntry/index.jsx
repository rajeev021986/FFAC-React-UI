import React, { useState, useEffect } from "react";
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

import GridActions from "../../components/common/Grid/GridActions";
import { RECIVEABLE_COLUMNS } from "../../data/columns/recieveableColumn";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";

import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

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
  useDeletePaybleEntryMutation,
  usePrintPayableEntryMutation,
} from "../../store/api/payableApi";
import CancelModalApprove from "../JobEntry/CancelModalApprove";
import ApiManager from "../../services/ApiManager";
// import ApprovePayableModal from "./AddReceievevaleForm/ApprovePayableModal";
import PayableViewModal from "./Actions/PayableViewModal";
import AddRejectedRemarks from "../JobEntry/RejectedRemarks";
import { getReceiveableEntryGridActionApprove } from "../accounts/PendingPayable/actionCopy";
import { useFetchReceivableDatasQuery } from "../../store/api/receivableApi";
import {
  receivableEntryView,
  updateInput,
  receivableEntrySetSortModel,
  setPagination,
} from "../../store/freatures/ReceivableEntrySlice";

export default function ReceivableEntryList({ page }) {
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const receivableEntrySelector = useSelector((s) => s?.receivableEntry);

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
        { name: "Add Entry" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : page === "recieveable_approve"
    ? [{ name: exportLoader ? <LoaderIcon /> : "Export" }]
    : [
        { name: "Add Entry" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ];

  const query = {
    page: receivableEntrySelector?.pagination?.page + 1,
    size: receivableEntrySelector?.pagination?.pageSize,
    sortBy:
      receivableEntrySelector.sortModel.length > 0
        ? receivableEntrySelector.sortModel[0].field
        : receivableEntrySelector?.sortBy?.split("*")[0],
    sortOrder:
      receivableEntrySelector.sortModel.length > 0
        ? receivableEntrySelector?.sortModel[0]?.sort
        : receivableEntrySelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      receivableEntrySelector.sortModel.length > 0
        ? receivableEntrySelector.sortModel[0].field === "cname"
        : receivableEntrySelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }
  const payload = Object.entries(receivableEntrySelector?.formData)
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
    data: receiveableLisData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchReceivableDatasQuery({
    params: query,
    payload,
    page: page == "receivableEntry" ? "receivable/filter" : "",
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  RECIVEABLE_COLUMNS[RECIVEABLE_COLUMNS.length - 1].renderCell = GridActions({
    actions:
      page == "receivableEntry"
        ? getReceiveableEntryGridActionApprove(nav, setModal)
        : "",
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
          page: "receivableEntry",
          filename: "receivableEntry-data.xlsx",
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
    console.log("modal?.data?", modal?.data);
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
      console.log("no charge");
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
    if (!receivableEntrySelector.view) {
      dispatch(receivableEntryView("card"));
    }
  }, [receivableEntrySelector.view, dispatch]);

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            {(page == "receivableEntry" || page == "recieveable_approve") && (
              <SpeedDial
                ariaLabel="Text-only  SpeedDial"
                sx={{
                  "& .MuiFab-root": {
                    width: 40,
                    height: 40,
                    minHeight: 40,
                  },
                }}
                icon={
                  <SpeedDialIcon
                    sx={{
                      fontSize: 20,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                }
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
                      px: 2,
                      py: 1,
                      borderRadius: "20px",
                      minWidth: 92,
                      width: "auto",
                      height: 36,
                      boxShadow: 3,
                      textTransform: "none",
                      fontSize: "12px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
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
          sx={{ padding: "8px" }}
          title={
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={receivableEntrySelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <FilterForm />
                </GridSearchInput>
              </Box>
              <Box>
                <IconButton
                  onClick={() => dispatch(receivableEntryView("card"))}
                >
                  <FormatListBulletedOutlined
                    color={
                      receivableEntrySelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton
                  onClick={() => dispatch(receivableEntryView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      receivableEntrySelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        {receivableEntrySelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={RECIVEABLE_COLUMNS}
            count={receiveableLisData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={receiveableLisData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={receivableEntrySelector.pagination}
            loading={isLoading || isFetching}
            sortModel={receivableEntrySelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(receivableEntrySetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={RECIVEABLE_COLUMNS}
            count={receiveableLisData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={receiveableLisData?.body?.data}
            paginationModel={receivableEntrySelector?.pagination}
            loading={isLoading || isFetching}
            actions={
              page == "receivableEntry"
                ? getReceiveableEntryGridActionApprove(nav, setModal)
                : ""
            }
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
          />
        )}
      </Card>

      {/* {modal.type === "audit" && (
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
      )} */}

      {/* <CancelModalApprove
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
      )} */}
    </Box>
  );
}
