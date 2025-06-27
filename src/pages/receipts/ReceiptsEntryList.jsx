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
  Drawer,
  SpeedDialIcon,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/material";

import CardsView from "../../components/common/Cards/CardsView";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { useLocation, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";

import GridActions from "../../components/common/Grid/GridActions";
import { RECEIPTS_ENTRY_COLUMNS } from "../../data/columns/receiptsEntry";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";

import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";

import { getPayableListGridActionApprove } from "../payable/Actions/appproveAction";

import toast, { LoaderIcon } from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";

import { menuConfigUrl } from "../../store/menuConfigUrl";
import { downloadBase64PDF, downloadExcel } from "../../utils/downloadExcel";
import { usePrintPayableEntryMutation } from "../../store/api/payableApi";
import {
  useDeleteReceiptsMutation,
  useFetchAllCustomerReceiptsQuery,
} from "../../store/api/receiptsApi";
import { getReceiptseListGridActions } from "./Actions/action";
import DeleteDialog from "../../components/common/DeleteDialog";
import AuditTimeLine from "../../components/AuditTimeLine";
import FilterForm from "./Actions/FilterForm";
import {
  receiptsEntrySetView,
  updateInput,
  setPagination,
  setSortModel,
} from "../../store/freatures/receiptsEntrySlice";
export default function PayableListScreen({ page }) {
  const receitptSelector = useSelector((state) => state.receiptsEntry);
  const location = useLocation();

  const primaryColor = useSelector((state) => state.dashboard.theme);

  const nav = useNavigate();
  const dispatch = useDispatch();
  const [deleteReceipts] = useDeleteReceiptsMutation();
  const [exportLoader, setExportLoader] = useState(false);
  const [seletectBox, setSelectedBox] = useState("");
  const [status, setStatus] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  console.log(modal, "modal");
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [
        { name: "Add Receipts" },
        { name: "Copy" },
        // { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : page == "receiptsEntry_approve"
    ? [{ name: exportLoader ? <LoaderIcon /> : "Export" }]
    : [
        { name: "Add Receipts" },
        // { name: exportLoader ? <LoaderIcon /> : "Export" },
      ];

  const query = {
    page: receitptSelector?.pagination?.page + 1,
    size: receitptSelector?.pagination?.pageSize,
    sortBy:
      receitptSelector.sortModel.length > 0
        ? receitptSelector.sortModel[0].field
        : receitptSelector?.sortBy?.split("*")[0],
    sortOrder:
      receitptSelector.sortModel.length > 0
        ? receitptSelector?.sortModel[0]?.sort
        : receitptSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      receitptSelector.sortModel.length > 0
        ? receitptSelector.sortModel[0].field === "cname"
        : receitptSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }
  const payload = Object.entries(receitptSelector?.formData)
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
    data: receipLisData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchAllCustomerReceiptsQuery({
    params: query,
    payload,
    page: page == "receiptsEntry" ? "receivable/receipt/filter" : "",
  });
  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  RECEIPTS_ENTRY_COLUMNS[RECEIPTS_ENTRY_COLUMNS.length - 1].renderCell =
    GridActions({
      actions:
        page == "receiptsEntry"
          ? getReceiptseListGridActions(nav, setModal)
          : getPayableListGridActionApprove(nav, setModal),
    });

  const handleActionClick = async (actionName) => {
    if (actionName === "Add Receipts") {
      nav("newEntry", {
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
          page: "receiptsEntry",
          filename: "receiptsEntry-data.xlsx",
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
  const handleDelete = async () => {
    try {
      await deleteReceipts(modal.data.id)
        .unwrap()
        .then(() => refetch());
      toast.custom(
        <CustomToast
          message="Receivable deleted successfully!"
          toast="success"
        />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to delete Receivable." toast="error" />,
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
    if (!receitptSelector.view) {
      dispatch(receiptsEntrySetView("card"));
    }
  }, [receitptSelector.view, dispatch]);

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
            {(page == "receiptsEntry" || page == "payable_approve") && (
              <SpeedDial
                ariaLabel="Text-only SpeedDial"
                sx={{
                  "& .MuiFab-root": {
                    width: 40,
                    height: 40,
                    minHeight: 40,
                  },

                  gap: 1,
                }}
                direction="left"
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
                      // <Box
                      //   sx={{
                      //     display: "flex",
                      //     alignItems: "center",
                      //     gap: 1,
                      //   }}
                      // >
                      //   {action.icon}
                      <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                        {action.name}
                      </span>
                      // </Box>
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
                  filters={receitptSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <FilterForm />
                </GridSearchInput>
              </Box>

              <ToggleButtonGroup
                value={receitptSelector.view}
                exclusive
                onChange={(e, newValue) => {
                  if (newValue !== null)
                    dispatch(receiptsEntrySetView(newValue));
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

        {receitptSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={RECEIPTS_ENTRY_COLUMNS}
            count={receipLisData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={receipLisData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={receitptSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={receitptSelector.sortModel}
            onSortModelChange={(sortModel) => dispatch(setSortModel(sortModel))}
            storageKey="PayableListDataGrid"
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={RECEIPTS_ENTRY_COLUMNS}
            count={receipLisData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={receipLisData?.body?.data}
            paginationModel={receitptSelector?.pagination}
            loading={isLoading || isFetching}
            actions={
              page == "receiptsEntry"
                ? getReceiptseListGridActions(nav, setModal)
                : getPayableListGridActionApprove(nav, setModal)
            }
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
          />
        )}
      </Card>
      <DeleteDialog
        source={modal?.data?.deleteName?.receiptRefNo}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
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
              Receipt Audit Logs
            </Typography>

            <AuditTimeLine
              id={modal.data.id}
              page="receivable/receipt"
              service={menuConfigUrl.receipts}
            />
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
