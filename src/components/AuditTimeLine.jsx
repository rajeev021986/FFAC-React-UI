import React, { useEffect } from "react";
import Timeline from "./Timeline";
import { Button, Grid } from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import Loader from "./common/Loader/Loader";
function AuditTimeLine({ auditDetails, reloadDataHandler, loading }) {
  console.log(auditDetails, "auditDetails");
  useEffect(() => {
    reloadDataHandler();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ minHeight: "55vh" }}>
          <Grid
            container
            justifyContent="flex-end"
            marginBottom={2}
            marginTop={2}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshOutlinedIcon />}
              onClick={reloadDataHandler}
              sx={{ borderRadius: "17px 18px 18px 17px" }}
            >
              Refresh
            </Button>
          </Grid>
          <Timeline data={auditDetails?.body} />
        </div>
      )}
    </>
  );
}

export default AuditTimeLine;
