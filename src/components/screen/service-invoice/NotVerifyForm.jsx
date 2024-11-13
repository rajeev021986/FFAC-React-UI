import React from 'react'

import { Alert, AlertTitle, Box, Stack } from '@mui/material';
import { OutlinedButton } from '../../common/Button';
import InputBox from '../../common/InputBox';
export default function NotVerifyForm({ modalFormik }) {
    return (
        <Stack p={2} spacing={2} >
            <Alert severity="warning">
                <AlertTitle>Are you sure you want to not verify this service invoice?</AlertTitle>
            </Alert>
            <InputBox
                label="Reason for not verify"
                id={"reason"}
                variant="outlined"
                value={modalFormik.values.reason}
                onChange={modalFormik.handleChange}
                error={modalFormik.errors.reason}
                fullWidth
                multiline
                rows={3}
            />
            <Box display="flex" justifyContent={"end"} >
                <OutlinedButton onClick={modalFormik.handleSubmit} size={"small"} color="error" >Reject</OutlinedButton>
            </Box>
        </Stack>
    )
}
