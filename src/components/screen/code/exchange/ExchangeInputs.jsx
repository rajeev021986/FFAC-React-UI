import React from 'react'
import InputBox from '../../../common/InputBox'
import { Grid, TextField } from '@mui/material'

export default function ExchangeInputs({ formik, ChargeSettingsData, nav, type }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <TextField
          label="From Date"
          name='fromDate'
          type="date"
          value={formik.values.fromDate}
          error={formik.errors.fromDate}
          onChange={formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Grid> <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <TextField
          label="To Date"
          type="date"
          name='toDate'
          value={formik.values.toDate}
          error={formik.errors.toDate}
          onChange={formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Grid><Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Currency"
          id="Currency"
          value={formik.values.Currency}
          error={formik.errors.Currency}
          onChange={formik.handleChange}
        />
      </Grid><Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="USD Exchange"
          id="usdExchange"
          value={formik.values.usdExchange}
          error={formik.errors.usdExchange}
          onChange={formik.handleChange}
        />
      </Grid><Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="UGX Exchange"
          id="ugxExchange"
          value={formik.values.ugxExchange}
          error={formik.errors.ugxExchanges}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  )
}
