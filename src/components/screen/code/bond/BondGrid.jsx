import React from "react";
import { Box, Button, colors, Typography } from "@mui/material";
import { DataGrid, GridEditDateCell } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export default function BondEditGrid({ formik, disabled }) {

    const TabsHosts = [
        {
            tabLable: "Bond Purchase Details",
            value: formik.values.bondPurchaseDetailsEntities || [],
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
                    id: Date.now(),
                    policyNo: '',
                    date: '',
                    amount: '',
                    validUpToDate: '',
                    new: true
                };
                formik.setFieldValue("bondPurchaseDetailsEntities", [...TabsHosts[0].value, newRow]);
            },
            deleteRow: (id) => {
                const updatedRows = TabsHosts[0].value.filter((row) => row.id !== id);
                formik.setFieldValue("bondPurchaseDetailsEntities", updatedRows);
            },
            handleProcessRowUpdate: (newRow, oldRow) => {
                const updatedRows = TabsHosts[0].value.map((row) =>
                    row.id === newRow.id ? { ...row, ...newRow } : row
                );
                formik.setFieldValue("bondPurchaseDetailsEntities", updatedRows);
                return newRow;
            },
            columns: [
                {
                    field: "policyNo",
                    headerName: "policyNo",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "date",
                    headerName: "date",
                    flex: 1,
                    editable: !disabled,
                    renderEditCell: (params) => (
                        <GridEditDateCell {...params} />
                    ),
                },
                {
                    field: "amount",
                    headerName: "amount",
                    flex: 1,
                    editable: !disabled,
                },
                {
                    field: "validUpToDate",
                    headerName: "validUpToDate",
                    flex: 1,
                    editable: !disabled,
                    renderEditCell: (params) => (
                        <GridEditDateCell {...params} />
                    ),
                },
                {
                    field: "actions",
                    headerName: "Actions",
                    sortable: false,
                    renderCell: (params) => (
                        <Button
                            color="error"
                            onClick={() => TabsHosts[0].deleteRow(params.row.id)}
                        >
                            Remove
                        </Button>
                    ),
                },
            ]
        },
    ]
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ width: "100%", marginTop: 2 }}>

            <Box sx={{ width: '100%', typography: 'body1' }}>
                {TabsHosts.map((ob, index) =>
                    <Box sx={{ width: "100%" }} key={index}>
                        <Box
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
                        </Box>
                        <Box sx={{ height: 400 }}>
                            <DataGrid
                                rows={ob.value}
                                columns={ob.columns}
                                disableSelectionOnClick
                                processRowUpdate={ob.handleProcessRowUpdate}
                                experimentalFeatures={{ newEditingApi: true }}
                                getRowId={(row) => row.id}
                                disableColumnMenu
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
