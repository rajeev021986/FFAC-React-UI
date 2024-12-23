import { Grid, Stack } from '@mui/material'
import React from 'react'
import InputBox from '../../../common/InputBox'
import BondFilterForm from './BondFilterForm'
import BondEditGrid from './BondGrid'
import SelectBox from '../../../common/SelectBox'
import { OutlinedButton, ThemeButton } from '../../../common/Button'
import { useNavigate } from 'react-router-dom'

export default function BondValue({ formik, optionsSettingsData,type }) {
    const nav = useNavigate();
    console.log(optionsSettingsData, "optionsSettingsData")
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="bondNumber"
                    id="bondNumber"
                    value={formik.values.bondNumber}
                    error={formik.errors.bondNumber}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="bondType"
                    id="bondType"
                    value={formik.values.bondType}
                    error={formik.errors.bondType}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <InputBox
                    label="openingBalance"
                    id="openingBalance"
                    value={formik.values.openingBalance}
                    error={formik.errors.openingBalance}
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
                    label="remark"
                    id="remark"
                    value={formik.values.remark}
                    error={formik.errors.remark}
                    onChange={formik.handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <BondEditGrid formik={formik} disabled={false} />
            </Grid>
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
