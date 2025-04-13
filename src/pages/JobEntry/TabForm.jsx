import React, { useState } from "react";
import { Box, Tab } from "@mui/material";

// Components
import ShipperDetails from "./ShiperDetail";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LineVessel from "./LineVessel";
import ShipmentDetails from "./ShipmentDetails";
import JobEntryGridForm from "./jobEntryEditGrid";
import NoteListing from "./NoteListing";

// Job Setting Data
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";

const tabData = [
  { label: "Shipper Details", value: "1" },
  { label: "Line/Vessel", value: "2" },
  { label: "Shipment Details", value: "3" },
  { label: "Notes", value: "4" },
];

const CommonTabForm = ({ formik, dropdownData }) => {
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  return (
    <Box sx={{ p: 0.5, bgcolor: "white", borderRadius: 3, boxShadow: 2 }}>
      <Box
        className="ThemeTabBox"
        sx={{
          typography: "body1",
          position: "relative",
          borderRadius: "10px",
          ...tabStyle.tabPanel,
        }}
      >
        <TabContext value={value}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // marginBottom: 1,
            }}
          >
            <Box sx={tabStyle.container}>
              <TabList onChange={handleChange} aria-label="generic tab">
                {tabData.length > 0 &&
                  tabData.map((tab, index) => (
                    <Tab
                      sx={tabStyle.tab}
                      className="nested1"
                      label={tab.label}
                      value={tab.value}
                      key={index}
                      disabled={tab.disable}
                      iconPosition="end"
                    />
                  ))}
              </TabList>
            </Box>
          </Box>

          <TabPanel disabled value="1">
            <ShipperDetails formik={formik} />
          </TabPanel>

          <TabPanel value="2">
            <LineVessel formik={formik} />
          </TabPanel>

          <TabPanel value="3">
            <ShipmentDetails formik={formik} />
          </TabPanel>

          <TabPanel value="4">
            <NoteListing formik={formik} />
          </TabPanel>
        </TabContext>
      </Box>

      {value === "3" && (
        <Box
          className="ThemeTabBox"
          sx={{
            typography: "body1",
            position: "relative",
            borderRadius: "10px",
            ...tabStyle.tabPanel,
          }}
        >
          <JobEntryGridForm
            formik={formik}
            dropdownData={dropdownData}
            jobSettingData={jobSettingData}
          />
        </Box>
      )}
    </Box>
  );
};

export default CommonTabForm;

const tabStyle = {
  container: {
    width: "fit-content",
    fontWeight: "bold",
  },
  tab: {
    textTransform: "capitalize",
  },
  tabPanel: {
    width: "100%",
    "& .MuiTabPanel-root": {
      padding: "0px !important",
      width: "100%",
    },
  },
  tabHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    width: "100%",
  },
};
