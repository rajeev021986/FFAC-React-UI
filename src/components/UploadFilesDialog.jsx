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
import DeleteDialog from "./common/DeleteDialog";

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
  setFormData,
}) {
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
            <Grid item xs={12}>
              <SelectBox
                label="Document Type"
                id="documentType"
                options={dropdownData}
                value={formData.documentType}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value !== "Other") {
                    setFormData((prev) => ({
                      ...prev,
                      other: null,
                    }));
                  }
                }}
                error={!!formErrors.documentType}
                helperText={formErrors.documentType}
              />
            </Grid>
            {formData.documentType == "Other" && (
              <Grid item xs={12}>
                <TextField
                  label="Other"
                  id="other"
                  name="other"
                  value={formData.other}
                  onChange={handleInputChange}
                  error={formErrors.other}
                  helperText={formErrors.other}
                  fullWidth
                  size="small"
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
      <DeleteDialog
        source="file"
        sourceName={deleteData.fileName}
        handleClose={onCloseConfiramtion}
        handleDelete={onDelete}
        handleOpen={openConfirmation}
      />
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
