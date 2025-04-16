import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Link,
} from "@mui/material";
import toast from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import { GridDeleteIcon } from "@mui/x-data-grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { reloadDataHandler } from "../../services/common/DocumentDetails";
import { useEffect } from "react";
import { StyledDataGrid } from "./Grid/styles";
import ApiManager from "../../services/ApiManager";
import CustomToast from "./Toast/CustomToast";
import ExcelViewer from "./FileViewer/ExcelViewer";
import PDFViewer from "./FileViewer/PDFViewer";
import WordViewer from "./FileViewer/WordViewer";
import TextViewer from "./FileViewer/TextViewer";
import ImageViewer from "./FileViewer/ImageViewer";

export default function DocumentDialog({
  // source,
  sourceId,
  customerRefNo,
  job_No,
  handleOpen,
  handleClose,
  ...props
}) {
  const {
    headerContent = "",
    cancelButton = "",
    cancelButtonColor = "",
  } = props;

  const handleDate = (date) => {
    if (!date) {
      return "";
    }

    return date.split("T")[0];
  };

  const deleteRow = (id) => {
    setListData((prev) => prev.filter((row) => row.id !== id));
  };

  const addNewRow = () => {
    const newRow = {
      id: Date.now(), // unique temp ID
      documentType: "",
      fileName: "New Document",
      createdBy: "You",
      createdDate: new Date().toISOString(),
    };
    setListData((prev) => [...prev, newRow]);
  };

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
      field: "fileName",
      headerName: "File Name",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={`${params.value}`} arrow>
          <div>
            <Link
              href="#"
              underline="always"
              style={{ color: "black" }}
              onClick={(event) =>
                handleView(event, params.row.id, params.row.fileName)
              }
            >
              {" "}
              {params.value}
            </Link>
          </div>
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
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0,
      renderHeader: () => (
        <IconButton color="white">
          <AddCircleIcon onClick={addNewRow} />
        </IconButton>
      ),
      renderCell: (params) => (
        <IconButton color="error" onClick={() => deleteRow(params.row.id)}>
          <GridDeleteIcon />
        </IconButton>
      ),
    },
  ];
  const [loader, setLoader] = useState(false);
  const [viewloader, setViewloader] = useState(false);
  const [viewloaderId, setViewLoaderId] = useState();
  const [fileData, setFileDaat] = useState({});
  const [viewDocument, setViewDocument] = useState({});
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [listData, setListData] = useState([]);
  const sourceType = "JOB_DETAIL";
  useEffect(() => {
    if (handleOpen) {
      reloadDataHandler(sourceType, sourceId, setListData, setLoader);
    }
  }, [sourceId]);
  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setViewDocument({});
  };
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
  const handleView = async (event, id, documentType) => {
    setViewloader(true);
    setViewLoaderId(id);
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
      toast.custom(
        <CustomToast message={"Something went wrong!"} toast="error" />,
        {
          closeButton: false,
        }
      );
    }
    setViewloader(false);
  };
  return (
    <>
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
        style={{ overflowY: "hidden" }}
        maxWidth="md"
        fullWidth
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
          {headerContent || `Document for Job No : ${job_No}`}
        </DialogTitle>
        <DialogContent
          sx={{
            fontSize: "1rem",
          }}
        >
          <p>
            Job No : <strong> {job_No}</strong>
          </p>
          <p>Uploaded Document</p>
          <Box style={{ height: "auto" }}>
            <StyledDataGrid
              rows={listData}
              columns={columns}
              pagination={false}
              disableSelectionOnClick
              hideFooterPagination    
            />
          </Box>
        </DialogContent>
        <br />
        <DialogActions
          sx={{
            padding: 0,
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
