import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';

const BasicTable = ({ columns, rows }) => {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  return (
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 650 }} size="small" stickyHeader aria-label="reusable table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell sx={{backgroundColor: "background.light", color : "text.primary"}} key={column.field} align={column.headerAlign || 'center'}>
                <TableSortLabel
                  active={sortField === column.field}
                  direction={sortField === column.field ? sortDirection : 'asc'}
                  onClick={() => handleSort(column.field)}
                  hideSortIcon={!(sortField === column.field)}
                >
                  {column.headerName}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.field} align={column.align || 'center'}>
                  {column.renderCell ? column.renderCell(row[column.field]) : row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
