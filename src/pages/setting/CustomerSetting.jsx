import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import { Alert, Button, Grid, Snackbar, TextField, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { OutlinedButton } from "../../components/common/Button";
import { useAddOptonsMutation, useGetOptionsSettingsQuery } from "../../store/api/settingsApi";

const CustomerSetting = () => {
    const [backendData, setBackendData] = useState({ unitType: [], creditDays: [], });
    const [addOptons, { isloading }] = useAddOptonsMutation();
    const { data, isLoading, error: geterror } = useGetOptionsSettingsQuery("customer_settings");
    const [errorType, setErrorType] = useState();

    const [editRowIds, setEditRowIds] = useState({
        unitType: null,
        creditDays: null,
    });
    const [editData, setEditData] = useState({});
    const [error, setError] = useState("");


    const handleCloseSnackbar = () => setError("");

    const handleEditClick = (row, type) => {
        setEditRowIds((prev) => ({ ...prev, [type]: row.id }));
        setEditData(row);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };
    useEffect(() => {
        if (data) {
            setBackendData(data.body);
            setCounter({
                unitType: data.body?.unitType.length + 1,
                creditDays: data.body?.creditDays.length + 1,
            })
        }
    }, [data, geterror]);
    const [counter, setCounter] = useState({
        unitType: backendData.unitType.length + 1,
        creditDays: backendData.creditDays.length + 1,
    });
    const handleSaveClick = (id, type) => {
        // Check for duplicate value
        const isDuplicate = backendData[type].some(
            (item) => item.value === editData.value && item.id !== id
        );

        if (isDuplicate) {
            setError(`Value already exists.`);
            setErrorType("error")
            setEditRowIds((prev) => ({ ...prev, [type]: null }));
            setEditData({});
            return; // Prevent saving
        }

        // Save changes if no duplicate
        setBackendData((prev) => ({
            ...prev,
            [type]: prev[type].map((item) =>
                item.id === id ? { ...item, value: editData.value, label: editData.label || editData.value } : item
            ),
        }));
        setEditRowIds((prev) => ({ ...prev, [type]: null }));
        setEditData({});
    };

    const handleCancelClick = (type) => {
        setEditRowIds((prev) => ({ ...prev, [type]: null }));
        setEditData({});
    };

    const handleDeleteClick = (id, type) => {
        setBackendData((prev) => ({
            ...prev,
            [type]: prev[type].filter((item) => item.id !== id),
        }));
    };

    const handleAddRow = (type) => {
        const newRow = { id: counter[type], label: "", value: "" };
        setBackendData((prev) => ({
            ...prev,
            [type]: [...prev[type], newRow],
        }));
        setEditRowIds((prev) => ({ ...prev, [type]: counter[type] }));
        setEditData(newRow);
        setCounter((prev) => ({
            ...prev,
            [type]: prev[type] + 1,
        }));
    };


    const Postdata = async () => {
        const filteredData = Object.keys(backendData).reduce((acc, key) => {
            if (Array.isArray(backendData[key])) {
                const filteredArray = backendData[key].filter(
                    (item) => item.value.trim() !== ""
                );
                if (filteredArray.length > 0) {
                    acc[key] = filteredArray;
                }
            } else if (key === "approval_request" && backendData[key] !== undefined) {
                acc[key] = backendData[key];
            }
            return acc;
        }, {});
        await addOptons({ body: { customer_settings: filteredData }, type: "customer_setting" }).then((res) => { setError(`setting Updated Successufully`); setErrorType("success") }).catch(() => console.log("filteredData"))
       
    };

    const createColumns = (type) => [
        {
            field: "value",
            headerName: "Value",
            width: 320,
            renderCell: (params) =>
                editRowIds[type] === params.row.id ? (
                    <TextField
                        name="value"
                        value={editData.value || ""}
                        onChange={handleInputChange}
                        size="small"
                    />
                ) : (
                    params.value
                ),
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            width: 320,
            getActions: (params) => {
                const isEditing = editRowIds[type] === params.row.id;
                return isEditing
                    ? [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            onClick={() => handleSaveClick(params.row.id, type)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            onClick={() => handleCancelClick(type)}
                        />,
                    ]
                    : [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            onClick={() => handleEditClick(params.row, type)}
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={() => handleDeleteClick(params.row.id, type)}
                        />,
                    ];
            },
        },
    ];

    const renderGrid = (title, dataKey) => (
        <Grid item xs={12} md={6} sm={6}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "50px" }}>
                <h3>{title}</h3>
                <OutlinedButton color="primary" size="small" onClick={() => handleAddRow(dataKey)}>
                    Add
                </OutlinedButton>
            </div>
            <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                    rows={backendData[dataKey]}
                    columns={createColumns(dataKey)}
                    disableRowSelectionOnClick
                    pagination={false}  // Disable pagination
                    // pageSize={backendData[dataKey]?.length}  // Show all rows without pagination
                    components={{
                        Pagination: () => null, // Hide the pagination component
                    }}
                    autoPageSize
                    sx={{backgroundColor:"white.main"}}
                />
            </div>
        </Grid>
    );

    return (
        <div style={{ padding: "1rem" }}>
            {/* Radio button to handle Approval Req */}
            <Grid xs={12} sx={{ marginBottom: "10px" }} ><Typography variant="h4">Customer Setting</Typography></Grid>
            {/* <Grid sx={{ marginBottom: "10px" }} >
                <RadioGroup
                    value={backendData?.approval_request ?"true":"false"}
                    onChange={(e) =>
                        setBackendData({
                            ...backendData,
                            approval_request: e.target.value === "true",
                        })
                    }
                    row
                >
                    <FormControlLabel value="true" control={<Radio />} label="Approval Request" />
                    <FormControlLabel value="false" control={<Radio />} label="No Approval Request" />
                </RadioGroup>
            </Grid> */}

            {/* Render the Grids */}
            <Grid container spacing={2} flexWrap={"wrap"}>
                {renderGrid("Unit Type", "unitType")}
                {renderGrid("Credit Days", "creditDays")}
            </Grid>

            {/* Save Button */}
            <Grid style={{ width: "100%", display: "flex", flexDirection: "row-reverse", marginTop: "10px" }}>
                <OutlinedButton color="primary" size="small" onClick={Postdata}>
                    Save
                </OutlinedButton>
            </Grid>

            {/* Snackbar for error handling */}
            <Snackbar open={!!error} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={errorType}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CustomerSetting;
