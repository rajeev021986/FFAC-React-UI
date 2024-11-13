import { Box, Stack } from '@mui/material'
import React from 'react'

export default function ScreenToolbar({leftComps, rightComps}) {
    return (
        <Stack
            justifyContent={"space-between"}
            alignItems={"center"}
            direction="row"
            spacing={2}
            my={2}
        >
            <Box display={"flex"} gap={2} >
                {leftComps}
            </Box>
            <Box display={"flex"} gap={2} >
                {rightComps}
            </Box>
        </Stack>
    )
}
