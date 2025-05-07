import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { OutlinedButton } from "../../components/common/Button";
import {
  useAddOptonsMutation,
  useGetOptionsSettingsQuery,
} from "../../store/api/settingsApi";
import Loader from "../../components/common/Loader/Loader";
import toast from "react-hot-toast";
import GlobalDrrpdownSetting from "./GlobalDrrpdownSetting";
import CustomToast from "../../components/common/Toast/CustomToast";
import GlovalInvoicePattern from "./GlobalInvoicePattern";

const GlobalSetting = () => {
  const [addOptons, { isloading }] = useAddOptonsMutation();
  const {
    data,
    isLoading,
    error: geterror,
    refetch,
  } = useGetOptionsSettingsQuery("common_settings");
  const [status, setStatus] = useState([]);
  const [account_type, setAccountType] = useState([]);
  const [shipmentType, setShipmentType] = useState([]);
  const [vatRate, setVatRate] = useState([]);
  const [costCenter, setCostCenter] = useState([]);
  const [isLoadingsave, setIsLoading] = useState(false);
  const [currencyType, setCurrencyType] = useState([]);
  const [invoicePatternData, setInvoicePatternData] = useState([
    {
      id: 1,
      invoiceType: "",
      invoicePattern: "",
      resetNumber: "",
      sampleInvoiceNumber: "",
    },
  ]);

  useEffect(() => {
    if (data) {
      data.body.status && setStatus(data.body.status);
      data.body.account_type && setAccountType(data.body.account_type);
      data.body.shipmentType && setShipmentType(data.body.shipmentType);
      data.body.vatRate && setVatRate(data.body.vatRate);
      data.body.costCenter && setCostCenter(data.body.costCenter);
      data.body.currencyType && setCurrencyType(data.body.currencyType);
      data.body.invoicePatternData &&
        setInvoicePatternData(data.body.invoicePatternData);
    }
  }, [data, geterror]);

  const Postdata = async () => {
    setIsLoading(true);
    const filteredData = {
      status: status.filter((item) => !item.value.includes("Type the")),
      account_type: account_type.filter(
        (item) => !item.value.includes("Type the")
      ),
      shipmentType: shipmentType.filter(
        (item) => !item.value.includes("Type the")
      ),
      vatRate: vatRate.filter((item) => !item.value.includes("Type the")),
      costCenter: costCenter.filter((item) => !item.value.includes("Type the")),
      currencyType: currencyType.filter((item) => !item.value.includes("Type the")),
      invoicePatternData: invoicePatternData,
    };
    await addOptons({
      body: { common_settings: filteredData },
      type: "common_settings",
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
        <Typography variant="h4">Global Setting</Typography>
      </Grid>
      {isLoading ? (
        <Loader />
      ) : (
        <Grid xs={12} md={8} lg={12} container spacing={1} flexWrap={"wrap"}>
          <GlobalDrrpdownSetting
            value={status}
            setvalue={setStatus}
            title="Status"
          />
          <GlobalDrrpdownSetting
            value={account_type}
            setvalue={setAccountType}
            title="Account Type"
          />
          <GlobalDrrpdownSetting
            value={shipmentType}
            setvalue={setShipmentType}
            title="Shipment Type"
          />

          <GlobalDrrpdownSetting
            value={vatRate}
            setvalue={setVatRate}
            title="Vat Rate"
          />

          <GlobalDrrpdownSetting
            value={costCenter}
            setvalue={setCostCenter}
            title="Cost Center"
          />
          <GlobalDrrpdownSetting
            value={currencyType}
            setvalue={setCurrencyType}
            title="Currency Type"
          />
          <GlovalInvoicePattern
            value={invoicePatternData}
            setvalue={setInvoicePatternData}
            title="Payable Number"
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

export default GlobalSetting;
