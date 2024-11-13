import {
  FormatListBulletedOutlined,
  GridOnOutlined,
  AddCircleOutlineOutlined,
  FileDownloadOutlined,
  GpsFixedOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { SHIPMENT_COLUMNS } from "../../data/columns/dashbaord.shipment";
import { useNavigate } from "react-router-dom";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardSetPagination,
  dashboardSetSortBy,
  dashboardSetSortModel,
  dashboardSetView,
  dashboardUpdateInput,
} from "../../store/freatures/dashboardSlice";
import SelectBox from "../../components/common/SelectBox";
import { DASHBAORD_SORT_OPTIONS } from "../../data/options";
import GridActions from "../../components/common/Grid/GridActions";

import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { COMMON } from "../../data/columns/audit";
import { useFetchShipmentDataQuery } from "../../store/api/dashbaordDataApi";
import MapContainer from "../../components/screen/dashboard/MapContainer";
import DashboardFilters from "../../components/screen/dashboard/DashboardFilters";
import ShipmentCardView from "../../components/screen/dashboard/card/ShipmentCardView";
import { getDashboardActions } from "../../components/screen/dashboard/action";
import AppDrawer from "../../components/common/AppDrawer";
import TrackerContainer from "../../components/screen/dashboard/Tracker/TrackerContainer";
import { SHIPMENT_STATUS_OBJ } from "../../data/enums";
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import { exportDashboardData } from "../../components/screen/dashboard/export";
// import ShipmentData from "../../data/table-data/dashbaord.json"


export default function DashboardScreen() {
  // const dashboardSelector = useSelector((state) => state.dashboard);
  // const nav = useNavigate();
  // const dispatch = useDispatch();
  // const [modal, setModal] = React.useState({
  //   open: false,
  //   type: "",
  //   data: {},
  // });


  // const {
  //   data: ShipmentData,
  //   isError,
  //   isLoading,
  //   error,
  //   isFetching,
  // } = useFetchShipmentDataQuery({
  //   page: dashboardSelector?.pagination?.page + 1,
  //   perPage: dashboardSelector?.pagination?.pageSize,
  //   type: dashboardSelector?.shipment,
  //   pol: dashboardSelector?.pol.join("**"),
  //   pod: dashboardSelector?.pod.join("**"),
  //   shipper: dashboardSelector?.shipper.join("**"),
  //   orderBy:
  //     dashboardSelector.sortModel.length > 0
  //       ? dashboardSelector.sortModel[0].field +
  //         "*" +
  //         dashboardSelector.sortModel[0].sort
  //       : dashboardSelector.sortBy,

  //   ...dashboardSelector?.formData
  // });

  // const handlePage = (params) => {
  //   let { page, pageSize } = params;
  //   dispatch(dashboardSetPagination({ page, pageSize }));
  // };

  // SHIPMENT_COLUMNS[SHIPMENT_COLUMNS.length - 1].renderCell =
  //   GridActions({
  //     actions: getDashboardActions(nav, setModal),
  //   });
  // SHIPMENT_COLUMNS.map((column) => {
  //   if (column.field === 'status') {
  //     column.renderCell = (params) => {
  //       if (params.value?.key) {
  //         return <Chip
  //           icon={SHIPMENT_STATUS_OBJ[params.value.key]?.icon}
  //           label={params.value.key}
  //           color={SHIPMENT_STATUS_OBJ[params.value.key]?.color}
  //           variant="outlined"
  //           clickable
  //           onClick={() => { handleTrackingSlide(params.row) }}
  //         />
  //       }
  //       return '';
  //     }
  //   }
  // })

  // const handleTrackingSlide = (item) => {
  //   setModal({ open: true, type: "tracking", data: item });
  // }

  return (
    <Box>
      <h1>Coming Sooon!</h1>
      {/* <MapContainer data={ShipmentData?.data} />
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={dashboardSelector?.formData}
                  setFilters={(filters) => dispatch(dashboardUpdateInput(filters))}
                  width="650px"
                  height="400px"
                >
                  <DashboardFilters filterInfo={ShipmentData || []} />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={DASHBAORD_SORT_OPTIONS}
                  value={dashboardSelector.sortBy}
                  onChange={(event) => {
                    dispatch(dashboardSetSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
                <div>
                  <OutlinedButton
                  onClick={()=>{exportDashboardData(ShipmentData?.data)}}
                    sx={{
                      padding: '5px 25px',
                      fontWeight: 'normal',
                      borderRadius: '50px',
                    }}
                  >
                    <FileDownloadOutlined />
                    Export
                  </OutlinedButton>
                </div>
              </Box>
              <Box>
                <IconButton onClick={() => dispatch(dashboardSetView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      dashboardSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(dashboardSetView("grid"))}>
                  <GridOnOutlined
                    color={
                      dashboardSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />
        {dashboardSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="serial_id"
            columns={SHIPMENT_COLUMNS}
            count={ShipmentData?.totalRecords}
            handlePage={handlePage}
            data={ShipmentData?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => { }}
            paginationModel={dashboardSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={dashboardSelector.sortModel}
            onSortModelChange={(sortModel) => dispatch(dashboardSetSortModel(sortModel))}
          />
        ) : (
          <ShipmentCardView
            uniqueId="serial_id"
            columns={SHIPMENT_COLUMNS}
            count={ShipmentData?.totalRecords}
            handlePage={handlePage}
            data={ShipmentData?.data}
            paginationModel={dashboardSelector.pagination}
            loading={isLoading || isFetching}
            actions={getDashboardActions(setModal)}
            handleTrackingSlide={handleTrackingSlide}
          />
        )}
      </Card>
      {modal.type === 'audit' && (
        <ReusableRightDrawer
          open={modal?.open}
          data={modal?.data?.usercode}
          table={"USER"}
          column={COMMON}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          sx={{ zIndex: 2, position: "absolute" }}
        />
      )}
      {modal.type === 'tracking' && (
        <AppDrawer
          open={modal.open}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          title="Tracking Deatils"
          Icon={GpsFixedOutlined}
        >
          <TrackerContainer data={modal.data} />
        </AppDrawer>
      )} */}
    </Box>
        // Handle response and display toast messages
  );
}
