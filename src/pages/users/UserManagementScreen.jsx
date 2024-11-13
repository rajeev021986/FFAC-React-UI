import {
  FormatListBulletedOutlined,
  GridOnOutlined,
  AddCircleOutlineOutlined,
  FileDownloadOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { USER_MANAGEMENT_COLUMNS } from "../../data/columns/user";
import CardsView from "../../components/common/Cards/CardsView";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import { useFetchUsersQuery } from "../../store/api/userDataApi";
import UserManagementFilters from "../../components/screen/user-management/UserManagementFilters";
import { useDispatch, useSelector } from "react-redux";
import {
  setPagination,
  setSortBy,
  setSortModel,
  setView,
  updateInput,
} from "../../store/freatures/userManagementSlice";
import SelectBox from "../../components/common/SelectBox";
import { USER_SORT_OPTIONS } from "../../data/options";
import { exportUserManagement } from "../../components/screen/user-management/export";
import GridActions from "../../components/common/Grid/GridActions";
import { getUserListGridActions } from '../../components/screen/user-management/action'
// import EditIcon from "@mui/icons-material/Edit";
import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { COMMON } from "../../data/columns/audit";

const ADD_NEW_USER_PATH = "/app/admin_master/user_management/form";

export default function UserManagementScreen() {
  const userManagementSelector = useSelector((state) => state.userManagement);
  console.log("userManagementSelectoruserManagementSelector",userManagementSelector);
  const nav = useNavigate();
  const dispatch = useDispatch();
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [drawerData, setDrawerData] = useState(null);
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  console.log("modalmodal",modal);
  

  const {
    data: UserData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchUsersQuery({
    page: userManagementSelector?.pagination?.page + 1,
    perPage: userManagementSelector?.pagination?.pageSize,
    orderBy:
      userManagementSelector.sortModel.length > 0
        ? userManagementSelector.sortModel[0].field +
          "*" +
          userManagementSelector.sortModel[0].sort
        : userManagementSelector.sortBy,
    role: userManagementSelector.role.join(","),
    status: userManagementSelector.status.join(","),
    ...userManagementSelector.formData,
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  USER_MANAGEMENT_COLUMNS[USER_MANAGEMENT_COLUMNS.length - 1].renderCell =
    GridActions({
      actions: getUserListGridActions(nav,setModal),
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
              onClick={() => exportUserManagement(UserData?.rows)}
            >
              <FileDownloadOutlined fontSize="small" /> Export
            </OutlinedButton>
            <OutlinedButton
              color="primary"
              size="small"
              onClick={() =>
                nav(ADD_NEW_USER_PATH, { state: { formAction: "add" } })
              }
            >
              <AddCircleOutlineOutlined fontSize="small" /> New User
            </OutlinedButton>
          </>
        }
      />
      <Card sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={userManagementSelector.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <UserManagementFilters filterInfo={UserData?.counts || []} />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={USER_SORT_OPTIONS}
                  value={userManagementSelector.sortBy}
                  onChange={(event) => {
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
                      userManagementSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(setView("grid"))}>
                  <GridOnOutlined
                    color={
                      userManagementSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />
        {userManagementSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="usercode"
            columns={USER_MANAGEMENT_COLUMNS}
            count={UserData?.totalRecord}
            handlePage={handlePage}
            data={UserData?.rows}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={userManagementSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={userManagementSelector.sortModel}
            onSortModelChange={(sortModel) => dispatch(setSortModel(sortModel))}
          />
        ) : (
          <CardsView
            uniqueId="usercode"
            columns={USER_MANAGEMENT_COLUMNS}
            count={UserData?.totalRecord}
            handlePage={handlePage}
            data={UserData?.rows}
            paginationModel={userManagementSelector.pagination}
            loading={isLoading || isFetching}
            actions={getUserListGridActions(nav,setModal)}
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
    </Box>
  );
}
