import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "../../store/freatures/VesselSlice";
import { Button, Stack } from "@mui/material";
import InputBox from "../../components/common/InputBox";
import { OutlinedButton } from "../../components/common/Button";
import SelectBox from "../../components/common/SelectBox";

export function VesselFilters({ setFilterOpen }) {
  const dispatch = useDispatch();
  const inputs = useSelector((state) => state.vesselStore.formData);

  const formik = useFormik({
    initialValues: {
      lname: inputs.lname || "",
      vname: inputs.vname || "",
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
        vname: "",
        lname: "",
        statusCode: "",
      })
    );
    formik.setValues({
      vname: "",
      lname: "",
      statusCode: "",
    });
  };

  const statusOptions = [
    { value: 1, label: "Active" },
    { value: -2, label: "InActive" },
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
