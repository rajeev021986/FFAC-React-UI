import { Button, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updateVendorInput } from "../../../../store/freatures/vendorSlice";

export default function VendorFilterForm() {
    const dispatch = useDispatch();
    const inputs = useSelector((state) => state.vendor.formData);

    const formik = useFormik({
        initialValues: {
            tinNo: inputs.tinNo || "",
            vendorName: inputs.vendorName || "",
            vrnNo: inputs.country || "",
        },
        onSubmit: (values) => {
            dispatch(updateVendorInput(values));
        },
    });
    const handleReset = () => {
        formik.resetForm();
        dispatch(
            updateVendorInput({
                tinNo: "",
                vendorName: "",
                vrnNo: "",
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
                        label="vendor Name"
                        id="vendorName"
                        value={formik.values.vendorName}
                        onChange={formik.handleChange}
                    />
                    <InputBox
                        label="Tin No"
                        id="tinNo"
                        value={formik.values.tinNo}
                        onChange={formik.handleChange}
                    />
                    <InputBox
                        label="Vrn No"
                        id="vrnNo"
                        value={formik.values.vrnNo}
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
