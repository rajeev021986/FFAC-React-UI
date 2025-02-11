import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import {
  useAddVesselMutation,
  useFetchVesselQuery,
  useLazyFetchAuditVesselQuery,
  useUpdateVesselMutation,
} from "../../store/api/vesselDataApi";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
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
import SelectBox from "../../components/common/SelectBox";
import AuditTimeLine from "../../components/AuditTimeLine";
import getFirstError from "../../components/common/FieldToastError";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import CustomToast from "../../components/common/Toast/CustomToast";
import { menuConfigUrl } from "../../store/menuConfigUrl";
import EditIconForHeader from "../../components/common/commonIcons/EditIcons/EditIconForHeader";
import AuditIcon from "../../components/common/commonIcons/AuditIcon/AuditIcon";
export function VesselForm({ initialValues, type }) {
  const location = useLocation();
  const nav = useNavigate();
  const disabled = false;
  const [addVessel, { isLoading: loadingAdd }] = useAddVesselMutation();

  const [updateVessel, { isLoading: loadingUpdate }] =
    useUpdateVesselMutation();
  const [dropdownData, setDropdownData] = useState({});

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ownerOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];
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
    validationSchema: VesselValidation(),
    onSubmit: async (values) => {
      if (type == "copy" || type == "add") {
        let line = values.vesselLineEntities.map((item) =>
          item?.new ? { ...item, id: null, new: false } : item
        );

        try {
          values.statusCode = 1;
          values.status = "";
          delete values.id;
          let response = await addVessel({
            ...values,
            vesselLineEntities: line,
          }).unwrap();

          if (response.code == "SUCCESS") {
            toast.custom(
              <CustomToast message={response.message} toast="success" />,
              {
                closeButton: false,
              }
            );
            nav("/app/master/vessel");
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
          let line = values.vesselLineEntities.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          Boolean(values.status == "Active") && (values.statusCode = 1);
          Boolean(values.status == "Inactive") && (values.statusCode = -2);

          let response = await updateVessel({
            ...values,
            vesselLineEntities: line,
          }).unwrap();

          if (response.code == "SUCCESS") {
            toast.custom(
              <CustomToast message={response.message} toast="success" />,
              {
                closeButton: false,
              }
            );
            nav("/app/master/vessel");
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
  const { data: vesselSettingsData } =
    useGetOptionsSettingsQuery("vessel_settings");

  useEffect(() => {
    if (optionsSettingsData?.body || vesselSettingsData?.body) {
      setDropdownData({
        ...optionsSettingsData?.body,
        ...vesselSettingsData?.body,
      });
    }
  }, [optionsSettingsData, vesselSettingsData]);

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
                    label="Vessel Details"
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
                      <InputBox
                        label="Vessel Name*"
                        id="vesselName"
                        value={formik.values.vesselName}
                        error={formik.errors.vesselName}
                        onChange={formik.handleChange}
                        inputRef={FieldRef}
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
                        label="Line Name*"
                        id="lineName"
                        value={formik.values.lineName}
                        error={formik.errors.lineName}
                        onChange={formik.handleChange}
                        suggestionName="vendor_name"
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
                      <SelectBox
                        label="Vessel Owner"
                        id="vesselOwner"
                        options={ownerOptions}
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
                  <Box
                    sx={{
                      width: "100%",
                      typography: "body1",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      margin: "8px 8px 0px 8px",
                    }}
                  >
                    <TabContext value={value}>
                      <Box>
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab
                            label="Line"
                            value="1"
                            sx={{
                              textTransform: "capitalize",
                            }}
                            className="nested1"
                          />
                        </TabList>
                      </Box>
                      <TabPanel value="1" sx={{ margin: 0, padding: 0 }}>
                        {" "}
                        <VesselMapping disabled={disabled} formik={formik} />
                      </TabPanel>
                    </TabContext>
                  </Box>

                  <Grid item xs={12} sx={{ margin: 1, padding: 0 }}>
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        sx={{ fontWeight: "500", borderRadius: "12px" }}
                        onClick={() => nav("/app/master/vessel")}
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
                    label="Vessel Details"
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
                      <InputBox
                        label="Vessel Name*"
                        id="vesselName"
                        value={formik.values.vesselName}
                        error={formik.errors.vesselName}
                        onChange={formik.handleChange}
                        inputRef={FieldRef}
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
                        label="Line Name*"
                        id="lineName"
                        value={formik.values.lineName}
                        error={formik.errors.lineName}
                        onChange={formik.handleChange}
                        suggestionName="vendor_name"
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
                      <SelectBox
                        label="Vessel Owner"
                        id="vesselOwner"
                        options={ownerOptions}
                        value={formik.values.vesselOwner}
                        error={formik.errors.vesselOwner}
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

                  <Box
                    sx={{
                      width: "100%",
                      typography: "body1",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                      margin: "8px 8px 0px 8px",
                    }}
                  >
                    <TabContext value={value}>
                      <Box>
                        <TabList
                          onChange={handleChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab
                            label="Line"
                            value="1"
                            sx={{
                              textTransform: "capitalize",
                            }}
                            className="nested1"
                          />
                        </TabList>
                      </Box>
                      <TabPanel value="1" sx={{ margin: 0, padding: 0 }}>
                        {" "}
                        <VesselMapping disabled={disabled} formik={formik} />
                      </TabPanel>
                    </TabContext>
                  </Box>
                  <Grid item xs={12} sx={{ margin: 1, padding: 0 }}>
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        sx={{ fontWeight: "500", borderRadius: "12px" }}
                        onClick={() => nav("/app/master/vessel")}
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
                  page="vessel"
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
