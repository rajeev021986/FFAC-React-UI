import { CARD_VESSEL_COLUMNS } from "../../data/columns/vessel";
import CardsView from "../../components/common/Cards/CardsView";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  setPagination,
  vesselSetSortModel,
} from "../../store/freatures/VesselSlice";
import { useDispatch, useSelector } from "react-redux";
import { getVesselListGridActions } from "../../components/screen/vessel/action";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import {
  useFetchAuditVesselQuery,
  useFetchVesselQuery,
  useLazyFetchAuditVesselQuery,
} from "../../store/api/vesselDataApi";
import { Box, Drawer, Typography } from "@mui/material";
import AuditTimeLine from "../../components/AuditTimeLine";

// const vesselData = json.body;

// const vesselData = [
//   {
//     vesselName: "VesselName1",
//     lineName: "LineName1",
//     vesselOwner: "Owner1",
//     status: true,
//     id: 1,
//   },
//   {
//     vesselName: "VesselName2",
//     lineName: "LineName2",
//     vesselOwner: "Owner2",
//     status: false,
//     id: 2,
//   },
//   {
//     vesselName: "VesselName3",
//     lineName: "LineName3",
//     vesselOwner: "Owner3",
//     status: true,
//     id: 3,
//   },
//   {
//     vesselName: "VesselName4",
//     lineName: "LineName4",
//     vesselOwner: "Owner4",
//     status: false,
//     id: 4,
//   },
//   {
//     vesselName: "VesselName5",
//     lineName: "LineName5",
//     vesselOwner: "Owner5",
//     status: true,
//     id: 5,
//   },
//   {
//     vesselName: "VesselName6",
//     lineName: "LineName6",
//     vesselOwner: "Owner6",
//     status: false,
//     id: 6,
//   },
//   {
//     vesselName: "VesselName7",
//     lineName: "LineName7",
//     vesselOwner: "Owner7",
//     status: true,
//     id: 7,
//   },
//   {
//     vesselName: "VesselName8",
//     lineName: "LineName8",
//     vesselOwner: "Owner8",
//     status: false,
//     id: 8,
//   },
//   {
//     vesselName: "VesselName9",
//     lineName: "LineName9",
//     vesselOwner: "Owner9",
//     status: true,
//     id: 9,
//   },
//   {
//     vesselName: "VesselName10",
//     lineName: "LineName10",
//     vesselOwner: "Owner10",
//     status: false,
//     id: 10,
//   },
//   {
//     vesselName: "VesselName11",
//     lineName: "LineName11",
//     vesselOwner: "Owner11",
//     status: true,
//     id: 11,
//   },
//   {
//     vesselName: "VesselName12",
//     lineName: "LineName12",
//     vesselOwner: "Owner12",
//     status: false,
//     id: 12,
//   },
//   {
//     vesselName: "VesselName13",
//     lineName: "LineName13",
//     vesselOwner: "Owner13",
//     status: true,
//     id: 13,
//   },
//   {
//     vesselName: "VesselName14",
//     lineName: "LineName14",
//     vesselOwner: "Owner14",
//     status: false,
//     id: 14,
//   },
//   {
//     vesselName: "VesselName15",
//     lineName: "LineName15",
//     vesselOwner: "Owner15",
//     status: true,
//     id: 15,
//   },
//   {
//     vesselName: "VesselName16",
//     lineName: "LineName16",
//     vesselOwner: "Owner16",
//     status: false,
//     id: 16,
//   },
//   {
//     vesselName: "VesselName17",
//     lineName: "LineName17",
//     vesselOwner: "Owner17",
//     status: true,
//     id: 17,
//   },
//   {
//     vesselName: "VesselName18",
//     lineName: "LineName18",
//     vesselOwner: "Owner18",
//     status: false,
//     id: 18,
//   },
//   {
//     vesselName: "VesselName19",
//     lineName: "LineName19",
//     vesselOwner: "Owner19",
//     status: true,
//     id: 19,
//   },
//   {
//     vesselName: "VesselName20",
//     lineName: "LineName20",
//     vesselOwner: "Owner20",
//     status: false,
//     id: 20,
//   },
//   {
//     vesselName: "VesselName21",
//     lineName: "LineName21",
//     vesselOwner: "Owner21",
//     status: false,
//     id: 21,
//   },
//   {
//     vesselName: "VesselName22",
//     lineName: "LineName22",
//     vesselOwner: "Owner22",
//     status: false,
//     id: 22,
//   },
//   {
//     vesselName: "VesselName23",
//     lineName: "LineName23",
//     vesselOwner: "Owner23",
//     status: false,
//     id: 23,
//   },
//   {
//     vesselName: "VesselName24",
//     lineName: "LineName24",
//     vesselOwner: "Owner24",
//     status: false,
//     id: 24,
//   },
// ];

export function VesselBody({ selectBox, setSelectBox }) {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const vesselSelector = useSelector((state) => state.vesselStore);

  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });

  const fetchUserAudit = () => {
    fetchAudit({
      id: modal?.data?.id,
    });
  };

  const [fetchAudit, { data: AuditData, isLoading: AuditLoadinng }] =
    useLazyFetchAuditVesselQuery();

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  const query = {
    page: vesselSelector?.pagination?.page + 1,
    size: vesselSelector?.pagination?.pageSize,
    sortBy:
      vesselSelector.sortModel.length > 0
        ? vesselSelector.sortModel[0].field
        : vesselSelector?.sortBy?.split("*")[0],
    sortOrder:
      vesselSelector.sortModel.length > 0
        ? vesselSelector?.sortModel[0]?.sort
        : vesselSelector?.sortBy?.split("*")[1] || "",
  };

  if (
    Boolean(
      vesselSelector.sortModel.length > 0
        ? vesselSelector.sortModel[0].field === "vname"
        : vesselSelector?.sortBy?.split("*")[0] === "vname"
    )
  ) {
    query.sortBy = "vesselName";
  }

  if (
    Boolean(
      vesselSelector.sortModel.length > 0
        ? vesselSelector.sortModel[0].field === "lname"
        : vesselSelector?.sortBy?.split("*")[0] === "lname"
    )
  ) {
    query.sortBy = "lineName";
  }

  const payload = Object.entries(vesselSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "vname") && (fieldname = "vesselName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "or",
      };
    });

  const {
    data: vesselData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useFetchVesselQuery({
    params: query,
    payload: payload,
  });

  console.log("vesselData", vesselData);

  return (
    <>
      {vesselSelector.view === "grid" ? (
        <ThemedGrid
          uniqueId="id"
          columns={CARD_VESSEL_COLUMNS}
          count={vesselData?.body?.totalElements}
          handlePage={handlePage}
          data={vesselData?.body?.data}
          columnVisibility={{}}
          columnVisibilityHandler={() => {}}
          paginationModel={vesselSelector.pagination}
          loading={isLoading || isFetching}
          sortModel={vesselSelector.sortModel}
          onSortModelChange={(sortModel) =>
            dispatch(vesselSetSortModel(sortModel))
          }
        />
      ) : (
        <CardsView
          uniqueId="id"
          columns={CARD_VESSEL_COLUMNS}
          count={vesselData?.body?.totalElements}
          handlePage={handlePage}
          data={vesselData?.body?.data}
          paginationModel={vesselSelector.pagination}
          loading={isLoading || isFetching}
          actions={getVesselListGridActions(nav, setModal)}
          seletectBox={selectBox}
          setSelectedBox={setSelectBox}
          page="customer"
        />
      )}
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
              User Audit Logs
            </Typography>
            <AuditTimeLine
              auditDetails={AuditData}
              reloadDataHandler={fetchUserAudit}
              loading={AuditLoadinng}
            />
          </Box>
        </Drawer>
      )}
    </>
  );
}
