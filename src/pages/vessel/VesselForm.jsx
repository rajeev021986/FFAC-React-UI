import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import {
  useAddVesselMutation,
  useFetchVesselQuery,
  useUpdateVesselMutation,
} from "../../store/api/vesselDataApi";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { VesselValidation } from "../../components/screen/vessel/validation";
import toast from "react-hot-toast";
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import { VesselMapping } from "./VesselMapping";
import UploadFile from "../../components/UploadFile";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import ApiManager from "../../services/ApiManager";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import FormAutoComplete from "../../components/common/AutoComplete/FormAutoComplete";

export function VesselForm({ initialValues, type }) {
  const location = useLocation();
  const nav = useNavigate();
  const disabled = false;
  const [addVessel, { isLoading }] = useAddVesselMutation();
  const [updateVessel] = useUpdateVesselMutation();

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: VesselValidation(),
    onSubmit: async (values) => {
      if (type == "copy" || type == "add") {
        let line = values.vesselLineEntities.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );

        try {
          delete values.id;
          let response = await addVessel({
            ...values,
            vesselLineEntities: line,
          }).unwrap();

          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/vessel");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("An error occurred while submitting the form.");
        }
      } else {
        try {
          let line = values.vesselLineEntities.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          let response = await updateVessel({
            ...values,
            vesselLineEntities: line,
          }).unwrap();

          if (response.code == "SUCCESS") {
            toast.success(response.message);
            nav("/app/master/vessel");
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("An error occurred while submitting the form.");
        }
      }
    },
  });

  const fetchSuggestions = async (inputValue, inputId) => {
    inputId =
      inputId === "vesselName"
        ? "VESSEL"
        : inputId === "lineName"
        ? "LINE"
        : "SHIPPER";
    if (!inputValue) return [];

    const response = await ApiManager.fetchVesselSuggestions(
      inputValue,
      inputId
    );
    const data = await response.body;

    return data || [];
  };
  const { data: vesselSettingsData } =
    useGetOptionsSettingsQuery("vessel_settings");
  return (
    <>
      {type == "copy" || type == "add" ? (
        <>
          <Grid container sx={{ padding: 0, margin: 0, paddingRight: "8px" }}>
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
                <FormAutoComplete
                  label="Vessel Name"
                  id="vesselName"
                  suggestionName="vessel_name"
                  value={formik.values.vesselName}
                  error={formik.errors.vesselName}
                  onChange={formik.handleChange}
                  fetchSuggestions={fetchSuggestions}
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
                <FormAutoComplete
                  label="Line Name"
                  id="lineName"
                  value={formik.values.lineName}
                  error={formik.errors.lineName}
                  onChange={formik.handleChange}
                  suggestionName="line_name"
                  fetchSuggestions={fetchSuggestions}
                ></FormAutoComplete>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={1}>
                <InputBox
                  label="Vessel Owner"
                  id="vesselOwner"
                  value={formik.values.vesselOwner}
                  error={formik.errors.vesselOwner}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} paddingLeft={1}>
                <InputBox
                  label="Status"
                  id="status"
                  value={formik.values.status}
                  error={formik.errors.status}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <VesselMapping
                  disabled={disabled}
                  formik={formik}
                  fetchSuggestions={fetchSuggestions}
                />
              </Box>
            </Grid>
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
                  <Tab label="Edit Vessel" value="1" />
                  <Tab label="Upload Documents" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ margin: 0, padding: 0 }}>
                {" "}
                <Grid
                  container
                  sx={{ padding: 0, margin: 0, paddingRight: "8px" }}
                >
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
                      <FormAutoComplete
                        label="Vessel Name"
                        id="vesselName"
                        suggestionName="vessel_name"
                        value={formik.values.vesselName}
                        error={formik.errors.vesselName}
                        onChange={formik.handleChange}
                        fetchSuggestions={fetchSuggestions}
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
                      <FormAutoComplete
                        label="Line Name"
                        id="lineName"
                        value={formik.values.lineName}
                        error={formik.errors.lineName}
                        onChange={formik.handleChange}
                        suggestionName="line_name"
                        fetchSuggestions={fetchSuggestions}
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
                        label="Vessel Owner"
                        id="vesselOwner"
                        value={formik.values.vesselOwner}
                        error={formik.errors.vesselOwner}
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
                        label="Status"
                        id="status"
                        value={formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{
                      margin: "0px ! important",
                      padding: "0px ! important",
                    }}
                  >
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <VesselMapping
                        disabled={disabled}
                        formik={formik}
                        fetchSuggestions={fetchSuggestions}
                      />
                    </Box>
                  </Grid>
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
                        Update
                      </ThemeButton>
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>{" "}
              <TabPanel value="2" sx={{ margin: 0, padding: 0 }}>
                <UploadFile
                  customer_id={initialValues.id}
                  disabled={disabled}
                  sourceType="VESSEL"
                  dropdownData={vesselSettingsData?.body?.documentType}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
