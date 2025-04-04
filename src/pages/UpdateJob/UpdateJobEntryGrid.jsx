import React, { useRef, useState } from "react";

// MUI
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import DeleteIcon from "@mui/icons-material/Delete";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Skeleton } from "@mui/material";

// Components
import AutoCompleteInput from "../../components/common/AutoCompletInput";
import EditRowDialog from "../../components/common/EditRowDialog";
import InputBoxForGrid from "../../components/common/InputBoxForGrid";
import { StyledDataGrid } from "../../components/common/Grid/styles";
import DateTimeField from "../../components/common/DateTime/DateTimeField";

export default function BondDetailsGridForm({ formik, dropdownData }) {
  const [editDialogData, setEditDialogData] = useState();
  const [openTable, setopenTable] = useState(true);
  const [EditRowDialogopen, setEditRowDialogOpen] = useState(false);

  const newRowRef = useRef(null);
  const setFocus = () => {
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.focus();
      }
    }, 1000);
  };

  const handleClose = () => {
    setEditRowDialogOpen(false);
    setEditDialogData({});
    setopenTable(false);
    setTimeout(() => {
      setopenTable(true);
    }, 10);
  };

  const TabsHosts = [
    {
      tabLable: "Bond Details",
      value: formik?.values?.bondDetails || [],
      addNewRow: () => {
        const newRow = {
          id: Date.now(),
          bondNumber: "",
          balanceBondAmount: "",
          bondAmount: "",
          bondDate: "",
          runningBalance: "",
          new: true,
        };
        formik.setFieldValue("bondDetails", [...TabsHosts[0].value, newRow]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[0]?.value.filter((row) => row.id !== id);
        formik.setFieldValue("bondDetails", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts?.[0]?.value?.map((row) =>
          row?.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("bondDetails", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "bondNumber",
          headerName: "Bond Number",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter Bond Number" />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter Bond Number" />
          ),
        },
        {
          field: "balanceBondAmount",
          headerName: "Balance Bond Amount",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid
              {...params}
              placeholder="Enter Balance Bond Amount"
            />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid
              {...params}
              placeholder="Enter Balance Bond Amount"
            />
          ),
        },
        {
          field: "bondAmount",
          headerName: "Bond Amount",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter Bond Amount" />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter Bond Amount" />
          ),
        },
        {
          field: "bondDate",
          headerName: "Bond Date",
          flex: 1,
          renderCell: (params) => (
            <DateTimeField
              value={params.value}
              onChange={(_, value) => {
                const updatedDischargeDate = formik.values.bondDetails.map(
                  (a) => {
                    if (a.id === params.id) {
                      return { ...a, bondDate: value };
                    }
                    return a;
                  }
                );
                formik.setFieldValue("bondDetails", updatedDischargeDate);
              }}
            />
          ),
        },
        {
          field: "runningBalance",
          headerName: "Running Balance",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter Running Balance" />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter Running Balance" />
          ),
        },
        {
          field: "actions",
          sortable: false,
          flex: 0,
          renderHeader: () => (
            <IconButton color="white" onClick={TabsHosts[0].addNewRow}>
              <AddCircleIcon />
            </IconButton>
          ),
          renderCell: (params) => (
            <IconButton
              color="error"
              onClick={() => TabsHosts[0].deleteRow(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      ],
    },
  ];

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
              {TabsHosts?.map((value, index) => (
                <Tab
                  sx={{ textTransform: "capitalize" }}
                  label={value.tabLable}
                  value={index}
                  className="nested1"
                />
              ))}
            </TabList>
          </Box>
          {TabsHosts?.map((ob, index) => (
            <TabPanel value={index} sx={{ padding: 0, marginTop: 2 }}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ height: 400 }}>
                  {openTable ? (
                    <StyledDataGrid
                      rows={ob.value}
                      columns={ob?.columns?.map((column) => ({
                        ...column,
                        headerAlign: "center",
                        align: "center",
                      }))}
                      disableSelectionOnClick
                      processRowUpdate={ob.handleProcessRowUpdate}
                      experimentalFeatures={{ newEditingApi: true }}
                      getRowId={(row) => row.id}
                      disableColumnMenu
                      disablePagination
                      paginationMode="client" // Ensures manual pagination is off
                      hideFooterPagination 
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Skeleton animation="wave" sx={{ flex: 1 }} />
                      <Skeleton animation="wave" sx={{ flex: 1 }} />
                      <Skeleton animation="wave" sx={{ flex: 1 }} />
                      <Skeleton animation="wave" sx={{ flex: 1 }} />
                    </Box>
                  )}
                </Box>
              </Box>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
      <EditRowDialog
        state={editDialogData}
        EditRowDialogopen={EditRowDialogopen}
        setEditRowDialogOpen={setEditRowDialogOpen}
        handleClose={handleClose}
      />
    </Box>
  );
}
