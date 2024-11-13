import { Box, Card, CardHeader } from "@mui/material";
import { useLocation } from "react-router-dom";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import AddOtmBolForm from "./AddOtmBolForm";
import { useEffect, useState } from "react";
import { useLazyFetchOTMBOLPayLoadQuery } from "../../store/api/otmBolDataApi";
// import { OutlinedButton } from "../../components/common/Button";

const AddOtmBolScreen = () => {
  const { state } = useLocation();
  const [payload,setPayload] = useState(null);
  const [detailsPayload,setDetailsPayload] = useState(null);
  console.log(state);
  const [fetch, { isLoading, data }] = useLazyFetchOTMBOLPayLoadQuery();
  useEffect(() => {
    (async () => {
      const params = {
        bol: state.selectedBol,
        pl_no: state.plNoArrya.join(","),
      };

      const {data} = await fetch(params);
      const details = data.details.map((item)=>({
        pl_no: "",
        po_no: "",
        hts_code: "",
        hts_code_secondary: "",
        container: "",
        description: "",
        qty: "",
        qty_ctn: "",
        mcq: "",
        gross_weight: "",
        volume: "",
        total_entered_value: "",
        hmf: "",
        mpf: "",
        duty_amount: "",
        ...item,
      }));
      console.log("details : ",details);
      
      const payloadData = {...data.headerData,details : details.slice(0,100)}
      const totalGrossWeight = data.details.reduce((sum, item) => sum + parseFloat(item.gross_weight), 0);
      
      console.log("totalGrossWeight : ",totalGrossWeight);
      
      setPayload(payloadData)
      console.log("payload : ",payloadData);
      console.log("data.details : ",data.details);
    })();
  }, []);


  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
      />

      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader title={"Add OTM BOL"} />
        <AddOtmBolForm payload={payload !== null && payload} />
      </Card>
    </Box>
  );
};
export default AddOtmBolScreen;
