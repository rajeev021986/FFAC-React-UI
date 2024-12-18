import { Button, Grid, Stack } from "@mui/material";
import InputBox from "../../../common/InputBox";
import { Typography } from "@mui/material";
import VendorEditGrid from "./VendorEditGrid";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import { useNavigate } from "react-router-dom";
import ApiManager from "../../../../services/ApiManager";
import toast from "react-hot-toast";
import SelectBox from "../../../common/SelectBox";

export default function VendorFormInput({ formik, type, optionsSettingsData }) {
    console.log(type, "typeFd")
    const nav = useNavigate();
    const handleApproveRequest = async () => {
        try {
            const response = await ApiManager.approveCustomerApprove(
                formik.values.id,
                "Vendor"
            );
            nav(-1);
            toast.success("Approved");
        } catch (error) {
            toast.error("Error");
        }
    };
    const handleRejectRequest = async () => {
        try {
            const response = await ApiManager.rejectCustomerApprove(
                formik.values.id,
                "Vendor"
            );
            nav(-1);
            toast.success("Rejected");
        } catch (error) {
            toast.error("Error");
        }
    };
    const getFirstError = (errors) => {
        for (const key in errors) {
            if (Array.isArray(errors[key])) {
                for (const item of errors[key]) {
                    const nestedError = getFirstError(item);
                    if (nestedError) return nestedError;
                }
            } else if (typeof errors[key] === "object") {
                const nestedError = getFirstError(errors[key]);
                if (nestedError) return nestedError;
            } else {
                return errors[key];
            }
        }
        return null;
    };

    const currentError = getFirstError(formik.errors);
    const disable = type == "Approve"
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Vendor Name"
                        id="vendorName"
                        value={formik.values.vendorName}
                        error={formik.errors.vendorName}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Vendor Code"
                        id="vendorCode"
                        value={formik.values.vendorCode}
                        error={formik.errors.vendorCode}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Vendor No"
                        id="vendorNo"
                        value={formik.values.vendorNo}
                        error={formik.errors.vendorNo}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="MLO"
                        id="mlo"
                        value={formik.values.mlo}
                        error={formik.errors.mlo}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                {type == "copy" || type == "new" ? (<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Status"
                        id="status"
                        value={formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                        disabled
                    />
                </Grid>) : (formik.values?.isApproved ? <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
                    sx={{ marginTop: 2 }}
                >
                    <SelectBox
                        label="Status"
                        id="status"
                        disabled={disable}
                        options={optionsSettingsData?.status}
                        value={formik.values.status == "ACTIVE" || formik.values.status == "Active" ? "Active" : formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                    />
                </Grid> : <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Status"
                        id="status"
                        value={formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                        disabled
                    />
                </Grid>)}

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Type"
                        id="type"
                        value={formik.values.type}
                        error={formik.errors.type}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Vendor Creation"
                        id="vendorCreation"
                        value={formik.values.vendorCreation}
                        error={formik.errors.vendorCreation}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Mode"
                        id="mode"
                        value={formik.values.mode}
                        error={formik.errors.mode}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Address"
                        id="address"
                        value={formik.values.address}
                        error={formik.errors.address}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Alia"
                        id="alia"
                        value={formik.values.alia}
                        error={formik.errors.alia}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Bank Name"
                        id="bankName"
                        value={formik.values.bankName}
                        error={formik.errors.bankName}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Bank Address"
                        id="bankAddress"
                        value={formik.values.bankAddress}
                        error={formik.errors.bankAddress}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="USD Account No"
                        id="usdAccountNo"
                        value={formik.values.usdAccountNo}
                        error={formik.errors.usdAccountNo}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="KSH Account No"
                        id="kshAccountNo"
                        value={formik.values.kshAccountNo}
                        error={formik.errors.kshAccountNo}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="SWIFT Code"
                        id="swiftCode"
                        value={formik.values.swiftCode}
                        error={formik.errors.swiftCode}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Telephone 1"
                        id="telephone1"
                        value={formik.values.telephone1}
                        error={formik.errors.telephone1}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Telephone 2"
                        id="telephone2"
                        value={formik.values.telephone2}
                        error={formik.errors.telephone2}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Fax"
                        id="fax"
                        value={formik.values.fax}
                        error={formik.errors.fax}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Email ID"
                        id="emailId"
                        value={formik.values.emailId}
                        error={formik.errors.emailId}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="PIN No"
                        id="pinNo"
                        value={formik.values.pinNo}
                        error={formik.errors.pinNo}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="VRN No"
                        id="vrnNo"
                        value={formik.values.vrnNo}
                        error={formik.errors.vrnNo}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="City"
                        id="city"
                        value={formik.values.city}
                        error={formik.errors.city}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Country"
                        id="country"
                        value={formik.values.country}
                        error={formik.errors.country}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Credit Days"
                        id="creditDays"
                        value={formik.values.creditDays}
                        error={formik.errors.creditDays}
                        onChange={formik.handleChange}
                        disabled={disable}
                    />
                </Grid>
                {currentError && <div style={{ color: "red" }}>{currentError}</div>}
                <Grid item xs={12}>
                    <VendorEditGrid formik={formik} disabled={disable} />
                </Grid>
                {/* <Grid item xs={12}> */}
                {/* <Button onClick={formik.handleSubmit}>{type == "Edit" ? "Update" : "Add"}</Button> */}
                {/* </Grid> */}
                {!disable ? (
                    <Grid item xs={12}>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="space-between"
                        >
                            <Stack direction="row" spacing={2}>
                                <OutlinedButton sx={{ fontWeight: "500" }} onClick={() => nav(-1)}>
                                    Cancel
                                </OutlinedButton>
                                <ThemeButton
                                    onClick={formik.handleSubmit}
                                    sx={{ fontWeight: "500" }}
                                >
                                    {/* {isLoading && (
                                <CircularProgress size={20} color="white" />
                            )}{" "} */}
                                    {type == "Edit" ? "Update" : "Add"}
                                </ThemeButton>
                            </Stack>
                        </Stack>
                    </Grid>
                ) : (
                    <Grid item xs={12}>
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="space-between"
                        >
                            <Stack direction="row" spacing={2}>
                                <OutlinedButton sx={{ fontWeight: "500" }}
                                    onClick={() => nav(-1)}
                                >
                                    Cancel
                                </OutlinedButton>
                                <ThemeButton
                                    sx={{ fontWeight: "500", backgroundColor: "red" }}
                                    onClick={() => handleRejectRequest()}
                                >
                                    {/* {isLoading && (
                                <CircularProgress size={20} color="white" />
                            )}{" "} */}
                                    Approve reject
                                </ThemeButton>
                                <ThemeButton
                                    sx={{ fontWeight: "500" }}
                                    onClick={() => handleApproveRequest()}
                                >
                                    {/* {isLoading && (
                                <CircularProgress size={20} color="white" />
                            )}{" "} */}
                                    Approve request
                                </ThemeButton>
                            </Stack>
                        </Stack>
                    </Grid>
                )}
            </Grid>
        </>
    );
}