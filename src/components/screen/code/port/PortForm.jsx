import React, { useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Tab } from '@mui/material';
import ScreenToolbar from '../../../common/ScreenToolbar';
import ThemedBreadcrumb from '../../../common/Breadcrumb';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Loader from '../../../common/Loader/Loader';
import PortValueForm from './PortValueForm';
import { useAddPortMutation, useLazyGetPortQuery, useUpdatePortMutation } from '../../../../store/api/portDataApi';
import toast from 'react-hot-toast';
import UploadFile from '../../../UploadFile';
import { useLocation } from 'react-router-dom';
import { useGetOptionsSettingsQuery } from '../../../../store/api/settingsApi';
import { useNavigate } from 'react-router-dom';
function PortForm() {
    const [value, setValue] = React.useState(1);
    const location = useLocation();
    const nav = useNavigate();
    const [getPort, { isLoading: isFetchingPort }] = useLazyGetPortQuery();
    const [addPort, isLoading] = useAddPortMutation();
    const [updatePort] = useUpdatePortMutation();
    const { id, type } = location.state;
    console.log(type, id, "type")
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const tabs = [{ label: "Port Details", value: 1 },
    { label: "Document Details", value: 2 }
    ];
    const { data: optionsSettingsData } = useGetOptionsSettingsQuery("common_settings");
    const { data: customerSettingsData } = useGetOptionsSettingsQuery("port_settings");

    useEffect(() => {
        if (id && optionsSettingsData) {
            handleFetchPort();
        }
    }, [optionsSettingsData]);
    const handleFetchPort = async () => {
        try {
            const response = await getPort({ id });
            if (response?.data) {
                if (type === "copy" || type === "new") {
                    formik.setValues({
                        ...response.data.body,
                        // isApproved: !customerSettingsData?.approvalRequest,
                    });
                } else {
                    formik.setValues(response.data.body);
                }
            } else {
                toast.error("Failed to fetch Port data");
            }
        } catch (error) {
            console.error("Error fetching Port data:", error);
            toast.error("Error fetching Port data");
        }
    };
    const formik = useFormik({
        initialValues: {
            status: "",
            portDetails: "",
            unCode: "",
            customCode: "",
            newPortName: "",
            countryName: "",
            region: "",
            basePort: "",
            type: "",
            iotaCode: ""
        },
        validationSchema: Yup.object({
            status: Yup.string().required("Status is required"),
            portDetails: Yup.string(),
            unCode: Yup.string(),
            customCode: Yup.string(),
            newPortName: Yup.string(),
            countryName: Yup.string(),
            region: Yup.string(),
            basePort: Yup.string(),
            type: Yup.string(),
            iotaCode: Yup.string(),
        }),
        onSubmit: async (values) => {
            if (type == "copy" || type == "new") {
                try {
                    const result = await addPort({ ...values, id: null }).unwrap();
                    console.log("Success:", result);
                } catch (error) {
                    console.error("Error:", error);
                }
            } else {
                try {
                    const result = await updatePort({ ...values }).unwrap();
                    toast.success(result.message)
                } catch (error) {
                    toast.success(error.message)
                }
            }
            nav(-1);

        },
    });

    return (
        <><Box sx={{ width: '100%', typography: 'body1' }}>
            <ScreenToolbar leftComps={<ThemedBreadcrumb />} />
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        {tabs.map((a) => <Tab label={a.label} value={a.value} />)}
                    </TabList>
                </Box>
                <TabPanel value={1}>{isFetchingPort ? <Loader /> : <PortValueForm formik={formik} type={type} optionsSettingsData={optionsSettingsData} />}</TabPanel>
                <TabPanel value={2}><UploadFile customer_id={id} sourceType="PORT" dropdownData={customerSettingsData?.body?.documentType} /></TabPanel>
            </TabContext>
        </Box></>
    )
}

export default PortForm