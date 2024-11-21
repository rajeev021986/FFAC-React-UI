import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from "@mui/lab";
import GridTable from "./GridTable";

function TimelineComponent({ data }) {
    const [isActive, setIsActive] = useState(false);

    const handleButtonClick = () => {
        setIsActive(!isActive);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "20px" }}>
            {data?.length > 0 ? (
                <Timeline>
                    {data?.map((entry, index) => (
                        <div style={{ display: "flex" }} key={index}>
                            <TimelineItem position="left">
                                <TimelineSeparator>
                                    <TimelineDot sx={{ backgroundColor: "primary.main" }} />
                                    {index < data.length - 1 && (
                                        <TimelineConnector
                                            sx={{
                                                height: '100%',
                                                backgroundColor: "primary.main"
                                            }}
                                        />
                                    )}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography variant="body1" color="textSecondary">
                                        {new Date(entry.date).toLocaleString()}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                            <div style={{ flexGrow: 1, marginTop: "10px" }}>
                                <Accordion>
                                    <AccordionSummary>
                                        <Typography sx={{ flexGrow: 1, color: 'primary.main' }}>
                                            {entry.label}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                borderColor: "primary.main",
                                                color: "primary.main",
                                                textTransform: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                            onClick={handleButtonClick}
                                        >
                                            <span>More Details</span>
                                            <ArrowForwardIosIcon
                                                fontSize="small"
                                                sx={{
                                                    transform: isActive ? 'rotate(-90deg)' : 'rotate(90deg)',
                                                }}
                                            />
                                        </Button>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <GridTable data={entry.value} />
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </div>
                    ))}
                </Timeline>
            ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="h5">Audit details not available.</Typography>
                </div>
            )}
        </div>
    );
}

export default TimelineComponent;
