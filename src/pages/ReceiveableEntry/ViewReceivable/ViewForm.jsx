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

  const OPTION_TYPE = [
    {
      label: "Tax Invoice",
      value: "tax_invoice",
    },
    {
      label: "Debit Note",
      value: "debit_note",
    },
  ];

  return (
    <Box sx={{ padding: 0, margin: 0 }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList aria-label="lab API tabs example">
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
          </TabList>
        </Box>

        <TabPanel value="1" sx={{ padding: 0 }}>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                margin: "8px",
                padding: 1,
              }}
            >
              <AppBar
                position="static"
                sx={{ minHeight: "40px", borderRadius: "5px" }}
              >
                <Toolbar
                  sx={{
                    minHeight: "40px !important",
                    px: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: "8px !important",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography variant="body1">
                      <strong>Job Profit And Loss </strong>
                    </Typography>
                    <Typography variant="body1"></Typography>
                  </Box>
                </Toolbar>
              </AppBar>

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
                      <FormAutoCompleteWithLoader
                        label="Customer Name*"
                        id="customerId"
                        value={{
                          customerId: formik.values.customerId,
                          customerName: formik.values.customerName,
                        }}
                        error={formik.errors.customerId}
                        idKey="customerId"
                        nameKey="customerName"
                        suggestionName="customer_name"
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Consignee Name"
                        id="consigneeName"
                        value={formik.values.consigneeName}
                        error={formik.errors.consigneeName}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Debit (Cost)"
                        id="debitCost"
                        value={formik.values.debitCost}
                        error={formik.errors.debitCost}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
                      <InputBox
                        label="Credit (Cost)"
                        id="creditCost"
                        value={formik.values.creditCost}
                        error={formik.errors.creditCost}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Net (Cost)"
                        id="netCost"
                        value={formik.values.netCost}
                        error={formik.errors.netCost}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Total Revenue"
                        id="totalRevenue"
                        value={formik.values.totalRevenue}
                        error={formik.errors.totalRevenue}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>

                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <InputBox
                        label="Profit/Loss"
                        id="profitLoss"
                        value={formik.values.profitLoss}
                        error={formik.errors.profitLoss}
                        onChange={formik.handleChange}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} lg={3} paddingLeft={0} marginTop={2}>
                      <SelectBox
                        label="Invoice Type"
                        id="type"
                        name="type"
                        options={OPTION_TYPE}
                        value={formik.values.type}
                        disabled={formik.values.id ? true : false}
                        error={formik.errors.type}
                      />
                    </Grid>
                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      <SelectBox
                        label="Currency"
                        id="currency"
                        // options={mergedCurrencyOptions}
                        value={formik.values.currency}
                        error={formik.errors.currency}
                        disabled={formik.values.id ? true : false}
                      />
                    </Grid>
                    <Grid item xs={12} lg={3} paddingLeft={2} marginTop={2}>
                      {formik.values?.currency === "TZS" ||
                      formik.values?.currency === "INR" ? (
                        <InputBox
                          label="Ex. Rate"
                          id="exchangeRate"
                          value={formik.values?.currency}
                          error={formik.errors.exchangeRate}
                          onChange={formik.handleChange}
                          disabled={
                            formik.values?.currency === "TZS" ||
                            formik.values?.currency === "INR"
                          }
                        />
                      ) : (
                        <FormAutoCompleteWithExchangeLoader
                          label="Ex. Rate"
                          id="exchangeRate"
                          value={formik.values.exchangeRate}
                          error={formik.errors.exchangeRate}
                          onChange={formik.handleChange}
                          suggestionName="usd_exchange"
                          name={true}
                          other={formik.values.currency}
                          disabled={formik.values.id ? true : false}
                        />
                      )}
                    </Grid>
                    {formik.values.containerTypeDTO &&
                      formik.values.containerTypeDTO.length > 0 && (
                        <>
                          {formik.values.containerTypeDTO?.map((val, index) => (
                            <Grid
                              item
                              xs={12}
                              lg={3}
                              paddingLeft={index % 5 === 1 ? 0 : 2}
                              marginTop={2}
                              key={index}
                            >
                              <InputBox
                                label={val.type}
                                id={val.type}
                                value={val.count}
                                disabled
                              />
                            </Grid>
                          ))}
                        </>
                      )}
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Box>

          <AddDebitAndInvoice formik={formik} Isdisabled={true} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
