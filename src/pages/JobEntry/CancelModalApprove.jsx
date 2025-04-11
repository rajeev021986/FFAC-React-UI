import React, { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { LoaderIcon } from "react-hot-toast";

export default function CancelModalApprove({
  source,
  sourceName,
  handleOpen,
  handleClose,
  handleCancel,
  ...props
}) {
  const {
    headerContent = "",
    showName = true,
    content = "",
    cancelButton = "",
    confirmationButton = "",
    cancelButtonColor = "",
    confirmationButtonColor = "",
    confirmationButtonBackground = "",
  } = props;
  const [loader, setLoader] = useState(false);
  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          padding: 2,
          borderRadius: 4,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "primary.main",
          borderBottom: "1px solid #ddd",
          pb: 2,
        }}
      >
        {headerContent || `Are you sure you want to change the status of  ${sourceName}?`}
      </DialogTitle>
    <br/>
    <br/>
      <DialogActions
        sx={{
          padding: 0,
          marginX: 5,
          justifyContent: "end",
        }}
      >
        <Button
          onClick={handleClose}
          color="primary"
          variant="outlined"
          sx={{
            minWidth: 100,
            borderRadius: 50,
            color: cancelButtonColor || "primary.main",
          }}
        >
          {cancelButton || "Close"}
        </Button>
        <Button
          onClick={async () => {
            setLoader(true);
            try {
              await handleCancel();
            } finally {
              setLoader(false);
            }
          }}
          variant="contained"
          sx={{
            minWidth: 100,
            borderRadius: 50,
            color: confirmationButtonColor || "white",
          }}
        >
        Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
