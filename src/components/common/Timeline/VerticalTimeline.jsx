import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

const defaultSteps = [
    { label: 'PL SUBMIT', isCompleted: true },
    { label: 'PL BOOKED', isCompleted: true },
    { label: 'PL FINAL', isCompleted: true },
    { label: 'BOL ISSUE', isCompleted: false },
    { label: 'SI RAISED', isCompleted: false },
];

export default function VerticalTimeline({
    steps = defaultSteps,
    position = 'left',
    sx,
    icon
}) {

    const styles = {
        text  :{ 
            fontSize:  '10px',
            fontWeight: 'bold',
            color: 'text.secondary'
        },
        ...sx
    }

    return (
        <Timeline position={position} sx={{my : 0}}>
            {steps.map((step, index) => (
                <TimelineItem key={index}>
                    <TimelineSeparator>
                        {
                            (index === 0 || steps.length - 1 === index) && icon ? 
                            <TimelineDot color='white'>
                                {icon}
                            </TimelineDot>
                             : <TimelineDot color={step?.isCompleted ? 'success' : 'gray'} />

                        }
                        {index !== steps.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={styles.text}>{step?.label}</TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}
