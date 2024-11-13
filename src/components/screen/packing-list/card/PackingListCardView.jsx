import { Box, CircularProgress, TablePagination, Checkbox } from '@mui/material';
import React from 'react';
import PackingListCardItem from './PackingListCardItem';

export default function PackingListCardsView({
  columns,
  count,
  handlePage,
  data,
  paginationModel,
  loading,
  uniqueId,
  actions,
  rowSelectionModel,
  onRowSelectionModelChange, // handle row selection change
  isRowSelectable // if a row is selectable
}) {
  const handleCardPagination = (event, page) => {
    handlePage({
      page: page,
      pageSize: paginationModel.pageSize,
    });
  };

  const handleChangeRowPerPage = (event) => {
    handlePage({
      page: paginationModel.page,
      pageSize: parseInt(event.target.value, 10),
    });
  };

  const handleCardCheckboxChange = (itemId) => (event) => {
    if (event.target.checked) {
      onRowSelectionModelChange([...rowSelectionModel, itemId]);
    } else {
      onRowSelectionModelChange(rowSelectionModel.filter((id) => id !== itemId));
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        borderRadius: '5px',
        height: 'calc(100vh - 250px)',
        overflowY: 'auto',
        position: 'relative',
        pt: 2,
      }}
    >
      {/* Map through data and render each card item with a checkbox */}
      {data?.map((item, index) => {
        const isSelectable = isRowSelectable({ row: item });
        const isChecked = rowSelectionModel.includes(item[uniqueId]);

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            {/* Checkbox for each card */}
            <Checkbox
              checked={isChecked}
              disabled={!isSelectable} // Disable if not selectable
              onChange={handleCardCheckboxChange(item[uniqueId])} // Handle checkbox change
              sx={{ marginRight: 2 }}
            />

            {/* Render the card */}
            <PackingListCardItem
              item={item}
              columns={columns}
              uniqueId={uniqueId}
              actions={actions}
            />
          </Box>
        );
      })}

      {/* Show loading spinner */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      {/* Pagination */}
      <Box sx={styles.pagination}>
        <TablePagination
          component="div"
          count={count || 0}
          page={paginationModel.page}
          onPageChange={handleCardPagination}
          onRowsPerPageChange={handleChangeRowPerPage}
          rowsPerPage={paginationModel.pageSize}
          rowsPerPageOptions={[10, 20, 50, 100]}
          color="primary"
          size="small"
          sx={{ margin: 'auto' }}
        />
      </Box>
    </Box>
  );
}

const styles = {
  pagination: {
    position: 'sticky',
    bottom: -1,
    right: 0,
    backgroundColor: 'white.main',
    borderTop: '1px solid #e0e0e0',
  },
};
