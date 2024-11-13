import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { PL_DETAILS_COULUM } from '../../../data/columns/packing-list';
import { useFormat } from '../../../hooks/useFormat';

export default function PLDeatilsTableList({ item }) {
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({
    column1: 0,
    column2: 0,
    column3: 0,
  });
  const {displayFormat} = useFormat()

  useEffect(() => {
    calculateTotals();
  }, [item]);

  const calculateTotals = () => {
    const cardTotals = {
      column1: 0,
      column2: 0,
      column3: 0,
    };

    item?.forEach((row) => {
        const value1 = parseFloat(row.t360volume) || 0;
        const value2 = parseFloat(row.t360weight) || 0;
        const value3 = parseFloat(row.t360qty) || 0;

        cardTotals.column1 += value1;
        cardTotals.column2 += value2;
        cardTotals.column3 += value3;
    });
    cardTotals.column1 = parseFloat(cardTotals.column1.toFixed(3)).toLocaleString();
    cardTotals.column2 = parseFloat(cardTotals.column2.toFixed(3)).toLocaleString();
    cardTotals.column3 = parseFloat(cardTotals.column3.toFixed(3)).toLocaleString();

    setTotals(cardTotals);

    const updatedRows = [
      ...item,
      {
        id: 'totals',
        lineNo: '<b>Total:</b>',
        t360volume: `<b>${cardTotals.column1}</b>`,
        t360weight: `<b>${cardTotals.column2}</b>`,
        t360qty: `<b>${cardTotals.column3}</b>`,
        isTotal: true,
      },
    ];
    setRows(updatedRows);
  };
  const COLUMNS = PL_DETAILS_COULUM(displayFormat)
  const columnsWithBoldTotal = COLUMNS.map((column) => ({
    ...column,
    renderCell: (params) =>
      params.row.isTotal ? (
        <span dangerouslySetInnerHTML={{ __html: params.value }} />
      ) : (
        params.value
      ),
  }));

  return (
    <Stack width="100%" direction="column" pt={2}>
      <DataGrid
        autoHeight
        rows={rows}
        getRowId={(rows) => rows.id || `${rows.lineNo}-${rows.gpcItemNo}`}
        columns={columnsWithBoldTotal}
        hideFooterPagination
        disableRowSelectionOnClick
        disableColumnResize
        disableColumnMenu
        disableColumnSorting
        getRowClassName={(params) => (params.row.isTotal ? 'total-row' : '')}
      />
    </Stack>
  );
}