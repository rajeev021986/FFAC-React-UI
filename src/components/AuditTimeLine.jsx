
import React, { useEffect } from "react";
import Timeline from "./Timeline";
import { Button, Grid } from "@mui/material";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
function AuditTimeLine({ auditDetails, reloadDataHandler }) {
  useEffect(() => {
    reloadDataHandler();
  }, [])
  
  return (
    <div>
      <Grid container justifyContent="flex-end" marginBottom={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshOutlinedIcon />}
          onClick={reloadDataHandler}
        >
          Refresh
        </Button>
      </Grid>
      <Timeline data={auditDetails.body} />
    </div>
  )
}

export default AuditTimeLine;

