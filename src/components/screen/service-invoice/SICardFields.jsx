import { Grid,Typography,Input, TextField } from '@mui/material'
import React from 'react'
import AppDatePicker from '../../common/AppDatePicker'

export default function SICardFields({ title,type, ...props }) {
  return (
    <Grid container spacing={1} alignItems="center" >
        <Grid item xs={6} alignItems={"center"}>
            <Typography variant="subtitle2" sx={styles.text} >{title}: </Typography>
        </Grid>
        <Grid item xs={6}>
            {
                type === 'date' ? <AppDatePicker {...props} size="small" label=""/>  : 
                type === 'text' ? <Typography variant="subtitle1" sx={styles.text} >{props.value}</Typography> :
                <Input {...props} size="small" />
            }
        </Grid>
    </Grid>
  )
}


const styles = {
    text: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
}