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
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { USER_MANAGEMENT_COLUMNS } from "../../data/columns/user";
import CardsView from "../../components/common/Cards/CardsView";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import { useLocation, useNavigate } from "react-router-dom";
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
import { getUserListGridActions } from "../../components/screen/user-management/action";
// import EditIcon from "@mui/icons-material/Edit";
import ReusableRightDrawer from "../../components/common/CommonDrawer";
import { COMMON } from "../../data/columns/audit";
import UserManagementModules from "./UserManagementModules";
import AuditTimeLine from "../../components/AuditTimeLine";
import { useLazyFetchAuditQuery } from "../../store/api/common";
import ApiManager from "../../services/ApiManager";
import CustomToast from "../../components/common/Toast/CustomToast";
import toast, { LoaderIcon } from "react-hot-toast";
import FilterForm from "../../components/screen/user-management/FilterForm";
const ADD_NEW_USER_PATH = "/app/admin/users/addUser";

export default function UserManagementScreen() {
  const userManagementSelector = useSelector((state) => state.userManagement);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [exportLoader, setExportLoader] = useState();
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });

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
  Boolean(userManagementSelector?.status.length > 0) &&
    payload.push({
      fieldName: "status",
      operator: "=",
      value: userManagementSelector?.status[0],
      logicalOperator: "and",
    });

  const {
    data: UserData,
    isError,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useFetchUsersQuery({
    params: query,
    payload,
  });
  const [fetchAudit, { data: AuditData, isLoading: AuditLoadinng }] =
    useLazyFetchAuditQuery();
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };
  useEffect(() => {
    refetch();
  }, [location.pathname]);
  const actions = [
    { name: "New User" },
    { name: exportLoader ? <LoaderIcon /> : "Export" },
  ];
  USER_MANAGEMENT_COLUMNS[USER_MANAGEMENT_COLUMNS.length - 1].renderCell =
    GridActions({
      actions: getUserListGridActions(nav, setModal),
    });
  const fetchUserAudit = () => {
    fetchAudit({
      userId: modal.data.id,
    });
  };
  const handleActionClick = async (actionName) => {
    if (actionName === "New User") {
      nav(ADD_NEW_USER_PATH, { state: { formAction: "add" } });
    }
    if (actionName === "Export") {
      setExportLoader(true);
      try {
        const blob = await ApiManager.fetchDatasExcel({
          query: query,
          payload: payload,
          service: "admin-service",
          page: "user",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "user-data.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        toast.custom(
          <CustomToast message="Something went wrong" toast="error" />,
          {
            closeButton: false,
          }
        );
      }
      setExportLoader(false);
    }
  };
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
                    boxShadow: 3,
                    borderRadius: "20px 19px 19px 20px",
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
            {/* <OutlinedButton
              color="primary"
              size="small"
              onClick={() =>
                nav(ADD_NEW_USER_PATH, { state: { formAction: "add" } })
              }
            >
              <AddCircleOutlineOutlined fontSize="small" /> New User
            </OutlinedButton> */}
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
                  <FilterForm />
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
            columnVisibilityHandler={() => {}}
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
      <UserManagementModules
        refetch={refetch}
        modal={modal}
        setModal={setModal}
      />
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
              auditDetails={AuditData}
              reloadDataHandler={fetchUserAudit}
              loading={AuditLoadinng}
            />
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
