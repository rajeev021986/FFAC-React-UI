import React, { useRef } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Tab,
  Modal,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import InputBoxForGrid from "../../../common/InputBoxForGrid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { StyledDataGrid } from "../../../common/Grid/styles";
import InputBoxForGridTab from "../../../common/InputBoxForGridTab";
import DateTimeField from "../../../common/DateTime/DateTimeField";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import UploadFile from "../../../UploadFile";

export default function BondEditGrid({ formik, disabled }) {
  const [value, setValue] = React.useState(0);
  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [currentRowId, setCurrentRowId] = React.useState(null);
  const handleOpenUploadModal = (rowId) => {
    setCurrentRowId(rowId);
    setOpenUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setCurrentRowId(null);
    setOpenUploadModal(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };
  const newRowRef = useRef(null);
  const setFocus = () => {
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.focus();
      }
    }, 1000);
  };
  const TabsHosts = [
    {
      tabLabel: "Bond Purchase Details",
      value: formik.values.bondPurchaseDetailsEntities || [],
      addNewRow: () => {
        const hasEmptyFields = TabsHosts[0].value.some((row) =>
          Object.values(row).some(
            (value) => value === "" || value === null || value === undefined
          )
        );

        if (false) {
          toast.error("Please fill in all fields before adding a new row.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          return;
        }

        const newRow = {
          id: Date.now(),
          policyNo: "",
          date: "",
          amount: "",
          validUpToDate: "",
          new: true,
        };

        formik.setFieldValue("bondPurchaseDetailsEntities", [
          ...TabsHosts[0].value,
          newRow,
        ]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[0].value.filter((row) => row.id !== id);
        formik.setFieldValue("bondPurchaseDetailsEntities", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts[0].value.map((row) =>
          row.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("bondPurchaseDetailsEntities", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "policyNo",
          headerName: "Policy No",
          flex: 1,
          headerAlign: "center",
          editable: false,
          renderCell: (params) => {
            return (
              <InputBoxForGridTab
                value={params.value}
                field={params.field}
                id={params.id}
                formik={formik}
                api={params.api}
                arrayName="bondPurchaseDetailsEntities"
                inputRef={newRowRef}
              />
            );
          },
        },
        {
          field: "date",
          headerName: "Date",
          flex: 1,
          headerAlign: "center",
          editable: false,
          renderCell: (params) => {
            return (
              <div style={{ paddingTop: "5px" }}>
                <DateTimeField
                  value={params.value}
                  onChange={(_, value) => {
                    const updatedBondPurchaseDetails =
                      formik.values.bondPurchaseDetailsEntities.map((a) => {
                        if (a.id === params.id) {
                          return { ...a, date: value };
                        }
                        return a;
                      });
                    formik.setFieldValue(
                      "bondPurchaseDetailsEntities",
                      updatedBondPurchaseDetails
                    );
                  }}
                />
              </div>
            );
          },
        },
        {
          field: "amount",
          headerName: "Amount",
          flex: 1,
          headerAlign: "center",
          editable: false,
          renderCell: (params) => {
            return (
              <InputBoxForGridTab
                value={params.value}
                field={params.field}
                id={params.id}
                formik={formik}
                api={params.api}
                arrayName="bondPurchaseDetailsEntities"
                type="number"
              />
            );
          },
        },
        {
          field: "validUpToDate",
          headerName: "Valid Up To Date",
          flex: 1,
          headerAlign: "center",
          editable: false,
          renderCell: (params) => {
            return (
              <div style={{ paddingTop: "5px" }}>
                <DateTimeField
                  value={params.value}
                  onChange={(_, value) => {
                    const updatedBondPurchaseDetails =
                      formik.values.bondPurchaseDetailsEntities.map((a) => {
                        if (a.id === params.id) {
                          return { ...a, validUpToDate: value };
                        }
                        return a;
                      });
                    formik.setFieldValue(
                      "bondPurchaseDetailsEntities",
                      updatedBondPurchaseDetails
                    );
                  }}
                />
              </div>

              // <InputBoxForGridTab
              //   value={params.value}
              //   field={params.field}
              //   id={params.id}
              //   formik={formik}
              //   api={params.api}
              //   arrayName="bondPurchaseDetailsEntities"
              //   type="datetime-local"
              // />
            );
          },
        },
        {
          field: "uploadDocument",
          headerName: "Upload Document",
          flex: 1,
          headerAlign: "center",
          align: "center",
          renderCell: (params) => {
            const row = params.row;
            const isDateAddedRow = row.validUpToDate
            return (
              <Tooltip
                title={
                  isDateAddedRow
                    ? ""
                    : "Please first add the Valid Up to Date to upload document."
                }
              >
                <span>
                  <Button
                    variant="text"
                   onClick={() => isDateAddedRow && handleOpenUploadModal(row?.id)}
                    sx={{ textTransform: "none" }}
                    disabled={!isDateAddedRow}
                  >
                    Upload Document
                  </Button>
                </span>
              </Tooltip>
            );
          },
        },
        

        // {
        //   field: "actions",
        //   headerName: "Actions",
        //   sortable: false,
        //   headerAlign: "center",
        //   renderCell: (params) => (
        //     <Button
        //       color="error"
        //       onClick={() => TabsHosts[0].deleteRow(params.row.id)}
        //     >
        //       Remove
        //     </Button>
        //   ),
        // },
        {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          headerAlign: "center",
          align: "center",
          renderHeader: () => (
            <IconButton color="white">
              <AddCircleIcon onClick={TabsHosts[0].addNewRow} />
            </IconButton>
          ),
          renderCell: (params) => (
            <IconButton
              color="error"
              onClick={() => TabsHosts[0].deleteRow(params.row.id)}
            >
              <GridDeleteIcon />
            </IconButton>
          ),
        },
      ],
    },
  ];
  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      <Box
        sx={{
          width: "100%",
          typography: "body1",
          borderBottom: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "10px",
        }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {TabsHosts.map((value, index) => (
                <Tab
                  sx={{ textTransform: "capitalize" }}
                  label={value.tabLabel}
                  value={index}
                  className="nested1"
                />
              ))}
            </TabList>
          </Box>
          {TabsHosts.map((ob, index) => (
            <TabPanel value={index} sx={{ padding: 0, marginTop: 2 }}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ height: 400 }}>
                  <StyledDataGrid
                    rows={ob.value}
                    columns={ob.columns.map((column) => ({
                      ...column,
                      headerAlign: "center",
                      align: "center",
                    }))}
                    disableSelectionOnClick
                    processRowUpdate={ob.handleProcessRowUpdate}
                    experimentalFeatures={{ newEditingApi: true }}
                    getRowId={(row) => row.id}
                    disableColumnMenu
                  />
                </Box>
              </Box>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
      <Modal open={openUploadModal} onClose={handleCloseUploadModal}>
        <Box sx={style}>
          <Button
            onClick={handleCloseUploadModal}
            sx={{
              position: "absolute",
              top: 10,
              right: 8,
              color: "red",
              backgroundColor: "transparent",
            }}
          >
            <CloseIcon color="red" />
          </Button>
          <UploadFile
            customer_id={currentRowId}
            isNotShowType={true}
            sourceType={"BOND_POLICY"}
            type={"POLICY"}
            disabled={disabled}

          />
        </Box>
      </Modal>
    </Box>

    // <Box sx={{ width: "100%", marginTop: 2 }}>
    //   <Box sx={{ width: "100%", typography: "body1" }}>
    //     {TabsHosts.map((ob, index) => (
    //       <Box sx={{ width: "100%" }} key={index}>
    //         {/* <Box
    //           sx={{
    //             display: "flex",
    //             justifyContent: "space-between",
    //             alignItems: "center",
    //             flexDirection: "row-reverse",
    //             mb: 2,
    //           }}
    //         >
    //           <Button
    //             variant="contained"
    //             startIcon={<AddIcon />}
    //             onClick={ob.addNewRow}
    //             sx={{ borderRadius: "17px 18px 18px 17px", margin: "5px" }}
    //           >
    //             Add {ob.tabLabel}
    //           </Button>
    //         </Box> */}
    //         <Box sx={{ height: 400 }}>
    //           <StyledDataGrid
    //             rows={ob.value}
    //             columns={ob.columns}
    //             disableSelectionOnClick
    //             processRowUpdate={ob.handleProcessRowUpdate}
    //             experimentalFeatures={{ newEditingApi: true }}
    //             getRowId={(row) => row.id}
    //             disableColumnMenu
    //           />
    //         </Box>
    //       </Box>
    //     ))}
    //   </Box>
    // </Box>
  );
}
