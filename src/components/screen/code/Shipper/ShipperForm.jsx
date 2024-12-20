import {
  CircularProgress,
  Grid,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import ApiManager from "../../../../services/ApiManager";
import PopupAlert from "../../../common/Alert/PopupAlert";
import toast from "react-hot-toast";
import { ShipperValidationSchema } from "./validationSchema";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddShipperMutation,
  useGetShipperAuditQuery,
  useUpdateShipperMutation,
} from "../../../../store/api/shipperDataApi";
import { useLocation, useNavigate } from "react-router-dom";
import AuditTimeline from "../../../AuditTimeLine";
import UploadFile from "../../../UploadFile";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";

export default function ShipperForm({
  initialValues,
  page,
  type = "notcopy",
  id,
  // optionsSettingsData,
  // customerSettingsData,
 
}) {
  const [options, setOptions] = useState([]);
  const [enquiryAuditDetails, setEnquiryAuditDetails] = useState([]);
  const [optionsCity, setCityOptions] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(initialValues.files || []);
  const [addShipper, { isLoading }] = useAddShipperMutation();
  const [loading, setLoading] = useState(false);
  const [enquiryFileDetails, setEnquiryFileDetails] = useState([]);
  const [updateShipper] = useUpdateShipperMutation();
  const [dropdownData, setDropdownData] = useState({});
  const location = useLocation();

  const nav = useNavigate();
  const [value, setValue] = React.useState("1");

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

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    // validationSchema: ShipperValidationSchema(),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      if (!values.id || type == "copy") {
        try {
          delete values.id;
          values.status = "New"
          values.isApproved = !dropdownData?.approvalRequest;
          let response = await addShipper({ ...values}).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/entity/shipper");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred while submitting the form.");
        }
      } else {
        try {
          let response = await updateShipper({ ...values }).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/entity/shipper");
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

  let shouldShowTabs = Object.values(formik.values?.name).some(
    (value) => value !== ""
  );
  const reloadDataHandler = async () => {
    try {
      setLoading(true);
      console.log("id"+id);
      const res = await ApiManager.getShipperAuditDetails(initialValues.id);
      setEnquiryAuditDetails(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: shipperSettingsData } =
    useGetOptionsSettingsQuery("shipper_settings");

  useEffect(() => {
    if (optionsSettingsData?.body || shipperSettingsData?.body) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...shipperSettingsData?.body,
      });
    }
  }, [optionsSettingsData]);
  
  const disabled = page == "shipper" ? false : true;

  const disableStatus =
    page === "shipper" && location.pathname.includes("/new") ? true : false;

  return (
    <>
      {!shouldShowTabs || type == "copy" ? (
        <>
          {" "}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Shipper Name"
                id="name"
                value={formik.values.name}
                disabled={disabled}
                error={formik.errors.name}
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

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={2}
             
            >
              
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
                label="Country."
                id="country"
                value={formik.values.country}
                error={formik.errors.country}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Email"
                id="email"
                value={formik.values.email}
                error={formik.errors.email}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Contact Name"
                id="contactName"
                value={formik.values.contactName}
                error={formik.errors.contactName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Designation"
                id="designation"
                value={formik.values.designation}
                error={formik.errors.designation}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Telephone"
                id="tel_No"
                value={formik.values.tel_No}
                error={formik.errors.tel_No}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Extn. No."
                id="extn_No"
                value={formik.values.extn_No}
                error={formik.errors.extn_No}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Fax number"
                id="fax_No"
                value={formik.values.fax_No}
                error={formik.errors.fax_No}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Mobile Number"
                id="mobile"
                value={formik.values.mobile}
                error={formik.errors.mobile}
                onChange={formik.handleChange}
              />
            </Grid>

            {page == "shipper" && (
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
                    {isLoading && (
                      <CircularProgress size={20} color="white" />
                    )}{" "}
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
                  <Tab label="Edit Shipper" value="1" />
                  <Tab label="Upload Documents" value="2" />
                  <Tab label="Audit Logs" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {" "}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Shipper Name"
                      id="name"
                      disabled={disabled}
                      value={formik.values.name}
                      error={formik.errors.name}
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
                      label="Email"
                      id="email"
                      disabled={disabled}
                      value={formik.values.email}
                      error={formik.errors.email}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Contact Name"
                      id="contactName"
                      disabled={disabled}
                      value={formik.values.contactName}
                      error={formik.errors.contactName}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Designation"
                      id="designation"
                      disabled={disabled}
                      value={formik.values.designation}
                      error={formik.errors.designation}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Telephone"
                      id="tel_No"
                      disabled={disabled}
                      value={formik.values.tel_No}
                      error={formik.errors.tel_No}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Extn.No."
                      id="extn_No"
                      disabled={disabled}
                      value={formik.values.extn_No}
                      error={formik.errors.extn_No}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Fax Number"
                      id="fax_No"
                      disabled={disabled}
                      value={formik.values.fax_No}
                      error={formik.errors.fax_No}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    
                    <InputBox
                label="Mobile Number"
                id="mobile"
                value={formik.values.mobile}
                error={formik.errors.mobile}
                onChange={formik.handleChange}
                />
            
                  </Grid>

                  {page == "shipper" && (
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2}>
                          <OutlinedButton sx={{ fontWeight: "500" }}>
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
                  id={initialValues.id}
                  disabled={disabled}
                  dropdownData={dropdownData}
                  source="SHIPPER"
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

