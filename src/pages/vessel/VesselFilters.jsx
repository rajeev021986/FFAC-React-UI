import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "../../store/freatures/VesselSlice";
import { Button, Stack } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton } from "../../components/common/Button";
import SelectBox from "../../components/common/SelectBox";

export function VesselFilters() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.vesselStore.formData);

  const formik = useFormik({
    initialValues: {
      lname: inputs.lname || "",
      vname: inputs.vname || "",
      status: inputs.status || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
    },
  });
  const handleReset = () => {
    dispatch(
      updateInput({
        vname: "",
        lname: "",
        status: "",
      })
    );
    formik.setValues({
      vname: "",
      lname: "",
      status: "",
    });
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
    { value: 0, label: "Pending" },
  ];

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Vessel Name"
            id="vname"
            value={formik.values.vname}
            onChange={formik.handleChange}
          />
          <InputBox
            label="Line Name"
            id="lname"
            value={formik.values.lname}
            onChange={formik.handleChange}
            sx={{ marginLeft: "5px !important" }}
          />

          <SelectBox
            label="Status"
            id="statusCode"
            options={statusOptions}
            value={formik.values.statusCode}
            onChange={formik.handleChange}
            sx={{ marginLeft: "5px !important" }}
          />
        </Stack>
        <Stack direction="row" spacing={3} justifyContent={"end"}>
          <Button
            color="primary"
            size="small"
            onClick={handleReset}
            sx={{ borderRadius: "12px" }}
          >
            reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={formik.handleSubmit}
            sx={{ borderRadius: "12px" }}
          >
            apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
