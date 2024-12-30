import React from 'react'
import InputBox from '../../../common/InputBox'
import { Grid, Stack, TextField } from '@mui/material'
import { OutlinedButton, ThemeButton } from '../../../common/Button'

export default function ExchangeInputs({ formik, nav, type }) {
  return (
    <Grid container spacing={2} >
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <TextField
          label="From Date"
          name='fromDate'
          type="datetime-local"
          value={formik.values.fromDate}
          error={formik.errors.fromDate}
          onChange={formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <TextField
          label="To Date"
          type="datetime-local"
          name='toDate'
          value={formik.values.toDate}
          error={formik.errors.toDate}
          onChange={formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="Currency"
          id="currency"
          value={formik.values.currency}
          error={formik.errors.currency}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="USD Exchange"
          id="usdExchange"
          value={formik.values.usdExchange}
          error={formik.errors.usdExchange}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
        <InputBox
          label="UGX Exchange"
          id="ugxExchange"
          value={formik.values.ugxExchange}
          error={formik.errors.ugxExchanges}
          onChange={formik.handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2}>
            <OutlinedButton sx={{ fontWeight: "500" }} onClick={() => nav(-1)}>
              Cancel
            </OutlinedButton>
            <ThemeButton
              onClick={formik.handleSubmit}
              sx={{ fontWeight: "500" }}
            >
              {type == "Edit" ? "Update" : "Add"}
            </ThemeButton>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  )
}
