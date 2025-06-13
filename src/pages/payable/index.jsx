// #a27bb7

import React, { useState, useEffect } from "react";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Drawer, IconButton, Stack } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

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
import SpeedDialAction from "@mui/material/SpeedDialAction";

import { FiPlus } from "react-icons/fi";
import { IoDocumentTextOutline } from "react-icons/io5";

import { getPayableListGridActions } from "./Actions/action";
import { getPayableListGridActionApprove } from "./Actions/appproveAction";

import DeleteDialog from "../../components/common/DeleteDialog";
import toast from "react-hot-toast";
import AuditTimeLine from "../../components/AuditTimeLine";
import CustomToast from "../../components/common/Toast/CustomToast";
import FilterForm from "./Actions/FilterForm";

import { menuConfigUrl } from "../../store/menuConfigUrl";
import { downloadBase64PDF, downloadExcel } from "../../utils/downloadExcel";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import {
  useFetchPaybleEntryDatasQuery,
  useDeletePaybleEntryMutation,
  usePrintPayableEntryMutation,
} from "../../store/api/payableApi";
import CancelModalApprove from "../JobEntry/CancelModalApprove";
import ApiManager from "../../services/ApiManager";
import ApprovePayableModal from "./AddPayableForm/ApprovePayableModal";
import PayableViewModal from "./Actions/PayableViewModal";
import AddRejectedRemarks from "../JobEntry/RejectedRemarks";
import InputBox from "../../components/common/InputBox";
import { getTheme } from "../../config/theme";

export default function PayableListScreen({ page }) {
  const payableActionSelector = useSelector((state) => state.payableAction);
  const location = useLocation();

  const primaryColor = useSelector((state) => state.dashboard.theme);

  const nav = useNavigate();
  const dispatch = useDispatch();

  const [exportLoader, setExportLoader] = useState(false);
  const [seletectBox, setSelectedBox] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });

  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [
        { name: "New Entry", icon: <FiPlus size={16} /> },
        {
          name: "Export",
          icon: exportLoader ? (
            <AiOutlineLoading3Quarters className="animate-spin" size={14} />
          ) : (
            <IoDocumentTextOutline size={16} />
          ),
        },
      ]
    : page === "payable_approve"
    ? [
        {
          name: "Export",
          icon: exportLoader ? (
            <AiOutlineLoading3Quarters className="animate-spin" size={16} />
          ) : (
            <IoDocumentTextOutline size={16} />
          ),
        },
      ]
    : [
        { name: "New Entry", icon: <FiPlus size={16} /> },
        {
          name: "Export",
          icon: exportLoader ? (
            <AiOutlineLoading3Quarters className="animate-spin" size={16} />
          ) : (
            <IoDocumentTextOutline size={16} />
          ),
        },
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

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleClear = () => {
    setStatus("");
  };

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            {(page == "payable_list" || page == "payable_approve") && (
              <SpeedDial
                ariaLabel="Text-only SpeedDial"
                open={true}
                onOpen={() => {}}
                onClose={() => {}}
                FabProps={{ sx: { display: "none" } }}
                sx={{
                  "& .MuiFab-root": {
                    width: 40,
                    height: 40,
                    minHeight: 40,
                    paddingRight: "26px !important",
                  },
                  "& .MuiSpeedDial-actions": {
                    paddingRight: "25px",
                  },
                  gap: 1,
                }}
                direction="left"
                icon={null}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    tooltipTitle=""
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      px: 2,
                      py: 1,
                      borderRadius: "10px",
                      minWidth: 110,
                      width: "auto",
                      height: 36,
                      boxShadow: 3,
                      textTransform: "none",
                      fontSize: "12px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      gap: 1,
                    }}
                    icon={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {action.icon}
                        <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                          {action.name}
                        </span>
                      </Box>
                    }
                    onClick={() => handleActionClick(action.name)}
                  />
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

                <FormControl
                  sx={{
                    minWidth: 220,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      height: "43px",
                    },
                  }}
                  size="small"
                >
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status-select"
                    value={status}
                    label="Status"
                    onChange={handleChange}
                    endAdornment={
                      status && (
                        <IconButton
                          onClick={handleClear}
                          size="small"
                          sx={{ mr: 1 }}
                          aria-label="clear"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <MenuItem disabled value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="new">New & Pending</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inActive">In-Active</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="cancel">Cancel</MenuItem>
                  </Select>
                </FormControl>

                <InputBox
                  label="Payable Ref. No."
                  id="paybleRefNo"
                  // value={formik.values.paybleRefNo}
                  // onChange={formik.handleChange}
                />
              </Box>

              <ToggleButtonGroup
                value={payableActionSelector.view}
                exclusive
                onChange={(e, newValue) => {
                  if (newValue !== null)
                    dispatch(payableDashboardView(newValue));
                }}
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: `1px solid ${primaryColor}`,
                }}
              >
                <ToggleButton
                  value="card"
                  sx={{
                    border: "none",
                    borderRadius: 0,
                    color: primaryColor,
                    "&.Mui-selected": {
                      backgroundColor: primaryColor,
                      color: "#fff",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#000",
                    },
                  }}
                >
                  <FormatListBulletedOutlined />
                </ToggleButton>

                <ToggleButton
                  value="grid"
                  sx={{
                    border: "none",
                    borderRadius: 0,
                    color: primaryColor,
                    "&.Mui-selected": {
                      backgroundColor: primaryColor,
                      color: "#fff",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#000",
                    },
                  }}
                >
                  <GridOnOutlined />
                </ToggleButton>
              </ToggleButtonGroup>
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
          refetch={refetch}
          onClose={() => setModal((prev) => ({ ...prev, open: false }))}
          viewType={"view"}
        />
      )}
      
      {modal.open && modal.type === "reject" && (
        <AddRejectedRemarks
          handleOpen={modal.open && modal.type === "reject"}
          handleClose={handleClose}
          rowId={modal?.data?.id}
          type="accounts_payable"
          label="Reject Reason"
          refetch={refetch}
        />
      )}
    </Box>
  );
}
