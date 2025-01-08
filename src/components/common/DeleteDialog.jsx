import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function DeleteDialog({
  source,
  sourceName,
  handleOpen,
  handleClose,
  handleDelete,
}) {
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
        {`Are you sure you want to delete the ${source}?`}
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: "center",
          color: "text.secondary",
          fontSize: "1rem",
        }}
      >
        <p>
          <strong>{sourceName}</strong>
        </p>
        <p>This action cannot be undone.</p>
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
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          sx={{
            minWidth: 100,
            borderRadius: 50,
            backgroundColor: "red",
            color: "white",
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    // <Dialog
    //   open={modal.open && modal.type === "delete"}
    //   onClose={handleClose}
    //   aria-labelledby="delete-vendor-title"
    //   aria-describedby="delete-vendor-description"
    // >
    //   <DialogTitle id="delete-vendor-title">{`Delete ${modal?.data?.who}`}</DialogTitle>
    //   <DialogContent>
    //     <Typography variant="body1">
    //       Are you sure you want to delete the {modal?.data?.who}{" "}
    //       <strong>{modal.data.deleteName || "this vendor"}</strong>?
    //     </Typography>
    //   </DialogContent>
    //   <DialogActions>
    //     <Button onClick={handleClose} color="primary">
    //       Cancel
    //     </Button>
    //     <Button onClick={handleDelete} color="error">
    //       Delete
    //     </Button>
    //   </DialogActions>
    // </Dialog>
  );
}
