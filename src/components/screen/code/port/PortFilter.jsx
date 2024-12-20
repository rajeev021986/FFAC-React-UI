import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updatePortInput } from "../../../../store/freatures/portSlice";

export default function PortFilterForm() {
    const dispatch = useDispatch();
    const inputs = useSelector((state) => state.port.formData);

    const formik = useFormik({
        initialValues: {
            portName: inputs.portName || "",
            city: inputs.city || "",
            country: inputs.country || "",
        },
        onSubmit: (values) => {
            dispatch(updatePortInput(values));
        },
    });
    const handleReset = () => {
        formik.resetForm();
        dispatch(
            updatePortInput({
                portName: "",
                city: "",
                country: "",
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
                        label="Port Name"
                        id="portName"
                        value={formik.values.portName}
                        onChange={formik.handleChange}
                    />
                    <InputBox
                        label="City"
                        id="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                    />
                    <InputBox
                        label="Country"
                        id="country"
                        value={formik.values.country}
                        onChange={formik.handleChange}
                    />
                </Stack>
                <Stack direction="row" spacing={3} justifyContent={"end"}>
                    <Button color="primary" size="small" onClick={handleReset} sx={{ borderRadius: '12px' }}>
                        reset
                    </Button>
                    <OutlinedButton
                        color="primary"
                        size="small"
                        onClick={formik.handleSubmit}
                        sx={{ borderRadius: '12px' }}
                    >
                        apply
                    </OutlinedButton>
                </Stack>
            </Stack>
        </div>
    );
}
