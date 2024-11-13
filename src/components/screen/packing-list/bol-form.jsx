import React, { useState } from "react";
import { Grid } from "@mui/material";
import InputBox from "../../common/InputBox";
import AppAutocomplete from "../../common/AppAutocomplete";
import AppDatePicker from "../../common/AppDatePicker";
import SelectBox from "../../common/SelectBox";
import { Console_BL_OPTIONS } from "../../../data/options";
import { useDispatch, useSelector } from "react-redux";
import { updateBolDataInput } from "../../../store/freatures/sprblDataSlice";
import { useFormik } from "formik";
import ApiManager from "../../../services/ApiManager";

const BLDetailsFields = ({ initialValues }) => {
  const [options, setOptions] = useState([]);
  const [optionsPOL, setPOLOptions] = useState([]);
  const [optionsPOD, setPODOptions] = useState([]);
  const [optionsFinalDesti, setoptionsFinalDestiptions] = useState([]);
//   const initialData = useSelector((state) => state.sprblDetails.formData);
  const formErrors = useSelector((state) => state.sprblDetails.errors);
  const dispatch = useDispatch();
  const handleVesselOptionChange = async (query) => {
    ApiManager.getVesselOptions(query)
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlePolOptionChange = async (query) => {
    ApiManager.getPolPodOptions(query)
      .then((response) => {
        setPOLOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handlePodOptionChange = async (query) => {
    ApiManager.getPolPodOptions(query)
      .then((response) => {
        setPODOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handlefinalDestOptionChange = async (query) => {
    ApiManager.getfinalDestOptions(query)
      .then((response) => {
        setoptionsFinalDestiptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formik = useFormik({
    initialValues: {
      blno: "",
      console_bl: "",
      weights: initialValues?.weights,
      pieces: initialValues?.pieces,
      cbm: initialValues?.cbm,
      ...initialValues?.sprBLDetails[0]
    },
    validateOnChange: false,
    validateOnBlur: false,
    onChange: (e) => {
      const { id, value } = e.target;
      dispatch(updateBolDataInput({ field: id, value }));
      formik.handleChange(e);
    },
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="BL No"
          id="blno"
          value={formik.values.blno}
          error={formErrors?.blno}
          onChange={(e) => {
            formik.handleChange(e);
            dispatch(updateBolDataInput({ field: e.target.id, value: e.target.value }));
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Booking No"
          id="bookingNo"
          value={formik.values.bookingNo}
          error={formErrors?.bookingNo}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppAutocomplete
          label="Vessel"
          id="vessel"
          value={formik.values.vessel}
          formik={formik}
          error={formErrors?.vessel}
          options={options}
          onChange={(selectedValue) => {
            dispatch(updateBolDataInput({ field: 'vessel', value: selectedValue }));
          }}
          handleOptionChange={handleVesselOptionChange}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Voyage"
          id="voyage"
          value={formik.values.voyage}
          error={formErrors?.voyage}
          onChange={(e) => {
            formik.handleChange(e);
            dispatch(updateBolDataInput({ field: e.target.id, value: e.target.value }));
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Shipper"
          id="shipper"
          value={formik.values.shipper}
          error={formErrors?.shipper}
          disabled={false}
          onChange={(e) => {
            formik.handleChange(e);
            dispatch(updateBolDataInput({ field: e.target.id, value: e.target.value }));
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="BL Status"
          id="blStatus"
          value={formik.values.blStatus}
          error={formik.errors.blStatus}
          disabled={true}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppAutocomplete
          label="POL"
          id="pol"
          value={formik.values.pol}
          error={formErrors?.pol}
          formik={formik}
          options={optionsPOL}
          onChange={(selectedValue) => {
            dispatch(updateBolDataInput({ field: 'pol', value: selectedValue }));
          }}
          handleOptionChange={handlePolOptionChange}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppAutocomplete
          label="POD"
          id="pod"
          value={formik.values.pod}
          error={formErrors?.pod}
          formik={formik}
          options={optionsPOD}
          onChange={(selectedValue) => {
            dispatch(updateBolDataInput({ field: 'pod', value: selectedValue }));
          }}
          handleOptionChange={handlePodOptionChange}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppAutocomplete
          label="Final Destination"
          id="finalDest"
          value={formik.values.finalDest}
          error={formErrors?.finalDest}
          formik={formik}
          options={optionsFinalDesti}
          onChange={(selectedValue) => {
            dispatch(updateBolDataInput({ field: 'finalDest', value: selectedValue }));
          }}
          handleOptionChange={handlefinalDestOptionChange}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="polDate"
          label="POL Date"
          value={formik.values.polDate}
          error={formErrors?.polDate}
          onChange={(value) => {formik.setFieldValue("polDate", value);
            dispatch(updateBolDataInput({ field: "polDate", value: value }));
          }}
          disabled={false}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="podDate"
          label="POD Date"
          value={formik.values.podDate}
          error={formErrors?.podDate}
          onChange={(value) => {formik.setFieldValue("podDate", value);
            dispatch(updateBolDataInput({ field: "podDate", value: value }));
          }}
          disabled={false}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="etaFinalDest"
          label="ETA Final Destination"
          error={formErrors?.etaFinalDest}
          value={formik.values.etaFinalDest}
          onChange={(value) => {formik.setFieldValue("etaFinalDest", value);
            dispatch(updateBolDataInput({ field: "etaFinalDest", value: value }));
          }}
          disabled={false}
          sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="BOL Total Cartons"
          id="pieces"
          value={formik.initialValues?.pieces}
          error={formik.errors.pieces}
          disabled={false}
          onChange={(e) => {
            formik.handleChange(e);
            dispatch(updateBolDataInput({ field: e.target.id, value: e.target.value }));
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="BOL Total CBM"
          id="cbm"
          value={formik.initialValues?.cbm}
          error={formik.errors.cbm}
          disabled={false}
          onChange={(e) => {
            formik.handleChange(e);
            dispatch(updateBolDataInput({ field: e.target.id, value: e.target.value }));
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="BOL Total Gross Weight"
          id="weights"
          value={formik.initialValues?.weights}
          error={formik.errors.weights}
          disabled={false}
          onChange={(e) => {
            formik.handleChange(e);
            dispatch(updateBolDataInput({ field: e.target.id, value: e.target.value }));
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <SelectBox
          label="Console BL"
          id="console_bl"
          options={Console_BL_OPTIONS}
          value={formik.values.console_bl}
          error={formik.errors.console_bl}
          onChange={(e) => {
            formik.handleChange(e);
            dispatch(updateBolDataInput({ field: e.target.id, value: e.target.value }));
          }}
          sx={{ marginTop: "16px", marginBottom: "8px" }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <AppDatePicker
          id="dateForClearance"
          label="Date for Clearance"
          value={formik.values.dateForClearance}
          error={formErrors?.dateForClearance}
          onChange={(value) => {formik.setFieldValue("dateForClearance", value);
            dispatch(updateBolDataInput({ field: "dateForClearance", value: value }));

          }}
          // sx={{ marginTop: "16px", marginButtom: "8px" }}
        />
      </Grid>
    </Grid>
  );
};

export default BLDetailsFields;
