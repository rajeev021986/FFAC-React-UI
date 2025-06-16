import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  Drawer,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CardsView from "../../components/common/Cards/CardsView";
import AuditTimeLine from "../../components/AuditTimeLine";
import { useLazyGetShipperAuditQuery } from "../../store/api/shipperDataApi";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { useLocation, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import {
  useFetchShipperDatasQuery,
  useDeleteShipperMutation,
} from "../../store/api/shipperDataApi";
import ShipperFilters from "../../components/screen/code/Shipper/ShipperFilters";
import { useDispatch, useSelector } from "react-redux";
import {
  setPagination,
  setSortBy,
  shipperSetView,
  shipperSetSortModel,
  updateInput,
} from "../../store/freatures/shipperSlice";
import SelectBox from "../../components/common/SelectBox";
import { SHIPPER_SORT_OPTIONS } from "../../data/options";
import GridActions from "../../components/common/Grid/GridActions";
import { SHIPPER_COLUMNS } from "../../data/columns/shipper";
import { getShipperListGridActions } from "../../components/screen/code/Shipper/action";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import toast, { LoaderIcon } from "react-hot-toast";
import { useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import ApiManager from "../../services/ApiManager";
import CustomToast from "../../components/common/Toast/CustomToast";
import DeleteDialog from "../../components/common/DeleteDialog";
import ShpperFilterForm from "../../components/screen/code/Shipper/FilterForm";
import { menuConfigUrl } from "../../store/menuConfigUrl";
import { downloadExcel } from "../../utils/downloadExcel";

const ADD_NEW_SHIPPER_PATH = "new_shipper";
export default function ShipperScreen({ page }) {
  const shipperSelector = useSelector((state) => state.shipper);
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
        { name: "New Shipper" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : [
        { name: "New Shipper" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ];
  const query = {
    page: shipperSelector?.pagination?.page + 1,
    size: shipperSelector?.pagination?.pageSize,
    sortBy:
      shipperSelector.sortModel.length > 0
        ? shipperSelector.sortModel[0].field
        : shipperSelector?.sortBy?.split("*")[0],
    sortOrder:
      shipperSelector.sortModel.length > 0
        ? shipperSelector?.sortModel[0]?.sort
        : shipperSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      shipperSelector.sortModel.length > 0
        ? shipperSelector.sortModel[0].field === "sname"
        : shipperSelector?.sortBy?.split("*")[0] === "sname"
    )
  ) {
    query.sortBy = "name";
  }
  const payload = Object.entries(shipperSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "sname") && (fieldname = "name");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });

  const {
    data: ShipperData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchShipperDatasQuery({
    params: query,
    payload,
    page: "shipper/filter",
  });
  useEffect(() => {
    refetch();
  }, [location.pathname]);
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  SHIPPER_COLUMNS[SHIPPER_COLUMNS.length - 1].renderCell = GridActions({
    actions: getShipperListGridActions(nav, setModal),
  });

  useEffect(() => {
    if (!shipperSelector.view) {
      dispatch(shipperSetView("card"));
    }
  }, [shipperSelector.view, dispatch]);

  const handleActionClick = async (actionName) => {
    if (actionName === "New Shipper") {
      nav(ADD_NEW_SHIPPER_PATH, {
        replace: true,
        state: { formAction: "add", type: "new" },
      });
    }
    if (actionName === "Copy") {
      nav(`editshipper`, {
        state: {
          formAction: "edit",
          initialValues: { id: seletectBox },
          type: "copy",
        },
      });
    }

    if (actionName === "Export") {
      setExportLoader(true);
      try {
        await downloadExcel({
          query: query,
          payload: payload,
          service: `${menuConfigUrl.entity}`,
          page: "shipper",
          filename: "shipper-data.xlsx",
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

  const [deleteShipper] = useDeleteShipperMutation();
  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deleteShipper(modal.data.id)
        .unwrap()
        .then(() => refetch());
      toast.custom(
        <CustomToast message="Shipper deleted successfully!" toast="success" />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to delete shipper." toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };
  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            {page == "shipper" && (
              <SpeedDial
                ariaLabel="Text-only  SpeedDial"
                sx={{
                  "& .MuiFab-root": {
                    width: 50, // Adjust main button width
                    height: 50, // Adjust main button height
                    minHeight: 50, // Set minimum height
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
                      // width: "150px",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                      borderRadius: 1,
                      boxShadow: 3,
                      borderRadius: "20px 19px 19px 20px",
                      // "&:hover": {
                      //   backgroundColor: "#e0e0e0",
                      // },
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
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={shipperSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <ShpperFilterForm />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={SHIPPER_SORT_OPTIONS}
                  value={shipperSelector.sortBy}
                  onChange={(event) => {
                    dispatch(setSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>
              <Box>
                <IconButton onClick={() => dispatch(shipperSetView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      shipperSelector.view === "card" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(shipperSetView("grid"))}>
                  <GridOnOutlined
                    color={
                      shipperSelector.view === "grid" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />
        {shipperSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={SHIPPER_COLUMNS}
            count={ShipperData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={ShipperData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={shipperSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={shipperSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(shipperSetSortModel(sortModel))
            }
            storageKey="ShipperDataGrid"
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={SHIPPER_COLUMNS}
            count={ShipperData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={ShipperData?.body?.data}
            paginationModel={shipperSelector?.pagination}
            loading={isLoading || isFetching}
            actions={getShipperListGridActions(nav, setModal)}
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
            page={page}
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
            // maxWidth: "50vw",
            display: "flex",
            flexDirection: "column",
            // zIndex: isFrontmost ? 1301 : 1300, // Adjust z-index based on isFrontmost,
            zIndex: 1301,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Shipper Audit Logs
            </Typography>
            <AuditTimeLine
              id={modal.data.id}
              page="shipper"
              service={menuConfigUrl.entity}
            />
          </Box>
        </Drawer>
      )}
      <DeleteDialog
        source="shipper"
        sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
    </Box>
  );
}
