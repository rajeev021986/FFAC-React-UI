import { useFormik } from "formik";
import { CircularProgress, Grid, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { OutlinedButton, ThemeButton } from "../../../components/common/Button";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";

import { useNavigate } from "react-router-dom";
import CustomToast from "../../../components/common/Toast/CustomToast";
import getFirstError from "../../../components/common/FieldToastError";


// Sections Components
import JobProfitAndLoss from "./JobProfitAndLoss";
import AddDebitAndInvoce from "./AddDebitAndInvoice";
import { useAddReceivableMutation } from "../../../store/api/receivableApi";
import { payableValidationSchema } from "../Actions/ValidationSchema";

export default function SubSections({ initialValues, page, type = "notcopy" }) {
  //
  const nav = useNavigate();
  const [addReceivable, { isLoading }] = useAddReceivableMutation();

  const [dropdownData, setDropdownData] = useState({});
  const [value, setValue] = React.useState("1");
  const [chargesData, setChargesData] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
    onConfirm: null,
    onClose: () => setAlertConfig({ ...alertConfig, open: false }),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    // validationSchema: payableValidationSchema(),
    onSubmit: async (values) => {
      //
      console.log(values, 234567890);
      if (!values.id || type === "copy") {
        try {
          values.statusCode = dropdownData?.approvalRequest ? 0 : 1;
          values.status = "";
          let response = await addReceivable({
            ...values,
          }).unwrap();

          const message = response.message;
          if (response.code == "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="warn" />, {
              closeButton: false,
            });
            nav("/app/documentation/paybleEntry");
          } else {
            toast.custom(<CustomToast message={message} toast="error" />, {
              closeButton: false,
            });
          }
        } catch (error) {
          if (error.status === 409) {
            const message = error.data.message;
            toast.custom(<CustomToast message={message} toast="error" />, {
              closeButton: false,
            });
          } else {
            toast.custom(
              <CustomToast
                message="An error occurred while submitting the form."
                toast="error"
              />,
              {
                closeButton: false,
              }
            );
          }
        }
      }
    },
  });

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  const handleFetchPayable = () => {
    const apiPayableData = formik?.values?.paybleDetails || [];
    const appendData = [...apiPayableData].reduce((acc, pay) => {
      if (!acc.some((n) => n.id === pay.id)) {
        acc.push(pay);
      }
      return acc;
    }, []);
    setChargesData(appendData);
  };

  useEffect(() => {
    handleFetchPayable();
  }, [formik?.values?.chargesData]);

  return (
    <>
      <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <JobProfitAndLoss formik={formik} />
          </Box>

          <TabPanel value="1" sx={{ padding: 0 }}>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  margin: "8px",
                  padding: 1,
                }}
              >
                <AddDebitAndInvoce
                  initialValues={initialValues}
                  page="as"
                  viewPage="hsdgh"
                  type="notcopy"
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: "10px", padding: "15px" }}>
              <Grid item xs={12} sx={{ margin: 1 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={2}>
                    {/*  */}
                    <OutlinedButton
                      sx={{ fontWeight: "500" }}
                      onClick={() =>
                        page === "receivableEntry"
                          ? nav("/app/accounts/operations/receivableEntry")
                          : nav("/app/accounts/operations/receivableEntry")
                      }
                    >
                      Close
                    </OutlinedButton>

                    <ThemeButton
                      onClick={formik.handleSubmit}
                      sx={{
                        fontWeight: "500",
                        color: "white !important",
                      }}
                    >
                      {isLoading && (
                        <CircularProgress size={20} color="white" />
                      )}
                      Generate TaxInvoice/Debit Note
                    </ThemeButton>
                  </Stack>
                </Stack>
              </Grid>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
