import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useDeleteVoyageMutation,
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
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
import DeleteDialog from "../../components/common/DeleteDialog";
import { menuConfigUrl } from "../../store/menuConfigUrl";

export function VesselVoyageBody({ selectBox, setSelectBox }) {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const voyageSelector = useSelector((state) => state.vesselVoyageStore);

  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });

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
        ? voyageSelector.sortModel[0].field === "vessel"
        : voyageSelector?.sortBy?.split("*")[0] === "vessel"
    )
  ) {
    query.sortBy = "vessel";
  }

  const payload = Object.entries(voyageSelector?.formData)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "vessel") && (fieldname = "vessel");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });

  const {
    data: voyageData,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useFetchVoyageQuery({
    params: query,
    payload: payload,
  });

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const [deleteVoyage] = useDeleteVoyageMutation();
  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deleteVoyage(modal.data.id)
        .unwrap()
        .then(() => refetch());
      toast.custom(
        <CustomToast message="Voyage deleted successfully!" toast="success" />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to delete voyage." toast="error" />,
        {
          closeButton: false,
        }
      );
      handleClose();
    }
  };

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
          storageKey="VesselVoyageDataGrid"

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
              id={modal?.data?.id}
              page="vessel/voyage"
              service={menuConfigUrl.master}
            />
          </Box>
        </Drawer>
      )}
      <DeleteDialog
        source="voyage"
        sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
    </>
  );
}
