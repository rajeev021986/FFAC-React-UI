import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import SelectBox from "./common/SelectBox";
import ExcelViewer from "./common/FileViewer/ExcelViewer";
import ImageViewer from "./common/FileViewer/ImageViewer";
import PDFViewer from "./common/FileViewer/PDFViewer";
import WordViewer from "./common/FileViewer/WordViewer";
import TextViewer from "./common/FileViewer/TextViewer";

export default function UploadFilesDialog({
  dialogOpen,
  handleDialogClose,
  dropdownData,
  formData,
  handleInputChange,
  formErrors,
  sourceType,
  handleDialogSave,
  openConfirmation,
  onCloseConfiramtion,
  deleteData,
  onDelete,
  viewDialogOpen,
  handleViewDialogClose,
  viewDocument,
  fileData,
}) {
  const [typeField, setTypeField] = useState(false);
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            File Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {typeField ? (
              <Grid item xs={12}>
                <TextField
                  label="Document Type"
                  id="documentType"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  error={!!formErrors.documentType}
                  fullWidth
                  size="small"
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <SelectBox
                  label="Document Type"
                  id="documentType"
                  options={[
                    ...(Array.isArray(dropdownData) ? dropdownData : []),
                    { value: "Other" },
                  ]}
                  value={formData.documentType}
                  onChange={(e) => {
                    handleInputChange(e);
                    if (e.target.value == "Other") {
                      setTypeField(true);
                    }
                  }}
                  error={!!formErrors.documentType}
                  helperText={formErrors.documentType}
                />
              </Grid>
            )}
            {sourceType == "CUSTOMER" && (
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  fullWidth
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
            {sourceType == "CUSTOMER" && (
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Number"
                  name="number"
                  fullWidth
                  value={formData.number}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
            {sourceType == "CUSTOMER" && (
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Expiry Date"
                  name="expiryDate"
                  type="date"
                  fullWidth
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmation}
        onClose={onCloseConfiramtion}
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
          Are you sure you want to delete it?
        </DialogTitle>
        <DialogContent
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontSize: "1rem",
          }}
        >
          <p>
            <strong>{deleteData.fileName}</strong>
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
            onClick={onCloseConfiramtion}
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
            onClick={onDelete}
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
      <Dialog
        open={viewDialogOpen}
        onClose={handleViewDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{viewDocument.documentType}</DialogTitle>
        <DialogContent>
          {fileData.documentType == "XL" && (
            <ExcelViewer
              mimeType={fileData.mimeType}
              base64Data={fileData.base64Data}
            />
          )}
          {fileData.documentType == "IMG" && (
            <ImageViewer
              mimeType={fileData.mimeType}
              base64Data={fileData.base64Data}
            />
          )}
          {fileData.documentType == "PDF" && (
            <PDFViewer
              mimeType={fileData.mimeType}
              base64Data={fileData.base64Data}
            />
          )}
          {fileData.documentType == "MSW" && (
            <WordViewer
              mimeType={fileData.mimeType}
              base64Data={fileData.base64Data}
            />
          )}
          {fileData.documentType == "TXT" && (
            <TextViewer
              mimeType={fileData.mimeType}
              base64Data={fileData.base64Data}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose} color="secondary">
            Close
          </Button>
          <Button
            onClick={() => {
              const link = document.createElement("a");
              link.href = viewDocument.url;
              link.download = viewDocument.documentType;
              link.click();
            }}
            color="primary"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
