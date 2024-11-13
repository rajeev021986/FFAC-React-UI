import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

const CalculationTable = ({ columns, rows,formik, editable }) => {
  const [data, setData] = useState(rows);

  const handleAmountChange = (index, event) => {
    const value = event.target.value; 
    const newData = [...data];  
    const updatedRow = { ...newData[index], extended_price: Number(value) || 0 };
    newData[index] = updatedRow; 
    setData(newData); 
    formik.setFieldValue('serviceInvoiceDetails',newData)
  };

  useEffect(() => {
    setData(rows);
  }, [rows]);

  const calculateTotal = () => {
    const total = data.reduce((sum, row) => {
      return sum + Number(row.extended_price);
    }, 0);
    return total.toFixed(2);
  };

  

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{
            color : 'primary',
            backgroundColor : 'primary.light'
        }}>
          <TableRow>
            {columns?.map((column,idx) => (
              <TableCell key={idx} align={column.align || 'left'} width={column.width}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row, index) => (
            <TableRow key={index}>
              {columns?.map((column) => (
                <TableCell key={column.field} align={column.align || 'left'}>
                  {column.cellType === 'text' && editable 
                  ? (
                    <TextField
                      type="number"
                      value={row[column.field]}
                      onChange={(e) => handleAmountChange(index, e)}
                      variant="standard"
                      fullWidth
                    />
                  ) : (
                    row[column.field]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={columns.length - 1} align="right">
              <Typography variant="subtitle2" fontWeight={"bold"}>Total</Typography>
            </TableCell>
            <TableCell align="right">{calculateTotal()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};


export default CalculationTable;

