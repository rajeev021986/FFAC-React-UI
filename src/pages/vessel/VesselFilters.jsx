import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "../../store/freatures/VesselSlice";
import { Button, Stack } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton } from "../../components/common/Button";

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
    formik.resetForm();
    dispatch(
      updateInput({
        vname: "",
        lname: "",
        status: "",
      })
    );
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        {/* <InputBox
                  label="Code"
                  id="acode"
                  value={formik.values.acode}
                  onChange={formik.handleChange}
                /> */}
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
          />
          <InputBox
            label="Status"
            id="status"
            value={formik.values.status}
            onChange={formik.handleChange}
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
