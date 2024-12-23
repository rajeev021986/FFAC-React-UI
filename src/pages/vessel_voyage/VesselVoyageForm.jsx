import { Box, CircularProgress, Grid, Stack, Tab } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton, ThemeButton } from "../../components/common/Button";
import { VesselVoyageMapping } from "./VesselVoyageMapping";
import { useFormik } from "formik";
import { VesselVoyageValidation } from "../../components/screen/vessel_voyage/validation";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import UploadFile from "../../components/UploadFile";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useAddVoyageMutation,
  useUpdateVoyageMutation,
} from "../../store/api/vesselVoyageDataApi";

export function VesselVoyageForm({ initialValues, type }) {
  const disabled = false;
  const nav = useNavigate();

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [addVoyage, { isLoading }] = useAddVoyageMutation();
  const [updateVoyage] = useUpdateVoyageMutation();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
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
          console.error("Error submitting form:", error);
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
          console.error("Error submitting form:", error);
          toast.error("An error occurred while submitting the form.");
        }
      }
    },
  });

  const { data: voyageSettingsData } = useGetOptionsSettingsQuery(
    "vessel_voyage_settings"
  );

  return (
    <>
      {type == "copy" || type == "add" ? (
        <>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Vessel Voyage"
                id="vesselVoyage"
                value={formik.values.vesselVoyage}
                error={formik.errors.vesselVoyage}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Status"
                id="status"
                value={formik.values.status}
                error={formik.errors.status}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Voyage InBound"
                id="voyageInBound"
                value={formik.values.voyageInBound}
                error={formik.errors.voyageInBound}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Voyage OutBound"
                id="voyageOutBound"
                value={formik.values.voyageOutBound}
                error={formik.errors.voyageOutBound}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Gate Status"
                id="gateStatus"
                value={formik.values.gateStatus}
                error={formik.errors.gateStatus}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Post Operator"
                id="portOperator"
                value={formik.values.portOperator}
                error={formik.errors.portOperator}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <InputBox
                label="Mode"
                id="mode"
                value={formik.values.mode}
                error={formik.errors.mode}
                onChange={formik.handleChange}
              />
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
                  <Tab label="Edit Voyage" value="1" />
                  <Tab label="Upload Documents" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {" "}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Vessel Voyage"
                      id="vesselVoyage"
                      value={formik.values.vesselVoyage}
                      error={formik.errors.vesselVoyage}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Status"
                      id="status"
                      value={formik.values.status}
                      error={formik.errors.status}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Voyage InBound"
                      id="voyageInBound"
                      value={formik.values.voyageInBound}
                      error={formik.errors.voyageInBound}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Voyage OutBound"
                      id="voyageOutBound"
                      value={formik.values.voyageOutBound}
                      error={formik.errors.voyageOutBound}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Gate Status"
                      id="gateStatus"
                      value={formik.values.gateStatus}
                      error={formik.errors.gateStatus}
                      onChange={formik.handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Post Operator"
                      id="portOperator"
                      value={formik.values.portOperator}
                      error={formik.errors.portOperator}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                      label="Mode"
                      id="mode"
                      value={formik.values.mode}
                      error={formik.errors.mode}
                      onChange={formik.handleChange}
                    />
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
                        Save
                      </ThemeButton>
                    </Stack>
                  </Grid>
                </Grid>
              </TabPanel>{" "}
              <TabPanel value="2">
                <UploadFile
                  customer_id={initialValues.id}
                  disabled={disabled}
                  sourceType="VOYAGE"
                  dropdownData={voyageSettingsData?.body?.documentType}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </>
      )}
    </>
  );
}
