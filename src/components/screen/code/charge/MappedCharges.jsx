import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import InputBox from "../../../common/InputBox";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { OutlinedButton, ThemeButton } from "../../../common/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { StyledDataGrid } from "../../../common/Grid/styles";
import getFirstError from "../../../common/FieldToastError";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ThemedBreadcrumb from "../../../common/Breadcrumb";
import ScreenToolbar from "../../../common/ScreenToolbar";
import { useNavigate } from "react-router-dom";
import Loader from "../../../common/Loader/Loader";
import EditIconForHeader from "../../../common/commonIcons/EditIcons/EditIconForHeader";
import {
  useFetchMappedChargesDatasQuery,
  useUpdateMappedChargeMutation,
} from "../../../../store/api/mappedChargesDataApi";
import CustomToast from "../../../common/Toast/CustomToast";
import FormAutoCompleteWithLoader from "../../../common/AutoComplete/FormAutoCompletewithLoader";
import AutoCompleteInput from "../../../common/AutoCompletInput";

export default function MappedCharges({ type, loading }) {
  const newRowRef = useRef(null);
  const nav = useNavigate();
  const [pageSize, setPageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const { data: mappedChargesData, isLoading } =
    useFetchMappedChargesDatasQuery();
  const [updateMappedCharge, {}] = useUpdateMappedChargeMutation();
  const validationSchema = Yup.array().of(
    Yup.object().shape({
      directIncome: Yup.string().required("Direct Income is required"),
      directExpense: Yup.string().required("Direct Expense is required"),
    })
  );

  const tabs = [
    {
      label: "Mapped Charges Details",
      value: 1,
      icon: <EditIconForHeader />,
    },
    // { label: "Audit Logs", value: 2, icon: <AuditIcon /> },
  ];
  Boolean(type === "copy" || type === "new") && tabs.splice(1, 1);
  const initialValues = [];
  const setFocus = () => {
    setTimeout(() => {
      if (newRowRef.current) {
        newRowRef.current.focus();
      }
    }, 1000);
  };

  const [value, setValue] = React.useState("1");
  const FieldRef = useRef(null);

  useEffect(() => {
    if (FieldRef.current) {
      FieldRef.current.focus();
    }
  }, []);

  const onSubmit = async (values) => {
    const updatedValue = formik.values.map((row) =>
      row.new ? { ...row, id: null, new: undefined } : row
    );
    try {
      let res = await updateMappedCharge(updatedValue).unwrap();
      if (res.success) {
        toast.custom(<CustomToast message={res.message} toast="success" />, {
          closeButton: false,
        });
        nav("/app/admin/charges");
      }
    } catch (error) {
      toast.custom(<CustomToast message={error.data.message} toast="error" />, {
        closeButton: false,
      });
    }
    // }
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    onSubmit,
  });
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const addNewRow = () => {
    const newRow = {
      id: Date.now(),
      directExpense: "",
      directIncome: "",
      expenseId: null,
      incomeId: null,
      new: true,
    };

    formik.setValues([...formik.values, newRow]);
    setFocus();
  };
  const deleteRow = (id) => {
    const updatedRows = formik.values.filter((row) => row.id !== id);
    formik.setValues(updatedRows);
  };

  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = formik.values.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    formik.setValues(updatedRows);
    return newRow;
  };

  const columns = [
    {
      field: "directIncome",
      headerName: "Direct Income",
      flex: 1,
      renderCell: (params) => {
        const rowIndex = formik.values.findIndex(
          (row) => row.id === params.row.id
        );
        const rowErrors = formik.errors?.[rowIndex] || {};
        return (
          <Box sx={{ width: "100%", margin: "12px" }}>
            <AutoCompleteInput
              id="directIncome"
              suggestionName="charge_name"
              placeholder="Direct Income"
              value={{
                id: params.row.incomeId,
                label: params.row.directIncome,
              }}
              error={rowErrors.directIncome}
              onChange={(newValue) => {
                const updated = [...formik.values];
                updated[rowIndex] = {
                  ...updated[rowIndex],
                  incomeId: newValue?.id || null,
                  directIncome: newValue?.label || "",
                };
                formik.setValues(updated);
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "directExpense",
      headerName: "Direct Expense",
      flex: 1,
      renderCell: (params) => {
        const rowIndex = formik.values.findIndex(
          (row) => row.id === params.row.id
        );
        const rowErrors = formik.errors?.[rowIndex] || {};
        return (
          <AutoCompleteInput
            placeholder="Direct Expense"
            id="directExpense"
            suggestionName="charge_name"
            value={{
              id: params.row.expenseId,
              label: params.row.directExpense,
            }}
            error={rowErrors.directExpense}
            onChange={(newValue) => {
              const updated = [...formik.values];
              updated[rowIndex] = {
                ...updated[rowIndex],
                expenseId: newValue?.id || null,
                directExpense: newValue?.label || "",
              };
              formik.setValues(updated);
            }}
          />
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

  useEffect(() => {
    if (mappedChargesData?.body) {
      formik.setValues(mappedChargesData.body);
    }
  }, [mappedChargesData]);
  return (
    <>
      <Box sx={{ padding: 0, margin: 0, height: "calc(100vh - 65px)" }}>
        <Stack sx={{ padding: "8px 0px" }}>
          <ScreenToolbar
            leftComps={
              <div>
                <ThemedBreadcrumb />
              </div>
            }
            rightComps={<div></div>}
          />
        </Stack>
        {isLoading ? (
          <Loader />
        ) : (
          <Card
            sx={{ borderWidth: 1, borderColor: "border.main", padding: "0px" }}
          >
            <CardContent
              sx={{ margin: "0px !important", padding: "0px !important" }}
            >
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab
                      label="Mapping Details"
                      value="1"
                      className="nested1"
                      sx={{
                        textTransform: "capitalize",
                        minHeight: "50px",
                      }}
                      icon=<EditIconForHeader />
                      iconPosition="start"
                    />
                  </TabList>
                </Box>
                <TabPanel
                  value="1"
                  sx={{ margin: "0px !important", padding: "0px !important" }}
                >
                  {" "}
                  <Box
                    sx={{
                      width: "100%",
                      marginTop: 1,
                      padding: "0px !important",
                    }}
                    paddingInline={2}
                  >
                    <Box sx={{ width: "100%", height: "100%" }}>
                      <StyledDataGrid
                        rows={formik.values || []}
                        columns={columns.map((column) => ({
                          ...column,
                          headerAlign: "center",
                          align: "center",
                          justifyContent: "center",
                        }))}
                        pagination
                        pageSizeOptions={[5, 10, 25, 50]}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 5, page: 0 },
                          },
                        }}
                        paginationModel={{ page, pageSize }}
                        onPaginationModelChange={(model) => {
                          setPage(model.page);
                          setPageSize(model.pageSize);
                        }}
                        disableRowSelectionOnClick
                        processRowUpdate={handleProcessRowUpdate}
                        experimentalFeatures={{ newEditingApi: true }}
                        getRowId={(row) => row.id}
                        disableColumnMenu
                        sx={{
                          "& .MuiDataGrid-row": {
                            fontSize: "14px",
                            height: "44px",
                            minHeight: "64px !important",
                            maxHeight: "44px !important",
                          },
                          "& .MuiDataGrid-cell": {
                            height: "44px",
                            minHeight: "64px !important",
                            maxHeight: "44px !important",
                            lineHeight: "44px !important",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <br />
                  <Grid item xs={12} sx={{ margin: 1 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2}>
                        <OutlinedButton
                          sx={{ fontWeight: "500" }}
                          onClick={() => nav("/app/admin/charges")}
                        >
                          Close
                        </OutlinedButton>
                        <ThemeButton
                          onClick={async () => {
                            const errors = await formik.validateForm();
                            if (Object.keys(errors).length > 0) {
                              formik.setTouched(
                                formik.values.map(() => ({
                                  directIncome: true,
                                  directExpense: true,
                                })),
                                true
                              );

                              getFirstError(errors);
                            } else {
                              formik.handleSubmit();
                            }
                          }}
                          sx={{ fontWeight: "500", color: "white !important" }}
                        >
                          {loading && (
                            <CircularProgress size={20} color="white" />
                          )}{" "}
                          Submit
                        </ThemeButton>
                      </Stack>
                    </Stack>
                  </Grid>
                </TabPanel>
              </TabContext>
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  );
}
