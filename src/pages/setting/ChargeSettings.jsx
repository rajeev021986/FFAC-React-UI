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

const ChargeSettings = () => {
  const [addOptons, {}] = useAddOptonsMutation();
  const {
    data,
    isLoading,
    error: geterror,
    refetch,
  } = useGetOptionsSettingsQuery("charge_settings");
  const [chargeFor, setChargeFor] = useState([]);
  const [isLoadingsave, setIsLoading] = useState(false);

  useEffect(() => {
    setChargeFor(data?.body.chargeFor || []);
  }, [data, geterror]);

  const Postdata = async () => {
    const filteredData = {
      chargeFor: chargeFor.filter((it) => !it.value.includes("Type the")),
    };
    setIsLoading(true);
    await addOptons({
      body: { charge_settings: filteredData },
      type: "charge_settings",
    })
      .then((res) => {
        if (res) {
          console.log("res.error", res.error);
          toast.custom(
            <CustomToast message={res.error.data.message} toast="error" />,
            {
              closeButton: false,
            }
          );
        } else {
          toast.custom(
            <CustomToast
              message="Setting Updated Successfully"
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
        <Typography variant="h4">Charge Setting</Typography>
      </Grid>

      {isLoading ? (
        <Loader />
      ) : (
        <Grid container spacing={2} flexWrap={"wrap"}>
          <GlobalDrrpdownSetting
            value={chargeFor}
            setvalue={setChargeFor}
            title="Charge For"
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

export default ChargeSettings;
