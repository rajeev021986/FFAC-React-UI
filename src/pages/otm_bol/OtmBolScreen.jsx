import {
  Autocomplete,
  Box,
  Card,
  CardHeader,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import {
  AddCircleOutlineOutlined,
  FileDownloadOutlined,
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
// import PackingListCardsView from "../../components/screen/packing-list/card/PackingListCardView";
import {
  setPackingListPagination,
  setPackingListSortBy,
  setPackingListSortModel,
  setPackingListView,
  updatePackingListInput,
} from "../../store/freatures/otmBolListSlice";
// import { useFetchPackingListQuery } from "../../store/api/packingListDataApi";
import { exportPackingList } from "../../components/screen/packing-list/export";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import SelectBox from "../../components/common/SelectBox";
import { OTM_BOL_COLUMNS } from "../../data/columns/otm_bol";
import { OTM_BOL_SORT_OPTIONS } from "../../data/options";
import GridActions from "../../components/common/Grid/GridActions";
// import { getPackingListGridActions } from "../../components/screen/packing-list/actions";
import ThemedModal from "../../components/common/ThemedModal";
// import AddBolConfirmation from "../../components/screen/packing-list/AddBolConfirmation";
// import PackingListFilters from "../../components/screen/packing-list/PackingListFilters";
import { useNavigate } from "react-router-dom";
import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { PACKING_LIST } from "../../data/columns/audit";
import { useFetchOtmBolListQuery } from "../../store/api/otmBolDataApi";
// import { getOtmBolGridActions } from "../../components/screen/otm_bol/actions";
import OtmBolListFilters from "../../components/screen/otm_bol/OtmBolListFilters";
import ApiManager from "../../services/ApiManager";
import BasicTable from "../../components/common/BasicTable";
import { getOtmBolGridActions } from "../../components/screen/otm_bol/actions";

export default function OtmBolScreen() {
  const [openAddBolModal, setOpenAddBolModal] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]); // Keep track of selected rows
  const otmBolListSelector = useSelector((state) => state.otmBolList);
  const [plArray,setPlArray] = useState([]);
  const [selectedBol,setSelectedBol] = useState(null);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const {
    data: otmBolList,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchOtmBolListQuery({
    page: otmBolListSelector?.pagination?.page + 1,
    perPage: otmBolListSelector?.pagination?.pageSize,
    filter: otmBolListSelector.status,
    orderBy:
      otmBolListSelector.sortModel.length > 0
        ? otmBolListSelector.sortModel[0].field +
          "*" +
          otmBolListSelector.sortModel[0].sort
        : otmBolListSelector.sortBy,
    ...otmBolListSelector.formData,
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPackingListPagination({ page, pageSize }));
  };
  const handleRowSelection = (selected) => {
    setRowSelectionModel(selected); // Update selected rows
  };

  const handleCloseAddBolModal = () => {
    setOpenAddBolModal(false);
  };

  // Logic if a row is selectable
  //   const isRowSelectable = (params) =>
  //     params.row.pl_status === "FINAL" && params.row.bl_status === "";
  
  OTM_BOL_COLUMNS[OTM_BOL_COLUMNS.length - 1].renderCell = GridActions({
    actions: getOtmBolGridActions(nav, setModal),
  });

  const handleBolChange = async (event, option) => {
    if (option?.value) {
      setSelectedBol(option.value)
      const result = await ApiManager.getPLPOByBol(option.value);
      setPlArray(result.data);
    }
    else{
      setPlArray([]);
    }
  };
  const handleNext = ()=>{
    const plNoArrya = Array.from(new Set(plArray.map((item)=> item.packing_list_no)));
    const poNoArray = Array.from(new Set(plArray.map((item)=> item.po_no)));
    nav("/app/spr/otm_bol/add",{state : {
      plNoArrya,
      poNoArray,
      selectedBol
    }})
  }
  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <OutlinedButton
              color="primary"
              size="small"
              onClick={() => {
                exportPackingList(otmBolList?.data);
              }}
            >
              <FileDownloadOutlined fontSize="small" /> Export
            </OutlinedButton>
            <OutlinedButton
              color="primary"
              size="small"
              onClick={() => {
                setOpenAddBolModal(true);
              }}
            >
              <AddCircleOutlineOutlined fontSize="small" /> Add OTM BOL
            </OutlinedButton>
          </>
        }
      />

      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={otmBolListSelector.formData}
                  setFilters={(filters) =>
                    dispatch(updatePackingListInput(filters))
                  }
                  width="500px"
                >
                  {/* Assuming PackingListFilters component filters data */}
                  <OtmBolListFilters />
                </GridSearchInput>

                <SelectBox
                  label="Sort By"
                  options={OTM_BOL_SORT_OPTIONS}
                  value={otmBolListSelector.sortBy}
                  onChange={(event) => {
                    dispatch(setPackingListSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>

              <Box>
                {/* <IconButton
                  onClick={() => dispatch(setPackingListView("card"))}
                >
                  <FormatListBulletedOutlined
                    color={
                      otmBolListSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton> */}
                <IconButton
                  onClick={() => dispatch(setPackingListView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      otmBolListSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        {/* Toggle between Grid View and Card View */}
        {otmBolListSelector.view === "grid" && (
          <ThemedGrid
            columns={OTM_BOL_COLUMNS}
            uniqueId="serial_id"
            data={otmBolList?.data}
            count={otmBolList?.totalRecords}
            handlePage={handlePage}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={otmBolListSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={otmBolListSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(setPackingListSortModel(sortModel))
            }
            onRowSelectionModelChange={handleRowSelection} // Update selection on change
            rowSelectionModel={rowSelectionModel} // Pass current selection state
            checkboxSelection
            disableRowSelectionOnClick
            // isRowSelectable={isRowSelectable} // Disable rows based on conditions
          />
        )}
      </Card>

      {/* Modal for adding BOL */}
      {openAddBolModal && (
        <ThemedModal
          width="75%"
          modalTitle="Add OTM BOL"
          open={openAddBolModal}
          setOpen={setOpenAddBolModal}
        >
          {/* <AddBolConfirmation
            rowSelectionModel={rowSelectionModel}
            onClose={handleCloseAddBolModal}
            view="modal"
          /> */}

          <Box sx={{ p: 3 }}>
            <Autocomplete
              disablePortal
              options={otmBolList?.bol_list}
              renderInput={(params) => <TextField {...params} label="BOL#" />}
              onChange={handleBolChange}
              value={selectedBol || ''}
            />
            <Box sx={{ marginTop: 2, marginBottom: 2,height: 250,overflowY : "auto" }}>
            <BasicTable columns={[
              {
                headerName : "Packing List No.",
                field : "packing_list_no"
              },
              {
                headerName : "PO No.",
                field : "po_no"
              }
            ]} rows={plArray} />

            </Box>
            <Stack direction={'row'} justifyContent={'end'}>
            <ThemeButton onClick={handleNext}>Next</ThemeButton>
            </Stack>
          </Box>
        </ThemedModal>
      )}
      {modal.type === "audit" && (
        <ReusableRightDrawer
          open={modal?.open}
          data={modal?.data?.serial_id}
          table={"PACKING_LIST"}
          column={PACKING_LIST}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          // sx={{ zIndex: 2, position: "absolute" }} // Higher zIndex for the drawer
        />
      )}
    </Box>
  );
}
