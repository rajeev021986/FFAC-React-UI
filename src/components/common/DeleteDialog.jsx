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

export default function DeleteDialog({
  source,
  sourceName,
  handleOpen,
  handleClose,
  handleDelete,
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
        {headerContent || `Are you sure you want to delete the ${source}?`}
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: "center",
          color: "text.secondary",
          fontSize: "1rem",
        }}
      >
        {showName && (
          <p>
            <strong>{sourceName}</strong>
          </p>
        )}
        <p>{content || "This action cannot be undone."}</p>
      </DialogContent>
      <DialogActions
        sx={{
          padding: 0,
          marginX: 5,
          justifyContent: "space-around",
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
              await handleDelete();
            } finally {
              setLoader(false);
            }
          }}
          variant="contained"
          sx={{
            minWidth: 100,
            borderRadius: 50,
            backgroundColor: confirmationButtonBackground || "red",
            color: confirmationButtonColor || "white",
          }}
        >
          {loader ? <LoaderIcon /> : confirmationButton || "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
