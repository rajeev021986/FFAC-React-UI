import React, { useEffect, useState } from "react";
import Timeline from "./Timeline";
import { Button, Grid } from "@mui/material";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import Loader from "./common/Loader/Loader";
import { reloadDataHandler } from "../services/common/AuditDetails";
function AuditTimeLine({ id, page, service }) {
  const [auditDetails, setAuditDetails] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const refresher = () =>
    reloadDataHandler(id, page, service, setAuditDetails, setAuditLoading);
  useEffect(() => {
    // reloadDataHandler(id, page, service, setAuditDetails, setAuditLoading);
    refresher();
  }, []);

  return (
    <>
      {auditLoading ? (
        <Loader />
      ) : (
        <div style={{ minHeight: "55vh", padding: 0, margin: "0px 8px" }}>
          <Grid container justifyContent="flex-end" marginTop={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshOutlinedIcon />}
              onClick={refresher}
              sx={{
                borderRadius: "50px",
                color: "white !important",
                fontSize: { xs: "0.8rem", sm: "0.875rem" }
              }}
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
