import { Box, Card} from '@mui/material'
import React from 'react'
import { FILE_COLUMN } from '../../../data/columns/packing-list'
// import FileData from '../../../data/table-data/file.json'
import { DataGrid } from '@mui/x-data-grid'

export default function FileScreen({ data }) {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const handleClick = (filepath) => {
    let trimmedFilePath = filepath.replace('/home/ubuntu/data/transmodal-backend/public/', '');
    const finalURL = `${baseURL}/${trimmedFilePath}`;
    window.open(finalURL, '_blank');
  };

  return (
    <Box>
      <Card>
        <DataGrid
        autoHeight
        rows={data}
        getRowId={(rows) =>  `${rows.filename}`}
        columns={FILE_COLUMN(handleClick)}
        hideFooterPagination
        disableRowSelectionOnClick
        disableColumnResize
        disableColumnMenu
        disableColumnSorting
      />

      </Card>
    </Box>
  )
}

