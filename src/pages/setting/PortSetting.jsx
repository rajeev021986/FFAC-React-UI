import React, { useEffect, useState } from "react";
import {
  Typography,
  Switch,
  FormGroup,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { OutlinedButton } from "../../components/common/Button";
import {
  useAddOptonsMutation,
  useGetOptionsSettingsQuery,
} from "../../store/api/settingsApi";
import Loader from "../../components/common/Loader/Loader";
import GlobalDrrpdownSetting from "./GlobalDrrpdownSetting";
import toast from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";

const PortSetting = () => {
  const [addOptons, { isloading }] = useAddOptonsMutation();
  const {
    data,
    isLoading,
    error: geterror,
    refetch,
  } = useGetOptionsSettingsQuery("port_settings");
  const [documentType, setDocumentType] = useState([]);
  const [basePort, setBasePort] = useState([]);
  const [type, setType] = useState([]);
  const [isLoadingsave, setIsLoading] = useState(false);

  useEffect(() => {
    setDocumentType(data?.body.documentType || []);
    setBasePort(data?.body.basePort || []);
    setType(data?.body.type || []);
  }, [data, geterror]);

  const Postdata = async () => {
    const filteredData = {
      documentType: documentType.filter(
        (item) => !item.value.includes("Type the")
      ),
      basePort: basePort.filter(
        (item) => !item.value.includes("Type the")
      ),
      type: type.filter(
        (item) => !item.value.includes("Type the")
      ),
    };
    setIsLoading(true);
    await addOptons({
      body: { port_settings: filteredData },
      type: "port_settings",
    })
      .then((res) => {
        if (res.error) {
          toast.custom(
            <CustomToast message={res.error.data.error} toast="error" />,
            {
              closeButton: false,
            }
          );
        } else {
          toast.custom(
            <CustomToast
              message="Setting Updated Successufully"
              toast="success"
            />,
            {
              closeButton: false,
            }
          );
        }
      })
      .catch(() => console.log("filteredData"));
    refetch();
    setIsLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Grid xs={12} sx={{ marginBottom: "10px" }}>
        <Typography variant="h4">Port Setting</Typography>
      </Grid>

      {isLoading ? (
        <Loader />
      ) : (
        <Grid container spacing={2} flexWrap={"wrap"}>
          <GlobalDrrpdownSetting
            value={documentType}
            setvalue={setDocumentType}
            title="Document Type"
          />
            <GlobalDrrpdownSetting
            value={basePort}
            setvalue={setBasePort}
            title="Base Port"
          />
             <GlobalDrrpdownSetting
            value={type}
            setvalue={setType}
            title="Type"
          />
        </Grid>
      )}
      <Grid
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row-reverse",
          marginTop: "10px",
        }}
      >
        <OutlinedButton color="primary" size="small" onClick={Postdata}>
          {isLoadingsave ? "Saving..." : "Save"}
        </OutlinedButton>
      </Grid>
    </div>
  );
};

export default PortSetting;
