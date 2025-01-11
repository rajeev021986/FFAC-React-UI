import {
  CircularProgress,
  Grid,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import {useLazyGetShipperAuditQuery } from '../../../../store/api/shipperDataApi';
import PopupAlert from "../../../common/Alert/PopupAlert";
import * as Yup from 'yup';
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import SelectBox from '../../../common/SelectBox'
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddShipperMutation,
  useUpdateShipperMutation,
} from "../../../../store/api/shipperDataApi";
import { useLocation, useNavigate } from "react-router-dom";
import AuditTimeline from "../../../AuditTimeLine";
import UploadFile from "../../../UploadFile";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";

export default function ShipperForm({
  initialValues,
  page,
  type,
  id,
}) {
  const tabs = [
    { label: "Shipper Details", value: 1 },
    { label: "Document Details", value: 2 },
    { label: "Audit logs", value: 3 },
  ];
  const [addShipper, { isLoading }] = useAddShipperMutation();
  const [updateShipper] = useUpdateShipperMutation();
  const [dropdownData, setDropdownData] = useState({});
  const [modal, setModal] = React.useState({
      open: false,
      type: "",
      data: {},
    });
    
  const nav = useNavigate();
  const [value, setValue] = React.useState(1);
  const validationSchema = Yup.object({
      name: Yup.string().required("Name is required"),
      address1: Yup.string().required("Address1 is required"),
  
    });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  

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
          let response = await addShipper({ ...values}).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/shipper");
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
            nav("/app/master/shipper");
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
  console.log(initialValues.id);
  const [getShipperAudit, { data: AuditData,
      isLoading: isLoadingAudit }] =  useLazyGetShipperAuditQuery();
  const fetchAuditData = () => {
      getShipperAudit(
        {id:initialValues.id}
      );
  }
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

  return (
    <>
      {type == "new" ? (
        <>
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
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="IE CODE"
                id="ieCode"
                value={formik.values.ieCode}
                error={formik.errors.ieCode}
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
                    Add
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
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="IE CODE"
                id="ieCode"
                value={formik.values.ieCode}
                error={formik.errors.ieCode}
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
                            Update
                          </ThemeButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  
                </Grid>
              </TabPanel>
              <TabPanel value={2}>
              <UploadFile
                  customer_id={initialValues.id}
                  dropdownData={shipperSettingsData?.body?.documentType}
                  sourceType="SHIPPER"
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

