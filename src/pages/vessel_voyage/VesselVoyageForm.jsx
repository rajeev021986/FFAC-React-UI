import { Box, CircularProgress, Grid, Stack, Tab } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import { useFormik } from "formik";
import { VesselVoyageValidation } from "../../components/screen/vessel_voyage/validation";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useAddVoyageMutation,
  useUpdateVoyageMutation,
} from "../../store/api/vesselVoyageDataApi";
import FormAutoComplete from "../../components/common/AutoComplete/FormAutoComplete";
import ApiManager from "../../services/ApiManager";
import DateField from "../../components/common/DateTime/DateField";
import DateTimeField from "../../components/common/DateTime/DateTimeField";
import SelectBox from "../../components/common/SelectBox";
import AuditTimeLine from "../../components/AuditTimeLine";
import getFirstError from "../../components/common/FieldToastError";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import CustomToast from "../../components/common/Toast/CustomToast";
import { menuConfigUrl } from "../../store/menuConfigUrl";
import EditIconForHeader from "../../components/common/commonIcons/EditIcons/EditIconForHeader";
import AuditIcon from "../../components/common/commonIcons/AuditIcon/AuditIcon";
export function VesselVoyageForm({ initialValues, type }) {
  const disabled = false;
  const nav = useNavigate();

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [dropdownData, setDropdownData] = useState({});
  const [addVoyage, { isLoading: loadingAdd }] = useAddVoyageMutation();
  const [updateVoyage, { isLoading: loadingUpdate }] =
    useUpdateVoyageMutation();

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: VesselVoyageValidation(),
    onSubmit: async (values) => {
      if (type == "copy" || type == "add") {
        try {
          delete values.id;
          values.statusCode = 1;
          values.status = "";
          let response = await addVoyage({
            ...values,
          }).unwrap();
          if (response.code == "SUCCESS") {
            toast.custom(
              <CustomToast message={response.message} toast="success" />,
              {
                closeButton: false,
              }
            );
            nav("/app/master/vesselVoyage");
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
          let response = await updateVoyage({
            ...values,
          }).unwrap();

          if (response.code == "SUCCESS") {
            toast.custom(
              <CustomToast message={response.message} toast="success" />,
              {
                closeButton: false,
              }
            );
            nav("/app/master/vesselVoyage");
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
  const { data: voyageSettingsData } = useGetOptionsSettingsQuery(
    "vessel_voyage_settings"
  );

  useEffect(() => {
    if (optionsSettingsData?.body || voyageSettingsData?.body) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...voyageSettingsData?.body,
      });
    }
  }, [optionsSettingsData, voyageSettingsData]);

  const gateOptions = [
    { label: "Close", value: "close" },
    { label: "Open", value: "open" },
  ];
  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  return (
    <>
      {type == "copy" || type == "add" ? (
        <>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label="Voyage Details"
                    value="1"
                    sx={{
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<EditIconForHeader />}
                    iconPosition="start"
                  />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ margin: 0, padding: 0 }}>
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
                      <FormAutoComplete
                        label="Vessel Name*"
                        id="vessel"
                        suggestionName="vessel_name"
                        value={formik.values.vessel}
                        error={formik.errors.vessel}
                        onChange={formik.handleChange}
                        inputRef={FieldRef}
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
                      marginTop={2}
                    >
                      <InputBox
                        label="Voyage InBound*"
                        id="voyageInBound"
                        value={formik.values.voyageInBound}
                        error={formik.errors.voyageInBound}
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
                        label="Voyage OutBound"
                        id="voyageOutBound"
                        value={formik.values.voyageOutBound}
                        error={formik.errors.voyageOutBound}
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
                        label="Status"
                        id="status"
                        disabled={true}
                        error={formik.errors.status}
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
                      <DateField
                        label="Eta"
                        id="eta"
                        value={formik.values.eta}
                        error={formik.errors.eta}
                        onChange={formik.setFieldValue}
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
                      <DateTimeField
                        label="Sailing Date"
                        id="sailingDateEtd"
                        value={formik.values.sailingDateEtd}
                        error={formik.errors.sailingDateEtd}
                        onChange={formik.setFieldValue}
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
                      <DateField
                        label="Arrival Date"
                        id="arrivalDatePilotStation"
                        value={formik.values.arrivalDatePilotStation}
                        error={formik.errors.arrivalDatePilotStation}
                        onChange={formik.setFieldValue}
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
                      <DateField
                        label="Document Deadline"
                        id="documentDeadLine"
                        value={formik.values.documentDeadLine}
                        error={formik.errors.documentDeadLine}
                        onChange={formik.setFieldValue}
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
                      <DateField
                        label="Payment Cutoff"
                        id="paymentCutOff"
                        value={formik.values.paymentCutOff}
                        error={formik.errors.paymentCutOff}
                        onChange={formik.setFieldValue}
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
                      <DateTimeField
                        label="Berthing Date"
                        id="berthingDate"
                        value={formik.values.berthingDate}
                        error={formik.errors.berthingDate}
                        onChange={formik.setFieldValue}
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
                      <DateTimeField
                        label="Manifest Kra"
                        id="manifestReady_kra"
                        value={formik.values.manifestReady_kra}
                        error={formik.errors.manifestReady_kra}
                        onChange={formik.setFieldValue}
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
                      <DateTimeField
                        label="Manifest Invoice"
                        id="manifestReady_invoice"
                        value={formik.values.manifestReady_invoice}
                        error={formik.errors.manifestReady_invoice}
                        onChange={formik.setFieldValue}
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
                      <DateField
                        label="Last Sling Date"
                        id="vesselLast_SlingDate"
                        value={formik.values.vesselLast_SlingDate}
                        error={formik.errors.vesselLast_SlingDate}
                        onChange={formik.setFieldValue}
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
                        label="Gate Status"
                        id="gateStatus"
                        options={gateOptions}
                        value={formik.values.gateStatus}
                        error={formik.errors.gateStatus}
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
                        label="Port Operator"
                        id="portOperator"
                        options={voyageSettingsData?.body.portOperator}
                        value={formik.values.portOperator}
                        error={formik.errors.portOperator}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sx={{ margin: 1 }}>
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        sx={{ fontWeight: "500", borderRadius: "12px" }}
                        onClick={() => nav("/app/master/vesselVoyage")}
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
                  <Tab
                    label="Voyage Details"
                    value="1"
                    sx={{
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<EditIconForHeader />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Audit Logs"
                    value="2"
                    sx={{
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<AuditIcon />}
                    iconPosition="start"
                  />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ margin: 0, padding: 0 }}>
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
                      <FormAutoComplete
                        label="Vessel Name*"
                        id="vessel"
                        suggestionName="vessel_name"
                        value={formik.values.vessel}
                        error={formik.errors.vessel}
                        onChange={formik.handleChange}
                        inputRef={FieldRef}
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
                      marginTop={2}
                    >
                      <InputBox
                        label="Voyage InBound*"
                        id="voyageInBound"
                        value={formik.values.voyageInBound}
                        error={formik.errors.voyageInBound}
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
                        label="Voyage OutBound"
                        id="voyageOutBound"
                        value={formik.values.voyageOutBound}
                        error={formik.errors.voyageOutBound}
                        onChange={formik.handleChange}
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
                        sx={{ marginTop: 2 }}
                        paddingLeft={1}
                      >
                        <SelectBox
                          label="Status"
                          id="status"
                          options={optionsSettingsData?.body.status}
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
                  </Grid>
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
                      <DateField
                        label="Eta"
                        id="eta"
                        value={formik.values.eta}
                        error={formik.errors.eta}
                        onChange={formik.setFieldValue}
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
                      <DateTimeField
                        label="Sailing Date"
                        id="sailingDateEtd"
                        value={formik.values.sailingDateEtd}
                        error={formik.errors.sailingDateEtd}
                        onChange={formik.setFieldValue}
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
                      <DateField
                        label="Arrival Date"
                        id="arrivalDatePilotStation"
                        value={formik.values.arrivalDatePilotStation}
                        error={formik.errors.arrivalDatePilotStation}
                        onChange={formik.setFieldValue}
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
                      <DateField
                        label="Document Deadline"
                        id="documentDeadLine"
                        value={formik.values.documentDeadLine}
                        error={formik.errors.documentDeadLine}
                        onChange={formik.setFieldValue}
                      />
                    </Grid>
                  </Grid>
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
                      <DateField
                        label="Payment Cutoff"
                        id="paymentCutOff"
                        value={formik.values.paymentCutOff}
                        error={formik.errors.paymentCutOff}
                        onChange={formik.setFieldValue}
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
                      <DateTimeField
                        label="Berthing Date"
                        id="berthingDate"
                        value={formik.values.berthingDate}
                        error={formik.errors.berthingDate}
                        onChange={formik.setFieldValue}
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
                      <DateTimeField
                        label="Manifest Kra"
                        id="manifestReady_kra"
                        value={formik.values.manifestReady_kra}
                        error={formik.errors.manifestReady_kra}
                        onChange={formik.setFieldValue}
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
                      <DateTimeField
                        label="Manifest Invoice"
                        id="manifestReady_invoice"
                        value={formik.values.manifestReady_invoice}
                        error={formik.errors.manifestReady_invoice}
                        onChange={formik.setFieldValue}
                      />
                    </Grid>
                  </Grid>
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
                      <DateField
                        label="Last Sling Date"
                        id="vesselLast_SlingDate"
                        value={formik.values.vesselLast_SlingDate}
                        error={formik.errors.vesselLast_SlingDate}
                        onChange={formik.setFieldValue}
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
                        label="Gate Status"
                        id="gateStatus"
                        options={gateOptions}
                        value={formik.values.gateStatus}
                        error={formik.errors.gateStatus}
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
                        label="Port Operator"
                        id="portOperator"
                        options={voyageSettingsData?.body.portOperator}
                        value={formik.values.portOperator}
                        error={formik.errors.portOperator}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{ margin: 1 }}>
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        sx={{ fontWeight: "500", borderRadius: "12px" }}
                        onClick={() => nav("/app/master/vesselVoyage")}
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
                        {loadingUpdate && (
                          <CircularProgress size={20} color="white" />
                        )}{" "}
                        Update
                      </ThemeButton>
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>{" "}
              <TabPanel value="2" sx={{ margin: 0, padding: 0 }}>
                <AuditTimeLine
                  id={initialValues.id}
                  page="vessel/voyage"
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
