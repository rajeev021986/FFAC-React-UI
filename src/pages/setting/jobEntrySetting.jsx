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
import GlobalDrrpdownSettingVoucher from "./GlobalDrrpdownSettingVoucher";

const JobEntrySetting = () => {
  const [addOptons] = useAddOptonsMutation();
  const {
    data,
    isLoading,
    error: geterror,
    refetch,
  } = useGetOptionsSettingsQuery("job_settings");

  const [approvalRequest, setApprovalRequest] = useState(false);
  const [moveType, setMoveType] = useState([]);
  const [cargoType, setCargoType] = useState([]);
  const [typesOfCargo, setTypesOfCargo] = useState([]);
  const [routeCode, setRouteCode] = useState([]);
  const [lineVesselType, setLineVesselType] = useState([]);
  const [IcdTransfer, setIcdTransfer] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [shiperStatus, setShiperStatus] = useState([]);
  const [ICDTransfer, setICDTransfer] = useState([]);
  const [sizeType, setsizeType] = useState([]);
  const [unitTypes, setunitTypes] = useState([]);
  const [jobDocumentType, setJobDocumentType] = useState([]);

  const [voucherData, setVoucherData] = useState([
    { id: 1, shipmentType: "", jobPattern: "", sampleJobNumber: "" },
  ]);

  const [isLoadingsave, setIsLoading] = useState(false);
  useEffect(() => {
    setApprovalRequest(data?.body.approvalRequest || false);
    setMoveType(data?.body.moveType || []);
    setCargoType(data?.body.cargoType || []);
    setTypesOfCargo(data?.body.typesOfCargo || []);
    setRouteCode(data?.body.routeCode || []);
    setLineVesselType(data?.body.lineVesselType || []);
    setIcdTransfer(data?.body.IcdTransfer || []);
    setCurrency(data?.body.currency || []);
    setShiperStatus(data?.body.shiperStatus || []);
    setICDTransfer(data?.body.ICDTransfer || []);
    setsizeType(data?.body.sizeType || []);
    setunitTypes(data?.body.unitTypes || []);
    setJobDocumentType(data?.body.jobDocumentType || []);
    const sorted = [...(data?.body.jobPatternData || [])].sort(
      (a, b) => a.id - b.id
    );
    const remapped = sorted.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setVoucherData(remapped);
  }, [data, geterror]);
  const Postdata = async () => {
    setIsLoading(true);
    const filteredData = {
      approvalRequest,
      moveType: moveType.filter((item) => !item.value.includes("Type the")),
      cargoType: cargoType.filter((item) => !item.value.includes("Type the")),
      typesOfCargo: typesOfCargo.filter(
        (item) => !item.value.includes("Type the")
      ),
      routeCode: routeCode.filter((item) => !item.value.includes("Type the")),
      lineVesselType: lineVesselType.filter(
        (item) => !item.value.includes("Type the")
      ),
      IcdTransfer: IcdTransfer.filter(
        (item) => !item.value.includes("Type the")
      ),
      currency: currency.filter((item) => !item.value.includes("Type the")),
      shiperStatus: shiperStatus.filter(
        (item) => !item.value.includes("Type the")
      ),
      ICDTransfer: ICDTransfer.filter(
        (item) => !item.value.includes("Type the")
      ),
      sizeType: sizeType.filter((item) => !item.value.includes("Type the")),
      unitTypes: unitTypes.filter((item) => !item.value.includes("Type the")),
      jobDocumentType: jobDocumentType.filter(
        (item) => !item.value.includes("Type the")
      ),
      jobPatternData: voucherData.filter(
        (item) => !item?.jobPattern?.includes("Type the")
      ),
    };
    await addOptons({
      body: { job_settings: filteredData },
      type: "job_settings",
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
      .catch((e) =>
        toast.custom(<CustomToast message={e?.message} toast="error" />, {
          closeButton: false,
        })
      );
    refetch();
    setIsLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Grid xs={12} sx={{ marginBottom: "10px" }}>
        <Typography variant="h4">Job Entry Setting</Typography>
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
            value={moveType}
            setvalue={setMoveType}
            title="Move Type"
          />

          <GlobalDrrpdownSetting
            value={cargoType}
            setvalue={setCargoType}
            title="Cargo Type"
          />

          <GlobalDrrpdownSetting
            value={typesOfCargo}
            setvalue={setTypesOfCargo}
            title="Types of Cargo"
          />

          <GlobalDrrpdownSetting
            value={shiperStatus}
            setvalue={setShiperStatus}
            title="Shipper Status"
          />

          <GlobalDrrpdownSetting
            value={lineVesselType}
            setvalue={setLineVesselType}
            title="Line Vessel Type"
          />

          <GlobalDrrpdownSetting
            value={currency}
            setvalue={setCurrency}
            title="Currency"
          />

          <GlobalDrrpdownSetting
            value={routeCode}
            setvalue={setRouteCode}
            title="Route Code"
          />

          <GlobalDrrpdownSetting
            value={ICDTransfer}
            setvalue={setICDTransfer}
            title="ICD Transfer"
          />

          <GlobalDrrpdownSetting
            value={sizeType}
            setvalue={setsizeType}
            title="Size Type"
          />

          <GlobalDrrpdownSetting
            value={unitTypes}
            setvalue={setunitTypes}
            title="Unit Types"
          />

          <GlobalDrrpdownSetting
            value={jobDocumentType}
            setvalue={setJobDocumentType}
            title="Document Job Type"
          />
          <GlobalDrrpdownSettingVoucher
            value={voucherData}
            setvalue={setVoucherData}
            title=" Job Number"
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

export default JobEntrySetting;
