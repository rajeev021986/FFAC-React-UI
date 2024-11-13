import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import {
  FileDownloadOutlined,
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import SelectBox from "../../components/common/SelectBox";
import { useSelector, useDispatch } from "react-redux";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { REGISTERED_USERS_COLUMNS } from "../../data/columns/user";
import {
  setPagination,
  setSortBy,
  setSortModel,
  setView,
  updateInput,
} from "../../store/freatures/newRegisteredUserSlice";
import { NEW_USER_SORT_OPTIONS } from "../../data/options";
import CardsView from "../../components/common/Cards/CardsView";
import { useFetchRegesterdUserQuery } from "../../store/api/userDataApi";
import {
  getUserListGridActions,
  newUserListGridActions,
} from "../../components/screen/user-management/action";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GridActions from "../../components/common/Grid/GridActions";
import ThemedModal from "../../components/common/ThemedModal";
import { Field, Form, Formik } from "formik";
import ApiManager from "../../services/ApiManager";
import toast from "react-hot-toast";
import UserManagementFilters from "../../components/screen/user-management/UserManagementFilters";
import NewUserRegisteredFilter from "../../components/screen/user-management/NewUserRegisteredFilter";

export default function NewRegisteredUserScreen() {
  const nav = useNavigate();
  const userManagementSelector = useSelector(
    (state) => state.newRegisteredUser
  );
  const dispatch = useDispatch();
  const {
    data: UserData,
    isLoading,
    isFetching,
    refetch
  } = useFetchRegesterdUserQuery({
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
  console.log("userManagementSelector : ",userManagementSelector);
  
  const [modal, setModal] = useState({
    open: false,
    type: "",
    data: {},
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  REGISTERED_USERS_COLUMNS[REGISTERED_USERS_COLUMNS.length - 1].renderCell =
    GridActions({
      actions: newUserListGridActions(nav, setModal),
    });

  const handleSubmit = async (value, { setSubmitting, setErrors }) => {
    const payload = { ...value, emailid: modal.data.emailid };
    try {
      const result = await ApiManager.rejectUser(payload);
      if (result.status === "error")
        throw new Error(result.message, { cause: result.errors });
      toast.success(result.message);
      refetch()
      setModal({
        open: false,
        type: "",
        data: {},
      })
    } catch (error) {
      console.log(error);
      let errors = {}
      error.cause.forEach((item) => {
        errors[item.path] = item.message;
      });

      setErrors(errors);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <OutlinedButton
              color="primary"
              size="small"
              //   onClick={() => exportUserManagement(UserData?.rows)}
            >
              <FileDownloadOutlined fontSize="small" /> Export
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
                  <NewUserRegisteredFilter />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={NEW_USER_SORT_OPTIONS}
                  value={userManagementSelector.sortBy}
                  onChange={(event) => {
                    console.log(event.target.value);
                    
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
            uniqueId="serial_id"
            columns={REGISTERED_USERS_COLUMNS}
            count={UserData?.totalRecord ? Number(UserData?.totalRecord) : 0}
            handlePage={handlePage}
            data={UserData && UserData.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={userManagementSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={userManagementSelector.sortModel}
            onSortModelChange={(sortModel) => {
              console.log("sortModel : ",sortModel);
              
              dispatch(setSortModel(sortModel))
            }}
          />
        ) : (
          <CardsView
            uniqueId="serial_id"
            columns={REGISTERED_USERS_COLUMNS}
            count={UserData?.totalRecord ? Number(UserData?.totalRecord) : 0}
            handlePage={handlePage}
            data={UserData && UserData.data}
            paginationModel={userManagementSelector.pagination}
            loading={isLoading || isFetching}
            actions={getUserListGridActions(nav, setModal)}
          />
        )}
      </Card>
      {modal.type === "reject" && (
        <ThemedModal
          open={modal.open}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          modalTitle={"Reject login request"}
        >
          <Box sx={{ padding: 2 }}>
            <Typography sx={{ fontSize: 16 }} color="secondary.main">
              <span style={{ fontWeight: "bold" }}>Name : </span>
              {modal.data.firstname} {modal.data.lastname}
            </Typography>
            <Typography sx={{ fontSize: 16 }} color="secondary.main">
              <span style={{ fontWeight: "bold" }}>Email : </span>
              {modal.data.emailid}
            </Typography>
          </Box>
          <Formik
            enableReinitialize={true}
            initialValues={{
              reject_reason: "",
            }}
            onSubmit={handleSubmit}
          >
            {({
              isSubmitting,
              errors,
              touched,
              handleChange,
              handleBlur,
              values,
            }) => (
              <Form
                style={{
                  minWidth: 500,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingBottom: 20,
                }}
              >
                <Field name="reject_reason">
                  {({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="Reject Reason"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.reject_reason}
                      error={
                        touched.reject_reason && Boolean(errors.reject_reason)
                      }
                      helperText={touched.reject_reason && errors.reject_reason}
                      style={{ width: "100%", marginBottom: 20 }}
                    />
                  )}
                </Field>
                <ThemeButton
                  type="submit"
                  disabled={isSubmitting}
                  color="primary"
                >
                  {isSubmitting && <CircularProgress color="white" size={20} />}
                  Register User
                </ThemeButton>
              </Form>
            )}
          </Formik>
        </ThemedModal>
      )}
    </Box>
  );
}
