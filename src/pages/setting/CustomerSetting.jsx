import React, { useEffect, useState } from "react";
import { Typography, Switch, FormGroup, FormControlLabel, Grid } from "@mui/material";
import { OutlinedButton } from "../../components/common/Button";
import { useAddOptonsMutation, useGetOptionsSettingsQuery } from "../../store/api/settingsApi";
import Loader from "../../components/common/Loader/Loader";
import GlobalDrrpdownSetting from "./GlobalDrrpdownSetting";
import toast from "react-hot-toast";

const CustomerSetting = () => {
    const [addOptons, { isloading }] = useAddOptonsMutation();
    const { data, isLoading, error: geterror, refetch } = useGetOptionsSettingsQuery("customer_settings");
    const [approvalRequest, setApprovalRequest] = useState(false);
    const [unitType, setUnitType] = useState([]);
    const [creditDays, setCreditDays] = useState([]);
    const [documentType, setDocumentType] = useState([]);
    const [isLoadingsave, setIsLoading] = useState(false);

    useEffect(() => {
        // let data= {
        //     "unitType": [
        //         {
        //             "id": 1,
        //             "label": "Flat",
        //             "value": "Flat"
        //         },
        //         {
        //             "id": 2,
        //             "label": "20FT",
        //             "value": "20FT"
        //         },
        //         {
        //             "id": 3,
        //             "label": "40FT",
        //             "value": "40FT"
        //         },
        //         {
        //             "id": 4,
        //             "label": "60FT",
        //             "value": "60FT"
        //         }
        //     ],
        //     "creditDays": [
        //         {
        //             "id": 1,
        //             "label": "0",
        //             "value": "0"
        //         },
        //         {
        //             "id": 2,
        //             "label": "15",
        //             "value": "15"
        //         },
        //         {
        //             "id": 3,
        //             "label": "30",
        //             "value": "26"
        //         },
        //         {
        //             "id": 4,
        //             "label": "45",
        //             "value": "45"
        //         },
        //         {
        //             "id": 5,
        //             "label": "60",
        //             "value": "60"
        //         },
        //         {
        //             "id": 6,
        //             "label": "90",
        //             "value": "90"
        //         }
        //     ],
        //     "approval_request": false
        // }
        setUnitType(data?.body.unitType)
        setCreditDays(data?.body.creditDays)
        setApprovalRequest(data?.body.approvalRequest)
        setDocumentType(data?.body.document_type || [])
        console.log(data,"data")
    }, [data, geterror]);


    const Postdata = async () => {
        const filteredData = { approvalRequest, unitType:unitType.filter(item=>!item.value.includes('Type the')), creditDays:creditDays.filter(item=>!item.value.includes('Type the')), documentType:documentType.filter(item=>!item.value.includes('Type the')) }
        setIsLoading(true);
        await addOptons({ body: { customer_settings: filteredData }, type: "customer_setting" }).then((res) => { if(res.error){toast.error(res.error.data.error)}else{toast.success(`setting Updated Successufully`)}}).catch(() => console.log("filteredData"))
        refetch();
        setIsLoading(false);
    };

    return (
        <div style={{ padding: "1rem" }}>
            <Grid xs={12} sx={{ marginBottom: "10px" }} ><Typography variant="h4">Customer Setting</Typography></Grid>
            <Grid sx={{ marginBottom: "10px" }} >
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

            {isLoading ? <Loader /> : <Grid container spacing={2} flexWrap={"wrap"}>
                <GlobalDrrpdownSetting value={unitType} setvalue={setUnitType} title="Unit Type" />
                <GlobalDrrpdownSetting value={creditDays} setvalue={setCreditDays} title="Credit Days" />
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

export default CustomerSetting;
