import {
  Autocomplete,
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
  downloadIntgater,
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
              <Autocomplete
                id="documentType"
                name="documentType"
                value={formData.documentType}
                size="small"
                onChange={(event, newValue) => {
                  setFormData((p) => ({ ...p, documentType: newValue }));
                }}
                inputValue={formData.documentType}
                onInputChange={(event, newValue) => {
                  setFormData((p) => ({ ...p, documentType: newValue }));
                }}
                error={!!formErrors.documentType}
                helperText={formErrors.documentType}
                options={dropdownData?.map((a) => a.value) || []}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Document Type"
                    name="documentType"
                    variant="outlined"
                    error={!!formErrors.documentType}
                    helperText={formErrors.documentType}
                  />
                )}
              />
            </Grid>
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
              downloadIntgater();
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
