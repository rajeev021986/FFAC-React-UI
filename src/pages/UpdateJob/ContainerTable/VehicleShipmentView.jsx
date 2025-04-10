import React, { useState, useEffect } from "react";

import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Stack } from "@mui/material";
import { Card, CardHeader } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDeleteCustomerMutation } from "../../../store/api/codeDataApi";
import { useDispatch, useSelector } from "react-redux";
import toast, { LoaderIcon } from "react-hot-toast";

import {
  setVehiclePagination,
  vehicleShipmentView,
  VehicleSetSortModel,
  updateVehicleInput,
} from "../../../store/freatures/containersSlice";

import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

// Components
import GridSearchInput from "../../../components/common/Filter/GridSearchInput";
import CardsView from "../../../components/common/Cards/CardsView";
import ScreenToolbar from "../../../components/common/ScreenToolbar";
import GridActions from "../../../components/common/Grid/GridActions";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import DeleteDialog from "../../../components/common/DeleteDialog";
import CustomToast from "../../../components/common/Toast/CustomToast";
import FilterForm from "../../../components/screen/code/customer/FilterForm";

import { useFetchContainerQuery } from "../../../store/api/containerApi";
import { getContaienrListGridActions } from "./containerAction";
import { VEHICLE_COLUMNS } from "../../../data/columns/jobEntry";

export default function VehicleShipmentView({ page }) {
  const containerSelector = useSelector((state) => state?.containers);

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
        { name: "New Customer" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : "";

  const query = {
    page: containerSelector?.pagination?.page + 1,
    size: containerSelector?.pagination?.pageSize,
    sortBy:
      containerSelector.sortModel.length > 0
        ? containerSelector.sortModel[0].field
        : containerSelector?.sortBy?.split("*")[0],
    sortOrder:
      containerSelector.sortModel.length > 0
        ? containerSelector?.sortModel[0]?.sort
        : containerSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      containerSelector.sortModel.length > 0
        ? containerSelector.sortModel[0].field === "cname"
        : containerSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }

  const payload = Object.entries(containerSelector?.formData)
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
    data: vehicleListData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchContainerQuery({
    params: query,
    payload,
    page: page == "vehicleShipment" ? "job-update/vehicle/filter" : "",
  });

  const handleActionClick = async (actionName) => {
    if (actionName === "New Customer") {
      nav("newcustomer", {
        replace: true,
        state: { formAction: "add" },
      });
    }
    if (actionName === "Export") {
      setExportLoader(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setVehiclePagination({ page, pageSize }));
  };

  VEHICLE_COLUMNS[VEHICLE_COLUMNS.length - 1].renderCell = GridActions({
    actions: getContaienrListGridActions(nav, setModal),
  });

  useEffect(() => {
    if (!containerSelector.view) {
      dispatch(vehicleShipmentView("card"));
    }
  }, [containerSelector.view, dispatch]);

  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(modal.data.id)
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

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        rightComps={
          <>
            <Backdrop open={open} />
            {(page == "customer" || page == "customerApprove") && (
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
                  filters={containerSelector?.formData}
                  setFilters={(filters) =>
                    dispatch(updateVehicleInput(filters))
                  }
                  width="650px"
                >
                  <FilterForm />
                </GridSearchInput>
              </Box>
              <Box>
                <IconButton
                  onClick={() => dispatch(vehicleShipmentView("card"))}
                >
                  <FormatListBulletedOutlined
                    color={
                      containerSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton
                  onClick={() => dispatch(vehicleShipmentView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      containerSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        {containerSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={VEHICLE_COLUMNS}
            count={vehicleListData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={vehicleListData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={containerSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={containerSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(VehicleSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={VEHICLE_COLUMNS}
            count={vehicleListData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={vehicleListData?.body?.data}
            paginationModel={containerSelector?.pagination}
            loading={isLoading || isFetching}
            actions={getContaienrListGridActions(nav, setModal)}
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
          />
        )}
      </Card>

      <DeleteDialog
        source="customer"
        sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
    </Box>
  );
}
