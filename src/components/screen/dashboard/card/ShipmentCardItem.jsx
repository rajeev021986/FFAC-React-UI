import { Avatar, Box, Chip, Grid, IconButton, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { DirectionsBoat, GpsFixedOutlined, MoreVert } from '@mui/icons-material'
import CardField from '../../../common/Cards/CardField';
import TMenu from '../../../common/TMenu';
import AppStepper from '../../../common/Timeline/AppStepper'; 
import { SHIPMENT_STATUS_OBJ } from '../../../../data/enums';
import { appDateFormat } from '../../../utils/date';
// import tranmodalLogo from '../../../../assets/images/TransmodalBlackLogo.png';


import tranmodalLogo from '../../../../assets/images/tflLogo.png'





export default function ShipmentCardItem({ item, columns, uniqueId, actions, handleTrackingSlide }) {

    // remove id from columns
    columns = columns.filter(column => {
        return column.field !== 'id' && 
        column.field !== 'action' &&
        column.field !== 'pol' &&
        column.field !== 'pod' &&
        column.field !== 't49_eta' &&
        column.field !== 'departure_date' &&
        column.field !== 't49_vessel_actualarrived_date' &&
        column.field !== 't49_vessel_actualdeparted_date' &&
        column.field !== 'status'
    });

    /*
    keys::
    place_of_delivery: "Destination"
    delivery_customer_date: "Destination Date"
    */
    const trackingDetails = [
        {info: item.pol+' - '+appDateFormat(item.departure_date)+' - '+appDateFormat(item.t49_vessel_actualdeparted_date)},
        {info: item.pod+' - '+appDateFormat(item.t49_eta)+' - '+appDateFormat(item.t49_vessel_actualarrived_date)},
        {info: item.place_of_delivery+' - '+appDateFormat(item.delivery_customer_date)}
    ];

    const fieldFormater = (field)=>{
        if(field === 'status'){
            return item[field]?.key
        }
        return item[field];
    }



    return (
        <Box sx={styles.root_item} >
            <Box sx={styles.card_left_box}>
                <Box width="100%" textAlign={"center"}>
                    <img src={item?.carrier?.logo || tranmodalLogo} alt="carrier" width={"auto"} height="30px" />
                </Box>
               <Avatar sx={{
                ...styles.icon, 
                backgroundColor: SHIPMENT_STATUS_OBJ[item.status.key]?.color+'.extlight',
                color: SHIPMENT_STATUS_OBJ[item.status.key]?.color+'.main'
                }}>
                     <Typography variant="h6" >{SHIPMENT_STATUS_OBJ[item?.status.key]?.icon}</Typography>
                <Typography variant="subtitle2" >{item?.status?.key?.toUpperCase()}</Typography>
               </Avatar>
            </Box>

            <Box sx={styles.card_right_box} >
                {trackingDetails && <Box sx={styles.trackerBox} >
                    <AppStepper 
                    activeStep={3} 
                    steps={trackingDetails} 
                    />
                    <Tooltip
                        title="Track Shipment"
                    >
                        <Chip 
                        onClick={()=>handleTrackingSlide(item)} 
                        color="success" 
                        label="Track"
                        icon={<GpsFixedOutlined />}
                        sx={{color: 'success.main', backgroundColor: 'success.light', 
                            '&:hover': {backgroundColor: 'success.light'}
                        }}
                        />
                        
                    </Tooltip>
                </Box>}
                <Grid container spacing={1} width="100%" >
                    {
                        columns.map((column, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index} >
                                <CardField title={column.headerName} subtitle={fieldFormater(column.field)} />
                            </Grid>
                        ))
                    }
                </Grid>
               
            </Box>

            {/* action */}
            {/* <Box>
                <TMenu
                    buttonIcon={<MoreVert />}
                    buttonProps={{ color: 'text.secondary' }}
                    menuItems={actions}
                    params={{ row: item }}
                    action={true}
                />
            </Box> */}

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
        py: 2,
        // border: '1px solid #e0e0e0',
        // boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;',
        boxShadow: ' rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;;',
        margin: 'auto',
        mb: 1,
        borderRadius: '10px',
    },
    card_left_box: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '12%',
        padding: '10px',
        height: '100%'
    },
    card_right_box: {
        width: '88%',
        height: '100%',
        pb: 1,
        display: 'flex',
        flexDirection: 'column',

    },
    icon: {
        backgroundColor: 'primary.light',
        borderRadius: '10px',
        padding: '10px',
        height : '7rem',
        width : '7rem',
        color : 'primary.main',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
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
        // mt: 2,
        mb: 2   
    }
}
