import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import InputBox from '../../../common/InputBox'
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from "@mui/icons-material/Add";
import { toast } from 'react-hot-toast';
import { GridDeleteIcon } from '@mui/x-data-grid';
import SelectBox from '../../../common/SelectBox';
import { OutlinedButton, ThemeButton } from '../../../common/Button';

export default function ChatgeInputs({ formik, ChargeSettingsData, type, nav }) {

    const addNewRow = () => {
        const hasEmptyFields = formik.values.mappingDetails.some((row) =>
            Object.values(row).some((value) => value === '' || value === null || value === undefined)
        );
        if (hasEmptyFields) {
            toast.error("Please fill in all fields before adding a new row.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }
        const newRow = {
            id: Date.now(),
            directExpense: '',
            directIncome: '', new: true
        };
        formik.setFieldValue("mappingDetails", [...formik.values.mappingDetails, newRow]);
    }
    const deleteRow = (id) => {
        const updatedRows = formik.values.mappingDetails.filter((row) => row.id !== id);
        formik.setFieldValue("mappingDetails", updatedRows);
    }
    const handleProcessRowUpdate = (newRow) => {
        const updatedRows = formik.values.mappingDetails.map((row) =>
            row.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("mappingDetails", updatedRows);
        return newRow;
    }
    const columns = [
        {
            field: "directIncome",
            headerName: "Direct Income",
            flex: 1,
            editable: true,
        },
        {
            field: "directExpense",
            headerName: "Direct Expense",
            flex: 1,
            editable: true,
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    color="error"
                    onClick={() => deleteRow(params.row.id)}
                >
                    <GridDeleteIcon />
                </IconButton>
            ),
        },
    ]
    return (
        <>
            <Grid container spacing={2}>
                {type == "copy" || type == "new" ? (<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Status"
                        id="status"
                        value={formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                        disabled={true}
                    />
                </Grid>) : <Grid
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
                        options={ChargeSettingsData?.body.status}
                        value={formik.values.status == "ACTIVE" || formik.values.status == "Active" ? "Active" : formik.values.status}
                        error={formik.errors.status}
                        onChange={formik.handleChange}
                    />
                </Grid>}
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Charge Details"
                        id="chargeDetails"
                        value={formik.values.chargeDetails}
                        error={formik.errors.chargeDetails}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Mode"
                        id="mode"
                        value={formik.values.mode}
                        error={formik.errors.mode}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Charge For"
                        id="chargeFor"
                        value={formik.values.chargeFor}
                        error={formik.errors.chargeFor}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Charge Name"
                        id="chargeName"
                        value={formik.values.chargeName}
                        error={formik.errors.chargeName}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Mapped Charge"
                        id="mappedCharge"
                        value={formik.values.mappedCharge}
                        error={formik.errors.mappedCharge}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="VAT Applicable"
                        id="vatApplicable"
                        value={formik.values.vatApplicable}
                        error={formik.errors.vatApplicable}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <InputBox
                        label="Charge Code"
                        id="chargeCode"
                        value={formik.values.chargeCode}
                        error={formik.errors.chargeCode}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Box sx={{ width: "100%" }} paddingInline={2}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: "reverse",
                            mb: 2,
                        }}
                    >
                        <Typography sx={{ mb: 2 }}>
                            <h2>Mapping Details</h2>
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={addNewRow}
                            sx={{ borderRadius: '17px 18px 18px 17px', margin: '5px' }}
                        >
                            Add Mapping
                        </Button>
                    </Box>
                    <Box sx={{ height: 400 }}>
                        <DataGrid
                            rows={formik.values.mappingDetails}
                            columns={columns.map((column) => ({
                                ...column,
                                headerAlign: 'center',
                            }))}
                            disableSelectionOnClick
                            processRowUpdate={handleProcessRowUpdate}
                            experimentalFeatures={{ newEditingApi: true }}
                            getRowId={(row) => row.id}
                            disableColumnMenu
                        />
                    </Box>
                </Box>
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
        </>
    )
}
