
import React, { useEffect } from "react";
import Timeline from "./Timeline";
import { Button, Grid } from "@mui/material";
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Loader from "./common/Loader/Loader";
function AuditTimeLine({ auditDetails, reloadDataHandler, loading }) {
  useEffect(() => {
    reloadDataHandler();
  }, [])

  return (
    <>{loading ? <Loader /> : <div>
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
    </div>}</>
  )
}

export default AuditTimeLine;

