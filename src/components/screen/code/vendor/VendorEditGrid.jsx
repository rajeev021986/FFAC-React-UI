import React from "react";
import { Box, Button, colors, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AutoCompleteInput from "../../../common/AutoCompletInput";
import ApiManager from "../../../../services/ApiManager";
import AddCircleIcon from '@mui/icons-material/AddCircle';
export default function VendorEditGrid({ formik, disabled, vendorSettingsData }) {
    const fetchSuggestions = async (inputValue, inputId) => {
        inputId =
            inputId === "chargeName"
                ? "CHARGE" : "CURRENCY"
        if (!inputValue) return [];

        const response = await ApiManager.fetchVesselSuggestions(
            inputValue,
            inputId
        );
        const data = await response.body;

        return data || [];
    };

    const TabsHosts = [
        {
            tabLable: "Tariffs",
            value: formik.values.vendorEntityTariffs || [],
            addNewRow: () => {
                const hasEmptyFields = TabsHosts[0].value.some((row) =>
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
                    id: Date.now(), chargeName: '',
                    type: '',
                    finalDestination: '',
                    unitType: '',
                    currency: '',
                    unitRate: 0, new: true
                };
                formik.setFieldValue("vendorEntityTariffs", [...TabsHosts[0].value, newRow]);
            },
            deleteRow: (id) => {
                const updatedRows = TabsHosts[0].value.filter((row) => row.id !== id);
                formik.setFieldValue("vendorEntityTariffs", updatedRows);
            },
            handleProcessRowUpdate: (newRow, oldRow) => {
                const updatedRows = TabsHosts[0].value.map((row) =>
                    row.id === newRow.id ? { ...row, ...newRow } : row
                );
                formik.setFieldValue("vendorEntityTariffs", updatedRows);
                return newRow;
            },
            columns: [
                {
                    field: "chargeName",
                    headerName: "chargeName",
                    flex: 2,
                    renderCell: (params) => {
                        return (
                            <AutoCompleteInput
                                id="chargeName"
                                suggestionName="charge_name"
                                value={params.value}
                                error={
                                    formik.errors.vendorEntityTariffs?.[params.rowIndex]?.chargeName
                                }
                                onChange={(newValue) => {
                                    const rowIndex = formik.values.vendorEntityTariffs.findIndex(
                                        (entity) => entity.id === params.id
                                    );
                                    // setTimeout(() => {
                                    formik.setValues({ ...formik.values, vendorEntityTariffs: formik.values.vendorEntityTariffs.map((entity, index) => index === rowIndex ? { ...entity, chargeName: newValue } : entity) });
                                    // }, 1500);
                                }}
                                fetchSuggestions={fetchSuggestions}
                            />
                        );

                    },
                },
                {
                    field: "type",
                    headerName: "Type",
                    flex: 1,
                    editable: !disabled,
                    type: "singleSelect",
                    valueOptions: vendorSettingsData?.body?.tarifType?.map((option) => option.value),
                },
                {
                    field: "finalDestination",
                    headerName: "Final Destination",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "unitType",
                    headerName: "UnitType",
                    flex: 1,
                    editable: !disabled,
                    type: "singleSelect",
                    valueOptions: vendorSettingsData?.body?.unitType?.map((option) => option.value),
                }, {
                    field: "currency",
                    headerName: "Currency",
                    flex: 1,
                    renderCell: (params) => {
                        return (
                            <AutoCompleteInput
                                id="currency"
                                suggestionName="currency_name"
                                value={params.value}
                                error={
                                    formik.errors.vendorEntityTariffs?.[params.rowIndex]?.chargeName
                                }
                                onChange={(newValue) => {
                                    const rowIndex = formik.values.vendorEntityTariffs.findIndex(
                                        (entity) => entity.id === params.id
                                    );
                                    // setTimeout(() => {
                                    formik.setValues({ ...formik.values, vendorEntityTariffs: formik.values.vendorEntityTariffs.map((entity, index) => index === rowIndex ? { ...entity, currency: newValue } : entity) });
                                    // }, 1500);
                                }}
                                fetchSuggestions={fetchSuggestions}
                            />
                        );

                    },
                }, {
                    field: "unitRate",
                    headerName: "UnitRate",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "actions",
                    sortable: false,
                    renderHeader: () => (
                        <IconButton
                            color="primary"
                            onClick={TabsHosts[0].addNewRow}
                        >
                            <AddCircleIcon />
                        </IconButton>
                    ),
                    renderCell: (params) => (
                        <IconButton
                            color="error"
                            onClick={() => TabsHosts[0].deleteRow(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    ),
                },
            ]
        },
        {
            tabLable: "Demurage Tariffs",
            value: formik.values.vendorEntityDemurageTariffs || [
                {
                    id: 0,
                    country: '',
                    containerType: '',
                    firstWeek: '',
                    secondWeek: '',
                    thirdWeek: '',
                    new: true
                },
            ],
            addNewRow: () => {
                const hasEmptyFields = TabsHosts[1].value.some((row) =>
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
                    country: '',
                    containerType: '',
                    firstWeek: '',
                    secondWeek: '',
                    thirdWeek: '',
                    new: true
                };
                formik.setFieldValue("vendorEntityDemurageTariffs", [...TabsHosts[1].value, newRow]);
            },
            deleteRow: (id) => {
                const updatedRows = TabsHosts[1].value.filter((row) => row.id !== id);
                formik.setFieldValue("vendorEntityDemurageTariffs", updatedRows);
            },
            handleProcessRowUpdate: (newRow, oldRow) => {
                const updatedRows = TabsHosts[1].value.map((row) =>
                    row.id === newRow.id ? { ...row, ...newRow } : row
                );
                formik.setFieldValue("vendorEntityDemurageTariffs", updatedRows);
                return newRow;
            },
            columns: [
                {
                    field: "country",
                    headerName: "country",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "containerType",
                    headerName: "containerType",
                    flex: 1,
                    editable: !disabled,
                    type: "singleSelect",
                    valueOptions: vendorSettingsData?.body?.container?.map((option) => option.value),
                },
                {
                    field: "firstWeek",
                    headerName: "firstWeek",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "secondWeek",
                    headerName: "secondWeek",
                    flex: 1,
                    editable: !disabled,
                }, {
                    field: "thirdWeek",
                    headerName: "thirdWeek",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "actions",
                    headerName: "Actions",
                    sortable: false,
                    renderHeader: () => (
                        <IconButton color="primary">
                            <AddCircleIcon onClick={TabsHosts[1].addNewRow} />
                        </IconButton>),
                    renderCell: (params) => (
                        <IconButton
                            color="error"
                            onClick={() => TabsHosts[1].deleteRow(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    ),
                },
            ]
        },
        {
            tabLable: "FreeDays",
            value: formik.values.vendorEntityFreeDays || [],
            addNewRow: () => {
                const hasEmptyFields = TabsHosts[2].value.some((row) =>
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
                    country: '',
                    noOfFreeDays: 0,
                    new: true
                };
                formik.setFieldValue("vendorEntityFreeDays", [...TabsHosts[2].value, newRow]);
            },
            deleteRow: (id) => {
                const updatedRows = TabsHosts[2].value.filter((row) => row.id !== id);
                formik.setFieldValue("vendorEntityFreeDays", updatedRows);
            },
            handleProcessRowUpdate: (newRow, oldRow) => {
                const updatedRows = TabsHosts[2].value.map((row) =>
                    row.id === newRow.id ? { ...row, ...newRow } : row
                );
                formik.setFieldValue("vendorEntityFreeDays", updatedRows);
                return newRow;
            },
            columns: [
                {
                    field: "country",
                    headerName: "country",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "noOfFreeDays",
                    headerName: "noOfFreeDays",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "actions",
                    headerName: "Actions",
                    sortable: false,
                    renderHeader: () => (
                        <IconButton color="primary">
                            <AddCircleIcon onClick={TabsHosts[2].addNewRow} />
                        </IconButton>),
                    renderCell: (params) => (
                        <IconButton
                            color="error"
                            onClick={() => TabsHosts[2].deleteRow(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    ),
                },
            ]
        },
        {
            tabLable: "Emails",
            value: formik.values.vendorEntityEmails || [],
            addNewRow: () => {
                const hasEmptyFields = TabsHosts[3].value.some((row) =>
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
                    designation: '',
                    emailId: 0,
                    new: true
                };
                formik.setFieldValue("vendorEntityEmails", [...TabsHosts[3].value, newRow]);
            },
            deleteRow: (id) => {
                const updatedRows = TabsHosts[3].value.filter((row) => row.id !== id);
                formik.setFieldValue("vendorEntityEmails", updatedRows);
            },
            handleProcessRowUpdate: (newRow, oldRow) => {
                const updatedRows = TabsHosts[3].value.map((row) =>
                    row.id === newRow.id ? { ...row, ...newRow } : row
                );
                formik.setFieldValue("vendorEntityEmails", updatedRows);
                return newRow;
            },
            columns: [
                {
                    field: "designation",
                    headerName: "Designation",
                    cellStyle: { color: "red" },
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "emailId",
                    headerName: "Email",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "actions",
                    headerName: "Actions",
                    sortable: false,
                    renderHeader: () => (
                        <IconButton color="primary">
                            <AddCircleIcon onClick={TabsHosts[3].addNewRow} />
                        </IconButton>),
                    renderCell: (params) => (
                        <IconButton
                            color="error"
                            onClick={() => TabsHosts[3].deleteRow(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    ),
                },
            ]
        },
        {
            tabLable: "Bank Details",
            value: formik.values.vendorBankDetails || [],
            addNewRow: () => {
                const hasEmptyFields = TabsHosts[4].value.some((row) =>
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
                    bankName: '',
                    bankAddress: '',
                    currency: '',
                    swiftCode: '',
                    vendorId: 0,
                    new: true
                };
                formik.setFieldValue("vendorBankDetails", [...TabsHosts[4].value, newRow]);
            },
            deleteRow: (id) => {
                const updatedRows = TabsHosts[4].value.filter((row) => row.id !== id);
                formik.setFieldValue("vendorBankDetails", updatedRows);
            },
            handleProcessRowUpdate: (newRow, oldRow) => {
                const updatedRows = TabsHosts[4].value.map((row) =>
                    row.id === newRow.id ? { ...row, ...newRow } : row
                );
                formik.setFieldValue("vendorBankDetails", updatedRows);
                return newRow;
            },
            columns: [
                {
                    field: "bankName",
                    headerName: "Bank Name",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "bankAddress",
                    headerName: "Bank Address",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "currency",
                    headerName: "Currency",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "swiftCode",
                    headerName: "SWIFT Code",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "actions",
                    headerName: "Actions",
                    sortable: false,
                    renderHeader: () => (
                        <IconButton color="primary">
                            <AddCircleIcon onClick={TabsHosts[4].addNewRow} />
                        </IconButton>),
                    renderCell: (params) => (
                        <IconButton
                            color="error"
                            onClick={() => TabsHosts[4].deleteRow(params.row.id)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    ),
                },
            ]
        }
    ]
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ width: "100%", marginTop: 2 }}>

            <Box sx={{
                width: '100%', typography: 'body1', borderBottom: 1,
                border: "1px solid",
                borderColor: "divider",
                marginBottom: 2,
                borderRadius: '10px',
            }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            {TabsHosts.map((value, index) => <Tab label={value.tabLable} value={index} />)}
                        </TabList>
                    </Box>
                    {TabsHosts.map((ob, index) =>
                        <TabPanel value={index} sx={{ padding: 0, marginTop: 2 }}>
                            <Box sx={{ width: "100%" }}>
                                {/* <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: "row-reverse",
                                        mb: 2,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={ob.addNewRow}
                                        sx={{ borderRadius: '17px 18px 18px 17px', margin: '5px' }}
                                    >
                                        Add {ob.tabLable}
                                    </Button>
                                </Box> */}
                                <Box sx={{ height: 400 }}>
                                    <DataGrid
                                        rows={ob.value}
                                        columns={ob.columns.map((column) => ({
                                            ...column,
                                            headerAlign: 'center',
                                            align: 'center',
                                        }))}
                                        disableSelectionOnClick
                                        processRowUpdate={ob.handleProcessRowUpdate}
                                        experimentalFeatures={{ newEditingApi: true }}
                                        getRowId={(row) => row.id}
                                        disableColumnMenu
                                    />
                                </Box>
                            </Box>
                        </TabPanel>
                    )}
                </TabContext>
            </Box>
        </Box>
    );
}
