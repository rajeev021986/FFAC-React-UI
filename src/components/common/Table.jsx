import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

export default function AppTable({
    data,
    columns,
    uniqueId = 'id',
    ...props
}) {
   
    return (
        <DataGrid
            autoHeight 
            rows={data}
            columns={columns}
            hideFooterPagination
            disableRowSelectionOnClick
            disableColumnResize
            disableColumnMenu
            disableColumnSorting
            getRowId={(row) => row[uniqueId]}
            {...props}
        />
    )
}
