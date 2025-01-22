import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../common/InputBox";
import { updateInput } from "../../../store/freatures/userManagementSlice";
import { OutlinedButton } from "../../common/Button";
import { useFormik } from "formik";
import SelectBox from "../../common/SelectBox";

export default function FilterForm({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.userManagement.formData);

  const formik = useFormik({
    initialValues: inputs || {
      userId: inputs.userId || "",
      firstName: inputs.firstName || "",
      lastName: inputs.lastName || "",
      email: inputs.email || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
      setFilterOpen(false);
    },
  });
  const handleReset = () => {
    setFilterOpen(false);
    formik.resetForm();
    dispatch(
      updateInput({
        userid: "",
        firstName: "",
        lastName: "",
        companyname: "",
        email: "",
      })
    );
  };
  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
  ];

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={3}>
          <InputBox
            label="User ID"
            id="userId"
            value={formik.values.userId}
            onChange={formik.handleChange}
          />
          <InputBox
            label="First Name"
            id="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Last Name"
            id="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
          />
        </Stack>
        <Stack direction="row" gap={3}>
          <InputBox
            label="Email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <SelectBox
            label="Status"
            id="statusCode"
            options={statusOptions}
            value={formik.values.statusCode}
            onChange={formik.handleChange}
            MenuProps={{
              disablePortal: true,
            }}
          />
        </Stack>
        {/* <Stack direction="row" spacing={3}>
          <div style={{ width: "48%", marginLeft: "0px" }}>
           
          </div>
        </Stack> */}
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button color="primary" size="small" onClick={handleReset}>
            reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={formik.handleSubmit}
          >
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
