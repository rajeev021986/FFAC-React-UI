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
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";
import { useParams } from "react-router-dom";
import ApiManager from "../../../services/ApiManager";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function AddCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [roles, setRoles] = useState([]);
  const formikRef = useRef(null);
  const [locations, setLocations] = useState([{ value: "Chennai", label: "Chennai" }, { value: "Mumbai", label: "Mumbai" }]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await ApiManager.getUserData(id);
        console.log(res, "dfghjkl");
        if (formikRef.current) {
          formikRef.current.setFieldValue("defaultLocation", res.body.defaultLocation);
          formikRef.current.setFieldValue("status", res.body.status);
          formikRef.current.setFieldValue("firstName", res.body.firstName);
          formikRef.current.setFieldValue("lastName", res.body.lastName);
          formikRef.current.setFieldValue("email", res.body.email);
          formikRef.current.setFieldValue("phone", res.body.phone);
          formikRef.current.setFieldValue("password", res.body.password);
          formikRef.current.setFieldValue("confirmPassword", res.body.confirmPassword);
          formikRef.current.setFieldValue("role", res.body.roles.map(role => role.roleName));
          formikRef.current.setFieldValue("companyCode", res.body.companyCode);
          formikRef.current.setFieldValue("userId", res.body.userId);
          formikRef.current.setFieldValue("id", res.body.id);
          const userRoles = res.body.roles.map(role => role.roleName) || [];
          setSelectedOptions(roles.map(role => ({
            value: role.roleName,
            checked: userRoles.includes(role.roleName)
          })));
        }
      } catch (err) {
        toast.error(err.message);
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await ApiManager.getRoles();
        setRoles(res.body);
        setSelectedOptions(res.body.map(role => ({
          value: role.roleName,
          checked: false
        })));
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchRoles();
    id && fetchUserData();
  }, []);

  const handleCheckboxChange = (event, optionValue) => {
    const isChecked = event.target.checked;

    setSelectedOptions(prevOptions =>
      prevOptions.map(option =>
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
        currentRoles.filter(role => role !== optionValue)
      );
    }
  };

  const status = [{ label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]



  const handleRemoveOption = (optionValue) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.value === optionValue ? { ...option, checked: false } : option
      )
    );
    const currentRoles = formikRef.current?.values?.role || [];
    formikRef.current.setFieldValue("role", currentRoles.filter(role => role !== optionValue));
  };

  const selectedCount = selectedOptions.filter(
    (option) => option.checked
  ).length;

  const filteredRoles = roles.filter(role =>
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
              roles: values.role.map((role, index) => { return { roleId: roles.find(r => r.roleName === role).roleId, roleName: role, isDeleted: roles.find(r => r.roleName === role).isDeleted } })
            }
            await ApiManager.updateUserData(payload).then((res) => {
              toast.success(res.message)
            }).catch((err) => {
              toast.error(err.message)
            })
          } else {
            const payload = {
              ...values,
              id: null,
              locations: [values.defaultLocation],
              roles: values.role.map((role, index) => { return { roleId: roles.find(r => r.roleName === role).roleId, roleName: role, isDeleted: roles.find(r => r.roleName === role).isDeleted } })
            }
            await ApiManager.addUserData(payload).then((res) => {
              toast.success(res.message)
            })
          }
          navigate(-1)
        }}
      >
        {(formik) => (
          <Form>
            <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
              <CardHeader
                title={
                  <Box display="flex" justifyContent={"space-between"}>
                    <Typography variant="subtitle3" component="div">
                      Customer
                    </Typography>
                  </Box>
                }
              />
              <TabContext>
                <TabList
                  // onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="User Info" sx={{ textTransform: "initial" }} />
                </TabList>
              </TabContext>
              <TabContext>
                <TabList sx={{ marginLeft: "14px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Field
                        name="userId"
                        label="User ID"
                        autoComplete="off"
                        value={formik.values.userId}
                        onChange={(e) => {
                          formik.setFieldValue("userId", e.target.value)
                        }}
                        component={InputBox}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="userId"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Field
                        name="firstName"
                        label="First Name"
                        value={formik.values.firstName}
                        onChange={(e) => {
                          formik.setFieldValue("firstName", e.target.value)
                        }}
                        component={InputBox}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Field
                        name="lastName"
                        label="Last Name"
                        value={formik.values.lastName}
                        component={InputBox}
                        onChange={(e) => {
                          formik.setFieldValue("lastName", e.target.value)
                        }}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Field
                        name="email"
                        label="Email Address"
                        value={formik.values.email}
                        component={InputBox}
                        onChange={(e) => {
                          formik.setFieldValue("email", e.target.value)
                        }}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Field
                        name="phone"
                        label="Phone"
                        value={formik.values.phone}
                        component={InputBox}
                        onChange={(e) => {
                          formik.setFieldValue("phone", e.target.value)
                        }}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      sx={{ marginTop: "15px" }}
                    >
                      <SelectBox
                        label="Locations"
                        id="defaultLocation"
                        options={locations}
                        value={formik.values.defaultLocation}
                        error={formik.errors.defaultLocation}
                        onChange={formik.handleChange}
                      />
                      <ErrorMessage
                        name="defaultLocation"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      sx={{ marginTop: "15px" }}
                    >
                      <SelectBox
                        label="Status"
                        id="status"
                        options={status}
                        value={formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                      />
                      <ErrorMessage
                        name="status"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Field
                        name="password"
                        label="Password"
                        type="password"
                        component={InputBox}
                        value={formik.values.password}
                        onChange={(e) => {
                          formik.setFieldValue("password", e.target.value)
                        }}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Field
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        component={InputBox}
                        value={formik.values.confirmPassword}
                        onChange={(e) => {
                          formik.setFieldValue("confirmPassword", e.target.value)
                        }}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Field
                        name="companyCode"
                        label="Company Code"
                        value={formik.values.companyCode}
                        component={InputBox}
                        onChange={(e) => {
                          formik.setFieldValue("companyCode", e.target.value)
                        }}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="companyCode"
                        component="div"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      />
                    </Grid>
                  </Grid>
                </TabList>
              </TabContext>
              <CardContent >
                {/* <TabContext>
                  <TabList
                    // onChange={handleChange}
                    aria-label="lab API tabs example"
                  > */}
                <Tab
                  label="Role"
                  sx={{
                    textTransform: "initial",
                  }}
                />
                {/* </TabList>
                </TabContext> */}
                <TabContext>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      width: "100%",
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
                                  checked={formik.values.role?.includes(option.roleName)}
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
                        <Typography>Selected ({selectedCount})</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ marginTop: 2 }}>
                      {formik.values.role?.length > 0 && formik.values.role
                        .map((option, index) => (
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
                </TabContext>
              </CardContent>
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
