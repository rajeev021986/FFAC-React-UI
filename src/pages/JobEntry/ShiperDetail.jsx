import { Grid } from "@mui/material";
import Box from "@mui/material/Box";

// Components
import InputBox from "../../components/common/InputBox";
import SelectBox from "../../components/common/SelectBox";

// Settng Data
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";

export default function ShipperDetails({ formik }) {
  let disabled = null;
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  return (
    <Box sx={{ width: "100%", typography: "body1", margin: 0, padding: 0 }}>
      <Grid container sx={{ margin: 0, padding: 0, paddingRight: 1 }}>
        <Grid paddingLeft={1} marginTop={2} container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Supplier Name"
              id="supplierName"
              value={formik?.values?.supplierName}
              error={formik?.errors?.supplierName}
              onChange={formik?.handleChange}
              disabled={disabled}
            />
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
            <InputBox
              label="Consignee Name"
              id="consigneeName"
              value={formik.values.consigneeName}
              error={formik.errors.consigneeName}
              onChange={formik.handleChange}
              disabled={disabled}
            />
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

        <Grid paddingLeft={1} marginTop={1} container spacing={2}>
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
