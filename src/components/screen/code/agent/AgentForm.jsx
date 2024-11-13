import { Box, Checkbox, CircularProgress, FormControlLabel, Grid, Stack } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import AppAutocomplete from "../../../common/AppAutocomplete";
import ApiManager from "../../../../services/ApiManager";
import PopupAlert from "../../../common/Alert/PopupAlert";
import SelectBox from "../../../common/SelectBox";
import { USER_STATUS_OPTIONS } from "../../../../data/options";
import { useAddAgentMutation } from "../../../../store/api/codeDataApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AgentValidationSchema } from "./validationSchema";

export default function AgentForm({
  initialValues,
}) {
  
    const [options, setOptions] = useState([]);
    const [addAgent, { isLoading }] = useAddAgentMutation();
    const nav = useNavigate();
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: AgentValidationSchema(),
    onSubmit: async (values) => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key !== 'files' && key !== 'atype') {
          formData.append(key, values[key]);
        }
      });

      formData.append("atype", JSON.stringify(values.atype));
  
      try {
        let response = await addAgent(formData).unwrap();

        if (response.message === 'Data saved successfully!') {
          toast.success(response.message);
          nav("/app/code/agent");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error("An error occurred while submitting the form.");
      }
    },
  });

  const handleCityOptionChange = async (query) => {
    console.log(query);
    ApiManager.getCityOptions('city',query)
      .then((response) => {
        console.log("Newwwwwwwwwwwwww",response.data);
        
        setOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCitySelect = (selectedCity) => {
    if (selectedCity) {
      formik.setFieldValue('state', selectedCity.state || '');
      formik.setFieldValue('zipcode', selectedCity.pincode || '');
      formik.setFieldValue('country', selectedCity.country || '');
    }
  };

  const checkboxOptions = ["Agent", "Consolidator"];

  const handleCheckboxChange = (option) => {
    const currentSelection = formik.values.atype || [];

    if (currentSelection.includes(option.toUpperCase())) {
        
      // If option is already selected, remove it from the array
      const updatedSelection = currentSelection.filter((item) => item !== option.toUpperCase());
      formik.setFieldValue("atype", updatedSelection);
    } else {
      // If option is not selected, add it to the array
      formik.setFieldValue("atype", [...currentSelection, option.toUpperCase()]);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="IES Client code"
          id="iesclientcode"
          value={formik.values.iesclientcode}
          error={formik.errors.iesclientcode}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Name"
          id="cname"
          value={formik.values.cname}
          error={formik.errors.cname}
          
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
          label="Mobile"
          id="mobile"
          value={formik.values.mobile}
          error={formik.errors.mobile}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Main Tel#"
          id="phone"
          value={formik.values.phone}
          error={formik.errors.phone}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Fax"
          id="fax"
          value={formik.values.fax}
          error={formik.errors.fax}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Url"
          id="url"
          value={formik.values.url}
          error={formik.errors.url}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Add. Line 1"
          id="addressl1"
          value={formik.values.addressl1}
          error={formik.errors.addressl1}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Line 2"
          id="addressl2"
          value={formik.values.addressl2}
          error={formik.errors.addressl2}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Line 3"
          id="addressl3"
          value={formik.values.addressl3}
          error={formik.errors.addressl3}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppAutocomplete
          label="City"
          id="city"
          value={formik.values.city}
          formik={formik}
          options={options.map((item) => ({
            label: item.city, // Show only city in the dropdown
            value: item.city,
            ...item, // Keep other properties for selection
          }))}
          error={formik.errors.city}
          onChange={(selectedCity) => {
            formik.setFieldValue("city", selectedCity); // Set selected city in formik
            const foundCity = options.find(city => city.city === selectedCity); // Find the selected city's data
            handleCitySelect(foundCity); // Populate pincode, state, and country
          }}
          handleOptionChange={handleCityOptionChange}
          sx={{ marginTop: "16px", marginBottom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="State"
          id="state"
          value={formik.values.state}
          error={formik.errors.state}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Postal Code"
          id="zipcode"
          value={formik.values.zipcode}
          error={formik.errors.zipcode}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Country"
          id="country"
          value={formik.values.country}
          error={formik.errors.country}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <SelectBox
              label="Status"
              id="status"
              options={USER_STATUS_OPTIONS}
              value={formik.values.status}
              error={formik.errors.status}
              onChange={formik.handleChange}
            />
      </Grid>

<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <Box sx={{ fontWeight: "bold", marginBottom: 1 }}>Account Type</Box>
        <Grid container spacing={2}>
          {checkboxOptions.map((option) => (
            <Grid item xs={6} key={option}> {/* 50% width for two checkboxes per row */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.atype.includes(option.toUpperCase())}
                    onChange={() => handleCheckboxChange(option)}
                    disabled={initialValues.atype.includes(option.toUpperCase())}
                  />
                }
                label={option}
              />
            </Grid>
          ))}
        </Grid>
        {formik.errors.atype && formik.touched.atype && (
          <Box sx={{ color: "red", fontSize: "0.875rem", marginTop: "8px" }}>
            {formik.errors.atype}
          </Box>
        )}
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="end">
          <Stack direction="row" spacing={2}>
            <OutlinedButton sx={{ fontWeight: "500" }}>Cancel</OutlinedButton>
            <ThemeButton
              onClick={formik.handleSubmit}
              sx={{ fontWeight: "500" }}
            >
              {isLoading && <CircularProgress size={20} color="white" />} Save
            </ThemeButton>
          </Stack>
        </Stack>
      </Grid>

      <PopupAlert alertConfig={alertConfig} />
    </Grid>
  );
}
