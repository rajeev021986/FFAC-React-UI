import { Box, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Stack } from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import InputBox from "../../../common/InputBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import AppAutocomplete from "../../../common/AppAutocomplete";
import ApiManager from "../../../../services/ApiManager";
import PopupAlert from "../../../common/Alert/PopupAlert";
import toast from "react-hot-toast";
import SelectBox from "../../../common/SelectBox";
import { USER_STATUS_OPTIONS ,PAYMENTTYPE_OPTIONS, ACCOUNT_TYPE_OPTIONS } from "../../../../data/options";
import ThemeTabs from "../../../common/Tab/ThemeTab";
import AddMapping from "./AddMapping"
import FileScreen from "./filesGrid";
import { CustomerValidationSchema } from "./validationSchema";

import { useAddCustomerMutation } from "../../../../store/api/codeDataApi";
import { useNavigate } from "react-router-dom";

export default function CustomerForm({
  initialValues,
}) {

  
    const [options, setOptions] = useState([]);
    const [optionsCity, setCityOptions] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState(initialValues.files || []);
    const [addCustomer, { isLoading }] = useAddCustomerMutation();

    
    const nav = useNavigate();
    // const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });
  console.log("optionsCity", optionsCity);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: CustomerValidationSchema(),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      try {
        let response = await addCustomer(values).unwrap();
        
        // Handle response and display toast messages
        if (response.code == "SUCCESS") {
          toast.success(response.message);
          nav("/app/entity/customer");
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred while submitting the form.");
      }
    },
  });

  const handleSalesOptionChange = async (query) => {
    console.log(query);
    ApiManager.getSalesOptions('salesname', query)
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCityOptionChange = async (query) => {
    console.log(query);
    ApiManager.getCityOptions('city',query)
      .then((response) => {
        setCityOptions(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Grid container spacing={2}>
       <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Customer Name"
          id="customerName"
          value={formik.values.customerName}
          error={formik.errors.customerName}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Account No."
          id="accountNo"
          value={formik.values.accountNo}
          error={formik.errors.accountNo}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Telephone"
          id="telephone"
          value={formik.values.telephone}
          error={formik.errors.telephone}
          onChange={formik.handleChange}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{marginTop :2}}>
        <SelectBox
          label="Account Type"
          id="accountType"
          options={ACCOUNT_TYPE_OPTIONS}
          value={formik.values.accountType}
          error={formik.errors.accountType}
          onChange={formik.handleChange}
        />
      </Grid>
     
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="PIN No."
          id="pinNo"
          value={formik.values.pinNo}
          error={formik.errors.pinNo}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="VAT No."
          id="vatNo"
          value={formik.values.vatNo}
          error={formik.errors.vatNo}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Address 1."
          id="add1"
          value={formik.values.add1}
          error={formik.errors.add1}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Address 2."
          id="add2"
          value={formik.values.add2}
          error={formik.errors.add2}
          
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Address 3."
          id="add3"
          value={formik.values.add3}
          error={formik.errors.add3}
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
          label="Bank Name"
          id="bankName"
          value={formik.values.bankName}
          error={formik.errors.bankName}
          
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Email Id "
          id="emailId"
          value={formik.values.emailId}
          error={formik.errors.emailId}
          onChange={formik.handleChange}
        />
      </Grid>
      
      {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
        <SelectBox
          label="Payment Type"
          id="paymentType"
          options={PAYMENTTYPE_OPTIONS}
          value={formik.values.paymentType}
          error={formik.errors.paymentType}
          onChange={formik.handleChange}
        />
      </Grid> */}

<RadioGroup
  id="paymentType"
  name="paymentType" // add name attribute here
  value={formik.values.paymentType}
  onChange={formik.handleChange}
  row
>
  <FormControlLabel value="cash" control={<Radio />} label="Cash" />
  <FormControlLabel value="credit" control={<Radio />} label="Credit" />
 
</RadioGroup>



      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Credit Days"
          id="creditDays"
          value={formik.values.creditDays}
          error={formik.errors.creditDays}
          onChange={formik.handleChange}
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Credit Amount"
          id="creditAmount"
          value={formik.values.creditAmount}
          error={formik.errors.creditAmount}
          
          onChange={formik.handleChange}
        />
      </Grid>


      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Zip Code"
          id="zipCode"
          value={formik.values.zipCode}
          error={formik.errors.zipCode}
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
        <InputBox
          label="City"
          id="city"
          value={formik.values.city}
          error={formik.errors.city}
          
          onChange={formik.handleChange}
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
          label="Contact Person"
          id="contactPerson"
          value={formik.values.contactPerson}
          error={formik.errors.contactPerson}
          
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{marginTop :2}}>
            <SelectBox
              label="Status"
              id="status"
              options={USER_STATUS_OPTIONS}
              value={formik.values.status}
              error={formik.errors.status}
              onChange={formik.handleChange}
            />
      </Grid>
      
      <Grid item xs={12}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
          <ThemeTabs
            tabData={[
              { label: "Tariff", value: "1", disable: false },
              { label: "Email", value: "2", disable: false },
            
            ]}
          >
            <AddMapping formik={formik}/>
            <FileScreen formik ={formik}/>
          </ThemeTabs>
        </Box>
      </Grid>
      
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
         
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


