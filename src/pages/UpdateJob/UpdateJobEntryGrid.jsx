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
import EditRowDialog from "../../components/common/EditRowDialog";
import InputBoxForGrid from "../../components/common/InputBoxForGrid";
import { StyledDataGrid } from "../../components/common/Grid/styles";
import DateTimeField from "../../components/common/DateTime/DateTimeField";
import FormAutoCompleteBond from "../../components/common/AutoComplete/FormAutoCompleteBond";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";

export default function BondDetailsGridForm({ formik }) {
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
          balanceBondAmount: 0,
          bondAmount: 0,
          bondDate: "",
          runningBalance: 0,
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
        const rowIndex = formik.values.bondDetails.findIndex(
          (row) => row.id === newRow.id
        );

        const runningBalance = parseFloat(newRow.runningBalance);
        const enteredBondAmount = parseFloat(newRow.bondAmount);

        if (enteredBondAmount > runningBalance) {
          console.log("Bond Amount exceeds Running Balance");
          toast.custom(
            <CustomToast
              message={"Bond Amount cannot exceed Running Balance"}
              toast="error"
            />
          );
          // formik.setFieldError(
          //   `bondDetails.${rowIndex}.bondAmount`,
          //   "Bond Amount cannot exceed Running Balance"
          // );
          return oldRow; // Reject update
        } else {
          console.log("Bond Amount not exceeds Running Balance");

          const updatedRow = {
            ...newRow,
            balanceBondAmount: runningBalance - enteredBondAmount, // Update balance bond amount
          };

          const updatedRows = formik.values.bondDetails.map((row) =>
            row.id === newRow.id ? updatedRow : row
          );

          formik.setFieldValue("bondDetails", updatedRows);
          return updatedRow;
        }
      },

      columns: [
        {
          field: "bondNumber",
          headerName: "Bond Number",
          flex: 1,
          renderCell: (params) => {
            return (
              <FormAutoCompleteBond
                id="bond_number"
                suggestionName="bond_number"
                value={params.row.bondNumber} // Use params.row to get correct row
                onChange={(e) => {
                  const selectedBondNumber = e.target.value;
                  const selectedBondData = e.fullData; // Get full bond data

                  const updatedRows = formik.values.bondDetails.map((row) =>
                    row.id === params.row.id // Use row.id for exact match
                      ? {
                          ...row,
                          bondNumber: selectedBondNumber,
                          runningBalance: selectedBondData?.amount || "", // Set running balance
                        }
                      : row
                  );

                  formik.setFieldValue("bondDetails", updatedRows);
                }}
              />
            );
          },
        },

        {
          field: "balanceBondAmount",
          headerName: "Balance Bond Amount",
          flex: 1,
          editable: false,
          renderCell: (params) => {
            const row = formik.values.bondDetails.find(
              (r) => r.id === params.id
            );
            return (
              <InputBoxForGrid
                {...params}
                type="number"
                placeholder="Enter Balance Bond Amount"
                value={row?.balanceBondAmount || 0}
                disabled={true} // Make it read-only
              />
            );
          },
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
          editable: true, // Allow users to edit this field
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter Bond Amount" />
          ),
          renderEditCell: (params) => {
            const row = formik.values.bondDetails.find(
              (r) => r.id === params.id
            );
            return (
              <InputBoxForGrid
                {...params}
                placeholder="Running Balance"
                type="number"
                disabled={!row?.bondNumber}
                onChange={(e) => {
                  const newRunningBalance = e.target.value;
                  const updatedRows = formik.values.bondDetails.map((row) =>
                    row.id === params.id
                      ? { ...row, runningBalance: newRunningBalance }
                      : row
                  );

                  formik.setFieldValue("bondDetails", updatedRows);
                  TabsHosts[0].handleProcessRowUpdate(
                    { ...params.row, runningBalance: newRunningBalance },
                    params.row
                  );
                }}
              />
            );
          },
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
                <Box>
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
