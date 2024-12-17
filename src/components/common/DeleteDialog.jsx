import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

export default function DeleteDialog({ modal, handleClose, handleDelete }) {
  return (
    <Dialog
      open={modal.open && modal.type === 'delete'}
      onClose={handleClose}
      aria-labelledby="delete-vendor-title"
      aria-describedby="delete-vendor-description"
    >
      <DialogTitle id="delete-vendor-title">`Delete ${modal?.data?.who}`</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Are you sure you want to delete the {modal?.data?.who}{" "}
          <strong>{modal.data.deleteName || 'this vendor'}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
