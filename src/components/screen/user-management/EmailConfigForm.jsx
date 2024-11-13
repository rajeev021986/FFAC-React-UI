import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import SelectBox from '../../common/SelectBox';

const options = [
    {label:'Yes',value:'1'},
    {label:'No',value:'0'}
]

export default function EmailConfigForm({
    formik
}) {
  return (
    <Box>
        <Typography variant="subtitle2" component={"h6"} sx={{
            mb : 2,
            color : "primary.main",
            borderBottom : "2px solid #1976d2",
            width : "fit-content"
        }} >Email Configuration</Typography>
        <Stack spacing={2} direction="row" justifyContent="space-between">
            <SelectBox 
                label="Send ETA Change Alert"
                id="send_etachange_alert"
                options={options} 
                value={formik.values.send_etachange_alert}
                error={formik.errors.send_etachange_alert}
                onChange={formik.handleChange}
            />
            <SelectBox 
                label="Send PAN Alert"
                id="send_pan_alert"
                options={options} 
                value={formik.values.send_pan_alert}
                error={formik.errors.send_pan_alert}
                onChange={formik.handleChange}
            />
        </Stack>
    </Box>
  )
}
