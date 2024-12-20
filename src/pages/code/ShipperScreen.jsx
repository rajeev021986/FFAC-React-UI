import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import CardsView from "../../components/common/Cards/CardsView";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { useLocation, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import {
  useFetchShipperDatasQuery
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
import { SHIPPER_COLUMNS} from "../../data/columns/shipper"
import { getShipperListGridActions } from "../../components/screen/code/Shipper/action";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { getShipperListGridActionsShipperApprovel } from "../../components/screen/code/Shipper/action copy";
import ApiManager from "../../services/ApiManager";


const ADD_NEW_SHIPPER_PATH = "new_shipper";


export default function ShipperScreen({ page }) {
  const shipperSelector = useSelector((state) => state.shipper);
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [seletectBox, setSelectedBox] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [{ name: "New Shipper" }, { name: "Copy" }, { name: "Export" }]
    : [{ name: "New Shipper" }, { name: "Export" }];
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
        ? shipperSelector.sortModel[0].field === "name"
        : shipperSelector?.sortBy?.split("*")[0] === "name"
    )
  ) {
    query.sortBy = "name";
  }
  const payload = Object.entries(shipperSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "name") && (fieldname = "name");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "or",
      };
    });

  const {
    data: ShipperData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useFetchShipperDatasQuery({
    params: query,
    payload,
    page: page == "shipper" ? "shipper/filter" : "approval/filter/shipper",
  });
  useEffect(() => {
    refetch();
  }, [location.pathname]);
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  SHIPPER_COLUMNS[SHIPPER_COLUMNS.length - 1].renderCell =
    GridActions({
      actions:
        page == "shipper"
          ? getShipperListGridActions(nav, setModal)
          : getShipperListGridActionsShipperApprovel((nav, setModal)),
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
        state: { formAction: "add" },
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
      const response = await fetch("http://localhost:9083/entity-service/shipper/export?page=1&size=10&sortBy=&sortOrder=", {   
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
    }
  }
  

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
                      backgroundColor: "#f0f0f0",
                      color: "black",
                      boxShadow: 3,
                      borderRadius: '20px 19px 19px 20px',
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
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
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={shipperSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <ShipperFilters filterInfo={ShipperData?.counts || []} />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={SHIPPER_SORT_OPTIONS}
                  value={shipperSelector.sortBy}
                  onChange={(event) => {
                    console.log(event);

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
                      shipperSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(shipperSetView("grid"))}>
                  <GridOnOutlined
                    color={
                      shipperSelector.view === "grid"
                        ? "primary"
                        : "secondary"
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
            actions={
              page == "shipper"
                ? getShipperListGridActions(nav, setModal)
                : getShipperListGridActionsShipperApprovel(nav, setModal)
            }
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
            page={page}
          />
        )}
      </Card>
     
    </Box>
  );
}
