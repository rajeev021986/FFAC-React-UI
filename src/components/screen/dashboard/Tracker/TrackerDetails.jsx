import { Box, Chip, Divider, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import Map from '../../../common/Map'
import { RadioButtonCheckedOutlined, CheckCircleOutline, QueryBuilderOutlined } from '@mui/icons-material'
import { makeCapitalized } from '../../../utils/utils'
import { MapTheme } from './map-theme'
import { getVesselDirectionAndPosition } from './vessel-position'


export default function TrackerDetails({trackingData}) {
    const [trackingPath, setTrackingPath] = React.useState([]);

    React.useEffect(() => {
        let pol = trackingData?.pol;
        let pod = trackingData?.pod;
        let destination = trackingData?.destination;
        let trackingPathArr = [];
        let vesselDetails = trackingData?.vessel_details?.data ?? null

        trackingPathArr.push({address : pol, icon : './images/m1.png'});
        if(vesselDetails){
            let vesselLoc = getVesselDirectionAndPosition(vesselDetails.attributes);
            trackingPathArr.push({
                lat: vesselDetails.attributes.latitude,
                lng: vesselDetails.attributes.longitude,
                address : 'Vessel Position',
                icon : `./images/${vesselLoc.direction}.png`,
            });
        }
        if(pod !== destination){
            trackingPathArr.push({address : pod, icon : './images/m1.png'});
        }
        trackingPathArr.push({address : destination, icon : './images/m1.png'});
        console.log('trackingPathArr',trackingPathArr)
        setTrackingPath(trackingPathArr);
    },[trackingData])

    return (
        <React.Fragment>
            <Grid item xs={12} height={"40vh"}>
                <Map locations={trackingPath} type="route" zoom={2} theme={MapTheme} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" color="primary">{trackingData?.mblno}</Typography>
                <Stack spacing={2} direction={"row"} >
                    <Chip label={trackingData?.scaccode}  sx={{ color: 'error.main' ,backgroundColor: 'error.extlight', borderRadius : '5px' }} /> 
                    <Chip label={trackingData?.fileno} sx={{ color: 'error.info', backgroundColor: 'gray', borderRadius : '5px' }} /> 
                </Stack >
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={4}>
                <TrackingStatusField 
                    title="Port of Lading" 
                    subtitle={makeCapitalized(trackingData?.pol)} 
                    dateTitle={trackingData?.atd === '' || !trackingData?.atd ? 'ETD' : 'ATD'} 
                    date={trackingData?.atd === '' || !trackingData?.atd ? trackingData?.etd : trackingData?.atd}
                    statusSwitch={trackingData?.atd === ''  || !trackingData?.atd ? 'off' : 'on'}
                />
            </Grid>
            <Grid item xs={4}>
                <TrackingStatusField 
                    title="Port of Discharge" 
                    subtitle={makeCapitalized(trackingData?.pod)} 
                    dateTitle={trackingData?.ata === '' || !trackingData?.ata ? 'ETA' : 'ATA'}
                    date={trackingData?.ata === '' || !trackingData?.ata  ? trackingData?.eta : trackingData?.ata}
                    statusSwitch={trackingData?.ata === '' || !trackingData?.ata ? 'off' : 'on'}
                />
            </Grid> 
            <Grid item xs={4}>
                <TrackingStatusField 
                title="Destination"
                subtitle={makeCapitalized(trackingData?.destination)}
                statusSwitch={trackingData?.destination_date ? 'on' : 'off'}
                date={trackingData?.destination_date ? trackingData?.destination_date : 'NA'}
                />
            </Grid>
        </React.Fragment>
    )
}




function TrackingStatusField({title,statusSwitch='off',subtitle,dateTitle,date}){
    const color = statusSwitch === 'on' ? 'success' : 'disabled';
    return (
        <Stack spacing={2} direction="row">
            <Stack>
                <RadioButtonCheckedOutlined color={color} />
            </Stack>
            <Stack>
                <Typography variand="subtitle1" >{title}</Typography>
                <Typography variand="subtitle2" sx={{fontSize : '1.2rem'}} >{subtitle}</Typography>
            </Stack>
            {date && <Stack>
                <Typography variand="subtitle1"  >{dateTitle}</Typography>
                <Chip 
                    label={date} 
                    sx={{ backgroundColor : color+'.extlight'}}
                    icon={statusSwitch === 'off' ? 
                    <QueryBuilderOutlined color={color}/> : 
                    <CheckCircleOutline color={color} /> }
                />
            </Stack>}
        </Stack>
    )
}
