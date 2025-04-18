import React, { useState, useEffect } from "react";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Stack,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
} from "@mui/material";
import VehicleNumberForm from "./VehicleForm";
import { Card, CardHeader } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoaderIcon } from "react-hot-toast";
import {
  setPagination,
  vehicleView,
  vehicleSetSortModel,
  // updateInput,
} from "../../../../store/freatures/vehicleSlice";
import ClearIcon from "@mui/icons-material/Clear";

import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

// Components
import GridSearchInput from "../../../../components/common/Filter/GridSearchInput";
import CardsView from "../../../../components/common/Cards/CardsView";
import ScreenToolbar from "../../../../components/common/ScreenToolbar";
import GridActions from "../../../../components/common/Grid/GridActions";
import ThemedGrid from "../../../../components/common/Grid/ThemedGrid";
import muiTextFieldStyles from "../../../../components/muiTextFieldStyles";

import { useFetchContainerQuery } from "../../../../store/api/containerApi";
import { getVehicleListGridActions } from "./vehicleAction";
import { VEHICLE_COLUMNS } from "../../../../data/columns/jobEntry";
import useDebounce from "../../../../hooks/useDebounce";
export default function VehicleShipmentView({ page, customer_id }) {
  const vehicleSelector = useSelector((s) => s?.vehicle);

  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [exportLoader, setExportLoader] = useState(false);
  const [seletectBox, setSelectedBox] = useState("");

  const [searchValue, setsearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const debounceValue = useDebounce(searchValue, 500);

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
    page: vehicleSelector?.pagination?.page + 1,
    size: vehicleSelector?.pagination?.pageSize,
    sortBy:
      vehicleSelector.sortModel.length > 0
        ? vehicleSelector.sortModel[0].field
        : vehicleSelector?.sortBy?.split("*")[0],
    sortOrder:
      vehicleSelector.sortModel.length > 0
        ? vehicleSelector?.sortModel[0]?.sort
        : vehicleSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      vehicleSelector.sortModel.length > 0
        ? vehicleSelector.sortModel[0].field === "cname"
        : vehicleSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }

  const payload = Object.entries(vehicleSelector?.formData)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key === "cname") && (fieldname = "customerName");
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
    page:
      page === "vehicleShipment"
        ? `job-update/vehicle/filter/${customer_id}`
        : "",
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
    dispatch(setPagination({ page, pageSize }));
  };

  const handleSearchBar = (e) => {
    setsearchValue(e.target.value);
  };

  VEHICLE_COLUMNS[VEHICLE_COLUMNS.length - 1].renderCell = GridActions({
    actions: getVehicleListGridActions(setModal),
  });

  useEffect(() => {
    if (debounceValue.trim()) {
      const lowerSearch = debounceValue.toLowerCase();
      const filtered = vehicleListData?.body?.data?.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(vehicleListData?.body?.data);
    }
  }, [debounceValue, vehicleListData]);

  useEffect(() => {
    if (!vehicleSelector.view) {
      dispatch(vehicleView("card"));
    }
  }, [vehicleSelector.view, dispatch]);

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        rightComps={
          <>
            <Backdrop open={open} />
            {(page === "customer" || page === "customerApprove") && (
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
                      // borderRadius: 1,
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
              <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
                <TextField
                  hiddenLabel
                  id="search"
                  name="search"
                  label="Search Vehicle"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={searchValue}
                  onChange={handleSearchBar}
                  sx={{ ...muiTextFieldStyles.root }}
                  InputProps={{
                    endAdornment: searchValue && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setsearchValue("")}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box>
                <IconButton onClick={() => dispatch(vehicleView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      vehicleSelector.view === "card" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(vehicleView("grid"))}>
                  <GridOnOutlined
                    color={
                      vehicleSelector.view === "grid" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        {vehicleSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={VEHICLE_COLUMNS}
            count={vehicleListData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={filteredData}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={vehicleSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={vehicleSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(vehicleSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={VEHICLE_COLUMNS}
            count={vehicleListData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={filteredData}
            paginationModel={vehicleSelector?.pagination}
            loading={isLoading || isFetching}
            actions={getVehicleListGridActions(setModal)}
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
          />
        )}
      </Card>
      <Dialog
        open={modal.open}
        onClose={() => setModal({ open: false, type: "", data: {} })}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            m: 4,
            borderRadius: 2,
          },
        }}
      >
        <DialogContent>
          <VehicleNumberForm
            initialValues={modal.data}
            type={modal.type}
            page={page}
            onCancel={() => setModal({ open: false, type: "", data: {} })}
            onSubmit={() => {
              setModal({ open: false, type: "", data: {} });
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
