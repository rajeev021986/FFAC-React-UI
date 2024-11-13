import { Box, Grid } from '@mui/material'
import React from 'react'
import { MoreVert } from '@mui/icons-material'
import CardField from '../../../common/Cards/CardField';
import TMenu from '../../../common/TMenu';
import AppStepper from '../../../common/Timeline/AppStepper';
import CircularTimeline from '../../../common/Timeline/CircularTimeline';
import { getBLTrackingDetails, getPLTrackingDetails } from './methods.tracking';
import VerticalTimeline from '../../../common/Timeline/VerticalTimeline';





export default function PackingListCardItem({ item, columns, uniqueId, actions }) {

    // remove id from columns
    columns = columns.filter(column => {
        return column.field !== 'id' && column.field !== 'action';
    });

    const BLTrackingDetails = getBLTrackingDetails(item);
    const PLTrackingDetails = getPLTrackingDetails(item);

    const fieldFormater = (field)=>{
        if(field === 'bl_no'){
            return (item[field] === 'NA' || item[field] === '') ?
                    'To Be Advised' : item[field];
        }
        return item[field];
    }

    return (
        <Box sx={styles.root_item} >
            <Box sx={styles.card_left_box}>

                {/* <CircularTimeline steps={PLTrackingDetails} /> */}
                <VerticalTimeline steps={PLTrackingDetails} />
                
            </Box>

            <Box sx={styles.card_right_box} >
                <Grid container spacing={1} width="100%" >
                    {
                        columns.map((column, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index} >
                                <CardField title={column.headerName} subtitle={fieldFormater(column.field)} />
                            </Grid>
                        ))
                    }
                </Grid>
               {BLTrackingDetails && <Box sx={styles.trackerBox} >
                    <AppStepper 
                    activeStep={3} 
                    steps={BLTrackingDetails} 
                    />
                </Box>}
            </Box>

            <Box>
                {/* action */}
                <TMenu
                    buttonIcon={<MoreVert />}
                    buttonProps={{ color: 'text.secondary' }}
                    menuItems={actions}
                    params={{ row: item }}
                    action={true}
                />
            </Box>

        </Box>
    )
}



const styles = {
    root_item: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '98%',
        padding: '10px',
        p: 0,
        // border: '1px solid #e0e0e0',
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;',
        margin: 'auto',
        mb: 2,
        borderRadius: '10px',
    },
    card_left_box: {
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'center',
        width: '14%',
        padding: '10px',
        height: '100%'
    },
    card_right_box: {
        width: '86%',
        height: '100%',
        pb: 1,
        display: 'flex',
        flexDirection: 'column',

    },
    icon: {
        backgroundColor: 'primary.light',
        borderRadius: '10px',
        padding: '10px',
    },
    trackerBox : {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding : 2,
        // backgroundColor: 'primary.light',
        // boxShadow: 'rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;',
        borderRadius: '10px',
        mt: 2,
        mb: 1   
    }
}
