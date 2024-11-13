import { Box, Card, CardHeader, IconButton, Stack } from "@mui/material";
import React from "react";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { AddCircleOutlineOutlined, GridOnOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setVendorPagination,
  updateVendorInput,
} from "../../store/freatures/vendorSlice";
import { useFetchVendorQuery } from "../../store/api/vendorDataApi";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { VENDOR_COLUMNS } from "../../data/columns/vendor";
import { getVendorGridActions } from "../../components/screen/vendor/actions";
import GridActions from "../../components/common/Grid/GridActions";
import ThemedModal from "../../components/common/ThemedModal";
import VendorForm from "../../components/screen/vendor/VendorForm";
import KeywordSearch from "../../components/common/KeywordSearch";
import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { COMMON } from "../../data/columns/audit";

export default function VendorScreen() {
  const vendorSelector = useSelector((state) => state.vendor);
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {
    data: VendorData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchVendorQuery({
    page: vendorSelector?.pagination?.page + 1,
    perPage: vendorSelector?.pagination?.pageSize,
    ...vendorSelector?.formData,
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setVendorPagination({ page, pageSize }));
  };

  VENDOR_COLUMNS[VENDOR_COLUMNS.length - 1].renderCell = GridActions({
    actions: getVendorGridActions(setModal),
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
                  keyword={vendorSelector.formData.keyword}
                  setKeyword={(keyword) =>
                    dispatch(updateVendorInput({ keyword }))
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
          columns={VENDOR_COLUMNS}
          uniqueId="serial_id"
          data={VendorData?.data}
          count={VendorData?.totalRecords}
          handlePage={handlePage}
          columnVisibility={{}}
          columnVisibilityHandler={() => {}}
          paginationModel={vendorSelector.pagination}
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
            modal.type === "add" ? "Add Vendor Details" : "Edit Vendor Details"
          }
        >
          <VendorForm setModal={setModal} modal={modal} />
        </ThemedModal>
      )}
      {modal.type === "audit" && (
        <ReusableRightDrawer
          open={modal?.open}
          data={modal?.data?.serial_id}
          table={"VENDOR"}
          column={COMMON}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          sx={{ zIndex: 2, position: "absolute" }} // Higher zIndex for the drawer
        />
      )}
    </Box>
  );
}
