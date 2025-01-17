import React from "react";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import InputBoxForGrid from "../../../common/InputBoxForGrid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { StyledDataGrid } from "../../../common/Grid/styles";
import InputBoxForGridTab from "../../../common/InputBoxForGridTab";

export default function BondEditGrid({ formik, disabled }) {
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

        if (hasEmptyFields) {
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
              <InputBoxForGridTab
                value={params.value}
                field={params.field}
                id={params.id}
                formik={formik}
                api={params.api}
                arrayName="bondPurchaseDetailsEntities"
                type="datetime-local"
              />
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
              <InputBoxForGridTab
                value={params.value}
                field={params.field}
                id={params.id}
                formik={formik}
                api={params.api}
                arrayName="bondPurchaseDetailsEntities"
                type="datetime-local"
              />
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
      <Box sx={{ width: "100%", typography: "body1" }}>
        {TabsHosts.map((ob, index) => (
          <Box sx={{ width: "100%" }} key={index}>
            {/* <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row-reverse",
                mb: 2,
              }}
            >
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={ob.addNewRow}
                sx={{ borderRadius: "17px 18px 18px 17px", margin: "5px" }}
              >
                Add {ob.tabLabel}
              </Button>
            </Box> */}
            <Box sx={{ height: 400 }}>
              <StyledDataGrid
                rows={ob.value}
                columns={ob.columns}
                disableSelectionOnClick
                processRowUpdate={ob.handleProcessRowUpdate}
                experimentalFeatures={{ newEditingApi: true }}
                getRowId={(row) => row.id}
                disableColumnMenu
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
