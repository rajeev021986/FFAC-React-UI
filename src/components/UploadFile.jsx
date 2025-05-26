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
import { margin, styled } from "@mui/system";
import { CloudDownload, Delete, Visibility } from "@mui/icons-material"; // Add Visibility icon
import moment from "moment";
import Uploadimg from "../assets/images/upload-placeholder.png";
import ApiManager from "../services/ApiManager";
import { useUploadCustomerFileMutation } from "../store/api/codeDataApi";
import Loader from "./common/Loader/Loader";
import { StyledDataGrid } from "./common/Grid/styles";
import UploadFilesDialog from "./UploadFilesDialog";
import toast, { LoaderIcon } from "react-hot-toast";
import CustomToast from "./common/Toast/CustomToast";
import { reloadDataHandler } from "../services/common/DocumentDetails";
import { reloadDocumentDataHandler } from "../services/common/DocumentDetails";

// Custom styled drop zone
const DropZone = styled(Box)(({ theme }) => ({
  border: "2px dashed #ccc",
  borderRadius: "8px",
  padding: theme.spacing(4),
  textAlign: "center",
  width: "100%",
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
  disabled = disabled ? disabled : false,
  dropdownData,
  sourceType = null,
  isNotShowType,
  type,
  refetchPayableData,
}) => {
  const [viewloader, setViewloader] = useState(false);
  const [viewloaderId, setViewLoaderId] = useState();
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
  useEffect(() => {
    type == null
      ? reloadDataHandler(sourceType, customer_id, setListData, setLoading)
      : reloadDocumentDataHandler(
          sourceType,
          customer_id,
          type,
          setListData,
          setLoading
        );
  }, []);

  const downloadIntgater = async () => {
    await ApiManager.fileDownloadIntegater(viewloaderId)
      .then((e) =>
        toast.custom(<CustomToast message={e.message} toast="success" />, {
          closeButton: false,
        })
      )
      .catch((e) =>
        toast.custom(<CustomToast message={e.message} toast="error" />, {
          closeButton: false,
        })
      );
  };
  const handleView = async (event, id, source, sourceId, documentType) => {
    setViewloader(true);
    setViewLoaderId(id);
    event.preventDefault();
    try {
      let source = sourceType;
      const res = await ApiManager.downloadDocumnent(id, source, sourceId);
      setFileDaat({
        base64Data: res.body.base64,
        mimeType: res.body.mimeType,
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
      Boolean(res.body.mimeType.includes("text/csv")) &&
        setFileDaat((prev) => ({ ...prev, documentType: "CSV" }));
      Boolean(res.body.mimeType.includes("application/msword")) &&
        setFileDaat((prev) => ({ ...prev, documentType: "WORD" }));
      Boolean(res.body.mimeType.includes("application/vnd.ms-excel")) &&
        setFileDaat((prev) => ({ ...prev, documentType: "EXCEL" }));
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
      toast.custom(
        <CustomToast message={"Something went wrong!"} toast="error" />,
        {
          closeButton: false,
        }
      );
    }
    setViewloader(false);
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
      type == null
        ? reloadDataHandler(sourceType, customer_id, setListData, setLoading)
        : reloadDocumentDataHandler(
            sourceType,
            customer_id,
            type,
            setListData,
            setLoading
          );

      refetchPayableData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFileDrop = (event) => {
    const file = (event.target.files || event.dataTransfer.files)[0];
    if (!file) return;
    const maxFileSize = 10 * 1024 * 1024;
    const invalidExtensions = ["zip", "exe"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (file.size > maxFileSize || invalidExtensions.includes(fileExtension)) {
      return toast.custom(
        <CustomToast
          message={
            file.size > maxFileSize
              ? "File size must be less than 10 MB."
              : `.${fileExtension} files are not allowed.`
          }
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }
    setUploadedFile(file);

    setDialogOpen(isNotShowType == true ? false : true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUploadedFile(null);
    setFormData({});
  };
  const onCloseConfiramtion = () => {
    setOpenConfirmation(false);
  };
  const validateForm = () => {
    const errors = {};
    if (!formData.documentType) {
      errors.documentType = "Document Type is required";
    }
    if (formData.documentType == "Other") {
      if (!formData.other) {
        errors.other = "Other Type is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDialogSave = async () => {
    // if (!validateForm()) {
    //   return;
    // }
    // Validate Issue Date
    const today = new Date();
    const issueDate = new Date(formData.issueDate);
    if (issueDate < today) {
      // Show error toast if the Issue Date is a past date
      toast.custom(<CustomToast message="Issue Date cannot be a past date." />);
      return; // Stop further execution if the date is invalid
    }
    const resolvedDocumentType =
      formData.documentType === "Other"
        ? formData.other
        : type == null
        ? formData.documentType
        : type;
    const isDuplicate = listData?.some(
      (item) =>
        item.fileName?.trim().toLowerCase() ===
          uploadedFile?.name?.trim().toLowerCase() &&
        item.documentType?.trim().toLowerCase() ===
          resolvedDocumentType?.trim().toLowerCase()
    );
    if (isDuplicate) {
      toast.custom(
        <CustomToast
          message={
            "You’ve already uploaded this file under the same document type."
          }
        />
      );
      return;
    }
    const uploadData = {
      file: uploadedFile,
      entityFile: {
        ...formData,
        source: sourceType,
        sourceId: customer_id,
        documentType: resolvedDocumentType,
      },
    };
    try {
      setLoading(true);
      let response = await uploadCustomerFile(uploadData).unwrap();
      setDialogOpen(false);
      if (type !== null && type !== undefined) {
        reloadDocumentDataHandler(
          sourceType,
          customer_id,
          type,
          setListData,
          setLoading
        );
      } else {
        reloadDataHandler(sourceType, customer_id, setListData, setLoading);
      }
      refetchPayableData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setDialogOpen(false);
    }
    setFormData({});
  };

  useEffect(() => {
    if (isNotShowType == true && uploadedFile != null && type !== null) {
      handleDialogSave();
    }
  }, [uploadedFile]);

  const handleDate = (date) => {
    if (!date) {
      return "";
    }

    return date.split("T")[0];
  };

  const cusColumns = [
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
      field: "fileName",
      headerName: "File Name",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={`${params.value}`} arrow>
          <div>{params.value}</div>
        </Tooltip>
      ),
    },

    {
      field: "number",
      headerName: "Number",
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
        <Tooltip title={`${params.value}`} arrow>
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
        <Tooltip title={`${params.value}`} arrow>
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
      renderCell: (params) => {
        return (
          <Tooltip title={`${handleDate(params.value)}`} arrow>
            <div>{handleDate(params.value)}</div>
          </Tooltip>
        );
      },
    },
    {
      field: "issueDate",
      headerName: "Issue Date",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Tooltip title={`${handleDate(params.value)}`} arrow>
            <div>{handleDate(params.value)}</div>
          </Tooltip>
        );
      },
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Tooltip title={`${handleDate(params.value)}`} arrow>
            <div>{handleDate(params.value)}</div>
          </Tooltip>
        );
      },
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
          {viewloader && viewloaderId == params.id ? (
            <LoaderIcon />
          ) : (
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
          )}
          <Delete
            sx={{
              cursor: "pointer",
              color: "red",
            }}
            onClick={() => {
              setDeleteData({
                id: params.row.id,
                source: params.row.source,
                sourceId: params.row.sourceId,
                fileName: params.row.fileName,
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
      renderCell: (params) => {
        return (
          <Tooltip title={`${params.value}`} arrow>
            <div className="word-wrap-cell"> {params.value}</div>
          </Tooltip>
        );
      },
    },
    {
      field: "fileName",
      headerName: "File Name",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Tooltip title={`${params.value}`} arrow>
            <div className="word-wrap-cell"> {params.value}</div>
          </Tooltip>
        );
      },
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
    // {
    //   field: "modifiedBy",
    //   headerName: "Modified By",
    //   flex: 1,
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <Tooltip title={`${params.row.modifiedBy}`} arrow>
    //       <div>{params.value}</div>
    //     </Tooltip>
    //   ),
    // },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 130,
      flex: 1,

      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <Tooltip title={`${handleDate(params.value)}`} arrow>
            <div
              style={{
                marginTop: "42px",
              }}
            >
              {handleDate(params.value)}
            </div>
            ;
          </Tooltip>
        );
      },
    },
    // {
    //   field: "modifiedDate",
    //   headerName: "Modified Date",
    //   width: 130,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params) => {
    //     return (
    //       <Tooltip title={`${handleDate(params.value)}`} arrow>
    //         <div >{handleDate(params.value)}</div>;
    //       </Tooltip>
    //     );
    //   },
    // },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
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
          {viewloader && viewloaderId == params.id ? (
            <LoaderIcon />
          ) : (
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
          )}
          {!disabled && (
            <Delete
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => {
                setDeleteData({
                  id: params.row.id,
                  source: params.row.source,
                  sourceId: params.row.sourceId,
                  fileName: params.row.fileName,
                });
                setOpenConfirmation(true);
              }}
              disabled={disabled}
            />
          )}
        </div>
      ),
    },
  ];

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
        <Grid container>
          {!disabled && (
            <>
              <Grid item xs={12}>
                <Typography variant="h5" sx={{ padding: "10px 15px 5px 15px" }}>
                  Select Files
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    display: "flex",
                    padding: "15px",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <DropZone
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
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
                        style={{
                          textDecoration: "underline",
                          color: "#1976d2",
                        }}
                      >
                        browse
                      </span>{" "}
                      through your machine
                    </Typography>
                    <input
                      id="file-input"
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        handleFileDrop(e);
                        e.target.value = "";
                      }}
                      disabled={disabled}
                    />
                  </DropZone>
                </Box>
              </Grid>
            </>
          )}
          <Grid item xs={12} md={disabled ? 12 : 8}>
            <Box
              style={{
                height: 400,
                width: "100%",
                padding: "15px",
                overflow: "auto",
              }}
            >
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
                hideFooterPagination
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  },
                  "& .MuiDataGrid-cell": {
                    fontSize: { xs: "0.7rem", sm: "0.85rem" },
                  },
                }}
              />
            </Box>
          </Grid>

          <UploadFilesDialog
            dialogOpen={dialogOpen}
            handleDialogClose={handleDialogClose}
            dropdownData={dropdownData}
            formData={formData}
            handleInputChange={handleInputChange}
            formErrors={formErrors}
            sourceType={sourceType}
            handleDialogSave={handleDialogSave}
            openConfirmation={openConfirmation}
            onCloseConfiramtion={onCloseConfiramtion}
            deleteData={deleteData}
            onDelete={onDelete}
            viewDialogOpen={viewDialogOpen}
            handleViewDialogClose={handleViewDialogClose}
            viewDocument={viewDocument}
            fileData={fileData}
            downloadIntgater={downloadIntgater}
            setFormData={setFormData}
          />
        </Grid>
      )}
    </>
  );
};

export default UploadFile;
