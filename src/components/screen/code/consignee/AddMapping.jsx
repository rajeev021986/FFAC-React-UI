import React,{ useRef }from "react";
import { Box, Button,IconButton ,Tooltip} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { StyledDataGrid } from "../../../common/Grid/styles";
import SelectBox from "../../../common/SelectBox";
import InputBox from "../../../common/InputBox";

export default function AddMapping({ formik, dropdownData, disabled }) {
  const consigneeEntityFreeDays = formik.values.consigneeEntityFreeDays || [
    // { id: 1, item: "", freeDays: "", storageRate: ""},
  ];
  

  // Static options for dropdowns
  
  const itemNameOptions = dropdownData?.item ||[
    { label: "Anode", value: "ANODE" },
    { label: "Cathode", value: "CATHODE" },
    { label: "Electrolyte", value: "ELECTROLYTE"},
    { label: "Copper Cement", value: "COPPER CEMENT" },
  ];
  const newRowRef = useRef(null);
    const setFocus = () => {
      setTimeout(() => {
        if (newRowRef.current) {
          newRowRef.current.focus();
        }
      }, 1000);
    };

  // Handler to add a new row
  const addRow = () => {
    const newRow = {
      id: Date.now(),
      item: "",
      freeDays: "",
      storageRate: "",
    };
    formik.setFieldValue("consigneeEntityFreeDays", [...consigneeEntityFreeDays, newRow]);
  };

  // Handler to delete a row
  const deleteRow = (id) => {
    const updatedRows = consigneeEntityFreeDays.filter((row) => row.id !== id);
    formik.setFieldValue("consigneeEntityFreeDays", updatedRows);
  };
  const updateRowValue = (params, e, name) => {
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

  // Columns for DataGrid
  const columns = [
    
      {
            field: "item",
            headerName: "Item",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
              <Tooltip
                title={params.value ? `${params.value}` : "This field is empty"}
                arrow
              >
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
                    size="small"
                    sx={{
                      marginTop: "0px",
                      marginBottom: "0px",
                      fontSize: "14px",
                    }}
                    options={itemNameOptions}
                    value={params.value}
                  
                    placeholder={true}
                    onChange={(e) =>
                      updateRowValue(params, e, "consigneeEntityFreeDays")
                    }
                  />
                </div>
              </Tooltip>
            ),
          },
    {
      field: "freeDays",
      headerName: "Free Days",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
              <Tooltip
                title={params.value ? `${params.value}` : "This field is empty"}
                arrow
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <InputBox
                    size="small"
                    value={params.value}
                    type="string"
                    onChange={(e) =>
                      updateRowValue(params, e, "consigneeEntityFreeDays")
                    }
                    sx={{
                      marginTop: "0px",
                      marginBottom: "5px",
                    }}
                  />
                </div>
              </Tooltip>
      ),
      
    },
    {
      field: "storageRate",
      headerName: "Storage Rate",
      flex: 1,
      headerAlign: "center",
      align: "center",

      renderCell: (params) => (
        <Tooltip
          title={params.value ? `${params.value}` : "This field is empty"}
          arrow
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <InputBox
              size="small"
              value={params.value}
              type="string"
              onChange={(e) =>
                updateRowValue(params, e, "consigneeEntityFreeDays")
              }
              sx={{
                marginTop: "0px",
                marginBottom: "5px",
              }}
            />
          </div>
        </Tooltip>
),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderHeader: () => (
        <IconButton color="white">
          <AddCircleIcon onClick={addRow} />
        </IconButton>
      ),
      renderCell: (params) => (
        <Button
          disabled={disabled}
          color="error"
          onClick={() => deleteRow(params.row.id)}
          // disabled={disabled || customerEntityTariffs.length === 1}
        >
          <Delete />
        </Button>
      ),
      headerAlign: "center",
      align: "center",
    },
  ];

  // Handler to commit changes
  const handleProcessRowUpdate = (newRow, oldRow) => {
    const updatedRows = consigneeEntityFreeDays.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setFieldValue("consigneeEntityFreeDays", updatedRows);
    return newRow;
  };

  return (
    <Box sx={{ width: "100%", textAlign:"right" }}>
      <Box
              sx={{
                height: 400,
              }}
            >
      {/* <Button
        startIcon={<Add />}
        onClick={addRow}
        variant="outlined"
        color="primary"
        disabled={disabled}
      >
        Add Free Days
      </Button> */}
      <Box sx={{ height: 400, marginTop: 2 }}>
        <StyledDataGrid
          rows={consigneeEntityFreeDays}
          columns={columns}
          disableSelectionOnClick
          processRowUpdate={handleProcessRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          getRowId={(row) => row.id}
          disableColumnMenu
        />
      </Box>
      </Box>
    </Box>
  );
}
