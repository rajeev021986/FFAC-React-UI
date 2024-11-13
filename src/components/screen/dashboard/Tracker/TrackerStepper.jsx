import { Accordion, AccordionSummary, Typography, AccordionDetails, Grid, Stack } from '@mui/material'
import React from 'react'
import {ExpandMore, LocationOnOutlined,ViewWeekOutlined } from '@mui/icons-material';
import VerticalTimeline from '../../../common/Timeline/VerticalTimeline';
import { makeCapitalized } from '../../../utils/utils';
import { appDateFormat } from '../../../utils/date';

export default function TrackerStepper({
    trackingData
}) {
    console.log(trackingData)
    return (
        <Grid item xs={12} mt={4} >
            {
                Array.isArray(trackingData.rows) && trackingData.rows.map((row, index) => (
                    <Accordion defaultExpanded={false} key={index} >
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Stack spacing={3} direction="row" >
                                <ViewWeekOutlined color="text.primary"/>
                                <Typography>{row.containerno}</Typography>
                                <Typography>{row.cont_size}</Typography>
                                <Typography>{makeCapitalized(row.cont_location)}</Typography>
                                <Typography>{row.cont_status}</Typography>
                                <Typography>{appDateFormat(row.cont_status_date)}</Typography>
                            </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                            <VerticalTimeline 
                            position='alternate'
                            sx={{text : {fontSize: '1rem',fontWeight: 'normal'}}}
                            icon = {<LocationOnOutlined color="primary"/>}
                            steps={StepperGenerator(row,trackingData)} />
                        </AccordionDetails>
                    </Accordion>
                ))
            }
        </Grid>
    )
}





const StepperGenerator = (data,trackingData) => {
    const steps = [];
    const mileStone = data.mileStone;
    const railMileStone = data.railMileStone;
    const truckMileStone = data.truckMileStone;

    steps.push({
        label : trackingData.pol, isCompleted : true
    });

    if(mileStone['Vessel Departure']){
        steps.push({
            label : (<>
                <Typography variant="subtitle2">Vessel Departure . {data.vessel} /{data.voyage}</Typography>
                <Typography variant="subtitle1">ATD: {mileStone['Vessel Departure'].atd} &nbsp; ETD: {mileStone['Vessel Departure'].etd}</Typography>
            </>), 
            isCompleted : mileStone['Vessel Departure'] ? true : false
        });
    }
    if(mileStone['Vessel Arrival']){
        steps.push({
            label : (<>
                <Typography variant="subtitle2">Vessel Arrival . {data.vessel} /{data.voyage}</Typography>
                <Typography variant="subtitle1">ATA: {mileStone['Vessel Arrival'].ata} &nbsp; ETA: {mileStone['Vessel Arrival'].eta}</Typography>
            </>), 
            isCompleted : mileStone['Vessel Arrival'] ? true : false
        });
    }
    if(mileStone['Available for Pickup']){
        steps.push({
            label : (<>
                <Typography variant="subtitle2">Available for Pickup</Typography>
                <Typography variant="subtitle1">{mileStone['Available for Pickup']}</Typography>
            </>), 
            isCompleted : mileStone['Available for Pickup'] ? true : false
        });
    }
    if(mileStone['Picked Up']){
        steps.push({
            label : (<>
                <Typography variant="subtitle2">Picked Up</Typography>
                <Typography variant="subtitle1">{mileStone['Picked Up']}</Typography>
            </>), 
            isCompleted : mileStone['Picked Up'] ? true : false
        });
    }

    if(trackingData.destination !== trackingData.pod){ // if destination is not same as pod
        steps.push({
            label : trackingData.pod, 
            isCompleted : true
        });
        for(let key in railMileStone){                 // add rail milestones
            steps.push({
                label : railMileStone[key], 
                isCompleted : true
            });
        }
        for(let key in truckMileStone){                // add truck milestones
            steps.push({
                label : truckMileStone[key], 
                isCompleted : truckMileStone[key] ? true : false
            });
        }
    }
    steps.push({
        label : (<>
            <Typography variant="subtitle2">Empty Returned</Typography>
            <Typography variant="subtitle1">{data.empty_return_date}</Typography>
        </>), 
        isCompleted : data.empty_return_date ? true : false
    });
    steps.push({
        label : trackingData.destination, 
        isCompleted : true
    });

    return steps;
}