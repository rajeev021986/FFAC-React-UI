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

const VendorSetting = () => {
  const [addOptons, { isloading }] = useAddOptonsMutation();
  const {
    data,
    isLoading,
    error: geterror,
    refetch,
  } = useGetOptionsSettingsQuery("vendor_settings");
  const [documentType, setDocumentType] = useState([]);
  const [vendorType, setVendorType] = useState([]);
  const [tarifType, setTarifType] = useState([]);
  const [unitType, setUnitType] = useState([]);
  const [container, setContainer] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [approvalRequest, setApprovalRequest] = useState(false);
  const [demurageOptions, setDemurageOptions] = useState([]);
  const [isLoadingsave, setIsLoading] = useState(false);

  useEffect(() => {
    setDocumentType(data?.body.documentType || []);
    setVendorType(data?.body.vendorType || []);
    setTarifType(data?.body.tarifType || []);
    setApprovalRequest(data?.body.approvalRequest || false);
    setUnitType(data?.body.unitType || []);
    setContainer(data?.body.container || []);
    setDesignation(data?.body.designation || []);
    setDemurageOptions(data?.body.demurageOptions || []);
  }, [data, geterror]);

  const Postdata = async () => {
    const filteredData = {
      approvalRequest,
      documentType: documentType.filter(
        (item) => !item.value.includes("Type the")
      ),
      tarifType: tarifType.filter((item) => !item.value.includes("Type the")),
      unitType: unitType.filter((item) => !item.value.includes("Type the")),
      container: container.filter((item) => !item.value.includes("Type the")),
      vendorType: vendorType.filter((item) => !item.value.includes("Type the")),
      demurageOptions: demurageOptions.filter(
        (item) => !item.value.includes("Type the")
      ),
      designation: designation.filter(
        (item) => !item.value.includes("Type the")
      ),
    };
    setIsLoading(true);
    await addOptons({
      body: { vendor_settings: filteredData },
      type: "vendor_settings",
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
        <Typography variant="h4">Vendor Setting</Typography>
      </Grid>
      <Grid sx={{ marginBottom: "10px" }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={approvalRequest || false}
                onChange={(e) => setApprovalRequest(e.target.checked)}
              />
            }
            label="Approval Required"
          />
        </FormGroup>
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
            value={tarifType}
            setvalue={setTarifType}
            title="Tarif Type"
          />
          <GlobalDrrpdownSetting
            value={unitType}
            setvalue={setUnitType}
            title="Unit Type"
          />
          <GlobalDrrpdownSetting
            value={container}
            setvalue={setContainer}
            title="Container"
          />
          <GlobalDrrpdownSetting
            value={vendorType}
            setvalue={setVendorType}
            title="Vendor Type"
          />
          <GlobalDrrpdownSetting
            value={designation}
            setvalue={setDesignation}
            title="Designation"
          />
          <GlobalDrrpdownSetting
            value={demurageOptions}
            setvalue={setDemurageOptions}
            title="Demurage Options"
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

export default VendorSetting;
