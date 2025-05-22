import React, { useEffect, useRef } from "react";
import { AppBar, Box, Grid, Toolbar, Typography } from "@mui/material";

// Components
import InputBox from "../../../components/common/InputBox";
import SelectBox from "../../../components/common/SelectBox";

const JobProfitAndLoss = ({ formik }) => {
  const payableRef = useRef(null);
  useEffect(() => {
    if (payableRef?.current) {
      payableRef.current.focus();
    }
  }, []);

  return (
    <React.Fragment>
      <AppBar position="static" sx={{ minHeight: "40px", borderRadius: "5px" }}>
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
          padding: "8px 0",
          margin: 0,
        }}
      >
        <Box sx={{ width: "100%", paddingRight: 2 }}>
          <Grid container sx={{ padding: 0, margin: 0 }}>
            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Job No"
                id="jobNo"
                value={formik.values.jobNo}
                error={formik.errors.jobNo}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Customer Name"
                id="customerName"
                value={formik.values.customerName}
                error={formik.errors.customerName}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Consignee Name"
                id="consigneeName"
                value={formik.values.consigneeName}
                error={formik.errors.consigneeName}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="20 FT"
                id="twentryFTContainer"
                value={formik.values.twentryFTContainer}
                error={formik.errors.twentryFTContainer}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="40 FT"
                id="fourtyFTContainer"
                value={formik.values.fourtyFTContainer}
                error={formik.errors.fourtyFTContainer}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Debit (Cost)"
                id="debitCost"
                value={formik.values.debitCost}
                error={formik.errors.debitCost}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Credit (Cost)"
                id="creditCost"
                value={formik.values.creditCost}
                error={formik.errors.creditCost}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Net (Cost)"
                id="netCost"
                value={formik.values.netCost}
                error={formik.errors.netCost}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Total Revenue"
                id="totalRevenue"
                value={formik.values.totalRevenue}
                error={formik.errors.totalRevenue}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>

            <Grid item xs={12} lg={4} paddingLeft={2} marginTop={2}>
              <InputBox
                label="Profit/Loss"
                id="profitLoss"
                value={formik.values.profitLoss}
                error={formik.errors.profitLoss}
                onChange={formik.handleChange}
                inputRef={payableRef}
                disabled
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default JobProfitAndLoss;
