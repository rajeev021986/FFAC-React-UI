import { Grid, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { appDateFormat } from "../../utils/date";
import { StatusChip } from "../../utils/statusChip";

export default function CardField({ title, subtitle, icon, ...props }) {
  const valuFormater = (value) => {
    // should not except 88, 78 ...  numbers
    let date = new Date(value);
    let isString = typeof value === "string";
    if (date instanceof Date && !isNaN(date) && isString) {
      return appDateFormat(value);
    } else {
      return value;
    }
  };

  return (
    <Grid container spacing={1} {...props}>
      <Grid item xs={4}>
        {icon ? icon : null}
        <Typography variant="subtitle2" sx={styles.text}>
          {title}:{" "}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        {title === "Status" ? (
          <div style={{ marginLeft: "10px" }}>
            {StatusChip(subtitle.toLowerCase(), "status")}
          </div>
        ) : title === "Document" ? (
          <div style={{ marginLeft: "10px" }}>
            {StatusChip(subtitle, "document")}
          </div>
        ) : (
          <Tooltip title={subtitle} arrow>
            <Typography
              variant="subtitle1"
              sx={{
                ml: 5,
                width: "80%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </Typography>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
}

const styles = {
  // if overflow then ellipsis
  text: {
    // overflow: "hidden",
    // textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
