import { Box, Card, CardHeader, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OutlinedButton } from "../../components/common/Button";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import {
  AddCircleOutlineOutlined,
  FileDownloadOutlined,
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import PackingListCardsView from "../../components/screen/packing-list/card/PackingListCardView";
import {
  setPackingListPagination,
  setPackingListSortBy,
  setPackingListSortModel,
  setPackingListView,
  updatePackingListInput,
} from "../../store/freatures/packingListSlice";
import { useFetchPackingListQuery } from "../../store/api/packingListDataApi";
import { exportPackingList } from "../../components/screen/packing-list/export";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import SelectBox from "../../components/common/SelectBox";
import { PACKING_LIST_COLUMNS } from "../../data/columns/packing-list";
import { PACKING_LIST_SORT_OPTIONS } from "../../data/options";
import GridActions from "../../components/common/Grid/GridActions";
import { getPackingListGridActions } from "../../components/screen/packing-list/actions";
import ThemedModal from "../../components/common/ThemedModal";
import AddBolConfirmation from "../../components/screen/packing-list/AddBolConfirmation";
import PackingListFilters from "../../components/screen/packing-list/PackingListFilters";
import { useNavigate } from "react-router-dom";
import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { PACKING_LIST } from "../../data/columns/audit";
import { useFormat } from "../../hooks/useFormat";

export default function PackingListScreen() {
  const [openAddBolModal, setOpenAddBolModal] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]); // Keep track of selected rows
  const packingListSelector = useSelector((state) => state.packingList);
  const {displayFormat} = useFormat()
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const {
    data: PackingListData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchPackingListQuery({
    page: packingListSelector?.pagination?.page + 1,
    perPage: packingListSelector?.pagination?.pageSize,
    filter: packingListSelector.status,
    orderBy:
      packingListSelector.sortModel.length > 0
        ? packingListSelector.sortModel[0].field +
          "*" +
          packingListSelector.sortModel[0].sort
        : packingListSelector.sortBy,
    ...packingListSelector.formData,
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
  const isRowSelectable = (params) =>
    params.row.pl_status === "FINAL" && params.row.bl_status === "";

  const COLUMN = PACKING_LIST_COLUMNS(displayFormat)
  COLUMN[COLUMN.length - 1].renderCell =
    GridActions({
      actions: getPackingListGridActions(nav,setModal),
  });

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
                exportPackingList(PackingListData?.data);
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
              <AddCircleOutlineOutlined fontSize="small" /> Add BOL
            </OutlinedButton>
          </>
        }
      />

      <Card  sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={packingListSelector.formData}
                  setFilters={(filters) =>
                    dispatch(updatePackingListInput(filters))
                  }
                  width="500px"
                >
                  {/* Assuming PackingListFilters component filters data */}
                  <PackingListFilters filterInfo={PackingListData?.counts} />
                </GridSearchInput>

                <SelectBox
                  label="Sort By"
                  options={PACKING_LIST_SORT_OPTIONS}
                  value={packingListSelector.sortBy}
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
                <IconButton
                  onClick={() => dispatch(setPackingListView("card"))}
                >
                  <FormatListBulletedOutlined
                    color={
                      packingListSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton
                  onClick={() => dispatch(setPackingListView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      packingListSelector.view === "grid"
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
        {packingListSelector.view === "grid" ? (
          <ThemedGrid
            columns={COLUMN}
            uniqueId="packing_list_no"
            data={PackingListData?.data}
            count={PackingListData?.totalRecord}
            handlePage={handlePage}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={packingListSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={packingListSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(setPackingListSortModel(sortModel))
            }
            onRowSelectionModelChange={handleRowSelection} // Update selection on change
            rowSelectionModel={rowSelectionModel} // Pass current selection state
            checkboxSelection
            disableRowSelectionOnClick
            isRowSelectable={isRowSelectable} // Disable rows based on conditions
          />
        ) : (
          <PackingListCardsView
            uniqueId="packing_list_no"
            columns={COLUMN}
            data={PackingListData?.data}
            count={PackingListData?.totalRecord || 0}
            handlePage={handlePage}
            paginationModel={packingListSelector.pagination}
            loading={isLoading || isFetching}
            actions={getPackingListGridActions(nav,setModal)}
            rowSelectionModel={rowSelectionModel} // Pass current selection state
            onRowSelectionModelChange={handleRowSelection} // Update selection on change
            isRowSelectable={isRowSelectable} // Disable checkboxes based on conditions
          />
        )}
      </Card>

      {/* Modal for adding BOL */}
      {openAddBolModal && (
        <ThemedModal
          width="30%"
          modalTitle="Add Bol Confirmation"
          open={openAddBolModal}
          setOpen={setOpenAddBolModal}
        >
          <AddBolConfirmation
            rowSelectionModel={rowSelectionModel}
            onClose={handleCloseAddBolModal}
            view="modal"
          />
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
