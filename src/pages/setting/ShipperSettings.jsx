import React, { useEffect, useState } from "react";
import { Typography, Switch, FormGroup, FormControlLabel, Grid } from "@mui/material";
import { OutlinedButton } from "../../components/common/Button";
import { useAddOptonsMutation, useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import Loader from "../../components/common/Loader/Loader";
import GlobalDrrpdownSetting from "./GlobalDrrpdownSetting";
import toast from "react-hot-toast";

const ShipperSetting = () => {
    const [addOptons, { isloading }] = useAddOptonsMutation();
    const { data, isLoading, error: geterror, refetch } = useGetOptionsSettingsQuery("shipper_settings");
    const [documentType, setDocumentType] = useState([]);
    const [isLoadingsave, setIsLoading] = useState(false);

    useEffect(() => {
        setDocumentType(data?.body.documentType || [])
    }, [data, geterror]);


    const Postdata = async () => {
        const filteredData = { documentType: documentType.filter(item => !item.value.includes('Type the')) }
        setIsLoading(true);
        await addOptons({ body: { shipper_settings: filteredData }, type: "shipper_settings" }).then((res) => { if (res.error) { toast.error(res.error.data.error) } else { toast.success(`setting Updated Successufully`) } }).catch(() => console.log("filteredData"))
        refetch();
        setIsLoading(false);
    };

    return (
        <div style={{ padding: "1rem" }}>
            <Grid xs={12} sx={{ marginBottom: "10px" }} ><Typography variant="h4">Shipper Setting</Typography></Grid>

            {isLoading ? <Loader /> : <Grid container spacing={2} flexWrap={"wrap"}>
                <GlobalDrrpdownSetting value={documentType} setvalue={setDocumentType} title="Document Type" />
            </Grid>}
            <Grid style={{ width: "100%", display: "flex", flexDirection: "row-reverse", marginTop: "10px" }}>
                <OutlinedButton color="primary" size="small" onClick={Postdata} >
                    {isLoadingsave ? "Saving..." : "Save"}
                </OutlinedButton>
            </Grid>
        </div>
    );
};

export default ShipperSetting;
