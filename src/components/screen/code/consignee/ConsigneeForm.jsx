import { CircularProgress, Grid, Stack, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import AddMapping from "./AddMapping";
import * as Yup from "yup";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import ApiManager from "../../../../services/ApiManager";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import SelectBox from "../../../common/SelectBox";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddConsigneeMutation,
  useUpdateConsigneeMutation,
} from "../../../../store/api/consigneeDataApi";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeTabs from "../../../common/Tab/ThemeTab";
import AuditTimeline from "../../../AuditTimeLine";
import UploadFile from "../../../UploadFile";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import { useLazyGetConsigneeAuditQuery } from "../../../../store/api/consigneeDataApi";
import getFirstError from "../../../common/FieldToastError";
import EditIcon from "@mui/icons-material/Edit";
import { ConsigneeValidationSchema } from "./ConsigneeValidationSchema";
import FormAutoComplete from "../../../common/AutoComplete/FormAutoComplete";
import HistoryIcon from "@mui/icons-material/History";

export default function ConsigneeForm({ initialValues, page, type, id }) {
  const tabs = [
    { label: "Consignee Details", value: 1 },
    { label: "Document Details", value: 2 },
    { label: "Audit logs", value: 3 },
  ];
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [options, setOptions] = useState([]);
  const [enquiryAuditDetails, setEnquiryAuditDetails] = useState([]);
  const [optionsCity, setCityOptions] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(initialValues.files || []);
  const [addConsignee, { isLoading }] = useAddConsigneeMutation();
  const [loading, setLoading] = useState(false);
  const [enquiryFileDetails, setEnquiryFileDetails] = useState([]);
  const [updateConsignee, { isLoading: loadingUpdate }] =
    useUpdateConsigneeMutation();
  const [dropdownData, setDropdownData] = useState({});
  const location = useLocation();

  const nav = useNavigate();
  const [value, setValue] = React.useState(1);
  const validationSchema = Yup.object({
    consigneeName: Yup.string().required("Name is required"),
    address1: Yup.string().required("Address1 is required"),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const consigneeNameRef = useRef(null);

  const formik = useFormik({
    initialValues,
    validateOnChange: false,
    validationSchema: ConsigneeValidationSchema(),
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!values.id || type == "copy") {
        let freeDays = values.consigneeEntityFreeDays.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        try {
          delete values.id;
          values.status = "";
          values.statusCode = 1;
          let response = await addConsignee({
            ...values,
            consigneeEntityFreeDays: freeDays,
          }).unwrap();
          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/consignee");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred while submitting the form.");
        }
      } else {
        try {
          let freeDays = values.consigneeEntityFreeDays.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);

          let response = await updateConsignee({
            ...values,
            consigneeEntityFreeDays: freeDays,
          }).unwrap();
          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/consignee");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred while submitting the form.");
        }
      }
    },
  });
  const [getConsigneeAudit, { data: AuditData, isLoading: isLoadingAudit }] =
    useLazyGetConsigneeAuditQuery();
  const fetchAuditData = () => {
    getConsigneeAudit({ id: initialValues.id });
  };

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: consigneeSettingsData } =
    useGetOptionsSettingsQuery("consignee_settings");

  useEffect(() => {
    if (optionsSettingsData?.body || consigneeSettingsData?.body) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...consigneeSettingsData?.body,
      });
    }
  }, [optionsSettingsData]);
  useEffect(() => {
    if (consigneeNameRef.current) {
      consigneeNameRef.current.focus();
    }
  }, []);
  const disabled = page == "consignee" ? false : true;
  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  return (
    <>
      {type == "new" ? (
        <>
          <Box
            sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}
          >
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                  sx={{ padding: "0px" }}
                >
                  <Tab
                    label=" Consignee Details"
                    value={1}
                    sx={{
                      fontSize: "1rem",
                      textTransform: "capitalize",
                      padding: "0px 12px",
                      minHeight: "50px",
                    }}
                    icon={<EditIcon />}
                    iconPosition="start"
                  />
                </TabList>
              </Box>
              <TabPanel value={1} sx={{ padding: "0px" }}>
                {" "}
                <Grid
                  container
                  sx={{ padding: 0, margin: 0, paddingRight: "8px" }}
                >
                  <Grid container sx={{ padding: "0px" }}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      marginTop={2}
                      paddingLeft={1}
                    >
                      <Tooltip
                        title={
                          !formik.values.consigneeName
                            ? "Field is mandatory"
                            : ""
                        }
                        arrow
                      >
                        <InputBox
                          label="Consignee Name*"
                          id="consigneeName"
                          value={formik.values.consigneeName}
                          disabled={disabled}
                          error={formik.errors.consigneeName}
                          onChange={formik.handleChange}
                          inputRef={consigneeNameRef}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      sx={{ marginTop: 2 }}
                      paddingLeft={1}
                    >
                      <SelectBox
                        label="Status"
                        id="status"
                        disabled={true}
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
                      marginTop={2}
                      paddingLeft={1}
                    >
                      <Tooltip
                        title={
                          !formik.values.address1 ? "Field is mandatory" : ""
                        }
                        arrow
                      >
                        <InputBox
                          label="Address1*"
                          id="address1"
                          value={formik.values.address1}
                          error={formik.errors.address1}
                          onChange={formik.handleChange}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      marginTop={2}
                      paddingLeft={1}
                    >
                      <InputBox
                        label="Address2"
                        id="address2"
                        value={formik.values.address2}
                        error={formik.errors.address2}
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
                      marginTop={2}
                      paddingLeft={1}
                    >
                      <InputBox
                        label="Address3"
                        id="address3"
                        value={formik.values.address3}
                        error={formik.errors.address3}
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
                      marginTop={2}
                      paddingLeft={1}
                    >
                      <InputBox
                        label="City"
                        id="city"
                        value={formik.values.city}
                        error={formik.errors.city}
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
                        label="Country"
                        id="country"
                        suggestionName="country"
                        value={formik.values.country}
                        error={formik.errors.country}
                        onChange={formik.handleChange}
                      ></FormAutoComplete>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      marginTop={2}
                      paddingLeft={1}
                    >
                      <InputBox
                        label="Standard Free Days"
                        id="standardFreeDays"
                        value={formik.values.standardFreeDays}
                        error={formik.errors.standardFreeDays}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      marginTop={2}
                      paddingLeft={1}
                    >
                      <InputBox
                        label="Standard Rate"
                        id="standardRate"
                        value={formik.values.standardRate}
                        error={formik.errors.standardRate}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    {/* <Box
                    sx={{
                      width: "100%",
                      typography: "body1",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      margin: "0px 8px",
                    }}
                  >
                    <TabContext value={value}>
                      <Box>
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab
                            label="Line"
                            value="1"
                            sx={{
                              fontSize: "1rem",
                              textTransform: "capitalize",
                            }}
                          />
                        </TabList>
                      </Box>
                      <TabPanel value="1" sx={{ margin: 0, padding: 0 }}>
                        {" "}
                        <AddMapping disabled={disabled} dropdownData={dropdownData}/>
                      </TabPanel>
                    </TabContext>
                  </Box> */}
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          width: "100%",
                          typography: "body1",
                          border: "1px solid #ccc",
                          borderRadius: "10px",
                          margin: "0px 8px",
                          marginTop: "10px",
                        }}
                      >
                        <TabContext value={value}>
                          <Box>
                            <TabList
                              onChange={handleChange}
                              aria-label="lab API tabs example"
                            >
                              <Tab
                                label="Free Days"
                                value={1}
                                sx={{
                                  fontSize: "1rem",
                                  textTransform: "capitalize",
                                  padding: "0px 12px",
                                  minHeight: "50px",
                                }}
                              />
                            </TabList>
                          </Box>
                          <TabPanel value={1} sx={{ margin: 0, padding: 0 }}>
                            {" "}
                            <AddMapping disabled={disabled} formik={formik} />
                          </TabPanel>
                        </TabContext>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sx={{ margin: 1 }}>
                      <Stack direction="row" spacing={2}>
                        <OutlinedButton
                          sx={{ fontWeight: "500", borderRadius: "12px" }}
                          onClick={() => nav("/app/master/consignee")}
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
                          {isLoading && (
                            <CircularProgress size={20} color="white" />
                          )}{" "}
                          Add
                        </ThemeButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </TabPanel>
            </TabContext>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  {tabs.map((a) => (
                    <Tab
                      label={a.label}
                      value={a.value}
                      sx={{
                        fontSize: "1rem",
                        textTransform: "capitalize",
                        minHeight: "50px",
                      }}
                      icon={a.value === 1 ? <EditIcon /> : <HistoryIcon />}
                      iconPosition="start"
                    />
                  ))}
                </TabList>
              </Box>
              <TabPanel value={1} sx={{ margin: 0, padding: 0 }}>
                {" "}
                <Grid container spacing={2} marginTop={1} paddingLeft={1}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                  >
                    <Tooltip
                      title={!formik.values.name ? "Field is mandatory" : ""}
                      arrow
                    >
                      <InputBox
                        label="Consignee Name*"
                        id="consigneeName"
                        disabled={disabled}
                        value={formik.values.consigneeName}
                        error={formik.errors.consigneeName}
                        onChange={formik.handleChange}
                      />
                    </Tooltip>
                  </Grid>
                  {initialValues.statusCode == -2 ||
                  initialValues.statusCode == 1 ? (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      //sx={{ marginTop: 2 }}
                      paddingLeft={1}
                    >
                      <SelectBox
                        label="Status"
                        id="status"
                        options={optionsSettingsData?.body?.status}
                        value={formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      xl={2}
                      //sx={{ marginTop: 2 }}
                      paddingLeft={1}
                    >
                      <InputBox
                        label="Status"
                        id="status"
                        disabled={true}
                        value={formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Tooltip
                      title={
                        !formik.values.address1 ? "Field is mandatory" : ""
                      }
                      arrow
                    >
                      <InputBox
                        label="Address1*"
                        id="address1"
                        disabled={disabled}
                        value={formik.values.address1}
                        error={formik.errors.address1}
                        onChange={formik.handleChange}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                  >
                    <InputBox
                      label="Address2"
                      id="address2"
                      disabled={disabled}
                      value={formik.values.address2}
                      error={formik.errors.address2}
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
                    // sx={{ marginTop: 2 }}
                    paddingLeft={1}
                  >
                    <InputBox
                      label="Address 3"
                      id="address3"
                      disabled={disabled}
                      options={dropdownData?.account_type}
                      value={formik.values.address3}
                      error={formik.errors.address3}
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
                  >
                    <InputBox
                      label="City"
                      id="city"
                      disabled={disabled}
                      value={formik.values.city}
                      error={formik.errors.city}
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
                  >
                    <FormAutoComplete
                      label="Country"
                      id="country"
                      suggestionName="country"
                      value={formik.values.country}
                      error={formik.errors.country}
                      onChange={formik.handleChange}
                    ></FormAutoComplete>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    paddingLeft={1}
                  >
                    <InputBox
                      label="Standard Free Days"
                      id="standardFreeDays"
                      value={formik.values.standardFreeDays}
                      error={formik.errors.standardFreeDays}
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
                  >
                    <InputBox
                      label="Standard Rate"
                      id="standardRate"
                      value={formik.values.standardRate}
                      error={formik.errors.standardRate}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ margin: "0px !important", padding: "0px !important" }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        typography: "body1",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        margin: "8px 16px",
                      }}
                    >
                      <TabContext value={value}>
                        <Box>
                          <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                          >
                            <Tab
                              label="Free Days"
                              value={1}
                              sx={{
                                fontSize: "1rem",
                                textTransform: "capitalize",
                              }}
                            />
                          </TabList>
                        </Box>
                        <TabPanel value={1} sx={{ margin: 0, padding: 0 }}>
                          {" "}
                          <AddMapping disabled={disabled} formik={formik} />
                        </TabPanel>
                      </TabContext>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{ margin: "0px !important", padding: "0px !important" }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      paddingLeft={2}
                      paddingBottom={1}
                    >
                      <Stack direction="row" spacing={2}>
                        <OutlinedButton
                          onClick={() => nav("/app/master/consignee")}
                          sx={{ fontWeight: "500" }}
                        >
                          Cancel
                        </OutlinedButton>

                        <ThemeButton
                          onClick={formik.handleSubmit}
                          sx={{ fontWeight: "500", color: "white !important" }}
                        >
                          {loadingUpdate && (
                            <CircularProgress size={20} color="white" />
                          )}{" "}
                          Update
                        </ThemeButton>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={2} sx={{ margin: 0, padding: 0 }}>
                <UploadFile
                  customer_id={initialValues.id}
                  dropdownData={consigneeSettingsData?.body?.documentType}
                  sourceType="CONSIGNEE"
                />
              </TabPanel>
              <TabPanel value={3} sx={{ margin: 0, padding: 0 }}>
                <AuditTimeline
                  auditDetails={AuditData}
                  reloadDataHandler={fetchAuditData}
                  loading={isLoadingAudit}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
