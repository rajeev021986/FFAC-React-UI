import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineOppositeContent,
} from "@mui/lab";
import GridTable from "./GridTable";

// Utility function to convert UTC date to local date
function convertUTCDateToLocalDate(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate;
}

function TimelineComponent({ data }) {
  const [isActive, setIsActive] = useState([]);

  const handleButtonClick = (ind) => {
    setIsActive((prevActive) => {
      if (prevActive.includes(ind)) {
        return prevActive.filter((item) => item !== ind);
      } else {
        return [...prevActive, ind];
      }
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "8px",
        }}
      >
        {data?.length > 0 ? (
          <Timeline sx={{ padding: 0, margin: 0 }}>
            {data.map((entry, index) => (
              <div style={{ display: "flex", padding: "0px" }} key={index}>
                <TimelineItem
                  position="left"
                  sx={{
                    width: "25%",
                    "&::before": {
                      content: "none",
                    },
                    paddingRight: "40px",
                  }}
                >
                  <TimelineSeparator>
                    <TimelineConnector
                      sx={{
                        height: "100%",
                        backgroundColor: "primary.main",
                      }}
                    />
                    <TimelineDot sx={{ backgroundColor: "primary.main" }} />
                    <TimelineConnector
                      sx={{
                        height: "100%",
                        backgroundColor: "primary.main",
                      }}
                    />
                  </TimelineSeparator>
                  <TimelineOppositeContent
                    sx={{
                      m: "auto 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    variant="body2"
                    color="text.secondary"
                  >
                    <Typography variant="body1" color="textSecondary">
                      {convertUTCDateToLocalDate(new Date(entry.date)).toLocaleString()}
                    </Typography>
                  </TimelineOppositeContent>
                </TimelineItem>
                <div
                  style={{ marginTop: "10px", width: "75%" }}
                  onClick={() => handleButtonClick(index)}
                >
                  <Accordion sx={{ width: "100%" }}>
                    <AccordionSummary
                    >
                      <Typography sx={{ flexGrow: 1, color: "primary.main" }}>
                        {entry.label}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "primary.main",
                          color: "primary.main",
                          textTransform: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          borderRadius: "17px 18px 18px 17px",
                        }}
                      >
                        <span>More Details</span>
                        <ArrowForwardIosIcon
                          fontSize="small"
                          sx={{
                            transform: isActive.includes(index)
                              ? "rotate(-90deg)"
                              : "rotate(90deg)",
                          }}
                        />
                      </Button>
                    </AccordionSummary>
                    <AccordionDetails onClick={(e) => e.stopPropagation()}>
                      <GridTable data={entry.value} />
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
            ))}
          </Timeline>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Audit details not available.</Typography>
          </div>
        )}
      </div>
    </>
  );
}

export default TimelineComponent;
