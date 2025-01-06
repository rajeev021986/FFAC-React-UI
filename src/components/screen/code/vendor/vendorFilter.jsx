import { Button, MenuItem, Select, Stack } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InputBox from "../../../common/InputBox";
import { OutlinedButton } from "../../../common/Button";
import { useFormik } from "formik";
import { updateVendorInput } from "../../../../store/freatures/vendorSlice";
import SelectBox from "../../../common/SelectBox";

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
    const StatusOptions = [{ value: "Active" }, { value: "InActive" }, { value: "New" }, { value: "Pendind Doc" }, { value: "Rejected" }];
    const StatusOptionsDoc = [{ value: "Pending" }, { value: "Available" }];
    return (
        <div>
            <Stack
                spacing={4}
                direction="column"
                justifyContent="space-between"
            >
                <Stack direction="row" flexWrap="wrap" justifyContent="space-between" spacing={2} gap={2}>
                    <InputBox
                        label="Vendor Name"
                        id="vendorName"
                        value={formik.values.vendorName}
                        onChange={formik.handleChange}
                        sx={{ width: "48%" }}
                    />
                    <InputBox
                        label="Tin No"
                        id="tinNo"
                        value={formik.values.tinNo}
                        onChange={formik.handleChange}
                        sx={{ width: "48%", marginLeft: "0px !important" }}
                    />
                    <InputBox
                        label="Vrn No"
                        id="vrnNo"
                        value={formik.values.vrnNo}
                        onChange={formik.handleChange}
                        sx={{ width: "48%", marginLeft: "0px !important" }}
                    />
                    <div style={{ width: "48%", marginLeft: "0px" }}>
                        <SelectBox
                            label="Status"
                            id="status"
                            options={StatusOptions}
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            sx={{ marginLeft: "0px !important" }}
                        />
                    </div>
                    <div style={{ width: "48%", marginLeft: "0px" }}>
                        <SelectBox
                            label="Doc Status"
                            id="doc_status"
                            options={StatusOptionsDoc}
                            value={formik.values.doc_status}
                            onChange={formik.handleChange}
                            sx={{ marginLeft: "0px !important" }}
                        />
                    </div>
                </Stack>

                <Stack direction="row" spacing={3} justifyContent="flex-end">
                    <Button
                        color="primary"
                        size="small"
                        onClick={handleReset}
                        sx={{
                            borderRadius: '12px',
                            padding: '6px 16px',
                            textTransform: 'capitalize',
                            backgroundColor: '#f5f5f5',
                            color: '#333',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        }}
                    >
                        Reset
                    </Button>
                    <OutlinedButton
                        color="primary"
                        size="small"
                        onClick={formik.handleSubmit}
                        sx={{
                            borderRadius: '12px',
                            padding: '6px 16px',
                            textTransform: 'capitalize',
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                        }}
                    >
                        Apply
                    </OutlinedButton>
                </Stack>
            </Stack>

        </div>
    );
}
