import { useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";

// Components
import InputBox from "../../components/common/InputBox";
import SelectBox from "../../components/common/SelectBox";
import FormAutoComplete from "../../components/common/AutoComplete/FormAutoComplete";

// Settng Data
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";

export default function ShipperDetails({ formik }) {
  let disabled = formik?.values?.statusCode === -3;
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");
  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  return (
    <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
      <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
        <Grid paddingLeft={1} marginTop={0} container spacing={1}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormAutoComplete
              label="Supplier Name"
              id="supplierId"
              suggestionName="name"
              // value={formik.values.supplierId}
              value={{
                supplierId: formik.values.supplierId,
                supplierName: formik.values.supplierName,
              }}
              error={formik.errors.supplierId}
              idKey="supplierId"
              nameKey="supplierName"
              onChange={(selected) => {
                formik.setFieldValue("supplierId", selected.supplierId);
                formik.setFieldValue("supplierName", selected.supplierName);
                formik.setFieldValue(
                  "supplierAddress",
                  selected.formattedAddress || ""
                );
              }}
              inputRef={FieldRef}
              disabled={disabled}
            ></FormAutoComplete>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Supplier Address"
              id="supplierAddress"
              value={formik.values.supplierAddress}
              error={formik.errors.supplierAddress}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormAutoComplete
              label="Consignee Name"
              id="consigneeId"
              suggestionName="consignee_name"
              // value={formik.values.consigneeId}
              value={{
                consigneeId: formik.values.consigneeId,
                consigneeName: formik.values.consigneeName,
              }}
              idKey="consigneeId"
              nameKey="consigneeName"
              error={formik.errors.consigneeId}
              onChange={(selected) => {
                formik.setFieldValue("consigneeId", selected.consigneeId);
                formik.setFieldValue("consigneeName", selected.consigneeName);

                formik.setFieldValue(
                  "consigneeAddress",
                  selected.formattedAddress || ""
                );
              }}
              inputRef={FieldRef}
              disabled={disabled}
            ></FormAutoComplete>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Consignee Address"
              id="consigneeAddress"
              value={formik.values.consigneeAddress}
              error={formik.errors.consigneeAddress}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>
        </Grid>

        <Grid paddingLeft={1} marginTop={1} container spacing={1}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Notify Party Name"
              id="notifyPartyName"
              value={formik.values.notifyPartyName}
              error={formik.errors.notifyPartyName}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Notify Address"
              id="notifyAddress"
              value={formik.values.notifyAddress}
              error={formik.errors.notifyAddress}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <SelectBox
              label="Consignee Status"
              id="shipperStatus"
              options={jobSettingData?.body.shiperStatus}
              value={formik.values.shipperStatus}
              error={formik.errors.shipperStatus}
              onChange={formik.handleChange}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
