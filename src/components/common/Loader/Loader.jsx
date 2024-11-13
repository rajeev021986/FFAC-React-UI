import { Box, CircularProgress } from '@mui/material'
import React from 'react'

export default function Loader({ size = 30, color = 'primary', screen = 'full' }) {
  if(screen === 'full'){
    return (
      <Box sx={{display : 'flex', justifyContent : 'center', alignItems : 'center', height : '70vh'}} >
        <CircularProgress size={size} color={color} />
      </Box>
    )
  }else{
    return (
      <Box sx={{display : 'flex', justifyContent : 'center', alignItems : 'center', height : '100vh', width: '100%'}} >
          <CircularProgress size={size} color={color} />
      </Box>
    )
  }
}
