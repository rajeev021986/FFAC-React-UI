import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import InputBox from "../../../common/InputBox";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-hot-toast";
import { GridDeleteIcon } from "@mui/x-data-grid";
import SelectBox from "../../../common/SelectBox";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import getFirstError from "../../../common/FieldToastError";
import { useGetOptionsSettingsQuery } from "../../../../store/api/settingsApi";

export default function ChargeInputs({
  formik,
  ChargeSettingsData,
  type,
  loading,
  nav,
}) {
  const newRowRef = useRef(null);
const vatApplicableOptions = [
    { label: "Yes", value: "YES" },
    { label: "No", value: "NO" },
  ];
  const [value, setValue] = React.useState("1");
  const FieldRef = useRef(null);
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("charge_settings");
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} lg={4}>
          <SelectBox
            label="Charge For *"
            id="chargeFor"
            options={optionsSettingsData?.body?.chargeFor || []}
            value={formik.values.chargeFor}
            error={formik.errors.chargeFor}
            onChange={formik.handleChange}
            inputRef={FieldRef}
          />
        </Grid>
        <Grid item xs={12} lg={8}>
          <InputBox
            label="Charge Name*"
            id="chargeName"
            value={formik.values.chargeName}
            error={formik.errors.chargeName}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <InputBox
            label="Charge Code"
            id="chargeCode"
            value={formik.values.chargeCode}
            error={formik.errors.chargeCode}
            onChange={formik.handleChange}
          />
        </Grid>
        {type == "add" &&
        formik.values.statusCode != -2 &&
        formik.values.statusCode != 1 ? (
          <Grid item xs={12} lg={4}>
            <InputBox
              label="Status"
              id="status"
              value={formik.values.status}
              error={formik.errors.status}
              onChange={formik.handleChange}
              disabled={true}
            />
          </Grid>
        ) : (
          <Grid item xs={12} lg={4}>
            <SelectBox
              label="Status"
              id="status"
              options={ChargeSettingsData?.body.status}
              value={formik.values.status}
              error={formik.errors.status}
              onChange={formik.handleChange}
            />
          </Grid>
        )}
        <Grid item xs={12} lg={4}>
          <InputBox
            label="Mapped Charge"
            id="mappedCharge"
            value={formik.values.mappedCharge}
            error={formik.errors.mappedCharge}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <SelectBox
            label="VAT Applicable"
            id="vatApplicable"
            options={vatApplicableOptions}
            value={formik.values.vatApplicable}
            error={formik.errors.vatApplicable}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <InputBox
            label="Charge Details"
            id="chargeDetails"
            value={formik.values.chargeDetails}
            error={formik.errors.chargeDetails}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} lg={8}></Grid>
        <Grid item xs={2}>
          <OutlinedButton
            onClick={() => nav("/app/admin/charges")}
            fullWidth
            sx={{ fontWeight: 500 }}
          >
            Cancel
          </OutlinedButton>
        </Grid>

        <Grid item xs={2}>
          <ThemeButton
            onClick={async () => {
              const errors = await formik.validateForm();

              if (Object.keys(errors).length > 0) {
                formik.setTouched(
                  Object.fromEntries(
                    Object.keys(errors).map((key) => [key, true])
                  ),
                  true
                );
                getFirstError(errors);
              } else {
                formik.handleSubmit();
              }
            }}
            fullWidth
            sx={{ fontWeight: 500 }}
          >
            {loading && <CircularProgress size={20} color="white" />}{" "}
            {type == "add" ? "Add" : "Update"}
          </ThemeButton>
        </Grid>
      </Grid>
    </>
  );
}
