import { Button, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../components/common/InputBox";
import { updateInput } from "../../../store/freatures/receiptsEntrySlice";
import { OutlinedButton } from "../../../components/common/Button";
import { useFormik } from "formik";
import SelectBox from "../../../components/common/SelectBox";
import ApiManager from "../../../services/ApiManager";
import { useGetOptionsSettingsQuery } from "../../../store/api/settingsApi";
import DateTimeField from "../../../components/common/DateTime/DateTimeField";

export default function FilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.receiptsEntry.formData);
  const formik = useFormik({
    initialValues: inputs || {
      withHoldingTaxRecov: inputs.withHoldingTaxRecov || "",
      recAmount: inputs.recAmount || "",
      currency: inputs.currency || "",
      receivablePartyId: inputs.receivablePartyId || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });

  const handleApply = (event) => {
    setFilterOpen(false);
    formik.handleSubmit(event);
  };

  const handleReset = () => {
    setFilterOpen(false);
    dispatch(
      updateInput({
        withHoldingTaxRecov: "",
        recAmount: "",
        currency: "",
        receivablePartyId: "",
      })
    );
    formik.setValues({
      withHoldingTaxRecov: "",
      recAmount: "",
      currency: "",
      receivablePartyId: "",
    });
  };
  const [mergedCurrencyOptions, setMergedCurrencyOptions] = useState([]);
  const [showDefaultCurrency, setshowDefaultCurrency] = useState("");
  const { data: optionsSettingsData } =
    useGetOptionsSettingsQuery("common_settings");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiManager.fetchAutoCompleteData(
          "",
          "COMPANY_CODE"
        );
        const backendData = await response.body;
        setshowDefaultCurrency(backendData?.[0]);
        // formik.setFieldValue(
        //   "currency",
        //   initialValues?.currency
        //     ? initialValues?.currency
        //     : backendData?.[0].currency
        // );
        const backendCurrencies = Array.from(
          new Set(
            (backendData || []).map((item) => item.currency).filter(Boolean)
          )
        ).map((curr) => ({ id: curr, value: curr }));
        const settingCurrencies = optionsSettingsData?.body?.currencyType || [];
        // Merge both arrays avoiding duplicates (based on `value`)
        const mergedCurrencies = [
          ...backendCurrencies,
          ...settingCurrencies.filter(
            (setting) =>
              !backendCurrencies.some((item) => item.value === setting.value)
          ),
        ];

        setMergedCurrencyOptions(mergedCurrencies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [optionsSettingsData?.body?.currencyType]);
  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          {/* <SelectBox
            label="Currency"
            id="currency"
            options={mergedCurrencyOptions}
            value={formik.values.currency}
            error={formik.errors.currency}
            onChange={(e) => {
              const value = e.target.value;
              formik.setFieldValue("currency", value);
            }}
          /> */}
          <DateTimeField
            name="upTo"
            label="UPTO"
            id="upTo"
            value={formik.values.upTo}
            error={formik.errors.upTo}
            onChange={formik.setFieldValue}
          />

          <InputBox
            label="REC.AMOUNT"
            id="recAmount"
            value={formik.values.recAmount}
            onChange={formik.handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <InputBox
            label="Receipt Party Name"
            id="receivablePartyId"
            value={
              formik.values.receivablePartyName ||
              formik.values.receivablePartyId
            }
            onChange={formik.handleChange}
          />
          <InputBox
            label="WithHolding Tax Recov."
            id="withHoldingTaxRecov"
            value={formik.values.withHoldingTaxRecov}
            error={formik.errors.withHoldingTaxRecov}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button
            color="primary"
            size="small"
            onClick={handleReset}
            sx={{
              borderRadius: "12px",
              padding: "6px 16px",
              textTransform: "capitalize",
              backgroundColor: "#f5f5f5",
              color: "#333",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            Reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={(e) => handleApply(e)}
            sx={{ borderRadius: "12px" }}
          >
            Apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
