import React, { useState } from 'react';
import {
    DataGrid,
    GridToolbarColumnsButton,
} from '@mui/x-data-grid';
import { Box, Grid } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { OutlinedButton } from '../../components/common/Button';
import toast from 'react-hot-toast';
import { GridToolbar } from '@mui/x-data-grid';

export default function GlobalDrrpdownSetting({ value, setvalue, title }) {

    const handleCellEdit = (params, event) => {
        const { id, field } = params;
        setvalue(prevStatus =>
            prevStatus.map(row =>
                row.id === id ? { ...row, [field]: event.target?.value } : row
            )
        );
    };

    const handleAddRow = () => {
        if (value.some(item => item.value.includes('Type the'))) {
            toast.error("Please complete the newly added field first");
            return;
        }

        const newId = value.length ? Math.max(...value.map(item => item.id)) + 1 : 1;
        setvalue(prevStatus => [...prevStatus, {
            id: newId,
            value: `Type the option`
        }]);
    };

    const handleDeleteRow = (id) => {
        setvalue(prevStatus => prevStatus.filter(item => item.id !== id));
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'value',
            headerName: 'Status',
            width: 150,
            editable: true,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <DeleteIcon
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => handleDeleteRow(params.id)}
                />
            ),
        }
    ];

    return (
        <Grid item xs={12} md={4} sm={6}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "50px" }}>
                <h3>{title}</h3> {/* Dynamic title here */}
                <OutlinedButton color="primary" size="small" onClick={handleAddRow}>
                    Add
                </OutlinedButton>
            </div>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={value}
                    columns={columns}
                    onCellEditStop={(params, event) => handleCellEdit(params, event)}
                    sx={{
                        backgroundColor: "white.main",
                        '& .MuiDataGrid-main': { overflow: 'auto' }
                    }}
                    disableRowSelectionOnClick
                    autoHeight={false}
                    hideFooter
                    slots={{
                        toolbar: () => (
                            <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
                                <GridToolbarColumnsButton />
                            </Box>
                        )
                    }}
                // components={{
                //     Toolbar: () => (
                //       <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
                //         <GridToolbarColumnsButton />
                //       </Box>
                //     ),
                //   }}
                />
            </div>
        </Grid>
    );
}
