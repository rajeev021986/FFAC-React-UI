import { useFormik } from "formik";
import { CircularProgress, Grid, Stack, Tab } from "@mui/material";
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
import AddDebitAndInvoice from "./AddDebitAndInvoice";
import {
  useAddReceivableMutation,
  useUpdateReceivableMutation,
} from "../../../store/api/receivableApi";
import { TabList } from "@mui/lab";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";
import AuditIcon from "../../../components/common/commonIcons/AuditIcon/AuditIcon";
import AuditTimeLine from "../../../components/AuditTimeLine";
import { menuConfigUrl } from "../../../store/menuConfigUrl";

export default function SubSections({
  initialValues,
  page,
  type = "notcopy",
  setgetDataFormParams,
}) {
  //
  const nav = useNavigate();
  const [addReceivable, { isLoading }] = useAddReceivableMutation();
  const [updateReceivable, { isUpdateLoading }] = useUpdateReceivableMutation();

  const [dropdownData, setDropdownData] = useState({});
  const [value, setValue] = React.useState("1");
  const [chargesData, setChargesData] = useState([]);

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
      // Create a payload excluding 'type' and 'costDetails'
      const { costDetails, ...payload } = values;
      if (payload.details.length === 0) {
        return toast.custom(
          <CustomToast
            message={
              "Please add atleast one entry to create TaxInvoice/Debit Note"
            }
            toast="error"
          />,
          {
            closeButton: false,
          }
        );
      }
      if (!values.id) {
        try {
          let DetailsData = values.details.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          const response = await addReceivable({
            ...payload,
            details: DetailsData,
          }).unwrap();

          const message = response.message;
          if (response.code === "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="success" />, {
              closeButton: false,
            });
            nav("/app/accounts/operations/receivableEntry");
          } else {
            toast.custom(<CustomToast message={message} toast="error" />, {
              closeButton: false,
            });
          }
        } catch (error) {
          const message =
            error?.data?.message || "An error occurred while submitting.";
          toast.custom(<CustomToast message={message} toast="error" />, {
            closeButton: false,
          });
        }
      } else {
        try {
          let DetailsData = values.details.map((item) =>
            item?.new ? { ...item, id: null, new: false } : item
          );
          const response = await updateReceivable({
            ...payload,
            details: DetailsData,
          }).unwrap();

          const message = response.message;
          if (response.code === "SUCCESS") {
            toast.custom(<CustomToast message={message} toast="success" />, {
              closeButton: false,
            });
            nav("/app/accounts/operations/receivableEntry");
          } else {
            toast.custom(<CustomToast message={message} toast="error" />, {
              closeButton: false,
            });
          }
        } catch (error) {
          const message =
            error?.data?.message || "An error occurred while submitting.";
          toast.custom(<CustomToast message={message} toast="error" />, {
            closeButton: false,
          });
        }
      }
    },
  });

  const data = setgetDataFormParams(formik?.values);
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    handleFetchPayable();
  }, [formik?.values?.chargesData]);

  return (
    <>
      <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            {type !== "edit" ? (
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Receivable Details"
                  value="1"
                  sx={{
                    textTransform: "capitalize",
                    minHeight: "50px",
                  }}
                  icon={<EditIconForHeader />}
                  iconPosition="start"
                />
              </TabList>
            ) : (
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab
                  label="Job Entry Details"
                  value="1"
                  icon={<EditIconForHeader />}
                  iconPosition="start"
                  sx={{
                    textTransform: "capitalize",
                    minHeight: "50px",
                    fontSize: { xs: "0.8rem", sm: "1.125rem" },
                    padding: { xs: "5px", sm: "10px 16px" },
                  }}
                />
                <Tab
                  label="Audit Logs"
                  value="2"
                  icon={<AuditIcon />}
                  iconPosition="start"
                  sx={{
                    textTransform: "capitalize",
                    minHeight: "50px",
                    fontSize: { xs: "0.8rem", sm: "1.125rem" },
                    padding: { xs: "5px", sm: "10px 16px" },
                  }}
                />
              </TabList>
            )}
          </Box>

          <TabPanel value="1" sx={{ padding: 0 }}>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  margin: "8px",
                  padding: 1,
                }}
              >
                <JobProfitAndLoss formik={formik} />
                <AddDebitAndInvoice
                  formik={formik}
                  dropdownData={dropdownData}
                  disabled={false}
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

                    {formik.values.id ? (
                      <ThemeButton
                        onClick={formik.handleSubmit}
                        sx={{
                          fontWeight: "500",
                          color: "white !important",
                        }}
                      >
                        {isUpdateLoading && (
                          <CircularProgress size={20} color="white" />
                        )}
                        Update TaxInvoice/Debit Note
                      </ThemeButton>
                    ) : (
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
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel value="2" sx={{ padding: "0px" }}>
            <AuditTimeLine
              id={formik.values.id}
              page="receivable"
              service={menuConfigUrl.account}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
}
