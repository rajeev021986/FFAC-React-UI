import { Box, Card, CardHeader, IconButton, Stack } from "@mui/material";
import React from "react";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { AddCircleOutlineOutlined, GridOnOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setDestinationPagination,
  updateDestinationInput,
} from "../../store/freatures/destinationSlice";
import { useFetchDestinationQuery } from "../../store/api/destinationDataApi";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { DESTINATION_COLUMNS } from "../../data/columns/destination";
import { getDestinationGridActions } from "../../components/screen/destination/actions";
import GridActions from "../../components/common/Grid/GridActions";
import ThemedModal from "../../components/common/ThemedModal";
import DestinationForm from "../../components/screen/destination/DestinationForm";
import KeywordSearch from "../../components/common/KeywordSearch";
import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { COMMON } from "../../data/columns/audit";

export default function DestinationScreen() {
  const destinationSelector = useSelector((state) => state.destination);
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {
    data: DestinationData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchDestinationQuery({
    page: destinationSelector?.pagination?.page + 1,
    perPage: destinationSelector?.pagination?.pageSize,
    ...destinationSelector?.formData,
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setDestinationPagination({ page, pageSize }));
  };

  DESTINATION_COLUMNS[DESTINATION_COLUMNS.length - 1].renderCell = GridActions({
    actions: getDestinationGridActions(setModal),
  });

  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <OutlinedButton
              startIcon={<AddCircleOutlineOutlined />}
              onClick={() => {
                setModal({ open: true, type: "add", data: {} });
              }}
              size="small"
            >
              Add New
            </OutlinedButton>
          </>
        }
      />
      <Card  sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <KeywordSearch
                  keyword={destinationSelector.formData.keyword}
                  setKeyword={(keyword) =>
                    dispatch(updateDestinationInput({ keyword }))
                  }
                />
              </Box>
              <Box>
                <IconButton>
                  <GridOnOutlined color={"primary"} />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        <ThemedGrid
          columns={DESTINATION_COLUMNS}
          uniqueId="serial_id"
          data={DestinationData?.data}
          count={DestinationData?.totalRecords}
          handlePage={handlePage}
          columnVisibility={{}}
          columnVisibilityHandler={() => {}}
          paginationModel={destinationSelector.pagination}
          loading={isLoading || isFetching}
          disableColumnMenu
          disableColumnSorting
        />
      </Card>
      {modal.type !== "audit" && (
        <ThemedModal
          open={modal.open}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          modalTitle={
            modal.type === "add"
              ? "Add Destination Details"
              : "Edit Destination Details"
          }
        >
          <DestinationForm setModal={setModal} modal={modal} />
        </ThemedModal>
      )}

      {modal.type === "audit" && (
        <ReusableRightDrawer
          open={modal?.open}
          data={modal?.data?.serial_id}
          table={"DESTINATION"}
          column={COMMON}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          // sx={{ zIndex: 2, position: "absolute" }} // Higher zIndex for the drawer
        />
      )}
    </Box>
  );
}
