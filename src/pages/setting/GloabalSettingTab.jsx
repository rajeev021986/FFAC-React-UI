import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import { Alert, Button, Grid, Snackbar, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { OutlinedButton } from "../../components/common/Button";
import { useAddOptonsMutation, useGetOptionsSettingsQuery } from "../../store/api/settingsApi";

const GlobalSetting = () => {
    const [backendData, setBackendData] = useState({});
    // const [getOptionsSettings]=useGetOptionsSettingsQuery();
    const [addOptons, { isloading }] = useAddOptonsMutation();
    const { data, isLoading, error: geterror } = useGetOptionsSettingsQuery("common_settings");
    const [errortype,setErrorType]=useState("true");

    useEffect(() => {
        if (data) {
            setBackendData(data.body);
            setCounter({
                status: data.body.status?.length + 1,
                account_type: data.body.account_type?.length + 1,
                shipmentType: data.body.shipmentType?.length + 1,
            })
        }
    }, [data, geterror]);


    const [editRowIds, setEditRowIds] = useState({
        status: null,
        account_type: null,
        shipmentType: null,
    });
    const [editData, setEditData] = useState({});
    const [error, setError] = useState("");
    const [counter, setCounter] = useState({
        status: backendData.status?.length + 1,
        account_type: backendData.account_type?.length + 1,
        shipmentType: backendData.shipmentType?.length + 1,
    });
    const handleCloseSnackbar = () => setError("");

    const handleEditClick = (row, type) => {
        setEditRowIds((prev) => ({ ...prev, [type]: row.id }));
        setEditData(row);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = (id, type) => {
        // Check for duplicate value
        const isDuplicate = backendData[type].some(
            (item) => item.value === editData.value && item.id !== id
        );

        if (isDuplicate) {
            setError(`Value  is alredy exist.`);
            setErrorType("error")
            setEditRowIds((prev) => ({ ...prev, [type]: null }));
            // setEditRowIds((prev)=>({ ...prev }))
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
            const filteredArray = backendData[key].filter(
                (item) => item.value.trim() !== ""
            );
            if (filteredArray.length > 0) {
                acc[key] = filteredArray;
            }
            return acc;
        }, {});
        console.log(filteredData, "filteredData")
        await addOptons({ body: { common_settings: filteredData }, type: "common_settings" }).then((res) =>{setError(`setting Updated Successufully`);setErrorType("success")}).catch(() => console.log("filteredData"))
       
    };
    const createColumns = (type) => [
        {
            field: "value",
            headerName: "Value",
            width: 120,
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
            width: 120,
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
        <Grid item xs={12} md={4} sm={6}>
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
                />
            </div>
        </Grid>
    );

    return (
        <div style={{ padding: "1rem" }}>
            <Grid xs={12} sx={{ marginBottom: "10px" }} ><Typography variant="h4">Global Setting</Typography></Grid>
            <Grid container spacing={2} flexWrap={"wrap"}>
                {renderGrid("Status", "status")}
                {renderGrid("Account Type", "account_type")}
                {renderGrid("Shipment Type", "shipmentType")}
            </Grid>

            <Grid style={{ width: "100%", display: "flex", flexDirection: "row-reverse", marginTop: "10px" }}>
                <OutlinedButton color="primary" size="small" onClick={() => Postdata()}>
                    Save
                </OutlinedButton>
            </Grid>

            <Snackbar open={!!error} autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={errortype}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default GlobalSetting;
