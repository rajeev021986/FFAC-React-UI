import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../components/common/InputBox";
import { updateInput } from "../../../store/freatures/receiptsEntrySlice";
import { OutlinedButton } from "../../../components/common/Button";
import { useFormik } from "formik";

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

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
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
            label="REC.AMOUNT"
            id="recAmount"
            value={formik.values.recAmount}
            onChange={formik.handleChange}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <InputBox
            label="currency"
            id="currency"
            value={formik.values.currency}
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
