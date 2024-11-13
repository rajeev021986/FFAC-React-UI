import React, { useMemo, useState, useRef } from 'react';
import {
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import { getCoreRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/table-core';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Paper,
} from '@mui/material';

// Global filter component for searching
function GlobalFilter({ globalFilter, setGlobalFilter }) {
  return (
    <TextField
      label="Search"
      value={globalFilter || ''}
      onChange={(e) => setGlobalFilter(e.target.value || undefined)}
      variant="outlined"
      margin="normal"
      fullWidth
    />
  );
}

const VirtualGrid = ({ columns, data }) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const parentRef = useRef();

  // Memoizing columns and data
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  // Set up the TanStack React Table
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Virtualization logic
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length, // total rows in the dataset
    getScrollElement: () => parentRef.current, // reference to the container
    estimateSize: () => 60, // approximate height of each row
    overscan: 10, // number of rows to render before and after the visible ones for smoother scrolling
  });

  return (
    <TableContainer component={Paper} ref={parentRef} style={{ height: 600, overflow: 'auto' }}>
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

      <Table stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id} sx={{textAlign : "center",minWidth: header.column.columnDef.size,maxWidth : header.column.columnDef.size}}>
                  {header.isPlaceholder ? null : (
                    <TableSortLabel
                      active={header.column.getIsSorted() !== false}
                      direction={header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`, // Total height of all rows
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <TableRow key={row.id} style={{ position: 'absolute', top: virtualRow.start }}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} sx={{textAlign : "center", minWidth : cell.column.columnDef.size, maxWidth : cell.column.columnDef.size, verticalAlign: 'middle'}}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </div>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VirtualGrid;
