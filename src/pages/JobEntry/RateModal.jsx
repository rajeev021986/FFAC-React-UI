import * as React from "react";

//  MUI
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Skeleton, TabContext, TabList, TabPanel } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Grid, IconButton, Tab } from "@mui/material";

//  Components
import InputBox from "../../components/common/InputBox";
import InputBoxForGrid from "../../components/common/InputBoxForGrid";
import { StyledDataGrid } from "../../components/common/Grid/styles";
import SelectBox from "../../components/common/SelectBox";
import { useGetOptionsSettingsQuery } from "../../store/api/settingsApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

export default function AddRateModal({
  formik,
  disabled,
  toggleRate,
  toggleRateModal,
}) {
  const [value, setValue] = React.useState(0);
  const [openTable, setopenTable] = React.useState(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { data: jobSettingData } = useGetOptionsSettingsQuery("job_settings");

  const OnChange = (params, e, name) => {
    const valuePath = name.split(".");
    let data = formik.values;
    for (const key of valuePath) {
      if (!data[key]) {
        return;
      }
      data = data[key];
    }
    if (!Array.isArray(data)) {
      return;
    }
    const rowIndex = data.findIndex((entity) => entity.id === params.id);
    if (rowIndex === -1) {
      return;
    }
    formik.setValues({
      ...formik.values,
      rate: {
        ...formik.values.rate,
        rateDetails: data.map((entity, index) =>
          index === rowIndex
            ? { ...entity, [params.field]: e.target.value }
            : entity
        ),
      },
    });
  };

  const TabsHosts = [
    {
      tabLable: "Rate Details",
      value: formik?.values?.rate?.rateDetails || [],
      addNewRow: () => {
        const newRow = {
          id: Date.now(),
          chargeHead: "",
          currency: "",
          unitType: "",
          noOfUnits: 0,
          rate: 0,
          amount: 0,
          new: true,
        };
        formik.setFieldValue("rate.rateDetails", [
          ...TabsHosts[0].value,
          newRow,
        ]);
      },
      deleteRow: (id) => {
        const updatedRows = TabsHosts[0]?.value.filter((row) => row.id !== id);
        formik.setFieldValue("rate.rateDetails", updatedRows);
      },
      handleProcessRowUpdate: (newRow, oldRow) => {
        const updatedRows = TabsHosts?.[0]?.value?.map((row) =>
          row?.id === newRow.id ? { ...row, ...newRow } : row
        );
        formik.setFieldValue("rate.rateDetails", updatedRows);
        return newRow;
      },
      columns: [
        {
          field: "chargeHead",
          headerName: "Charge Head",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "currency",
          headerName: "Currency",
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
                options={jobSettingData?.body?.currency}
                value={params.value}
                onChange={(e) => OnChange(params, e, "rate.rateDetails")}
              />
            </div>
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
              <SelectBox
                placeholder={true}
                size="small"
                sx={{
                  marginTop: "0px",
                  marginBottom: "0px",
                }}
                options={jobSettingData?.body?.unitTypes}
                value={params.value}
                onChange={(e) => OnChange(params, e, "rate.rateDetails")}
              />
            </div>
          ),
        },
        {
          field: "noOfUnits",
          headerName: "No of Units",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "rate",
          headerName: "Rate",
          flex: 1,
          editable: true,
          renderCell: (params) => <InputBoxForGrid {...params} type="number" />,
          renderEditCell: (params) => (
            <InputBoxForGrid {...params} type="number" />
          ),
        },
        {
          field: "amount",
          headerName: "Amount",
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
            >
              <DeleteIcon />
            </IconButton>
          ),
        },
      ],
    },
  ];

  return (
    <div>
      <Modal
        keepMounted
        open={toggleRate}
        onClose={toggleRateModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={{ ...style, position: "relative" }}>
          <IconButton
            onClick={toggleRateModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.600",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Grid paddingLeft={1} marginTop={2} container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
              <InputBox
                label="Total Amount"
                id="rate.totalAmount"
                value={formik?.values?.rate?.totalAmount}
                error={formik?.errors?.rate?.totalAmount}
                onChange={formik?.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={8} xl={2}>
              <InputBox
                label="Additional Remarks"
                id="rate.remarks"
                value={formik.values.rate?.remarks}
                error={formik.errors.rate?.remarks}
                onChange={formik.handleChange}
                disabled={disabled}
              />
            </Grid>
          </Grid>

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
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
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
                            <Skeleton animation="wave" sx={{ flex: 1 }} />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </TabPanel>
                ))}
              </TabContext>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
