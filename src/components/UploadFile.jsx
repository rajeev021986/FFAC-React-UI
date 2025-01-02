import React, { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { CloudDownload, Delete, Visibility } from "@mui/icons-material"; // Add Visibility icon
import moment from "moment";
import Uploadimg from "../assets/images/upload-placeholder.png";
import ApiManager from "../services/ApiManager";
import {
  useAddAgentMutation,
  useDownloadDocumnentMutation,
  useGetCustomerFileListMutation,
  useUploadCustomerFileMutation,
} from "../store/api/codeDataApi";
import Loader from "./common/Loader/Loader";
import { useGetOptionsSettingsQuery } from "../store/api/settingsApi";
import SelectBox from "./common/SelectBox";
import { appDateFormat } from "./utils/date";
import ExcelViewer from "./common/FileViewer/ExcelViewer";
import ImageViewer from "./common/FileViewer/ImageViewer";
import PDFViewer from "./common/FileViewer/PDFViewer";
import WordViewer from "./common/FileViewer/WordViewer";
import TextViewer from "./common/FileViewer/TextViewer";
import { StyledDataGrid } from "./common/Grid/styles";
// Custom styled drop zone
const DropZone = styled(Box)(({ theme }) => ({
  border: "2px dashed #ccc",
  borderRadius: "8px",
  padding: theme.spacing(4),
  textAlign: "center",
  width: "300px",
  color: theme.palette.primary.main,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  "&:hover": {
    borderColor: theme.palette.primary.main,
  },
}));

const UploadFile = ({
  customer_id,
  disabled = false,
  dropdownData,
  sourceType = null,
}) => {
  const [uploadCustomerFile] = useUploadCustomerFileMutation();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [listData, setListData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewDocument, setViewDocument] = useState({});
  const [fileData, setFileDaat] = useState({});
  const handleView = async (event, id, source, sourceId, documentType) => {
    event.preventDefault();
    try {
      let source = sourceType;
      const res = await ApiManager.downloadDocumnent(id, source, sourceId);
      setFileDaat({
        base64Data: res.body.base64,
        mimeType: res.body.mimeTsype,
      });
      Boolean(res.body.mimeType.includes("spreadsheetml.sheet")) &&
        setFileDaat((prev) => ({ ...prev, documentType: "XL" }));
      Boolean(res.body.mimeType.includes("image")) &&
        setFileDaat((prev) => ({ ...prev, documentType: "IMG" }));
      Boolean(res.body.mimeType.includes("pdf")) &&
        setFileDaat((prev) => ({ ...prev, documentType: "PDF" }));
      Boolean(res.body.mimeType.includes("wordprocessingml")) &&
        setFileDaat((prev) => ({ ...prev, documentType: "MSW" }));
      Boolean(res.body.mimeType.includes("plain")) &&
        setFileDaat((prev) => ({ ...prev, documentType: "TXT" }));
      const binaryString = atob(res.body.base64);
      const binaryArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([binaryArray], { type: res.body.mimeType });
      const url = URL.createObjectURL(blob);
      setViewDocument({ url, documentType });
      setViewDialogOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setViewDocument({});
  };

  const onDelete = async () => {
    try {
      let source = sourceType;
      setLoading(true);
      const res = await ApiManager.deleteDocument(
        deleteData.id,
        deleteData.source,
        deleteData.sourceId
      );

      setOpenConfirmation(false);
      reloadDataHandler();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFileDrop = (event) => {
    const files = event.target.files || event.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setDialogOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUploadedFile(null);
  };
  const onCloseConfiramtion = () => {
    setOpenConfirmation(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.documentType) {
      errors.documentType = "Document Type is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDialogSave = async () => {
    if (!validateForm()) {
      return;
    }
    const uploadData = {
      file: uploadedFile,
      entityFile: {
        ...formData,
        source: sourceType,
        sourceId: customer_id,
      },
    };
    try {
      setLoading(true);
      let response = await uploadCustomerFile(uploadData).unwrap();
      setDialogOpen(false);
      reloadDataHandler();
      setLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
      setDialogOpen(false);
    }
  };
  const cusColumns = [
    {
      field: "documentType",
      headerName: "Type",
      flex: 1,
      headerAlign: "center",
    },
    { field: "number", headerName: "Number", flex: 1, headerAlign: "center" },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <div>{appDateFormat(params.value)}</div>;
      },
    },
    {
      field: "modifiedDate",
      headerName: "Issue Date",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <span>{moment(params.value).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      field: "expiredDate",
      headerName: "Expiry Date",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <span>{moment(params.value).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Visibility
            style={{ cursor: "pointer", color: "#1976d2" }}
            onClick={(event) =>
              handleView(
                event,
                params.row.id,
                params.row.source,
                params.row.sourceId,
                params.row.fileName
              )
            }
          />
          <Delete
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => {
              setDeleteData({
                id: params.row.id,
                source: params.row.source,
                sourceId: params.row.sourceId,
              });
              setOpenConfirmation(true);
            }}
            disabled={disabled}
          />
        </div>
      ),
    },
  ];
  const columns = [
    {
      field: "documentType",
      headerName: "Type",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={`${params.value}`} arrow>
          <div>{params.value}</div>
        </Tooltip>
      ),
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={`${params.row.createdBy}`} arrow>
          <div>{params.value}</div>
        </Tooltip>
      ),
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={`${params.row.modifiedBy}`} arrow>
          <div>{params.value}</div>
        </Tooltip>
      ),
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={`${params.row.createdDate}`} arrow>
          <div>{appDateFormat(params.value)}</div>;
        </Tooltip>
      ),
    },
    {
      field: "modifiedDate",
      headerName: "Modified Date",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Tooltip title={`${params.row.modifiedDate}`} arrow>
          <div>{appDateFormat(params.value)}</div>;
        </Tooltip>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Visibility
            style={{ cursor: "pointer", color: "#1976d2" }}
            onClick={(event) =>
              handleView(
                event,
                params.row.id,
                params.row.source,
                params.row.sourceId,
                params.row.fileName
              )
            }
          />
          <Delete
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => {
              setDeleteData({
                id: params.row.id,
                source: params.row.source,
                sourceId: params.row.sourceId,
              });
              setOpenConfirmation(true);
            }}
            disabled={disabled}
          />
        </div>
      ),
    },
  ];
  useEffect(() => {
    reloadDataHandler();
  }, []);
  const reloadDataHandler = async () => {
    try {
      let source = sourceType;
      setLoading(true);
      const res = await ApiManager.getCustomerFormData(source, customer_id);
      setListData(res.body);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      {loading ? (
        <Grid
          container
          spacing={2}
          display="flex"
          justifyContent="center"
          alignContent="center"
        >
          <Loader />
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Typography
            variant="h5"
            gutterBottom
            style={{ width: "100%", marginLeft: "15px" }}
          >
            Select Files
          </Typography>
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" height="100%" gap={2}>
              <DropZone
                onClick={() => document.getElementById("file-input").click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileDrop(e);
                }}
              >
                <img
                  src={Uploadimg}
                  alt="Upload"
                  style={{ margin: "0 auto" }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 2 }}
                >
                  Drop file here or click to{" "}
                  <span
                    style={{ textDecoration: "underline", color: "#1976d2" }}
                  >
                    browse
                  </span>{" "}
                  through your machine
                </Typography>
                <input
                  id="file-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileDrop}
                  disabled={disabled}
                />
              </DropZone>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box style={{ height: 400, width: "100%" }}>
              <StyledDataGrid
                rows={listData}
                columns={(sourceType === "CUSTOMER" ? cusColumns : columns).map(
                  (a) => ({
                    ...a,
                    align: "center",
                  })
                )}
                pageSize={20}
                disableSelectionOnClick
              />
            </Box>
          </Grid>

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
                    onChange={handleInputChange}
                    error={!!formErrors.documentType}
                    helperText={formErrors.documentType}
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
                mt: 2,
              }}
            >
              <p>This action cannot be undone.</p>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "center",
                pt: 2,
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
                color="secondary"
                variant="contained"
                sx={{
                  minWidth: 100,
                  borderRadius: 50,
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
        </Grid>
      )}
    </>
  );
};

export default UploadFile;
