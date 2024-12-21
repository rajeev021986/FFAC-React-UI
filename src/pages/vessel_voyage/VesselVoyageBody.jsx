import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useFetchVoyageQuery,
  useLazyFetchAuditVoyageQuery,
} from "../../store/api/vesselVoyageDataApi";
import { CARD_VOYAGE_COLUMNS } from "../../data/columns/vessel_voyage";
import {
  setPagination,
  voyageSetSortModel,
} from "../../store/freatures/VesselVoyageSlice";
import { getVoyageListGridActions } from "../../components/screen/vessel_voyage/action";
import { Box, Drawer, Typography } from "@mui/material";
import CardsView from "../../components/common/Cards/CardsView";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import AuditTimeLine from "../../components/AuditTimeLine";

export function VesselVoyageBody({ selectBox, setSelectBox }) {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const voyageSelector = useSelector((state) => state.vesselVoyageStore);

  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });

  const fetchUserAudit = () => {
    console.log(modal.data.id, "modal");
    fetchAudit({
      id: modal?.data?.id,
    });
  };

  const [fetchAudit, { data: AuditData, isLoading: AuditLoading }] =
    useLazyFetchAuditVoyageQuery();

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  const query = {
    page: voyageSelector?.pagination?.page + 1,
    size: voyageSelector?.pagination?.pageSize,
    sortBy:
      voyageSelector.sortModel.length > 0
        ? voyageSelector.sortModel[0].field
        : voyageSelector?.sortBy?.split("*")[0],
    sortOrder:
      voyageSelector.sortModel.length > 0
        ? voyageSelector?.sortModel[0]?.sort
        : voyageSelector?.sortBy?.split("*")[1] || "",
  };

  if (
    Boolean(
      voyageSelector.sortModel.length > 0
        ? voyageSelector.sortModel[0].field === "vvoyage"
        : voyageSelector?.sortBy?.split("*")[0] === "vvoyage"
    )
  ) {
    query.sortBy = "vesselVoyage";
  }

  const {
    data: voyageData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useFetchVoyageQuery({
    params: query,
  });

  return (
    <>
      {voyageSelector.view === "grid" ? (
        <ThemedGrid
          uniqueId="id"
          columns={CARD_VOYAGE_COLUMNS}
          count={voyageData?.body?.totalElements}
          handlePage={handlePage}
          data={voyageData?.body?.data}
          columnVisibility={{}}
          columnVisibilityHandler={() => {}}
          paginationModel={voyageSelector.pagination}
          loading={isLoading || isFetching}
          sortModel={voyageSelector.sortModel}
          onSortModelChange={(sortModel) =>
            dispatch(voyageSetSortModel(sortModel))
          }
        />
      ) : (
        <CardsView
          uniqueId="id"
          columns={CARD_VOYAGE_COLUMNS}
          count={voyageData?.body?.totalElements}
          handlePage={handlePage}
          data={voyageData?.body?.data}
          paginationModel={voyageSelector.pagination}
          loading={isLoading || isFetching}
          actions={getVoyageListGridActions(nav, setModal)}
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
            display: "flex",
            flexDirection: "column",
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
              loading={AuditLoading}
            />
          </Box>
        </Drawer>
      )}
    </>
  );
}
