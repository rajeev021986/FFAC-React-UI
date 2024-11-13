import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const PopupAlert = ({ alertConfig }) => {
  const {
    open,
    title,
    message,
    severity,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
  } = alertConfig;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {/* <DialogTitle id="alert-dialog-title">{title}</DialogTitle> */}
      <DialogContent sx={{padding : 0}} >
        <Alert severity={severity}>
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupAlert;
