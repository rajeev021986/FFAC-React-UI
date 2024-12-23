import React from 'react'
import InputBox from '../../../common/InputBox'
import { Grid, Stack, TextField } from '@mui/material'
import { OutlinedButton, ThemeButton } from '../../../common/Button'
import { useNavigate } from 'react-router-dom';
import SelectBox from '../../../common/SelectBox';

export default function PortValueForm({ formik, type, optionsSettingsData }) {
    const nav = useNavigate();
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="newPortName"
                    id="newPortName"
                    value={formik.values.newPortName}
                    error={formik.errors.newPortName}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="countryName"
                    id="countryName"
                    value={formik.values.countryName}
                    error={formik.errors.countryName}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="Custom Code"
                    id="customCode"
                    value={formik.values.customCode}
                    error={formik.errors.customCode}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="region"
                    id="region"
                    value={formik.values.region}
                    error={formik.errors.region}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid
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
                    options={optionsSettingsData?.body?.status}
                    value={formik.values.status == "ACTIVE" || formik.values.status == "Active" ? "Active" : formik.values.status}
                    error={formik.errors.status}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="basePort"
                    id="basePort"
                    value={formik.values.basePort}
                    error={formik.errors.basePort}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="type"
                    id="type"
                    value={formik.values.type}
                    error={formik.errors.type}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="iotaCode"
                    id="iotaCode"
                    value={formik.values.iotaCode}
                    error={formik.errors.iotaCode}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="unCode"
                    id="unCode"
                    value={formik.values.unCode}
                    error={formik.errors.unCode}
                    onChange={formik.handleChange}
                />
            </Grid>
            <TextField
                id="portDetails"
                name="portDetails"
                label="portDetails"
                variant="outlined"
                multiline
                rows={4}
                value={formik.values.portDetails}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.portDetails && Boolean(formik.errors.portDetails)}
                helperText={formik.touched.portDetails && formik.errors.portDetails}
                fullWidth
                margin="normal"
            />
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
        </Grid>


    )
}
