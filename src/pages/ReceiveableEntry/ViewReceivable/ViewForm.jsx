import { AppBar, Box, Grid, Tab, Toolbar, Typography } from "@mui/material";
import EditIconForHeader from "../../../components/common/commonIcons/EditIcons/EditIconForHeader";
import { useFormik } from "formik";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";
import InputBox from "../../../components/common/InputBox";
import FormAutoCompleteWithLoader from "../../../components/common/AutoComplete/FormAutoCompletewithLoader";
import SelectBox from "../../../components/common/SelectBox";
import FormAutoCompleteWithExchangeLoader from "../../../components/common/AutoComplete/FormAutoCompleteWithExchangeLoader";
import AddDebitAndInvoice from "../SubSections/AddDebitAndInvoice";

export default function ViewPageForm({ page, initialValues }) {
  const [value, setValue] = useState("1");
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
  });
  const handleDate = (date) => {
    return date.split("T")[0];
  };
  console.log("formi", formik.values);
  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <TabContext value={value}>
        <TabPanel value="1" sx={{ padding: 0 }}>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                margin: "8px",
                padding: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "4px 0",
                  margin: 0,
                }}
              >
                <Box sx={{ width: "100%", paddingRight: 2 }}>
                  <Grid container sx={{ padding: 0, margin: 0 }}>
                    <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
                      <InputBox
                        label="Job No"
                        id="jobNo"
                        name="jobNo"
                        value={formik.values.jobNo}
                        error={formik.errors.jobNo}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Customer Name*"
                        id="customerId"
                        name="customerId"
                        value={formik.values.customerName}
                        error={formik.errors.customerId}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Currency"
                        id="currency"
                        name="currency"
                        value={formik.values.currency}
                        error={formik.errors.currency}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Ex. Rate"
                        id="exchangeRate"
                        name="exchangeRate"
                        value={formik.values.exchangeRate}
                        error={formik.errors.exchangeRate}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
                      <InputBox
                        label="VAT Amount"
                        id="vatAmount"
                        value={formik.values.vatAmount}
                        error={formik.errors.vatAmount}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Amount"
                        id="amount"
                        value={formik.values.amount}
                        error={formik.errors.amount}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Total Amount"
                        id="totalAmount"
                        value={formik.values.totalAmount}
                        error={formik.errors.totalAmount}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>
                    {formik?.values?.id && (
                      <>
                        <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                          <InputBox
                            label="Created Date"
                            id="createdDate"
                            value={
                              handleDate(formik.values.createdDate) || null
                            }
                            error={formik.errors.createdDate}
                            onChange={formik.handleChange}
                            disabled
                          />
                        </Grid>

                        <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
                          <InputBox
                            label="Receivable RefNo."
                            id="receivableRefNo"
                            value={formik.values.receivableRefNo}
                            error={formik.errors.receivableRefNo}
                            onChange={formik.handleChange}
                            disabled
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>

          <AddDebitAndInvoice formik={formik} isViewDisabled={true} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
