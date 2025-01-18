import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "../../store/freatures/VesselVoyageSlice";
import { Button, Stack } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton } from "../../components/common/Button";
import SelectBox from "../../components/common/SelectBox";

export function VesselVoyageFilters({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.vesselVoyageStore.formData);

  const formik = useFormik({
    initialValues: {
      vessel: inputs.vessel || "",
      statusCode: inputs.statusCode || "",
    },
    onSubmit: (values) => {
      dispatch(updateInput(values));
      setFilterOpen(false);
    },
  });
  const handleReset = () => {
    setFilterOpen(false);
    dispatch(
      updateInput({
        vessel: "",
        statusCode: "",
      })
    );
    formik.setValues({
      vessel: "",
      statusCode: "",
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
            label="Vessel"
            id="vessel"
            value={formik.values.vessel}
            onChange={formik.handleChange}
          />
          <SelectBox
            label="Status"
            id="statusCode"
            options={statusOptions}
            value={formik.values.statusCode}
            onChange={formik.handleChange}
            sx={{ marginLeft: "5px !important" }}
            MenuProps={{
              disablePortal: true,
            }}
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
            reset
          </Button>
          <OutlinedButton
            color="primary"
            size="small"
            onClick={formik.handleSubmit}
            sx={{ borderRadius: "12px" }}
          >
            Apply
          </OutlinedButton>
        </Stack>
      </Stack>
    </div>
  );
}
