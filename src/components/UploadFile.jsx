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
} from "@mui/material";
import { styled } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { CloudDownload, Delete } from "@mui/icons-material";
import moment from "moment";
import Uploadimg from "../assets/images/upload-placeholder.png";
import ApiManager from "../services/ApiManager";
import { useAddAgentMutation, useDownloadDocumnentMutation, useGetCustomerFileListMutation, useUploadCustomerFileMutation } from "../store/api/codeDataApi";
import Loader from "./common/Loader/Loader";
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

const UploadFile = ({ customer_id, disabled }) => {
  // const [uploadCustomerFile, { isLoading }] = useUploadCustomerFileMutation();
  const [uploadCustomerFile] = useUploadCustomerFileMutation();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [deleteData, setDeleteData] = useState({});
  const [listData, setListData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    documentName: "",
    issueDate: "",
    number: "",
    expiryDate: "",
  });

  const handleDownload = async (id, source, sourceId, documentName) => {
    try {
      setLoading(true);
      let source = "CUSTOMER";
      const res = await ApiManager.downloadDocumnent(id, source, sourceId);
      donloadData(res.body.base64, res.body.mimeType, documentName);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      let source = "CUSTOMER";
      setLoading(true);
      const res = await ApiManager.deleteDocument(deleteData.id, deleteData.source, deleteData.sourceId);

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

  const handleDialogSave = async () => {
    const uploadData = {
      file: uploadedFile,
      entityFile: {
        documentName: formData.documentName,
        issueDate: formData.issueDate,
        number: formData.number,
        expiryDate: formData.expiryDate,
        source: "CUSTOMER",
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
    }
  };
  const donloadData = (base64, mimeType, documentName) => {
    try {
      const binaryString = atob(base64);
      const binaryArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryArray[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([binaryArray], { type: mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = documentName;
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };
  const columns = [
    { field: "documentName", headerName: "Document Name", flex: 1 },
    { field: "number", headerName: "Number", flex: 1 },
    {
      field: "modifiedDate",
      headerName: "Issue Date",
      flex: 1,
      renderCell: (params) => (
        <span>{moment(params.value).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      field: "expiredDate",
      headerName: "Expiry Date",
      flex: 1,
      renderCell: (params) => (
        <span>{moment(params.value).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2,
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownload />}
            onClick={() =>
              handleDownload(
                params.row.id,
                params.row.source,
                params.row.sourceId,
                params.row.documentName
              )
            }
          >
            Download
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={() => {
              setDeleteData({
                id: params.row.id,
                source: params.row.source,
                sourceId: params.row.sourceId,
              });
              setOpenConfirmation(true);
            }}
            disabled = {disabled}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    reloadDataHandler();
  }, []);
  const reloadDataHandler = async () => {
    try {
      let source = "CUSTOMER";
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
          <Typography variant="h4" gutterBottom style={{ width: "100%" }}>
            Select Files
          </Typography>
          <Grid item xs={12} sm={4} >
            <Box display="flex" flexDirection="column" height="100%" gap={2} >
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
                  disabled = {disabled}
                />
              </DropZone>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={listData}
                columns={columns}
                pageSize={20}
                // checkboxSelection={checkBox}
                disableSelectionOnClick
              />
            </Box>
          </Grid>

          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>File Details</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Document Name"
                name="documentName"
                fullWidth
                value={formData.documentName}
                onChange={handleInputChange}
              />
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
              <TextField
                margin="dense"
                label="Number"
                name="number"
                fullWidth
                value={formData.number}
                onChange={handleInputChange}
              />
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
          <Dialog open={openConfirmation} onClose={onCloseConfiramtion}>
            <DialogTitle>Are you sure you want to delete it?</DialogTitle>
            <DialogContent>
              <p>This action cannot be undone.</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={onCloseConfiramtion} color="primary">
                Cancel
              </Button>
              <Button onClick={onDelete} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      )}
    </>
  );
};

export default UploadFile;
