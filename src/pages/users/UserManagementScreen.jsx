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
  Drawer,
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
import UserManagementModules from "./UserManagementModules";
import AuditTimeLine from "../../components/AuditTimeLine";
import { useLazyFetchAuditQuery } from "../../store/api/common";

const ADD_NEW_USER_PATH = "/app/admin/users/addUser";

export default function UserManagementScreen() {
  const userManagementSelector = useSelector((state) => state.userManagement);
  const nav = useNavigate();
  const dispatch = useDispatch();
  //   const [drawerOpen, setDrawerOpen] = useState(false);
  //   const [drawerData, setDrawerData] = useState(null);
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  console.log("modalmodal", modal);

  const query = {
    page: userManagementSelector?.pagination?.page + 1,
    size: userManagementSelector?.pagination?.pageSize,
    sortBy:
      userManagementSelector.sortModel.length > 0
        ? userManagementSelector.sortModel[0].field
        : userManagementSelector?.sortBy?.split("*")[0],
    sortOrder:
      userManagementSelector.sortModel.length > 0
        ? userManagementSelector?.sortModel[0]?.sort
        : userManagementSelector?.sortBy?.split("*")[1] || "",
  };
  console.log("userManagementSelector?.formData", userManagementSelector?.formData);
  const payload = Object.entries(userManagementSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      return {
        fieldName: key,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });
  Boolean(userManagementSelector?.status.length>0) && (payload.push({ fieldName: "status", operator: "=", value: userManagementSelector?.status[0], logicalOperator: "and" }))

  const {
    data: UserData,
    isError,
    isLoading,
    error,
    isFetching,
    refetch
  } = useFetchUsersQuery({
    params: query,
    payload,
  });
  const [fetchAudit, {
    data: AuditData,
    isLoading: AuditLoadinng
  }] = useLazyFetchAuditQuery();
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  USER_MANAGEMENT_COLUMNS[USER_MANAGEMENT_COLUMNS.length - 1].renderCell =
    GridActions({
      actions: getUserListGridActions(nav, setModal),
    });
  const fetchUserAudit = () => {
    fetchAudit({
      userId: modal.data.id,
    })
    console.log('first')
  }
  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            {/* <OutlinedButton
              color="primary"
              size="small"
              onClick={() => exportUserManagement(UserData?.rows)}
            >
              <FileDownloadOutlined fontSize="small" /> Export
            </OutlinedButton> */}
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
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
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
            uniqueId="id"
            columns={USER_MANAGEMENT_COLUMNS}
            count={UserData?.body?.totalElements}
            handlePage={handlePage}
            data={UserData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => { }}
            paginationModel={userManagementSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={userManagementSelector.sortModel}
            onSortModelChange={(sortModel) => dispatch(setSortModel(sortModel))}
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={USER_MANAGEMENT_COLUMNS}
            count={UserData?.body?.totalElements}
            handlePage={handlePage}
            data={UserData?.body?.data}
            paginationModel={userManagementSelector.pagination}
            loading={isLoading || isFetching}
            actions={getUserListGridActions(nav, setModal)}
            page="user_management"
          />
        )}
      </Card>
      <UserManagementModules refetch={refetch} modal={modal} setModal={setModal} />
      {/* {modal.type === 'audit' && (
        <ReusableRightDrawer
          open={modal?.open}
          data={modal?.data}
          table={"USER"}
          column={COMMON}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          sx={{ zIndex: 2, position: "absolute" }}
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
              User Audit Logs
            </Typography>
            <AuditTimeLine auditDetails={AuditData} reloadDataHandler={fetchUserAudit} loading={AuditLoadinng} />
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
