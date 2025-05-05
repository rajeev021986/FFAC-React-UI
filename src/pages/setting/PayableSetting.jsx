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

const PayableSettings = () => {
  const [addOptons, {}] = useAddOptonsMutation();
  const {
    data,
    isLoading,
    error: geterror,
    refetch,
  } = useGetOptionsSettingsQuery("payble_settings");
  const [invoiceType, setInvoiceType] = useState([]);
 
  const [holdingTax, setHoldingTax] = useState([]);
  const [isLoadingsave, setIsLoading] = useState(false);

  useEffect(() => {
    setInvoiceType(data?.body.invoiceType || []);
   
    setHoldingTax(data?.body.holdingTax || []);
  }, [data, geterror]);

  const Postdata = async () => {
    const filteredData = {
      invoiceType: invoiceType.filter((it) => !it.value.includes("Type the")),
    
      holdingTax: holdingTax.filter((it) => !it.value.includes("Type the")),
    };
    setIsLoading(true);
    await addOptons({
      body: { payble_settings: filteredData },
      type: "payble_settings",
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
        <Typography variant="h4">Payable Setting</Typography>
      </Grid>

      {isLoading ? (
        <Loader />
      ) : (
        <Grid container spacing={2} flexWrap={"wrap"}>
          <GlobalDrrpdownSetting
            value={invoiceType}
            setvalue={setInvoiceType}
            title="Invoice Type"
          />

          

          <GlobalDrrpdownSetting
            value={holdingTax}
            setvalue={setHoldingTax}
            title="Holding Tax"
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

export default PayableSettings;
