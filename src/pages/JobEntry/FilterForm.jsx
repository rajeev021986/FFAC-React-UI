import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { OutlinedButton } from "../../components/common/Button";
import { updateInput } from "../../store/freatures/JobEntrySlice";
import InputBox from "../../components/common/InputBox";
import SelectBox from "../../components/common/SelectBox";

export default function FilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.codeCustomer.formData);

  const formik = useFormik({
    initialValues: inputs || {
      customerName: inputs.customerName || "",
      tinNo: inputs.tinNo || "",
      customerRefNo: inputs.customerRefNo || "",
      statusCode: inputs.statusCode || "",
      isDoc: inputs.isDoc || "",
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
        customerName: "",
        tinNo: "",
        vatNo: "",
        statusCode: "",
        isDoc: "",
      })
    );
    formik.setValues({
      customerName: "",
      tinNo: "",
      vatNo: "",
      statusCode: "",
      isDoc: "",
    });
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
    { value: 0, label: "New & Pen Doc" },
    { value: -1, label: "Rejected" },
  ];
  const documentOptions = [
    { value: false, label: "Pending" },
    { value: true, label: "Available" },
  ];

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Customer Name"
            id="customerName"
            value={formik.values.customerName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="BL No."
            id="tinNo"
            value={formik.values.tinNo}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Tansad No."
            id="vatNo"
            value={formik.values.vatNo}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "65.7%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "48%", marginLeft: "0px" }}>
            <SelectBox
              label="Status"
              id="statusCode"
              options={statusOptions}
              value={formik.values.statusCode}
              onChange={formik.handleChange}
              sx={{ marginLeft: "0px !important" }}
              MenuProps={{
                disablePortal: true,
              }}
            />
          </div>
          <div style={{ width: "48%", marginLeft: "0px" }}>
          <InputBox
            label="Customer Ref"
            id="customerRefNo"
            value={formik.values.customerRefNo}
            onChange={formik.handleChange}
          />

          </div>
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
