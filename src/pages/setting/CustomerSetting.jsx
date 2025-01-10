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

const CustomerSetting = () => {
  const [addOptons, { isloading: saveLoading }] = useAddOptonsMutation();
  const {
    data,
    isLoading,
    error: geterror,
    refetch,
  } = useGetOptionsSettingsQuery("customer_settings");
  const [approvalRequest, setApprovalRequest] = useState(false);
  const [unitType, setUnitType] = useState([]);
  const [creditDays, setCreditDays] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [documentType, setDocumentType] = useState([]);
  const [customerType, setCustomerType] = useState([]);
  const [isLoadingsave, setIsLoading] = useState(false);

  useEffect(() => {
    setUnitType(data?.body.unitType);
    setCreditDays(data?.body.creditDays);
    setApprovalRequest(data?.body.approvalRequest);
    setDocumentType(data?.body.documentType || []);
    setDesignation(data?.body.designation || []);
    setCustomerType(data?.body.customerType || []);
  }, [data, geterror]);

  const Postdata = async () => {
    setIsLoading(true);
    const filteredData = {
      approvalRequest,
      unitType: unitType.filter((item) => !item.value.includes("Type the")),
      creditDays: creditDays.filter((item) => !item.value.includes("Type the")),
      documentType: documentType.filter(
        (item) => !item.value.includes("Type the")
      ),
      designation: designation.filter(
        (item) => !item.value.includes("Type the")
      ),
      customerType: customerType.filter(
        (item) => !item.value.includes("Type the")
      ),
    };
    await addOptons({
      body: { customer_settings: filteredData },
      type: "customer_setting",
    })
      .then((res) => {
        if (res.error) {
          toast.error(res.error.data.error);
        } else {
          toast.success(`setting Updated Successufully`);
        }
      })
      .catch((e) => toast.error(e?.message));
    refetch();
    setIsLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Grid xs={12} sx={{ marginBottom: "10px" }}>
        <Typography variant="h4">Customer Setting</Typography>
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
            value={unitType}
            setvalue={setUnitType}
            title="Unit Type"
          />
          <GlobalDrrpdownSetting
            value={creditDays}
            setvalue={setCreditDays}
            title="Credit Days"
          />
          <GlobalDrrpdownSetting
            value={documentType}
            setvalue={setDocumentType}
            title="Document Type"
          />
          <GlobalDrrpdownSetting
            value={designation}
            setvalue={setDesignation}
            title="Designation"
          />
          <GlobalDrrpdownSetting
            value={customerType}
            setvalue={setCustomerType}
            title="Customer Type"
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

export default CustomerSetting;
