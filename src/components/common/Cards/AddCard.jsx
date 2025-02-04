import {
  Box,
  Button,
  Card,
  Grid,
  CardContent,
  FormControlLabel,
  FormControl,
  FormGroup,
  Checkbox,
  CardHeader,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState, useRef } from "react";
import ScreenToolbar from "../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../common/Breadcrumb";
import InputBox from "../InputBox";
import SelectBox from "../SelectBox";
import { useParams } from "react-router-dom";
import ApiManager from "../../../services/ApiManager";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Height } from "@mui/icons-material";
import CustomToast from "../Toast/CustomToast";
import { OutlinedButton, ThemeButton } from "../Button";
import FormAutoComplete from "../AutoComplete/FormAutoComplete";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import AuditTimeLine from "../../AuditTimeLine";
import { menuConfigUrl } from "../../../store/menuConfigUrl";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone is required"),
});

export default function AddCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([
    { value: "Chennai", label: "Chennai" },
    { value: "Mumbai", label: "Mumbai" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = React.useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabs = [
    { label: "User Details", value: 1, icon: <EditIcon /> },
    { label: "Audit logs", value: 2, icon: <HistoryIcon /> },
  ];
  Boolean(!id) && tabs.splice(1, 1);
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      defaultLocation: "",
      status: "Active",
      companyCode: "",
      userId: "",
      role: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          locations: [values.defaultLocation],
          roles: values.role.map((role) => {
            const matchedRole = roles.find((r) => r.roleName === role);
            return matchedRole
              ? {
                  roleId: matchedRole.roleId,
                  roleName: role,
                  isDeleted: matchedRole.isDeleted,
                }
              : {};
          }),
          statusCode: values.status === "Active" ? 1 : -2,
        };

        if (id) {
          // Update user
          const res = await ApiManager.updateUserData(payload);
          toast.success(res.message);
        } else {
          // Create new user
          payload.id = null;
          const res = await ApiManager.addUserData(payload);
          toast.success(res.message);
        }

        navigate(-1);
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      }
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await ApiManager.getUserData(id);

        if (formik) {
          formik.setValues({ ...res.body });
          // formik.setFieldValue(
          //   "defaultLocation",
          //   res.body.defaultLocation
          // );
          // formik.setFieldValue("status", res.body.status);
          // formik.setFieldValue("firstName", res.body.firstName);
          // formik.setFieldValue("lastName", res.body.lastName);
          // formik.setFieldValue("email", res.body.email);
          // formik.setFieldValue("phone", res.body.phone);
          // formik.setFieldValue("password", res.body.password);
          // formik.setFieldValue(
          //   "confirmPassword",
          //   res.body.confirmPassword
          // );
          formik.setFieldValue(
            "role",
            res.body.roles.map((role) => role.roleName)
          );
          // formik.setFieldValue("companyCode", res.body.companyCode);
          // formik.setFieldValue("userId", res.body.userId);
          // formik.setFieldValue("id", res.body.id);
          const userRoles = res.body.roles.map((role) => role.roleName) || [];
          setSelectedOptions(
            roles.map((role) => ({
              value: role.roleName,
              checked: userRoles.includes(role.roleName),
            }))
          );
        }
      } catch (err) {
        toast.custom(<CustomToast message={err.message} toast="error" />, {
          closeButton: false,
        });
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await ApiManager.getRoles();
        setRoles(res.body);
        setSelectedOptions(
          res.body.map((role) => ({
            value: role.roleName,
            checked: false,
          }))
        );
      } catch (err) {
        toast.custom(<CustomToast message={err.message} toast="error" />, {
          closeButton: false,
        });
      }
    };

    fetchRoles();
    id && fetchUserData();
  }, []);
  const handleCheckboxChange = (event, optionValue) => {
    const isChecked = event.target.checked;

    setSelectedOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.value === optionValue
          ? { ...option, checked: isChecked }
          : option
      )
    );

    const currentRoles = formik?.values?.role || [];
    if (isChecked) {
      formik.setFieldValue("role", [...currentRoles, optionValue]);
    } else {
      formik.setFieldValue(
        "role",
        currentRoles.filter((role) => role !== optionValue)
      );
    }
  };

  const status = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const handleRemoveOption = (optionValue) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.value === optionValue ? { ...option, checked: false } : option
      )
    );
    const currentRoles = formik?.values?.role || [];
    formik.setFieldValue(
      "role",
      currentRoles.filter((role) => role !== optionValue)
    );
  };

  const selectedCount = selectedOptions.filter(
    (option) => option.checked
  ).length;

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box>
      <ScreenToolbar
        leftComps={
          <div>
            <ThemedBreadcrumb />
          </div>
        }
        rightComps={<div></div>}
      />
      <Card>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              sx={{
                padding: 0,
              }}
            >
              {tabs.map((a) => (
                <Tab
                  sx={{
                    textTransform: "capitalize",
                    padding: "0px 12px",
                    minHeight: "50px",
                  }}
                  label={a.label}
                  value={a.value}
                  icon={a.icon}
                  iconPosition="start"
                />
              ))}
            </TabList>
          </Box>
          <TabPanel value={1} sx={{ padding: "0px" }}>
            <Card
              sx={{
                borderWidth: 1,
                borderColor: "border.main",
                padding: "10px",
              }}
            >
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    name="userId"
                    label="User ID"
                    id="userId"
                    disabled={id}
                    autoComplete="off"
                    value={formik.values.userId}
                    error={formik.errors.userId}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    name="firstName"
                    label="First Name"
                    id="firstName"
                    autoComplete="off"
                    value={formik.values.firstName}
                    error={formik.errors.firstName}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    name="lastName"
                    label="Last Name"
                    id="lastName"
                    autoComplete="off"
                    value={formik.values.lastName}
                    error={formik.errors.lastName}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    name="email"
                    label="Email Address"
                    id="email"
                    autoComplete="off"
                    value={formik.values.email}
                    error={formik.errors.email}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <InputBox
                    name="phone"
                    label="Phone"
                    id="phone"
                    autoComplete="off"
                    value={formik.values.phone}
                    error={formik.errors.phone}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <SelectBox
                    label="Locations"
                    id="defaultLocation"
                    options={locations}
                    value={formik.values.defaultLocation}
                    error={formik.errors.defaultLocation}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <SelectBox
                    label="Status"
                    id="status"
                    options={status}
                    value={formik.values.status}
                    error={formik.errors.status}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  paddingLeft={1}
                  marginTop={2}
                >
                  <FormAutoComplete
                    label="Company Name"
                    id="companyCode"
                    suggestionName="company_code"
                    dataLabel="company_name"
                    value={formik.values.companyCode}
                    error={formik.errors.companyCode}
                    onChange={formik.handleChange}
                  ></FormAutoComplete>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  width: "100%",
                  marginTop: 2,
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 400,
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Roles
                  </Typography>{" "}
                  {/* Add this line for the header */}
                  <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ paddingLeft: "4px" }}
                        >
                          <SearchIcon sx={{ marginLeft: "2px" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      maxWidth: "300px",
                      margin: "0 auto",
                    }}
                  />
                  <FormControl component="fieldset">
                    <FormGroup>
                      {filteredRoles.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              name={option.roleName}
                              checked={formik.values.role?.includes(
                                option.roleName
                              )}
                              onChange={(event) =>
                                handleCheckboxChange(event, option.roleName)
                              }
                            />
                          }
                          label={option.roleName}
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                  <Box
                    sx={{
                      width: "80%",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "7px",
                      border: "1px dashed black",
                    }}
                  >
                    <Typography>
                      Selected ({formik.values.role.length})
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  {formik.values.role?.length > 0 &&
                    formik.values.role.map((option, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 1,
                          border: "1px solid #ccc",
                          padding: "5px 10px",
                          borderRadius: "22px",
                          borderColor: "primary.main",
                        }}
                      >
                        <Typography>{option}</Typography>
                        <IconButton
                          onClick={() => handleRemoveOption(option)}
                          size="small"
                          color="primary"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                </Box>
              </Box>

              <Grid display="flex" sx={{ height: "40px", marginTop: "20px" }}>
                <Stack direction="row" spacing={2}>
                  <OutlinedButton
                    sx={{ fontWeight: "500", borderRadius: "12px" }}
                    onClick={() => navigate("/app/admin/users")}
                  >
                    Cancel
                  </OutlinedButton>
                  <ThemeButton
                    onClick={formik.handleSubmit}
                    sx={{
                      fontWeight: "500",
                      borderRadius: "12px",
                      color: "white !important",
                    }}
                  >
                    Submit
                  </ThemeButton>
                </Stack>
              </Grid>
            </Card>
          </TabPanel>
          <TabPanel value={2} sx={{ padding: "0px" }}>
            <AuditTimeLine
              id={formik?.values?.id}
              page="user"
              service={menuConfigUrl.admin}
            />
          </TabPanel>
        </TabContext>
      </Card>
    </Box>
  );
}
