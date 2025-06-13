import { CARD_VESSEL_COLUMNS } from "../../data/columns/vessel";
import CardsView from "../../components/common/Cards/CardsView";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setPagination,
  vesselSetSortModel,
} from "../../store/freatures/VesselSlice";
import { useDispatch, useSelector } from "react-redux";
import { getVesselListGridActions } from "../../components/screen/vessel/action";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import {
  useDeleteVesselMutation,
  useFetchAuditVesselQuery,
  useFetchVesselQuery,
  useLazyFetchAuditVesselQuery,
} from "../../store/api/vesselDataApi";
import { Box, Drawer, Typography } from "@mui/material";
import AuditTimeLine from "../../components/AuditTimeLine";
import DeleteDialog from "../../components/common/DeleteDialog";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
import { menuConfigUrl } from "../../store/menuConfigUrl";
import GridActions from "../../components/common/Grid/GridActions";

export function VesselBody({ selectBox, setSelectBox }) {
  const nav = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const vesselSelector = useSelector((state) => state.vesselStore);

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
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "vname") && (fieldname = "vesselName");
      Boolean(key == "lname") && (fieldname = "lineName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });

  CARD_VESSEL_COLUMNS[CARD_VESSEL_COLUMNS.length - 1].renderCell = GridActions({
    actions: getVesselListGridActions(nav, setModal),
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

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const [deleteVessel] = useDeleteVesselMutation();

  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deleteVessel(modal.data.id)
        .unwrap()
        .then(() => refetch());
      toast.custom(
        <CustomToast message="Vessel deleted successfully!" toast="success" />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to delete vessel." toast="error" />,
        {
          closeButton: false,
        }
      );
      handleClose();
    }
  };

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
              id={modal?.data?.id}
              page="vessel"
              service={menuConfigUrl.master}
            />
          </Box>
        </Drawer>
      )}
      <DeleteDialog
        source="vessel"
        sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
    </>
  );
}
