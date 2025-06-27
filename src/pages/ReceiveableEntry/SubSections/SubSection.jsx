import { useFormik } from "formik";
import { CircularProgress, Grid, Stack, Tab, TextField } from "@mui/material";
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
import ApiManager from "../../../services/ApiManager";

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
  const [loaderApprove, setLoaderApprove] = useState({
    approve: false,
    reject: false,
  });
  const [value, setValue] = React.useState("1");
  const [rejectError, setRejectError] = useState(false);
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
      if (
        payload.details?.length === 0 ||
        formik.values.paybleDetails?.length === 0
      ) {
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
      if (!formik.values?.customerId) {
        return toast.custom(
          <CustomToast
            message={
              "Please add Customer Name to create TaxInvoice/Debit Note"
            }
            toast="error"
          />,
          {
            closeButton: false,
          }
        );
      }
      if (
        (values.currency === "USD" && values.exchangeRate === "1") ||
        !values.exchangeRate
      ) {
        return toast.custom(
          <CustomToast
            message={
              "Please select currency and exchange rate to create Tax Invoice / Debit Note"
            }
            toast="error"
          />,
          { closeButton: false }
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

  // const data = setgetDataFormParams(formik?.values);

  useEffect(() => {
    getFirstError(formik.errors);
  }, [formik.errors]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (formik?.values?.currency && formik?.values?.exchangeRate) {
      setgetDataFormParams({
        currency: formik.values.currency,
        exchangeRate: formik.values.exchangeRate,
        type: formik.values.type,
      });
    }
  }, [formik?.values?.currency, formik?.values?.exchangeRate]);
  const handleApproveRequest = async () => {
    if (formik.values.details.length === 0) {
      toast.custom(
        <CustomToast
          message="Please add atleast one entry to approve TaxInvoice/Debit Note"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
      return;
    }
    try {
      setLoaderApprove((prevState) => ({
        ...prevState,
        approve: true,
      }));

      const response = await ApiManager.reciveableApproveHandler(
        formik.values.id,
        "RECEIVABLE_ENTRY"
      );
      const message = response.message;
      nav("/app/accounts/operations/approveReceivable");
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while approve payable"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
    }

    setLoaderApprove((prevState) => ({
      ...prevState,
      approve: false,
    }));
  };

  const handleReject = async () => {
    if (!formik.values.rejectRemarks) {
      setRejectError(true);
      toast.custom(
        <CustomToast message="Reject remarks to be filled!" toast="warn" />,
        {
          closeButton: false,
        }
      );
      return;
    }
    if (formik.values.details.length === 0) {
      setRejectError(true);
      toast.custom(
        <CustomToast
          message="Please add atleast one entry to reject TaxInvoice/Debit Note"
          toast="error"
        />,
        {
          closeButton: false,
        }
      );
      return;
    }
    try {
      const response = await ApiManager.reciveableRejectHandler(
        formik.values.id,
        "RECEIVABLE_ENTRY",
        formik?.values?.rejectRemarks
      );
      const message = response.message;
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
      nav("/app/accounts/operations/receivableEntry");
    } catch (error) {
      toast.custom(<CustomToast message="Failed to reject." toast="error" />, {
        closeButton: false,
      });
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", padding: 0, margin: 0 }}>
        <TabContext value={value}>
          {page !== "approveReceivableEntry" && (
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              {type !== "edit" ? (
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <TabList
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
                    label="Receivable Details"
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
          )}

          <TabPanel value="1" sx={{ padding: 0 }}>
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  margin: "8px",
                  padding: 1,
                }}
              >
                {/* {page !== "approveReceivableEntry" && ( */}
                <JobProfitAndLoss formik={formik} page={page} />
                {/* )} */}
                <AddDebitAndInvoice formik={formik} isViewDisabled={false} />
              </Box>

              <Box sx={{ gap: "10px", padding: "15px" }}>
                {formik?.values?.status?.toLowerCase() === "rejected" ||
                page == "approveReceivableEntry" ? (
                  <Grid item xs={12} paddingTop={1}>
                    <TextField
                      label="Reject Remarks"
                      name="rejectRemarks"
                      value={formik.values.rejectRemarks}
                      error={rejectError}
                      helperText={
                        rejectError
                          ? "Reject remarks are required when rejecting a entry*."
                          : formik.errors.rejectRemarks
                      }
                      onChange={formik.handleChange}
                      disabled={page === "receivableEntry" ? true : false}
                      multiline
                      rows={4}
                      variant="outlined"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                        },
                      }}
                    />
                  </Grid>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            {page == "receivableEntry" ? (
              <Box sx={{ display: "flex", gap: "10px", padding: "15px" }}>
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    spacing={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={2}>
                      <OutlinedButton
                        sx={{
                          fontWeight: "500",
                        }}
                        onClick={() =>
                          page === "receivableEntry"
                            ? nav("/app/accounts/operations/receivableEntry")
                            : nav("/app/accounts/operations/approveReceivable")
                        }
                      >
                        Close
                      </OutlinedButton>

                      {!formik.values?.id ? (
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
                      ) : (
                        <ThemeButton
                          onClick={formik.handleSubmit}
                          sx={{
                            fontWeight: "500",
                            color: "white !important",
                          }}
                          // disabled={isDisabled}
                          disabled={formik.values?.statusCode === -3}
                        >
                          {isUpdateLoading && (
                            <CircularProgress size={20} color="white" />
                          )}
                          Update TaxInvoice/Debit Note
                        </ThemeButton>
                      )}
                    </Stack>
                  </Stack>
                </Grid>
              </Box>
            ) : (
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
                        sx={{
                          fontWeight: "500",
                          // display: viewPage === "editForm" ? "none" : "block",
                        }}
                        onClick={() =>
                          page === "receivableEntry"
                            ? nav("/app/accounts/operations/receivableEntry")
                            : nav("/app/accounts/operations/approveReceivable")
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
                        {isUpdateLoading && (
                          <CircularProgress size={20} color="white" />
                        )}
                        Update TaxInvoice/Debit Note
                      </ThemeButton>

                      <ThemeButton
                        sx={{
                          fontWeight: "500",
                          backgroundColor: "red",
                          color: "white !important",
                        }}
                        onClick={() => handleReject()}
                      >
                        {loaderApprove.reject && (
                          <CircularProgress size={20} color="white" />
                        )}
                        Reject
                      </ThemeButton>

                      <ThemeButton
                        sx={{
                          fontWeight: "500",
                          color: "white !important",
                          // visibility:
                          //   viewPage === "editForm" ? "hidden" : "visible",
                        }}
                        onClick={() => handleApproveRequest()}
                      >
                        {loaderApprove.approve && (
                          <CircularProgress size={20} color="white" />
                        )}
                        Approve
                      </ThemeButton>
                    </Stack>
                  </Stack>
                </Grid>
              </Box>
            )}
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
