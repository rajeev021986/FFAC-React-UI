import { Box, Card, CardHeader } from "@mui/material";
import AddOtmBolForm from "./AddOtmBolForm";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { useLocation } from "react-router-dom";
import { useFetchByUniqueKeyQuery } from "../../store/api/otmBolDataApi";
import { useEffect } from "react";

const EditOtmBolScreen = () => {
  const {state} = useLocation();

  const {data} = useFetchByUniqueKeyQuery(state.initialValues?.common_key);

  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
      />

      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader title={"Edit OTM BOL"} />
        <AddOtmBolForm payload={data?.data} />
      </Card>
    </Box>
  );
};

export default EditOtmBolScreen;
