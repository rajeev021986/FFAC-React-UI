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

  const columns = [
    {
      field: "documentType",
      headerName: "Document Name",
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
    if(handleOpen){
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
    console.log("documentType", documentType);
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
        style={{overflowY: "hidden" }}
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
          {headerContent || `Job detail for referenceNo : ${customerRefNo? customerRefNo : '-'}`}
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
              pageSize={20}
              disableSelectionOnClick
            />
            {listData.length === 0 && <p> No Rows Found</p>}
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
