import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

function GridTable({ data }) {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="subtitle2">ID</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Entity Name</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Field Name</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Old Value</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">New Value</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Modified By</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.entityName}</TableCell>
              <TableCell>{row.fieldName}</TableCell>
              <TableCell>{row.oldValue}</TableCell>
              <TableCell>{row.newValue}</TableCell>
              <TableCell>{row.modifiedBy || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default GridTable;
