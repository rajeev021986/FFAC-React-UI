import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "../../store/freatures/VesselVoyageSlice";
import { Button, Stack } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton } from "../../components/common/Button";

export function VesselVoyageFilters() {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.vesselVoyageStore.formData);

  const formik = useFormik({
    initialValues: {
      lname: inputs.vvoyage || "",
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
        vvoyage: "",
        status: "",
      })
    );
  };

  return (
    <div>
      <Stack spacing={3} direction="column" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <InputBox
            label="Vessel Voyage"
            id="vvoyage"
            value={formik.values.vvoyage}
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
