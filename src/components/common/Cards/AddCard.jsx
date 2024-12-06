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
import React, { useState } from "react";
import ScreenToolbar from "../../common/ScreenToolbar";
import ThemedBreadcrumb from "../../common/Breadcrumb";
import InputBox from "../InputBox";
import SelectBox from "../SelectBox";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabContext from "@mui/lab/TabContext";

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
  const [selectedOptions, setSelectedOptions] = useState([
    { label: "Option 1", value: "option1", checked: false },
    { label: "Option 2", value: "option2", checked: false },
    { label: "Option 3", value: "option3", checked: false },
    { label: "Option 4", value: "option4", checked: false },
    { label: "Option 5", value: "option5", checked: false },
    // { label: "Option 6", value: "option6", checked: false },
    // { label: "Option 7", value: "option7", checked: false },
    // { label: "Option 8", value: "option8", checked: false },
    // { label: "Option 9", value: "option9", checked: false },
    // { label: "Option 10", value: "option10", checked: false },
  ]);

  const handleCheckboxChange = (event, optionValue) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.value === optionValue
          ? { ...option, checked: event.target.checked }
          : option
      )
    );
  };

  const handleRemoveOption = (optionValue) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.value === optionValue ? { ...option, checked: false } : option
      )
    );
  };

  const selectedCount = selectedOptions.filter(
    (option) => option.checked
  ).length;

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
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          location: "",
          status: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() => (
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
                        name="firstName"
                        label="First Name"
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
                        component={InputBox}
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
                        component={InputBox}
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
                        component={InputBox}
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
                      <Field
                        name="location"
                        label="Select Location"
                        component={SelectBox}
                        sx={{ width: "90%" }}
                      />
                      <ErrorMessage
                        name="location"
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
                      <Field
                        name="status"
                        label="Status"
                        component={SelectBox}
                        sx={{ width: "90%" }}
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
                          {selectedOptions.map((option, index) => (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  name={option.value}
                                  checked={option.checked}
                                  onChange={(event) =>
                                    handleCheckboxChange(event, option.value)
                                  }
                                />
                              }
                              label={option.label}
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
                      {selectedOptions
                        .filter((option) => option.checked)
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
                            <Typography>{option.label}</Typography>
                            <IconButton
                              onClick={() => handleRemoveOption(option.value)}
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
