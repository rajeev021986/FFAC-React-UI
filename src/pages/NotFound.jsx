import { Box, Typography } from '@mui/material';
import React from 'react'

export default function NotFound() {

    const TITLE = '404 Not Found';
    const DESCRIPTION = 'The page you are looking for does not exist.';

    return (
        <Box
        sx={{
            display : "flex",
            flexDirection : "column",
            justifyContent : "center",
            alignItems : "center",
        }}
        >
            <Typography variant="h3" component="h1">{TITLE}</Typography>
            <Typography variant="body1" component="p">{DESCRIPTION}</Typography>
        </Box>
    )
}
