import { CircularProgress, Grid, Stack, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import InputBox from "../../../common/InputBox";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import { useLazyGetIcdAuditQuery } from "../../../../store/api/icdDataApi";
import ApiManager from "../../../../services/ApiManager";
import PopupAlert from "../../../common/Alert/PopupAlert";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import SelectBox from "../../../common/SelectBox";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
// import EditIcon from "@mui/icons-material/Edit";
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddIcdMutation,
  useUpdateIcdMutation,
} from "../../../../store/api/icdDataApi";
import { useLocation, useNavigate } from "react-router-dom";
import AuditTimeline from "../../../AuditTimeLine";
import UploadFile from "../../../UploadFile";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import getFirstError from "../../../common/FieldToastError";
import { IcdValidationSchema } from "./IcdValidationSchema";
import CustomToast from "../../../common/Toast/CustomToast";
import { menuConfigUrl } from "../../../../store/menuConfigUrl";
import EditIconForHeader from "../../../common/commonIcons/EditIcons/EditIconForHeader";
import AuditIcon from "../../../common/commonIcons/AuditIcon/AuditIcon";

export default function IcdForm({ initialValues, page, type, id }) {
  const tabs = [
    { label: "ICD Details", value: 1 },
    { label: "Audit logs", value: 2 },
  ];
  const [options, setOptions] = useState([]);
  const [enquiryAuditDetails, setEnquiryAuditDetails] = useState([]);
  const [optionsCity, setCityOptions] = useState([]);
  // const [uploadedFiles, setUploadedFiles] = useState(initialValues.files || []);
  const [addIcd, { isLoading: loaderAdd }] = useAddIcdMutation();
  const [loading, setLoading] = useState(false);
  const [enquiryFileDetails, setEnquiryFileDetails] = useState([]);
  const [updateIcd, { isLoading: loaderUpdate }] = useUpdateIcdMutation();
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
  const getStatusCode = () => {
    return 1;
  };

  const formik = useFormik({
    initialValues,
    validateOnChange: false, //
    validationSchema: IcdValidationSchema(),
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!values.id || type == "copy") {
        try {
          delete values.id;
          values.status = "";
          values.statusCode = 1;
          let response = await addIcd({ ...values }).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.custom(
              <CustomToast message={response.message} toast="success" />,
              {
                closeButton: false,
              }
            );

            nav("/app/master/icd");
          } else {
            toast.custom(
              <CustomToast message={response.message} toast="error" />,
              {
                closeButton: false,
              }
            );
          }
        } catch (error) {
          toast.custom(
            <CustomToast
              message="An error occurred while submitting the form."
              toast="error"
            />,
            {
              closeButton: false,
            }
          );
        }
      } else {
        try {
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);

          let response = await updateIcd({ ...values }).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.custom(
              <CustomToast message={response.message} toast="success" />,
              {
                closeButton: false,
              }
            );
            nav("/app/master/icd");
          } else {
            toast.custom(
              <CustomToast message={response.message} toast="error" />,
              {
                closeButton: false,
              }
            );
          }
        } catch (error) {
          toast.custom(
            <CustomToast
              message="An error occurred while submitting the form."
              toast="error"
            />,
            {
              closeButton: false,
            }
          );
        }
      }
    },
  });
  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);
  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  const { data: icdSettingsData } = useGetOptionsSettingsQuery("icd_settings");

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
                    label="ICD Details"
                    value={1}
                    sx={{
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<EditIconForHeader />}
                    iconPosition="start"
                  />
                </TabList>
              </Box>
              <TabPanel value={1} sx={{ padding: 0 }}>
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
                        title={!formik.values.name ? "Field is mandatory" : ""}
                        arrow
                      >
                        <InputBox
                          label="Icd Name *"
                          id="icd_name"
                          value={formik.values.icd_name}
                          disabled={disabled}
                          error={formik.errors.icd_name}
                          onChange={formik.handleChange}
                          inputRef={FieldRef}
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
                      marginTop={2}
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
                      <InputBox
                        label="Address1"
                        id="address1"
                        value={formik.values.address1}
                        error={formik.errors.address1}
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
                        label="Address2"
                        id="address2"
                        value={formik.values.address2}
                        error={formik.errors.address2}
                        onChange={formik.handleChange}
                      />
                    </Grid>
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
                      label="Icd Code"
                      id="icd_code"
                      value={formik.values.icd_code}
                      error={formik.errors.icd_code}
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
                      label="Contact Person"
                      id="contact_person"
                      value={formik.values.contact_person}
                      error={formik.errors.contact_person}
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
                      label="Email"
                      id="email"
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
                      label="Telephone"
                      id="tel_no"
                      value={formik.values.tel_no}
                      error={formik.errors.tel_no}
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
                      label="Mobile Number"
                      id="mobile"
                      value={formik.values.mobile}
                      error={formik.errors.mobile}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ margin: 1 }}>
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        onClick={() => nav("/app/master/icd")}
                        sx={{ fontWeight: "500", borderRadius: "12px" }}
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
                        {loaderAdd && (
                          <CircularProgress size={20} color="white" />
                        )}{" "}
                        Add
                      </ThemeButton>
                    </Stack>
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
                        textTransform: "capitalize",
                        minHeight: "50px",
                      }}
                      icon={
                        a.value === 1 ? <EditIconForHeader /> : <AuditIcon />
                      }
                      iconPosition="start"
                    />
                  ))}
                </TabList>
              </Box>
              <TabPanel value={1} sx={{ margin: 0, padding: 0 }}>
                {" "}
                <Grid
                  container
                  sx={{ padding: 0, margin: 0, paddingRight: "8px" }}
                >
                  <Grid container sx={{ margin: 0 }}>
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
                        label="Icd Name *"
                        id="icd_name"
                        disabled={disabled}
                        value={formik.values.icd_name}
                        error={formik.errors.icd_name}
                        onChange={formik.handleChange}
                        inputRef={FieldRef}
                      />
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
                        paddingLeft={1}
                        marginTop={2}
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
                        paddingLeft={1}
                        marginTop={2}
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
                        label="Address1"
                        id="address1"
                        disabled={disabled}
                        value={formik.values.address1}
                        error={formik.errors.address1}
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
                        label="Address2"
                        id="address2"
                        disabled={disabled}
                        value={formik.values.address2}
                        error={formik.errors.address2}
                        onChange={formik.handleChange}
                      />
                    </Grid>
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
                      label="Address 3"
                      id="address3"
                      disabled={disabled}
                      // options={dropdownData?.account_type}
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
                    marginTop={2}
                  >
                    <InputBox
                      label="Icd Code"
                      id="icd_code"
                      disabled={disabled}
                      value={formik.values.icd_code}
                      error={formik.errors.icd_code}
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
                      label="Contact Person"
                      id="contact_person"
                      disabled={disabled}
                      value={formik.values.contact_person}
                      error={formik.errors.contact_person}
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
                      label="Email"
                      id="email"
                      disabled={disabled}
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
                      label="Telephone"
                      id="tel_no"
                      disabled={disabled}
                      value={formik.values.tel_no}
                      error={formik.errors.tel_no}
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
                      label="Mobile Number"
                      id="mobile"
                      value={formik.values.mobile}
                      error={formik.errors.mobile}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{ margin: 1 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2}>
                        <OutlinedButton
                          sx={{ fontWeight: "500" }}
                          onClick={() => nav("/app/master/icd")}
                        >
                          Cancel
                        </OutlinedButton>
                        <ThemeButton
                          onClick={formik.handleSubmit}
                          sx={{ fontWeight: "500", color: "white !important" }}
                        >
                          {loaderUpdate && (
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
                <AuditTimeline
                  id={initialValues.id}
                  page="icd"
                  service={menuConfigUrl.master}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
