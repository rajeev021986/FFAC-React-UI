import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Tooltip } from "@mui/material";

function GridTable({ data }) {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            {/* <TableCell><Typography variant="subtitle2">ID</Typography></TableCell> */}
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
              {/* <TableCell>{row.id}</TableCell> */}
              <TableCell>{row.entityName}</TableCell>
              <TableCell>{row.fieldName}</TableCell>

              {/* Tooltip for Old Value with Ellipsis */}
              <TableCell style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Tooltip title={row.oldValue || "No previous value"} arrow>
                  <span>{row.oldValue}</span>
                </Tooltip>
              </TableCell>

              {/* Tooltip for New Value with Ellipsis */}
              <TableCell style={{ maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Tooltip title={row.newValue || "No new value"} arrow>
                  <span>{row.newValue}</span>
                </Tooltip>
              </TableCell>

              <TableCell>{row.modifiedBy || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default GridTable;
