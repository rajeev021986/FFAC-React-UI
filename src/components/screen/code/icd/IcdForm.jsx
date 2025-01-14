import {
  CircularProgress,
  Grid,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import {useLazyGetIcdAuditQuery } from '../../../../store/api/icdDataApi';
import ApiManager from "../../../../services/ApiManager";
import PopupAlert from "../../../common/Alert/PopupAlert";
import * as Yup from 'yup';
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import SelectBox from '../../../common/SelectBox'
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddIcdMutation,
  useUpdateIcdMutation,
} from "../../../../store/api/icdDataApi";
import { useLocation, useNavigate } from "react-router-dom";
import AuditTimeline from "../../../AuditTimeLine";
import UploadFile from "../../../UploadFile";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";

export default function IcdForm({
  initialValues,
  page,
  type,
  id,
}) {
  const tabs = [
    { label: "ICD Details", value: 1 },
    { label: "Document Details", value: 2 },
    { label: "Audit logs", value: 3 },
  ];
  console.log("initialValues.id"+initialValues.id);
  const [options, setOptions] = useState([]);
  const [enquiryAuditDetails, setEnquiryAuditDetails] = useState([]);
  const [optionsCity, setCityOptions] = useState([]);
  // const [uploadedFiles, setUploadedFiles] = useState(initialValues.files || []);
  const [addIcd, { isLoading }] = useAddIcdMutation();
  const [loading, setLoading] = useState(false);
  const [enquiryFileDetails, setEnquiryFileDetails] = useState([]);
  const [updateIcd] = useUpdateIcdMutation();
  const [dropdownData, setDropdownData] = useState({});
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const location = useLocation();

  const nav = useNavigate();
  const [value, setValue] = React.useState(1);
  const validationSchema = Yup.object({
      icd_name: Yup.string().required("Name is required"),
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
  console.log("id"+initialValues.id);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("Form values:", values);
      if (!values.id || type == "copy") {
        
        try {
          delete values.id;
         
          // values.status = "New"
          // values.isApproved = !dropdownData?.approvalRequest;
          let response = await addIcd({ ...values}).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/icd");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          toast.error("An error occurred while submitting the form.");
        }
      } else {
        try {
          
          let response = await updateIcd({ ...values }).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/icd");
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

  
  
  const [getIcdAudit, { data: AuditData,
    isLoading: isLoadingAudit }] =  useLazyGetIcdAuditQuery();
const fetchAuditData = () => {
    getIcdAudit(
      {id:initialValues.id}
    );
}
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: icdSettingsData } =
    useGetOptionsSettingsQuery("icd_settings");

  useEffect(() => {
    if (optionsSettingsData?.body || icdSettingsData?.body) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...icdSettingsData?.body,
      });
    }
  }, [optionsSettingsData]);
    const disabled = page == "icd" ? false : true;

  

  return (
    <>

      {type == "new" ? (
        <>
          {" "}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Icd Name"
                id="icd_name"
                value={formik.values.icd_name}
                disabled={disabled}
                error={formik.errors.icd_name}
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
                                          sx={{ marginTop: 2 }}
                                      >
                                          <SelectBox
                                              label="Status"
                                              id="status"
                                              options={optionsSettingsData?.body?.status}
                                              value={formik.values.status == "ACTIVE" || formik.values.status == "Active" ? "Active" : formik.values.status}
                                              error={formik.errors.status}
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
                label="Icd Code"
                id="icd_code"
                value={formik.values.icd_code}
                error={formik.errors.icd_code}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Contact Person"
                id="contact_person"
                value={formik.values.contact_person}
                error={formik.errors.contact_person}
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
                label="Telephone"
                id="tel_no"
                value={formik.values.tel_no}
                error={formik.errors.tel_no}
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
            
            
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <OutlinedButton
                  onClick={()=>nav(-1)}
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
                  {tabs.map((a) => <Tab label={a.label} value={a.value} />)}
                </TabList>
              </Box>
              <TabPanel value={1}>
                {" "}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Icd Name"
                      id="icd_name"
                      disabled={disabled}
                      value={formik.values.icd_name}
                      error={formik.errors.icd_name}
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
                                              sx={{ marginTop: 2 }}
                                          >
                                              <SelectBox
                                                  label="Status"
                                                  id="status"
                                                  options={optionsSettingsData?.body?.status}
                                                  value={formik.values.status == "ACTIVE" || formik.values.status == "Active" ? "Active" : formik.values.status}
                                                  error={formik.errors.status}
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
                      // options={dropdownData?.account_type}
                      value={formik.values.address3}
                      error={formik.errors.address3}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Icd Code"
                      id="icd_code"
                      disabled={disabled}
                      value={formik.values.icd_code}
                      error={formik.errors.icd_code}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Contact Person"
                      id="contact_person"
                      disabled={disabled}
                      value={formik.values.contact_person}
                      error={formik.errors.contact_person}
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
                      label="Telephone"
                      id="tel_no"
                      disabled={disabled}
                      value={formik.values.tel_no}
                      error={formik.errors.tel_no}
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
                 
                  
                    <Grid item xs={12}>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Stack direction="row" spacing={2}>
                        <OutlinedButton sx={{ fontWeight: "500" }}
                                    onClick={() => 
                                      nav(-1)}
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
                
                 
                  
                </Grid>
              </TabPanel>
              <TabPanel value={2}>
              <UploadFile
                  customer_id={initialValues.id}
                  dropdownData={icdSettingsData?.body?.documentType}
                  sourceType="ICD"
                />
              </TabPanel>
              <TabPanel value={3}>
              <AuditTimeline auditDetails={AuditData} reloadDataHandler={fetchAuditData} loading={isLoadingAudit} />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}

