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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
  const formikRef = useRef(null);
  const [locations, setLocations] = useState([
    { value: "Chennai", label: "Chennai" },
    { value: "Mumbai", label: "Mumbai" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await ApiManager.getUserData(id);

        if (formikRef.current) {
          formikRef.current.setValues({ ...res.body });
          // formikRef.current.setFieldValue(
          //   "defaultLocation",
          //   res.body.defaultLocation
          // );
          // formikRef.current.setFieldValue("status", res.body.status);
          // formikRef.current.setFieldValue("firstName", res.body.firstName);
          // formikRef.current.setFieldValue("lastName", res.body.lastName);
          // formikRef.current.setFieldValue("email", res.body.email);
          // formikRef.current.setFieldValue("phone", res.body.phone);
          // formikRef.current.setFieldValue("password", res.body.password);
          // formikRef.current.setFieldValue(
          //   "confirmPassword",
          //   res.body.confirmPassword
          // );
          formikRef.current.setFieldValue(
            "role",
            res.body.roles.map((role) => role.roleName)
          );
          // formikRef.current.setFieldValue("companyCode", res.body.companyCode);
          // formikRef.current.setFieldValue("userId", res.body.userId);
          // formikRef.current.setFieldValue("id", res.body.id);
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

    const currentRoles = formikRef.current?.values?.role || [];
    if (isChecked) {
      formikRef.current.setFieldValue("role", [...currentRoles, optionValue]);
    } else {
      formikRef.current.setFieldValue(
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
    const currentRoles = formikRef.current?.values?.role || [];
    formikRef.current.setFieldValue(
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
      <Formik
        innerRef={formikRef}
        validateOnChange={false}
        initialValues={{
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
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (id) {
            const payload = {
              ...values,
              locations: [values.defaultLocation],
              roles: values.role.map((role, index) => {
                return {
                  roleId: roles.find((r) => r.roleName === role).roleId,
                  roleName: role,
                  isDeleted: roles.find((r) => r.roleName === role).isDeleted,
                };
              }),
            };
            await ApiManager.updateUserData(payload)
              .then((res) => {
                toast.success(res.message);
              })
              .catch((err) => {
                toast.error(err.message);
              });
          } else {
            const payload = {
              ...values,
              id: null,
              locations: [values.defaultLocation],
              roles: values.role.map((role, index) => {
                return {
                  roleId: roles.find((r) => r.roleName === role).roleId,
                  roleName: role,
                  isDeleted: roles.find((r) => r.roleName === role).isDeleted,
                };
              }),
            };
            await ApiManager.addUserData(payload)
              .then((res) => {
                toast.success(res.message);
              })
              .catch((er) => toast.error(er.msg));
          }
          navigate(-1);
        }}
      >
        {(formik) => (
          <Form>
            <Card
              sx={{
                borderWidth: 1,
                borderColor: "border.main",
                padding: "10px",
              }}
            >
              <CardHeader
                title={
                  <Box display="flex" justifyContent={"space-between"}>
                    <Typography variant="subtitle3" component="div">
                      User Info
                    </Typography>
                  </Box>
                }
              />
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
                  <InputBox
                    name="companyCode"
                    label="Company Code"
                    type="companyCode"
                    id="companyCode"
                    autoComplete="off"
                    value={formik.values.companyCode}
                    error={formik.errors.companyCode}
                    onChange={formik.handleChange}
                  />
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
                          padding: "5px",
                          borderRadius: "4px",
                        }}
                      >
                        <Typography>{option}</Typography>
                        <IconButton
                          onClick={() => handleRemoveOption(option)}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ padding: "8px 10px", margin: "20px" }}
                type="submit"
              >
                Submit
              </Button>
            </Card>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
