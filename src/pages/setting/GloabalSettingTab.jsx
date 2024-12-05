import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import { Alert, Button, Grid, Snackbar, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { OutlinedButton } from "../../components/common/Button";
import { useAddOptonsMutation, useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import Loader from "../../components/common/Loader/Loader";
import toast from "react-hot-toast";
import GlobalDrrpdownSetting from "./GlobalDrrpdownSetting";

const GlobalSetting = () => {
    const [addOptons, { isloading }] = useAddOptonsMutation();
    const { data, isLoading, error: geterror, refetch } = useGetOptionsSettingsQuery("common_settings");
    const [status, setStatus] = useState([]);
    const [account_type, setAccountType] = useState([]);
    const [shipmentType, setShipmentType] = useState([]);
    const [isLoadingsave, setIsLoading] = useState(false);

    useEffect(() => {
        if (data) {
            data.body.status && setStatus(data.body.status)
            data.body.account_type && setAccountType(data.body.account_type)
            data.body.shipmentType && setShipmentType(data.body.shipmentType)
        }
    }, [data, geterror]);

    const Postdata = async () => {
        setIsLoading(true);
        const filteredData = { status:status.filter(item=>!item.value.includes('Type the')), account_type:account_type.filter(item=>!item.value.includes('Type the')), shipmentType:shipmentType.filter(item=>!item.value.includes('Type the'))  }
        await addOptons({ body: { common_settings: filteredData }, type: "common_settings" }).then((res) => { if(res.error){toast.error(res.error.data.error)}else{toast.success(`setting Updated Successufully`)}}).catch(() => console.log("filteredData"))
        setIsLoading(false);
    };
    return (
        <div style={{ padding: "1rem" }}>
            <Grid xs={12} sx={{ marginBottom: "10px" }} ><Typography variant="h4">Global Setting</Typography></Grid>
            {isLoading ? <Loader /> : <Grid container spacing={2} flexWrap={"wrap"}>
                <GlobalDrrpdownSetting value={status} setvalue={setStatus} title="Status" />
                <GlobalDrrpdownSetting value={account_type} setvalue={setAccountType} title="Account Type" />
                <GlobalDrrpdownSetting value={shipmentType} setvalue={setShipmentType} title="Shipment Type" />
            </Grid>}

            <Grid style={{ width: "100%", display: "flex", flexDirection: "row-reverse", marginTop: "10px" }}>
                <OutlinedButton color="primary" size="small" onClick={Postdata}>
                    {isLoadingsave ? "Saving..." : "Save"}
                </OutlinedButton>
            </Grid>
        </div>
    );
};

export default GlobalSetting;
