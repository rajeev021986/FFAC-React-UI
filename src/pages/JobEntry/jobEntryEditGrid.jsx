import React, { useEffect, useRef, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";

import ApiManager from "../../services/ApiManager";

// MUI
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, Skeleton } from "@mui/material";

// Components
import AutoCompleteInput from "../../components/common/AutoCompletInput";
import InputBoxForGridTab from "../../components/common/InputBoxForGridTab";
import EditRowDialog from "../../components/common/EditRowDialog";
import InputBoxForGrid from "../../components/common/InputBoxForGrid";
import SelectBox from "../../components/common/SelectBox";
import { StyledDataGrid } from "../../components/common/Grid/styles";
import DateTimeField from "../../components/common/DateTime/DateTimeField";

export default function JobEntryGridForm({
  formik,
  disabled = false,
  dropdownData,
  jobSettingData,
}) {
  const designation = dropdownData?.designation;
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
  const OnChange = (params, e, name) => {
    const rowIndex = formik.values[name].findIndex(
      (entity) => entity.id === params.id
    );
    formik.setValues({
      ...formik.values,
      [name]: formik?.values[name]?.map((entity, index) =>
        index === rowIndex
          ? { ...entity, [params.field]: e.target.value }
          : entity
      ),
    });
  };

  const handleClose = () => {
    setEditRowDialogOpen(false);
    setEditDialogData({});
    setopenTable(false);
    setTimeout(() => {
      setopenTable(true);
    }, 10);
  };

  const FieldRef = useRef(null);
  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  const SocData = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ];

  const TabsHosts = [
    // Container Shipemt
    {
      tabLable: "Container Shipment",
      value: formik?.values?.containerShipments || [],
      addNewRow: () => {
        const newRow = {
          id: Date.now(),
          containerNo: "",
          sizeType: "",
          dischargeDate: "",
          soc: "",
          shippingLineSealNo: "",
          cargoWeight: 0,
          tarWeight: 0,
          grossWeight: 0,
          cbm: 0,
          tflSealNo: "",
          new: true,
        };
        formik.setFieldValue("containerShipments", [
          ...TabsHosts[0].value,
          newRow,
        ]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[0]?.value.filter((row) => row.id !== id);
        formik.setFieldValue("containerShipments", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts?.[0]?.value?.map((row) =>
          row?.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("containerShipments", updatedRows);
        return newRow;
      },

      columns: [
        {
          field: "containerNo",
          headerName: "Container No.",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "sizeType",
          headerName: "Size Type",
          flex: 1,
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
              <SelectBox
                placeholder={true}
                size="small"
                sx={{
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
                options={jobSettingData?.body?.sizeType}
                value={params.value}
                onChange={(e) => OnChange(params, e, "containerShipments")}
              />
            </div>
          ),
        },
        {
          field: "dischargeDate",
          headerName: "Discharge Date",
          flex: 1,
          renderCell: (params) => (
            <DateTimeField
              value={params.value}
              onChange={(_, value) => {
                const updatedDischargeDate =
                  formik.values.containerShipments.map((a) => {
                    if (a.id === params.id) {
                      return { ...a, dischargeDate: value };
                    }
                    return a;
                  });
                formik.setFieldValue(
                  "containerShipments",
                  updatedDischargeDate
                );
              }}
            />
          ),
        },
        {
          field: "soc",
          headerName: "SOC",
          flex: 1,
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
                options={SocData}
                value={params.value}
                onChange={(e) => OnChange(params, e, "containerShipments")}
              />
            </div>
          ),
        },
        {
          field: "shippingLineSealNo",
          headerName: "Shipping Line, Seal No.",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "cargoWeight",
          headerName: "Cargo Weight",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "tarWeight",
          headerName: "Tar Weight",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "grossWeight",
          headerName: "Gross Weight",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "cbm",
          headerName: "CBM",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "tflSealNo",
          headerName: "TFL Seal No.",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
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
              style={{ width: "5%" }}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      ],
    },

    // Vehicle Shipment
    {
      tabLable: "Vehicle Shipment",
      value: formik?.values?.vehicleShipments || [],
      addNewRow: () => {
        const hasEmptyFields = TabsHosts[1].value.some((row) =>
          Object.values(row).some(
            (value) => value === "" || value === null || value === undefined
          )
        );
        const newRow = {
          id: Date.now(),
          chasisNo: "",
          engineCapacity: "",
          cbm: 0,
          driverCellNo: "",
          berthingDate: "",
          customReleaseODate: "",
          dateOfDeparture: "",
          dateOfArrivalAtBorder: "",
          dateOfDepartureAtBorder: "",
          dateOfDelivery: "",
          new: true,
        };
        formik.setFieldValue("vehicleShipments", [
          ...TabsHosts[1].value,
          newRow,
        ]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[1]?.value.filter((row) => row.id !== id);
        formik.setFieldValue("vehicleShipments", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts?.[1]?.value?.map((row) =>
          row?.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("vehicleShipments", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "chasisNo",
          headerName: "Chasis No.",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="text" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="text" />
          ),
        },
        {
          field: "engineCapacity",
          headerName: "Engine Capacity",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="text" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="text" />
          ),
        },
        {
          field: "cbm",
          headerName: "CBM",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="text" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="text" />
          ),
        },

        {
          field: "berthingDate",
          headerName: "Berthing Date",
          flex: 1,
          renderCell: (params) => (
            <DateTimeField
              value={params.value}
              onChange={(_, value) => {
                const updatedBirthingeDate = formik.values.vehicleShipments.map(
                  (a) => {
                    if (a.id === params.id) {
                      return { ...a, berthingDate: value };
                    }
                    return a;
                  }
                );
                formik.setFieldValue("vehicleShipments", updatedBirthingeDate);
              }}
            />
          ),
        },
        {
          field: "customReleaseODate",
          headerName: "Custom Release O Date",
          flex: 1,
          renderCell: (params) => (
            <DateTimeField
              value={params.value}
              onChange={(_, value) => {
                const updatedReleaseDate = formik.values.vehicleShipments.map(
                  (a) => {
                    if (a.id === params.id) {
                      return { ...a, customReleaseODate: value };
                    }
                    return a;
                  }
                );
                formik.setFieldValue("vehicleShipments", updatedReleaseDate);
              }}
            />
          ),
        },
        {
          field: "driverCellNo",
          headerName: "Driver Cell No.",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "dateOfDeparture",
          headerName: "Date of Departure",
          flex: 1,
          renderCell: (params) => (
            <DateTimeField
              value={params.value}
              onChange={(_, value) => {
                const updatedDepartureDate = formik.values.vehicleShipments.map(
                  (a) => {
                    if (a.id === params.id) {
                      return { ...a, dateOfDeparture: value };
                    }
                    return a;
                  }
                );
                formik.setFieldValue("vehicleShipments", updatedDepartureDate);
              }}
            />
          ),
        },
        {
          field: "dateOfArrivalAtBorder",
          headerName: "Date of Arrival at Border",
          flex: 1,
          renderCell: (params) => (
            <DateTimeField
              value={params.value}
              onChange={(_, value) => {
                const updatedArrivaleDate = formik.values.vehicleShipments.map(
                  (a) => {
                    if (a.id === params.id) {
                      return { ...a, dateOfArrivalAtBorder: value };
                    }
                    return a;
                  }
                );
                formik.setFieldValue("vehicleShipments", updatedArrivaleDate);
              }}
            />
          ),
        },
        {
          field: "dateOfDepartureAtBorder",
          headerName: "Date of Depart at Border",
          flex: 1,
          renderCell: (params) => (
            <DateTimeField
              value={params.value}
              onChange={(_, value) => {
                const updatedDepartureBorderDate =
                  formik.values.vehicleShipments.map((a) => {
                    if (a.id === params.id) {
                      return { ...a, dateOfDepartureAtBorder: value };
                    }
                    return a;
                  });
                formik.setFieldValue(
                  "vehicleShipments",
                  updatedDepartureBorderDate
                );
              }}
            />
          ),
        },
        {
          field: "dateOfDelivery",
          headerName: "Date of Delivary",
          flex: 1,
          renderCell: (params) => (
            <DateTimeField
              value={params.value}
              onChange={(_, value) => {
                const updatedDelivaryDate = formik.values.vehicleShipments.map(
                  (a) => {
                    if (a.id === params.id) {
                      return { ...a, dateOfDelivery: value };
                    }
                    return a;
                  }
                );
                formik.setFieldValue("vehicleShipments", updatedDelivaryDate);
              }}
            />
          ),
        },
        {
          field: "actions",
          sortable: false,
          flex: 0,
          renderHeader: () => (
            <IconButton color="white" onClick={TabsHosts[1].addNewRow}>
              <AddCircleIcon />
            </IconButton>
          ),
          renderCell: (params) => (
            <IconButton
              color="error"
              onClick={() => TabsHosts[1].deleteRow(params.row.id)}
              style={{ width: "20%" }}
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      ],
    },

    // Loose Cargo Shipment
    {
      tabLable: "Loose Cargo Shipment",
      value: formik.values.looseCargoShipments || [],
      addNewRow: () => {
        const hasEmptyFields = TabsHosts[2].value.some((row) =>
          Object.values(row).some(
            (value) => value === "" || value === null || value === undefined
          )
        );
        const newRow = {
          id: Date.now(),
          truckNo: "",
          trailerNo: "",
          transporter: "",
          licenceNo: "",
          driverName: "",
          cbm: 0,
          truckRegCard: "",
          trailerRegCard: "",
          new: true,
        };
        formik.setFieldValue("looseCargoShipments", [
          ...TabsHosts[2].value,
          newRow,
        ]);
        setFocus();
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[2]?.value?.filter((row) => row.id !== id);
        formik.setFieldValue("looseCargoShipments", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts[2]?.value?.map((row) =>
          row.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("looseCargoShipments", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "truckNo",
          headerName: "Truck No.",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Truck No." />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "trailerNo",
          headerName: "Trailer No.",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Trailer No." />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "transporter",
          headerName: "Transporter",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Transporter" />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "licenceNo",
          headerName: "Licence No.",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Licence No." />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "driverName",
          headerName: "Driver Name",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Driver name" />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "truckRegCard",
          headerName: "Truck Reg.Card",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Truck Red." />
          ),
          renderEditCell: (params) => <InputBoxForGrid {...params} />,
        },
        {
          field: "trailerRegCard",
          headerName: "Trailer Reg.Card",
          flex: 1,
          editable: true,
          renderCell: (params) => (
            <InputBoxForGrid {...params} placeholder="Trailer Reg." />
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
                      <Skeleton animation="wave" sx={{ flex: 0 }} />
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
