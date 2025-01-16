import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  colors,
  Typography,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AutoCompleteInput from "../../../common/AutoCompletInput";
import ApiManager from "../../../../services/ApiManager";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { StyledDataGrid } from "../../../common/Grid/styles";
import SelectBox from "../../../common/SelectBox";
import InputBox from "../../../common/InputBox";
import InputBoxForGrid from "../../../common/InputBoxForGrid";
import EditRowDialog from "../../../common/EditRowDialog";
export default function VendorEditGrid({
  formik,
  disabled = false,
  vendorSettingsData,
  dropdownData,
}) {
  const designation = dropdownData?.designation;
  const [editDialogData, setEditDialogData] = useState();
  const [EditRowDialogopen, setEditRowDialogOpen] = useState(false);
  const newRowRef = useRef(null);
  const setFocus = () => {
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.focus();
      }
    }, 1000);
  };
  const OnChange = (params, e, name) => {
    const rowIndex = formik.values[name].findIndex(
      (entity) => entity.id === params.id
    );
    formik.setValues({
      ...formik.values,
      [name]: formik.values[name].map((entity, index) =>
        index === rowIndex
          ? { ...entity, [params.field]: e.target.value }
          : entity
      ),
    });
  };
  const handleClose = () => {
    setEditRowDialogOpen(false);
    setEditDialogData({});
  };

  const TabsHosts = [
    {
      tabLable: "Tariffs",
      value: formik.values.vendorEntityTariffs || [],
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
          chargeName: "",
          type: "",
          finalDestination: "",
          unitType: "",
          currency: "",
          unitRate: "0",
          new: true,
        };
        formik.setFieldValue("vendorEntityTariffs", [
          ...TabsHosts[0].value,
          newRow,
        ]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[0].value.filter((row) => row.id !== id);
        formik.setFieldValue("vendorEntityTariffs", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts[0].value.map((row) =>
          row.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("vendorEntityTariffs", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "chargeName",
          headerName: "Charge Name",
          flex: 1,
          editable: true,
          renderCell: (params) => {
            return (
              <AutoCompleteInput
                id="chargeName"
                suggestionName="charge_name"
                value={params.value}
                error={
                  formik.errors.vendorEntityTariffs?.[params.rowIndex]
                    ?.chargeName
                }
                onChange={(newValue) => {
                  const rowIndex = formik.values.vendorEntityTariffs.findIndex(
                    (entity) => entity.id === params.id
                  );
                  // setTimeout(() => {
                  formik.setValues({
                    ...formik.values,
                    vendorEntityTariffs: formik.values.vendorEntityTariffs.map(
                      (entity, index) =>
                        index === rowIndex
                          ? { ...entity, chargeName: newValue }
                          : entity
                    ),
                  });
                  // }, 1500);
                }}
                inputRef={newRowRef}
              />
            );
          },
        },
        {
          field: "type",
          headerName: "Type",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {" "}
              <SelectBox
                placeholder={true}
                size="small"
                sx={{
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
                options={vendorSettingsData?.body?.tarifType}
                value={params.value}
                onChange={(e) => OnChange(params, e, "vendorEntityTariffs")}
              />
            </div>
          ),
        },
        {
          field: "finalDestination",
          headerName: "Final Destination",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid
              {...params}
              placeholder="Enter final destination"
            />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid
              {...params}
              placeholder="Enter final destination"
            />
          ),
        },
        {
          field: "unitType",
          headerName: "Unit Type",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {" "}
              <SelectBox
                placeholder={true}
                size="small"
                sx={{
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
                options={vendorSettingsData?.body?.unitType}
                value={params.value}
                onChange={(e) => OnChange(params, e, "vendorEntityTariffs")}
              />
            </div>
          ),
        },
        {
          field: "currency",
          headerName: "Currency",
          flex: 1,
          editable: true,
          renderCell: (params) => {
            return (
              <AutoCompleteInput
                id="currency"
                suggestionName="currency"
                value={params.value}
                error={
                  formik.errors.vendorEntityTariffs?.[params.rowIndex]
                    ?.chargeName
                }
                onChange={(newValue) => {
                  const rowIndex = formik.values.vendorEntityTariffs.findIndex(
                    (entity) => entity.id === params.id
                  );
                  // setTimeout(() => {
                  formik.setValues({
                    ...formik.values,
                    vendorEntityTariffs: formik.values.vendorEntityTariffs.map(
                      (entity, index) =>
                        index === rowIndex
                          ? { ...entity, currency: newValue }
                          : entity
                    ),
                  });
                  // }, 1500);
                }}
              />
            );
          },
        },
        {
          field: "unitRate",
          headerName: "Unit Rate",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} />,
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
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
    {
      tabLable: "Demurage Tariffs",
      value: formik.values.vendorEntityDemurageTariffs || [
        {
          id: 0,
          country: "",
          containerType: "",
          firstSlab: "",
          secondSlab: "",
          thirdSlab: "",
          new: true,
        },
      ],
      addNewRow: () => {
        const hasEmptyFields = TabsHosts[1].value.some((row) =>
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
          country: "",
          containerType: "",
          firstSlab: "",
          secondSlab: "",
          thirdSlab: "",
          new: true,
        };
        formik.setFieldValue("vendorEntityDemurageTariffs", [
          ...TabsHosts[1].value,
          newRow,
        ]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[1].value.filter((row) => row.id !== id);
        formik.setFieldValue("vendorEntityDemurageTariffs", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts[1].value.map((row) =>
          row.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("vendorEntityDemurageTariffs", updatedRows);
        return newRow;
      },
      columns: [
        ...[
          { field: "freeTime", type: "input" },
          {
            field: "freeTimeType",
            type: "dropdown",
            options: dropdownData.demurageOptions,
          },
          { field: "t1Start", type: "input" },
          { field: "t1End", type: "input" },
          {
            field: "t1Type",
            type: "dropdown",
            options: dropdownData.demurageOptions,
          },
          { field: "t1Rate", type: "input" },
          { field: "t2Start", type: "input" },
          { field: "t2End", type: "input" },
          {
            field: "t2Type",
            type: "dropdown",
            options: dropdownData.demurageOptions,
          },
          { field: "t2Rate", type: "input" },
          { field: "t3Start", type: "input" },
          { field: "t3End", type: "input" },
          {
            field: "t3Type",
            type: "dropdown",
            options: dropdownData.demurageOptions,
          },
          { field: "t3Rate", type: "input" },
        ].map((a) => {
          return {
            field: a.field,
            headerName:
              a.field
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .charAt(0)
                .toUpperCase() + a.field.slice(1),
            width: 130,
            type: a.type,
            options: a.options,
            headerName:
              a.field
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .charAt(0)
                .toUpperCase() + a.field.slice(1),
            editable: true,
            renderCell: (params) => (
              <InputBoxForGrid
                {...params}
                type={a.type}
                options={dropdownData.demurageOptions}
              />
            ),
            renderEditCell: (params) => (
              <InputBoxForGrid
                {...params}
                type={a.type}
                options={dropdownData.demurageOptions}
              />
            ),
          };
        }),

        {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          flex: 0,
          renderHeader: () => (
            <IconButton color="white">
              <AddCircleIcon onClick={TabsHosts[1].addNewRow} />
            </IconButton>
          ),
          renderCell: (params) => (
            <>
              <IconButton
                color="primary"
                onClick={() => TabsHosts[1].editRow(params.row)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => TabsHosts[1].deleteRow(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          ),
        },
      ],
      editRow: (data) => {
        setEditDialogData({
          formik: formik,
          data: data,
          tabName: "vendorEntityDemurageTariffs",
          columns: TabsHosts[1].columns,
        });
        setEditRowDialogOpen(true);
      },
    },
    {
      tabLable: "FreeDays",
      value: formik.values.vendorEntityFreeDays || [],
      addNewRow: () => {
        const hasEmptyFields = TabsHosts[2].value.some((row) =>
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
          country: "",
          noOfFreeDays: 0,
          new: true,
        };
        formik.setFieldValue("vendorEntityFreeDays", [
          ...TabsHosts[2].value,
          newRow,
        ]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[2].value.filter((row) => row.id !== id);
        formik.setFieldValue("vendorEntityFreeDays", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts[2].value.map((row) =>
          row.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("vendorEntityFreeDays", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "country",
          headerName: "Country",
          flex: 1,
          editable: true,
          renderCell: (params) => {
            return (
              <AutoCompleteInput
                id="country"
                suggestionName="country"
                value={params.value}
                error={
                  formik.errors.vendorEntityFreeDays?.[params.rowIndex]
                    ?.chargeName
                }
                onChange={(newValue) => {
                  const rowIndex = formik.values.vendorEntityFreeDays.findIndex(
                    (entity) => entity.id === params.id
                  );
                  // setTimeout(() => {
                  formik.setValues({
                    ...formik.values,
                    vendorEntityFreeDays:
                      formik.values.vendorEntityFreeDays.map((entity, index) =>
                        index === rowIndex
                          ? { ...entity, country: newValue }
                          : entity
                      ),
                  });
                  // }, 1500);
                }}
                inputRef={newRowRef}
              />
            );
          },
        },
        {
          field: "noOfFreeDays",
          headerName: "No Of Free Days",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Number of free days" />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          flex: 0,
          renderHeader: () => (
            <IconButton color="white">
              <AddCircleIcon onClick={TabsHosts[2].addNewRow} />
            </IconButton>
          ),
          renderCell: (params) => (
            <IconButton
              color="error"
              onClick={() => TabsHosts[2].deleteRow(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      ],
    },
    {
      tabLable: "Emails",
      value: formik.values.vendorEntityEmails || [],
      addNewRow: () => {
        const hasEmptyFields = TabsHosts[3].value.some((row) =>
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
          designation: "",
          emailId: "",
          new: true,
        };
        formik.setFieldValue("vendorEntityEmails", [
          ...TabsHosts[3].value,
          newRow,
        ]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[3].value.filter((row) => row.id !== id);
        formik.setFieldValue("vendorEntityEmails", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts[3].value.map((row) =>
          row.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("vendorEntityEmails", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "designation",
          headerName: "Designation",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {" "}
              <SelectBox
                placeholder={true}
                size="small"
                sx={{
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
                options={designation}
                value={params.value}
                onChange={(e) => OnChange(params, e, "vendorEntityEmails")}
                inputRef={newRowRef}
              />
            </div>
          ),
        },
        {
          field: "emailId",
          headerName: "Email",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid
              {...params}
              placeholder="Enter emails separated by commas"
            />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid
              {...params}
              placeholder="Enter emails separated by commas"
            />
          ),
        },
        {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          flex: 0,
          renderHeader: () => (
            <IconButton color="white">
              <AddCircleIcon onClick={TabsHosts[3].addNewRow} />
            </IconButton>
          ),
          renderCell: (params) => (
            <IconButton
              color="error"
              onClick={() => TabsHosts[3].deleteRow(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      ],
    },
    {
      tabLable: "Bank Details",
      value: formik.values.bankDetails || [],
      addNewRow: () => {
        const hasEmptyFields = TabsHosts[4].value.some((row) =>
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
          bankName: "",
          bankAddress: "",
          currency: "",
          swiftCode: "",
          vendorId: 0,
          new: true,
        };
        formik.setFieldValue("bankDetails", [...TabsHosts[4].value, newRow]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[4].value.filter((row) => row.id !== id);
        formik.setFieldValue("bankDetails", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts[4].value.map((row) =>
          row.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("bankDetails", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "bankName",
          headerName: "Bank Name",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter bank name" />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter bank name" />
          ),
        },
        {
          field: "bankAddress",
          headerName: "Bank Address",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter bank address" />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter bank address" />
          ),
        },
        {
          field: "accountNo",
          headerName: "AccountNo",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter account number" />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter account number" />
          ),
        },
        {
          field: "currency",
          headerName: "Currency",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter currency" />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter currency" />
          ),
        },
        {
          field: "swiftCode",
          headerName: "Swift Code",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter swift code" />
          ),
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Enter swift code" />
          ),
        },
        {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          flex: 0,
          renderHeader: () => (
            <IconButton color="white">
              <AddCircleIcon onClick={TabsHosts[4].addNewRow} />
            </IconButton>
          ),
          renderCell: (params) => (
            <IconButton
              color="error"
              onClick={() => TabsHosts[4].deleteRow(params.row.id)}
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
              {TabsHosts.map((value, index) => (
                <Tab
                  sx={{ fontSize: "1rem", textTransform: "capitalize" }}
                  label={value.tabLable}
                  value={index}
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
      <EditRowDialog
        state={editDialogData}
        EditRowDialogopen={EditRowDialogopen}
        setEditRowDialogOpen={setEditRowDialogOpen}
        handleClose={handleClose}
      />
    </Box>
  );
}
