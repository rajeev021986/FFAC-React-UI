import { Box, Card, CardHeader, Drawer, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { AddCircleOutlineOutlined, GridOnOutlined, FormatListBulletedOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setVendorPagination,
  updateVendorInput,
} from "../../store/freatures/vendorSlice";
import { useDeleteVendorMutation, useFetchVendorQuery, useLazyGetVendorAuditQuery } from "../../store/api/vendorDataApi";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { VENDOR_COLUMNS } from "../../data/columns/vendor";
import { getVendorGridActions, getVendorApproveGridActions } from "../../components/screen/vendor/actions";
import GridActions from "../../components/common/Grid/GridActions";
import ThemedModal from "../../components/common/ThemedModal";
import VendorForm from "../../components/screen/vendor/VendorForm";
import KeywordSearch from "../../components/common/KeywordSearch";
import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { COMMON } from "../../data/columns/audit";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import VendorFilterForm from "../../components/screen/code/vendor/vendorFilter";
import { setSortBy, setSortModel, setView } from "../../store/freatures/vendorSlice";
import SelectBox from "../../components/common/SelectBox";
import { VENDOR_SORT_OPTIONS } from "../../data/options";
import CardsView from "../../components/common/Cards/CardsView";
import AuditTimeLine from "../../components/AuditTimeLine";
import DeleteDialog from "../../components/common/DeleteDialog";
import toast from "react-hot-toast";
import ApiManager from "../../services/ApiManager";

export default function VendorScreen({ page }) {
  const vendorSelector = useSelector((state) => state.vendor);
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [deleteVendor] = useDeleteVendorMutation();

  const handleOpen = (type, data) => {
    setModal({
      open: true,
      type,
      data,
    });
  };

  const handleClose = () => {
    setModal({
      open: false,
      type: '',
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deleteVendor(modal.data.id).unwrap();
      toast.success('Vendor deleted successfully!');
      handleClose();
    } catch (error) {
      toast.error('Failed to delete vendor.');
      console.error('Delete Error:', error);
    }
  };
  const [getVendorAudit, { data: AuditData,
    isLoading: isLoadingAudit }] = useLazyGetVendorAuditQuery();
  const [seletectBox, setSelectedBox] = useState();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const payload = Object.entries(vendorSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      return {
        fieldName: key,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });
  const query = {
    page: vendorSelector?.pagination?.page + 1,
    size: vendorSelector?.pagination?.pageSize,
    sortBy:
      vendorSelector.sortModel.length > 0
        ? vendorSelector.sortModel[0].field
        : vendorSelector?.sortBy?.split("*")[0],
    sortOrder:
      vendorSelector.sortModel.length > 0
        ? vendorSelector?.sortModel[0]?.sort
        : vendorSelector?.sortBy?.split("*")[1] || "",
  }

  const {
    data: VendorData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchVendorQuery({
    params: query,
    payload,
    page
  }
  );
  const fetchUserAudit = () => {
    getVendorAudit({
      id: modal.data.id,
    });
  }
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setVendorPagination({ page, pageSize }));
  };
  const Actions = page == "vendor" ? getVendorGridActions(nav, setModal) : getVendorApproveGridActions(nav, setModal);
  
  const actions = seletectBox
    ? [{ name: "New Vendor" }, { name: "Copy" }, { name: "Export" }]
    : page == "vendor" ? [{ name: "New Vendor" }, { name: "Export" }] : [{ name: "Export" }];
  const handleActionClick = async (actionName) => {
    if (actionName === "New Vendor") {
      nav("addVendor", {
        state: { id: null, type: "new" },
      });
    }
    if (actionName === "Copy") {
      nav("addVendor", { state: { id: seletectBox, type: "copy" } });
    }
    if (actionName === "Export") {
      try {
        const blob = await ApiManager.fetchCustomerDatasExcel(query, payload,"vendor");
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'customer-data.xlsx'); 
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };
  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
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
          </>
        }
      />
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                {/* <KeywordSearch
                  keyword={vendorSelector.formData.keyword}
                  setKeyword={(keyword) =>
                    dispatch(updateVendorInput({ keyword }))
                  }
                /> */}
                <GridSearchInput
                  filters={vendorSelector?.formData}
                  setFilters={(filters) => dispatch(updateVendorInput(filters))}
                  width="650px"
                >
                  <VendorFilterForm />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={VENDOR_SORT_OPTIONS}
                  value={vendorSelector.sortBy}
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
                <IconButton onClick={() => dispatch(setView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      vendorSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(setView("grid"))}>
                  <GridOnOutlined
                    color={
                      vendorSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        {vendorSelector.view === "grid" ? (<ThemedGrid
          columns={VENDOR_COLUMNS}
          uniqueId="id"
          data={VendorData?.body?.data}
          count={VendorData?.body?.totalElements}
          handlePage={handlePage}
          columnVisibility={{}}
          columnVisibilityHandler={() => { }}
          paginationModel={vendorSelector.pagination}
          loading={isLoading || isFetching}
          disableColumnMenu
          disableColumnSorting
          sortModel={vendorSelector.sortModel}
          onSortModelChange={(sortModel) => dispatch(setSortModel(sortModel))}
        />) : (<CardsView
          uniqueId="id"
          columns={VENDOR_COLUMNS}
          count={VendorData?.body?.totalElements || 0}
          handlePage={handlePage}
          data={VendorData?.body?.data}
          paginationModel={vendorSelector?.pagination}
          loading={isLoading || isFetching}
          actions={Actions}
          setSelectedBox={setSelectedBox}
          seletectBox={seletectBox}
          page={page == "vendor" ? "customer" : ""}
        />)}


      </Card>
      {/* {modal.type !== "audit" && (
        <ThemedModal
          open={modal.open}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          modalTitle={
            modal.type === "add" ? "Add Vendor Details" : "Edit Vendor Details"
          }
        >
          <VendorForm setModal={setModal} modal={modal} />
        </ThemedModal>
      )} */}
      {/* {modal.type === "audit" && (
        <ReusableRightDrawer
          open={modal?.open}
          data={modal?.data?.serial_id}
          table={"VENDOR"}
          column={COMMON}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          sx={{ zIndex: 2, position: "absolute" }} // Higher zIndex for the drawer
        />
      )} */}
      {modal.type === 'audit' && (
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
            zIndex: 1301
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              Vendor Audit Logs
            </Typography>
            <AuditTimeLine auditDetails={AuditData} reloadDataHandler={fetchUserAudit} loading={isLoadingAudit} />
          </Box>
        </Drawer>
      )}
      <DeleteDialog
        modal={modal}
        handleClose={handleClose}
        handleDelete={handleDelete}
      />
    </Box>
  );
}
