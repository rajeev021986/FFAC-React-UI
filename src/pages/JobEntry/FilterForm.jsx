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
  const inputs = useSelector((state) => state?.codeJobEntryrSelector?.formData);
  const formik = useFormik({
    initialValues: inputs || {
      customerName: inputs?.customerName || "",
      invoiceNo: inputs?.invoiceNo || "",
      customerRefNo: inputs?.customerRefNo || "",
      tansadNo: inputs?.tansadNo || "",
      entryNo: inputs?.entryNo || "",
      mblNo: inputs?.mblNo || "",
      hblNo: inputs?.hblNo || "",
      statusCode: inputs?.statusCode || "",
      isDoc: inputs?.isDoc || "",
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
        customerRefNo: "",
        entryNo: "",
        mblNo: "",
        tansadNo: "",
        invoiceNo: "",
        hblNo: "",
        statusCode: "",
        isDoc: "",
      })
    );
    formik.setValues({
      customerName: "",
      customerRefNo: "",
      entryNo: "",
      mblNo: "",
      tansadNo: "",
      invoiceNo: "",
      hblNo: "",
      statusCode: "",
      isDoc: "",
    });
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
    { value: 0, label: "New & Pen Doc" },
    { value: -1, label: "Rejected" },
    { value: -3, label: "Cancel" },
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
            label="Customer Reference No."
            id="customerRefNo"
            value={formik.values.customerRefNo}
            onChange={formik.handleChange}
          />
            <InputBox
            label="Entry No."
            id="entryNo"
            value={formik.values.entryNo}
            onChange={formik.handleChange}
          />
           <InputBox
            label="MBL No."
            id="mblNo"
            value={formik.values.mblNo}
            onChange={formik.handleChange}
          />
      
        </Stack>

        <Stack direction="row" spacing={2}>

            <InputBox
            label="Customer Name"
            id="customerName"
            value={formik.values.customerName}
            onChange={formik.handleChange}
          />
              <InputBox
            label="Job No."
            id="jobNo"
            value={formik.values.jobNo}
            onChange={formik.handleChange}
          />

          <InputBox
            label="Tansad No."
            id="tansadNo"
            value={formik.values.tansadNo}
            onChange={formik.handleChange}
          />
          {/* <InputBox
            label="Invoice No."
            id="invoiceNo"
            value={formik.values.invoiceNo}
            onChange={formik.handleChange}
          /> */}
        </Stack>

        {/* <Stack direction="row" spacing={2}>
          <InputBox
            label="HBL No."
            id="hblNo"
            value={formik.values.hblNo}
            onChange={formik.handleChange}
          />
        </Stack> */}

        <Stack
          direction="row"
          spacing={2}
          // sx={{
          //   width: "99.7%",
          //   justifyContent: "space-between",
          // }}
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
