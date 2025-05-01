import { useEffect } from "react";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardHeader,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
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
import { downloadExcel } from "../../utils/downloadExcel";

import {
  useFetchPaybleEntryDatasQuery,
  useDeletePaybleEntryMutation,
} from "../../store/api/payableApi";
import AddRejectedRemarks from "../JobEntry/RejectedRemarks";
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
  const handleApprove = async () => {
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
    } catch (error) {
      toast.custom(<CustomToast message="Failed to approve." toast="error" />, {
        closeButton: false,
      });
    }
  };
  const handleCancel = async () => {
    const jobStatus = modal?.data?.label;
    if (jobStatus === "Approved Successfully") {
      toast.custom(
        <CustomToast
          message="Cannot cancel an approved payable."
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
            {(page == "payable_list" || page == "payable_approve") && (
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
          sx={{ padding: "8px" }}
          title={
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={payableActionSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <FilterForm />
                </GridSearchInput>
              </Box>
              <Box>
                <IconButton
                  onClick={() => dispatch(payableDashboardView("card"))}
                >
                  <FormatListBulletedOutlined
                    color={
                      payableActionSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton
                  onClick={() => dispatch(payableDashboardView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      payableActionSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
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
            columnVisibilityHandler={() => {}}
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
      <AddRejectedRemarks
        rowId={modal?.data?.id}
        handleOpen={modal.open && modal.type === "reject"}
        handleClose={handleClose}
        type="PAYBLE_ENTRY"
      />
      <CancelModalApprove
        rowId={modal?.data?.id}
        sourceName={modal?.data?.vendorName}
        handleOpen={modal.open && modal.type === "cancel"}
        handleClose={handleClose}
        handleCancel={handleCancel}
      />
      <ApprovePayableModal
        rowId={modal?.data?.id}
        sourceName={modal?.data?.vendorName}
        handleOpen={modal.open && modal.type === "approve"}
        handleClose={handleClose}
        handleApprove={handleApprove}
      />
      <DeleteDialog
        source="payable_list"
        sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
      {modal.open && modal.type === "document" && (
        <PayableViewModal
          open={modal.open}
          data={modal.data}
          onClose={() => setModal((prev) => ({ ...prev, open: false }))}
        />
      )}
    </Box>
  );
}
