import { CircularProgress, Grid, Stack } from "@mui/material";
import { useFormik } from "formik";
import AddMapping from "./AddMapping";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import ApiManager from "../../../../services/ApiManager";
import PopupAlert from "../../../common/Alert/PopupAlert";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
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

export default function ConsigneeForm({
  initialValues,
  page,
  type = "notcopy",
  id,
}) {
  const [options, setOptions] = useState([]);
  const [enquiryAuditDetails, setEnquiryAuditDetails] = useState([]);
  const [optionsCity, setCityOptions] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(initialValues.files || []);
  const [addConsignee, { isLoading }] = useAddConsigneeMutation();
  const [loading, setLoading] = useState(false);
  const [enquiryFileDetails, setEnquiryFileDetails] = useState([]);
  const [updateConsignee] = useUpdateConsigneeMutation();
  const [dropdownData, setDropdownData] = useState({});
  const location = useLocation();

  const nav = useNavigate();
  const [value, setValue] = React.useState("1");
  const validationSchema = Yup.object({
    consigneeName: Yup.string().required("Name is required"),
    address1: Yup.string().required("Address1 is required"),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });
  console.log("optionsCity", optionsCity);
  console.log("id" + initialValues.id);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!values.id || type == "copy") {
        let freeDays = values.consigneeEntityFreeDays.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );
        try {
          delete values.id;

          values.status = "New";
          values.isApproved = !dropdownData?.approvalRequest;
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

  let shouldShowTabs = Object.values(formik.values?.consigneeName).some(
    (value) => value !== ""
  );
  const reloadDataHandler = async () => {
    try {
      setLoading(true);
      console.log("id" + id);
      const res = await ApiManager.getConsigneeAuditDetails(initialValues.id);
      setEnquiryAuditDetails(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
  const disabled = page == "consignee" ? false : true;

  const disableStatus =
    page === "consignee" && location.pathname.includes("/new") ? true : false;

  return (
    <>
      {!shouldShowTabs || type == "copy" ? (
        <>
          {" "}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Consignee Name"
                id="consigneeName"
                value={formik.values.consigneeName}
                disabled={disabled}
                error={formik.errors.consigneeName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Address1"
                id="address1"
                value={formik.values.address1}
                error={formik.errors.address1}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Address2"
                id="address2"
                value={formik.values.address2}
                error={formik.errors.address2}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Address3"
                id="address3"
                value={formik.values.address3}
                error={formik.errors.address3}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="City"
                id="city"
                value={formik.values.city}
                error={formik.errors.city}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Country"
                id="country"
                value={formik.values.country}
                error={formik.errors.country}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <InputBox
                label="Standard Free Days"
                id="standardFreeDays"
                value={formik.values.standardFreeDays}
                error={formik.errors.standardFreeDays}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <InputBox
                label="Standard Rate"
                id="standardRate"
                value={formik.values.standardRate}
                error={formik.errors.standardRate}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  marginBottom: 2,
                }}
              >
                <AddMapping
                  formik={formik}
                  disabled={disabled}
                  dropdownData={dropdownData}
                />
              </Box>
            </Grid>
            {page == "consignee" && (
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <OutlinedButton
                    sx={{ fontWeight: "500", borderRadius: "12px" }}
                  >
                    Cancel
                  </OutlinedButton>
                  <ThemeButton
                    onClick={formik.handleSubmit}
                    sx={{ fontWeight: "500", borderRadius: "12px" }}
                  >
                    {isLoading && <CircularProgress size={20} color="white" />}{" "}
                    Save
                  </ThemeButton>
                </Stack>
              </Grid>
            )}

            <PopupAlert alertConfig={alertConfig} />
          </Grid>
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
                  <Tab label="Edit Consignee" value="1" />
                  <Tab label="Upload Documents" value="2" />
                  <Tab label="Audit Logs" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {" "}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Consignee Name"
                      id="consigneeName"
                      disabled={disabled}
                      value={formik.values.consigneeName}
                      error={formik.errors.consigneeName}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Address1"
                      id="address1"
                      disabled={disabled}
                      value={formik.values.address1}
                      error={formik.errors.address1}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="City"
                      id="city"
                      disabled={disabled}
                      value={formik.values.city}
                      error={formik.errors.city}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Country"
                      id="country"
                      disabled={disabled}
                      value={formik.values.country}
                      error={formik.errors.country}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Standard Free Days"
                      id="standardFreeDays"
                      value={formik.values.standardFreeDays}
                      error={formik.errors.standardFreeDays}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Standard Rate"
                      id="standardRate"
                      value={formik.values.standardRate}
                      error={formik.errors.standardRate}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        marginBottom: 2,
                      }}
                    >
                      <AddMapping
                        formik={formik}
                        disabled={disabled}
                        dropdownData={dropdownData}
                      />
                    </Box>
                  </Grid>
                  {page == "consignee" && (
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2}>
                          <OutlinedButton
                            onClick={() => nav(-1)}
                            sx={{ fontWeight: "500" }}
                          >
                            Cancel
                          </OutlinedButton>

                          <ThemeButton
                            onClick={formik.handleSubmit}
                            sx={{ fontWeight: "500" }}
                          >
                            {isLoading && (
                              <CircularProgress size={20} color="white" />
                            )}{" "}
                            Save
                          </ThemeButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  )}

                  <PopupAlert alertConfig={alertConfig} />
                </Grid>
              </TabPanel>
              <TabPanel value="2">
                <UploadFile
                  consignee_id={initialValues.id}
                  disabled={disabled}
                  dropdownData={consigneeSettingsData?.body?.documentType}
                  source="CONSIGNEE"
                />
              </TabPanel>
              <TabPanel value="3">
                <AuditTimeline
                  auditDetails={enquiryAuditDetails}
                  reloadDataHandler={reloadDataHandler}
                  loading={loading}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
