import React, { useEffect, useState } from 'react';
import { Box, Card, InputAdornment, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFetchPackingListQuery } from '../../../store/api/packingListDataApi';
import { BOL_CONFIRMSATION_COLUMN } from '../../../data/columns/packing-list';
import { ThemeButton, OutlinedButton } from '../../common/Button';
import InputBox from '../../common/InputBox';
import { useNavigate } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import PopupAlert from '../../common/Alert/PopupAlert';
import { useFormat } from '../../../hooks/useFormat';

export default function AddBolConfirmation({ rowSelectionModel, onClose, view }) {
  const [data, setAddBolModalData] = useState({});
  const navigate = useNavigate();
  const {displayFormat} = useFormat()

  const {
    data: PackingListData,
    isError,
    isLoading,
    error
  } = useFetchPackingListQuery({
    page: '',
    perPage: 1000,
    filter: 'fnl_pl_awt_bl',
    orderBy: ''
  });

  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const [selectedRows, setSelectedRows] = useState(new Set(rowSelectionModel));
  const [searchTerm, setSearchTerm] = useState('');

  const rowsWithId = PackingListData?.data?.map((row, index) => ({
    ...row,
    id: row.packing_list_no || index
  }));

  const filteredRows = rowsWithId?.filter(row =>
    row.packing_list_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRows = filteredRows?.sort((a, b) => {
    const isSelectedA = selectedRows.has(a.id);
    const isSelectedB = selectedRows.has(b.id);
    return isSelectedB - isSelectedA;
  });

  useEffect(() => {
    setSelectedRows(new Set(rowSelectionModel));
  }, [rowSelectionModel, PackingListData]);

  const handleRowSelectionChange = (newSelection) => {
    const newSelectedRows = new Set(selectedRows);
    newSelectedRows.forEach(id => {
      if (!newSelection.includes(id)) {
        newSelectedRows.delete(id);
      }
    });
    newSelection.forEach(id => newSelectedRows.add(id));
    setSelectedRows(newSelectedRows);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleProceed = () => {
    const data = { mode: 'add', packinglistno: Array.from(selectedRows).join('-'), id: null };
    setAddBolModalData(data);
    if (selectedRows.size > 0) {
      navigate('/app/spr/packing_list/bol', { state: data });
    } else {
      setAlertConfig({
        open: true,
        title: "Error",
        message: "Please select at least one PL Number",
        severity: "error",
        onConfirm: () => {
          setAlertConfig({ ...alertConfig, open: false });
        },
        onClose: () => setAlertConfig({ ...alertConfig, open: false }),
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Card sx={{ overflowY: 'auto', borderWidth: 1, borderColor: "border.main" }} mt={view === 'modal' ? 2 : 0}>
      <Box px={2} width={view === 'modal' ? '100%' : '25%'} >
        <InputBox
          placeholder="Search by Packing List No"
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (<InputAdornment position="start">
              <Search color="primary" />
            </InputAdornment>),
          }}
          sx={{
            my: 2, '& .MuiInputBase-root': {
              borderRadius: '25px',
            }
          }}
        />
      </Box>
      <Box sx={{
        height: view === 'modal' ? 400 : 'calc(100vh - 250px)',
      }}>
        <DataGrid
          rows={sortedRows}
          uniqueId="packing_list_no"
          columns={BOL_CONFIRMSATION_COLUMN(displayFormat)}
          hideFooterPagination
          checkboxSelection
          disableRowSelectionOnClick
          hideFooter
          rowSelectionModel={Array.from(selectedRows)}
          loading={isLoading}
          onRowSelectionModelChange={handleRowSelectionChange}
          disableColumnResize
          disableColumnMenu
          disableColumnSorting
        />
      </Box>
      <Box m={1}>
        <Typography variant="subtitle1" color="textSecondary">
          {selectedRows.size > 0
            ? `${Array.from(selectedRows).join(', ')}`
            : ""}
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} display={"flex"} m={1} justifyContent={"end"}>
        <OutlinedButton
          color="primary" size="lg"
          onClick={handleCancel}
        >
          Cancel
        </OutlinedButton>
        <ThemeButton
          color="primary"
          size="lg"
          onClick={handleProceed}
          sx={{ width: 140 }}
        >
          Proceed
        </ThemeButton>
        <PopupAlert alertConfig={alertConfig} />
      </Stack>
    </Card>
  );
}
