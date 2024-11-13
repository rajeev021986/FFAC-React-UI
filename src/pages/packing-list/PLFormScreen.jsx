import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
} from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import PLForm from "../../components/screen/packing-list/PLForm";
import { useFetchPackingListDetailsQuery } from "../../store/api/packingListDataApi";
import { OutlinedButton } from "../../components/common/Button";

export default function PLFormScreen() {
  const [openVesselModal, setOpenVesselModal] = React.useState(false);
  const { state } = useLocation();

  const {
    data: PLDeatils,
    isLoading,
    error,
    isError,
  } = useFetchPackingListDetailsQuery(state.initialValues?.serial_id);

  console.log("PLDeatils", PLDeatils);
  return (
    <Box>
      <ScreenToolbar
        leftComps={
          <div>
            <ThemedBreadcrumb />
          </div>
        }
        rightComps={<div></div>}
      />
      <Card sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader
          title={
            <Box display="flex" justifyContent={"space-between"}>
              <Typography variant="subtitle3" component="div">
                Packing List
              </Typography>
              <Box sx={styles.right}>
                <Chip
                  color="primary"
                  variant="outlined"
                  label={`Packing List No : ${state.initialValues?.packing_list_no}`}
                />
                <OutlinedButton
                  color="primary"
                  size="small"
                  onClick={() => {
                    setOpenVesselModal(true);
                  }}
                >
                  Add Vessel
                </OutlinedButton>
              </Box>
            </Box>
          }
        />
        <CardContent>
          <PLForm
            initialValues={state.initialValues}
            tableData={PLDeatils?.data?.packageListDetails}
            loading={isLoading}
            openVesselModal={openVesselModal}
            setOpenVesselModal={setOpenVesselModal}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

const styles = {
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
};
