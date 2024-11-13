import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import InputBox from "../../common/InputBox";
import UserManagementImage from "../../../assets/user_management.svg";
import { OutlinedButton, ThemeButton } from "../../common/Button";
import SelectBox from "../../common/SelectBox";
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from "../../../data/options";
import { useFormik } from "formik";
import { UserValidationSchema } from "./validation";
import MtrConfigForm from "./MtrConfigForm";
import { UserRoleEnum } from "../../../data/enums";
import ThemedMultiselect from "../../common/ThemedMultiselect";
import EmailConfigForm from "./EmailConfigForm";
import ApiManager from "../../../services/ApiManager";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChipAutocomplete from "../../common/ChipAutocomplete";
import {
  useEditUserMutation,
  useFetchOptionsQuery,
} from "../../../store/api/userDataApi";
import { optionFormatter } from "../../utils/utils";
import AppAutocomplete from "../../common/AppAutocomplete";

const BACK_BUTTON_PATH = "/app/admin_master/user_management";

export default function UserForm({ initialValues, formAction, refetch }) {
  console.log("initialValuesinitialValues", initialValues);

  const [loader, setLoader] = React.useState(false);
  const nav = useNavigate();
  const [options, setOptions] = React.useState([]);
  const { data: UserOptions } = useFetchOptionsQuery();
  const [editUser, { isLoading, isError, isSuccess, data, error }] =
    useEditUserMutation();
    const formik = useFormik({
        initialValues,
        validationSchema: UserValidationSchema(formAction),
        onSubmit: async (values) => {
            let payload = {...values}
            delete payload.confirm_password
            delete payload.usercode
            if (formAction === 'edit'){
                delete payload.password
            }
            if(formAction === "verify"){
                payload.action = "verify";
            }
            
            payload.ctypelist = Array.isArray(payload?.ctypelist) ? payload?.ctypelist?.map((item) => item?.value).join(',') : []
            payload.sprlist = Array.isArray(payload?.sprlist) ? payload?.sprlist?.map((item) => item?.value).join(',') : []
            setLoader(true);
            const apiCall = initialValues?.usercode ? editUser({
                usercode: initialValues?.usercode,
                ...payload,
              }).unwrap() : ApiManager.addUser(payload);
            await apiCall
        .then((response) => {
          console.log(response);
          if (response?.status === "error") {
            toast.error(
              response?.message + ": " + response?.errors[0]?.message
            );
          } else {
            const successMessage = initialValues?.usercode
              ? "User updated successfully"
              : "User added successfully";
            toast.success(successMessage);
            if (formAction === "edit") {
              refetch();
            } else {
                const successMessage = initialValues?.usercode ? "User updated successfully" : "User added successfully";
                toast.success(successMessage);
                if (formAction === 'edit' || formAction === "verify") {
                    refetch();
                }
                else {
                    formik.resetForm();
                }
            }
        }})
        .catch((error) => {
          const errorMessage = initialValues?.usercode
            ? "Failed to update user"
            : "Failed to add user";
          toast.error(errorMessage);
        })
        .finally(() => {
          setLoader(false);
        });
    },
  });
  React.useEffect(() => {
    if (
      formik.values.role &&
      formik.values.role !== UserRoleEnum.AGENT &&
      formik.values.role !== UserRoleEnum.CUSTOMER
    ) {
      formik.setFieldValue("companyname", "FFAC Corporation");
    } else if (formik.values.role === "") {
      formik.setFieldValue("companyname", "");
    }
  }, [formik.values.role, formik.setFieldValue]);
  const handleCompanyOptionChange = async (query) => {
    const role = formik.values.role;
    console.log("rolerolerolerole", role);

    ApiManager.getCompanyOptions(role, query)
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <form>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack
          spacing={4}
          direction="column"
          useFlexGap
          flexWrap="wrap"
          mt={2}
          width="50%"
          height="100%"
        >
          <Stack direction="row" spacing={2} mt={3}>
            <InputBox
              label="User ID"
              id="userid"
              value={formik.values.userid}
              error={formik.errors.userid}
              disabled={formAction === "edit"}
              onChange={formik.handleChange}
            />
            <InputBox
              label="Email ID"
              id="emailid"
              value={formik.values.emailid}
              error={formik.errors.emailid}
              onChange={formik.handleChange}
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <InputBox
              label="First Name"
              id="firstname"
              value={formik.values.firstname}
              error={formik.errors.firstname}
              onChange={formik.handleChange}
            />
            <InputBox
              label="Last Name"
              id="lastname"
              value={formik.values.lastname}
              error={formik.errors.lastname}
              onChange={formik.handleChange}
            />
          </Stack>
          {formAction !== "edit" && (
            <Stack direction="row" spacing={2}>
              <InputBox
                label="Password"
                id="password"
                type="password"
                value={formik.values.password}
                error={formik.errors.password}
                onChange={formik.handleChange}
              />
              <InputBox
                label="Comfirm Password"
                id="confirm_password"
                type="password"
                value={formik.values.confirm_password}
                error={formik.errors.confirm_password}
                onChange={formik.handleChange}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={2}>
            <SelectBox
              label="Status"
              id="status"
              options={USER_STATUS_OPTIONS}
              value={formik.values.status}
              error={formik.errors.status}
              onChange={formik.handleChange}
            />
            <SelectBox
              label="Role"
              id="role"
              options={USER_ROLE_OPTIONS}
              value={formik.values.role}
              error={formik.errors.role}
              onChange={formik.handleChange}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              {" "}
              {formik.values.role === UserRoleEnum.AGENT ||
              formik.values.role === UserRoleEnum.CUSTOMER ? (
                <AppAutocomplete
                  label="Company Name"
                  id="companyname"
                  value={formik.values.companyname}
                  formik={formik}
                  error={formik.errors.companyname}
                  options={options}
                  onChange={(value) =>
                    formik.setFieldValue("companyname", value)
                  }
                  handleOptionChange={handleCompanyOptionChange}
                  sx={{ marginTop: "16px", marginBottom: "8px", width: "100%" }}
                />
              ) : (
                <InputBox
                  label="Company Name"
                  id="companyname"
                  value={formik.values.companyname}
                  disabled={true}
                  error={formik.errors.companyname}
                  onChange={formik.handleChange}
                  sx={{ width: "100%" }}
                />
              )}
            </Box>
          </Stack>

          {/* ========= DYNAMIC FEILDS ========== */}
          {(formik.values.role === UserRoleEnum.ADMIN ||
            formik.values.role === UserRoleEnum.BACKOFFICE ||
            formik.values.role === UserRoleEnum.FRONTOFFICE ||
            formik.values.role === UserRoleEnum.SALES) && (
            <MtrConfigForm
              formik={formik}
              options={optionFormatter(UserOptions?.columnList, String)}
            />
          )}
          {formik.values.role === UserRoleEnum.AGENT && (
            <Box>
              <Typography
                variant="subtitle2"
                component={"h6"}
                sx={{
                  mb: 2,
                  color: "primary.main",
                  borderBottom: "2px solid #1976d2",
                  width: "fit-content",
                }}
              >
                SPR Configuration
              </Typography>
              <ChipAutocomplete
                options={optionFormatter(UserOptions?.countyList, String)}
                label="Select SPR"
                id="sprlist"
                placeholder="Select SPR"
                preValue={formik.values.sprlist}
                error={formik.errors.sprlist}
                formik={formik}
              />
            </Box>
          )}
          {formik.values.role === UserRoleEnum.CUSTOMER && (
            <EmailConfigForm formik={formik} />
          )}

          {/* ========= FORM ACTION ========== */}
          <Stack direction="row" spacing={2} display={"flex"} mt={3}>
            <OutlinedButton
              color="primary"
              size="lg"
              sx={{ width: 140 }}
              onClick={() => {
                nav(BACK_BUTTON_PATH);
              }}
            >
              Cancel
            </OutlinedButton>
            <ThemeButton
              color="primary"
              size="lg"
              sx={{ width: 140 }}
              onClick={formik.handleSubmit}
            >
              {loader && <CircularProgress size={20} color="white" />} Save
            </ThemeButton>
          </Stack>
        </Stack>

        <Stack
          width="50%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={UserManagementImage}
            alt="user management image"
            height="200px"
            width={"atuo"}
          />
        </Stack>
      </Stack>
    </form>
  );
}
