import { CircularProgress, Grid, Stack, Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import { useLazyGetShipperAuditQuery } from "../../../../store/api/shipperDataApi";
import PopupAlert from "../../../common/Alert/PopupAlert";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import SelectBox from "../../../common/SelectBox";
import TabPanel from "@mui/lab/TabPanel";
import {
  useAddShipperMutation,
  useUpdateShipperMutation,
} from "../../../../store/api/shipperDataApi";
import { useLocation, useNavigate } from "react-router-dom";
import AuditTimeline from "../../../AuditTimeLine";
import UploadFile from "../../../UploadFile";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";
import getFirstError from "../../../common/FieldToastError";
import EditIcon from "@mui/icons-material/Edit";
import FormAutoComplete from "../../../common/AutoComplete/FormAutoComplete";
import HistoryIcon from "@mui/icons-material/History";
import CustomToast from "../../../common/Toast/CustomToast";
import ApiManager from "../../../../services/ApiManager";
import { menuConfigUrl } from "../../../../store/menuConfigUrl";
import EditIconForHeader from "../../../common/commonIcons/EditIcons/EditIconForHeader";
import AuditIcon from "../../../common/commonIcons/AuditIcon/AuditIcon";

export default function ShipperForm({ initialValues, page, type, id }) {
  const FieldRef = useRef(null);

  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);
  const tabs = [
    { label: "Shipper Details", value: 1 },
    { label: "Document Details", value: 2 },
    { label: "Audit logs", value: 3 },
  ];
  const [addShipper, { isLoading: loadingAdd }] = useAddShipperMutation();
  const [updateShipper, { isLoading: loadingUpdate }] =
    useUpdateShipperMutation();
  const [dropdownData, setDropdownData] = useState({});

  const nav = useNavigate();
  const [value, setValue] = React.useState(1);
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    address1: Yup.string().required("Address1 is required"),
    city: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "City must only contain letters"
    ),
    country: Yup.string(),
    email: Yup.string()
      // .required("Email is required")
      .email("Invalid email format")
      .test("valid-email", "Invalid email format", (value) => {
        if (!value) return true; // Skip validation if email is empty

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) return false; // Basic email structure check

        if (value.includes("..")) return false; // Consecutive dots not allowed

        const domainPart = value.split("@")[1];
        const domainBeforeDot = domainPart?.split(".")[0];

        if (/\d/.test(domainBeforeDot)) {
          return false; // Disallow numbers in the domain before the first dot
        }

        return true;
      }),
    contactPerson: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "Contact Person must only contain letters"
    ),
    // tel_No: Yup.number()
    //   .typeError("That doesn't look like a phone number")
    //   .positive("A phone number can't start with a minus")
    //   .integer("A phone number can't include a decimal point")
    //   .min(8),
    extn_No: Yup.number().typeError("Extn number must be number"),
    fax_No: Yup.number().typeError("Fax number must be number"),
    contactName: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      "Contact Person must only contain letters"
    ),
    tel_No: Yup.string()
      // .required("Telephone number is required")
      .matches(/^\d+$/, "Telephone must be a valid number")
      .matches(/^\d{7,15}$/, "Telephone must be between 7 and 15 digits"),
    mobile: Yup.string()
      // .required("Mobile number is required")
      .matches(/^\d+$/, "Telephone must be a valid number")
      .matches(/^\d{10,15}$/, "Mobile must be between 10 and 15 digits"),
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const formik = useFormik({
    initialValues,
    validateOnChange: false,
      validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!values.id || type == "copy") {
        try {
          delete values.id;
          values.status = "";
          values.statusCode = 1;
          let response = await addShipper({ ...values }).unwrap();

          if (response.code == "SUCCESS") {
            toast.custom(
              <CustomToast message={response.message} toast="success" />,
              {
                closeButton: false,
              }
            );
            nav("/app/entity/shipper");
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

          let response = await updateShipper({ ...values }).unwrap();

          // Handle response and display toast messages
          if (response.code == "SUCCESS") {
            toast.custom(
              <CustomToast message={response.message} toast="success" />,
              {
                closeButton: false,
              }
            );
            nav("/app/entity/shipper");
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
  }, [optionsSettingsData, shipperSettingsData]);
  const disabled = page == "shipper" ? false : true;
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
                    label="Shipper Details"
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
              <TabPanel value={1} sx={{ padding: 0, margin: 0 }}>
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
                          label="Shipper Name*"
                          id="name"
                          value={formik.values.name}
                          disabled={disabled}
                          error={formik.errors.name}
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
                      //sx={{ marginTop: 2 }}
                      marginTop={2}
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
                          label="Address1 *"
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
                  </Grid>
                  <Grid container>
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
                        id="countryId"
                        suggestionName="country"
                        value={{
                          countryId: formik.values.countryId,
                          countryName: formik.values.countryName,
                        }}
                        error={formik.errors.countryId}
                        idKey="countryId"
                        nameKey="countryName"
                        // onChange={formik.setFieldValue}
                        onChange={(selected) => {
                          formik.setFieldValue("countryId", selected.countryId);
                          formik.setFieldValue(
                            "countryName",
                            selected.countryName
                          );
                        }}

                        // onChange={formik.handleChange}
                      ></FormAutoComplete>
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
                  </Grid>
                  <Grid container>
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
                        label="Contact Name"
                        id="contactName"
                        value={formik.values.contactName}
                        error={formik.errors.contactName}
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
                      <SelectBox
                        label="Designation"
                        id="designation"
                        options={dropdownData?.designation}
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
                        label="Telephone"
                        id="tel_No"
                        value={formik.values.tel_No}
                        error={formik.errors.tel_No}
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
                        label="Extn. No."
                        id="extn_No"
                        value={formik.values.extn_No}
                        error={formik.errors.extn_No}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
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
                        label="Fax number"
                        id="fax_No"
                        value={formik.values.fax_No}
                        error={formik.errors.fax_No}
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
                        label="IE CODE"
                        id="ieCode"
                        value={formik.values.ieCode}
                        error={formik.errors.ieCode}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid />

                    <Grid item xs={12} sx={{ margin: 1 }}>
                      <Stack direction="row" spacing={2}>
                        <OutlinedButton
                          onClick={() => nav("/app/entity/shipper")}
                          sx={{ fontWeight: "500", borderRadius: "12px" }}
                        >
                          Close
                        </OutlinedButton>
                        <ThemeButton
                          onClick={formik.handleSubmit}
                          sx={{
                            fontWeight: "500",
                            borderRadius: "12px",
                            color: "white !important",
                          }}
                        >
                          {loadingAdd && (
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
          <Box
            sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}
          >
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
                        label="Shipper Name*"
                        id="name"
                        disabled={disabled}
                        value={formik.values.name}
                        error={formik.errors.name}
                        onChange={formik.handleChange}
                        inputRef={FieldRef}
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
                      // sx={{ marginTop: 2 }}
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
                  >
                    <Tooltip
                      title={!formik.values.name ? "Field is mandatory" : ""}
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
                      id="countryId"
                      suggestionName="country"
                      value={{
                        countryId: formik.values.countryId,
                        countryName: formik.values.countryName,
                      }}
                      error={formik.errors.countryId}
                      idKey="countryId"
                      nameKey="countryName"
                      // onChange={formik.setFieldValue}
                      onChange={(selected) => {
                        formik.setFieldValue("countryId", selected.countryId);
                        formik.setFieldValue(
                          "countryName",
                          selected.countryName
                        );
                      }}

                      // onChange={formik.handleChange}
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
                  >
                    <InputBox
                      label="Contact Name"
                      id="contactName"
                      disabled={disabled}
                      value={formik.values.contactName}
                      error={formik.errors.contactName}
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
                    <SelectBox
                      label="Designation"
                      id="designation"
                      options={dropdownData?.designation}
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
                  >
                    <InputBox
                      label="Telephone"
                      id="tel_No"
                      disabled={disabled}
                      value={formik.values.tel_No}
                      error={formik.errors.tel_No}
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
                      label="Extn.No."
                      id="extn_No"
                      disabled={disabled}
                      value={formik.values.extn_No}
                      error={formik.errors.extn_No}
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
                      label="Fax Number"
                      id="fax_No"
                      disabled={disabled}
                      value={formik.values.fax_No}
                      error={formik.errors.fax_No}
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
                      label="Mobile Number"
                      id="mobile"
                      value={formik.values.mobile}
                      error={formik.errors.mobile}
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
                        <OutlinedButton
                          sx={{ fontWeight: "500" }}
                          onClick={() => nav("/app/entity/shipper")}
                        >
                          Close
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
                  dropdownData={dropdownData?.documentType}
                  sourceType="SHIPPER"
                />
              </TabPanel>
              <TabPanel value={3} sx={{ margin: 0, padding: 0 }}>
                <AuditTimeline
                  id={initialValues.id}
                  page="shipper"
                  service={menuConfigUrl.entity}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
