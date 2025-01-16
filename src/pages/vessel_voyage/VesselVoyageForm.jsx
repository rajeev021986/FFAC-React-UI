import { Box, CircularProgress, Grid, Stack, Tab } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import { useFormik } from "formik";
import { VesselVoyageValidation } from "../../components/screen/vessel_voyage/validation";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import React, { useEffect, useState } from "react";
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
export function VesselVoyageForm({ initialValues, type }) {
  const disabled = false;
  const nav = useNavigate();

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [dropdownData, setDropdownData] = useState({});
  const [addVoyage, { isLoading }] = useAddVoyageMutation();
  const [updateVoyage] = useUpdateVoyageMutation();

  const [loading, setLoading] = useState(false);
  const [enquiryAuditDetails, setEnquiryAuditDetails] = useState([]);

  const reloadDataHandler = async () => {
    try {
      setLoading(true);
      const res = await ApiManager.getVoyageAudit(initialValues.id);
      setEnquiryAuditDetails(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: VesselVoyageValidation(),
    onSubmit: async (values) => {
      if (type == "copy" || type == "add") {
        try {
          delete values.id;
          let response = await addVoyage({
            ...values,
          }).unwrap();
          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/vesselVoyage");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("An error occurred while submitting the form.");
        }
      } else {
        try {
          let response = await updateVoyage({
            ...values,
          }).unwrap();

          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/vesselVoyage");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("An error occurred while submitting the form.");
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
                      fontSize: "1rem",
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<EditIcon />}
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
                      <DateTimeField
                        label="Sailing Date"
                        id="sailingDateEtd"
                        value={formik.values.sailingDateEtd}
                        error={formik.errors.sailingDateEtd}
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
                      <DateField
                        label="Arrival Date"
                        id="arrivalDatePilotStation"
                        value={formik.values.arrivalDatePilotStation}
                        error={formik.errors.arrivalDatePilotStation}
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
                      <DateField
                        label="Document Deadline"
                        id="documentDeadLine"
                        value={formik.values.documentDeadLine}
                        error={formik.errors.documentDeadLine}
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
                        label="Payment Cutoff"
                        id="paymentCutOff"
                        value={formik.values.paymentCutOff}
                        error={formik.errors.paymentCutOff}
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
                      <DateTimeField
                        label="Berthing Date"
                        id="berthingDate"
                        value={formik.values.berthingDate}
                        error={formik.errors.berthingDate}
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
                      <DateTimeField
                        label="Manifest Kra"
                        id="manifestReady_kra"
                        value={formik.values.manifestReady_kra}
                        error={formik.errors.manifestReady_kra}
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
                      <DateTimeField
                        label="Manifest Invoice"
                        id="manifestReady_invoice"
                        value={formik.values.manifestReady_invoice}
                        error={formik.errors.manifestReady_invoice}
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
                        label="Last Sling Date"
                        id="vesselLast_SlingDate"
                        value={formik.values.vesselLast_SlingDate}
                        error={formik.errors.vesselLast_SlingDate}
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
                        label="Post Operator"
                        id="portOperator"
                        options={gateOptions}
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
                      fontSize: "1rem",
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<EditIcon />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Audit Logs"
                    value="2"
                    sx={{
                      fontSize: "1rem",
                      textTransform: "capitalize",
                      minHeight: "50px",
                    }}
                    icon={<HistoryIcon />}
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
                      <DateTimeField
                        label="Sailing Date"
                        id="sailingDateEtd"
                        value={formik.values.sailingDateEtd}
                        error={formik.errors.sailingDateEtd}
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
                      <DateField
                        label="Arrival Date"
                        id="arrivalDatePilotStation"
                        value={formik.values.arrivalDatePilotStation}
                        error={formik.errors.arrivalDatePilotStation}
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
                      <DateField
                        label="Document Deadline"
                        id="documentDeadLine"
                        value={formik.values.documentDeadLine}
                        error={formik.errors.documentDeadLine}
                        onChange={formik.handleChange}
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
                      <DateTimeField
                        label="Berthing Date"
                        id="berthingDate"
                        value={formik.values.berthingDate}
                        error={formik.errors.berthingDate}
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
                      <DateTimeField
                        label="Manifest Kra"
                        id="manifestReady_kra"
                        value={formik.values.manifestReady_kra}
                        error={formik.errors.manifestReady_kra}
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
                      <DateTimeField
                        label="Manifest Invoice"
                        id="manifestReady_invoice"
                        value={formik.values.manifestReady_invoice}
                        error={formik.errors.manifestReady_invoice}
                        onChange={formik.handleChange}
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
                        label="Post Operator"
                        id="portOperator"
                        options={gateOptions}
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
                        Update
                      </ThemeButton>
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>{" "}
              <TabPanel value="2" sx={{ margin: 0, padding: 0 }}>
                <AuditTimeLine
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
