import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGetOptionsSettingsQuery } from '../../../../store/api/settingsApi';
import { useAddExahangeRateMutation, useLazyGetExahangeRateQuery, useUpdateExahangeRateMutation } from '../../../../store/api/exchangeRateDataApi';
import ExchangeInputs from './ExchangeInputs';
import { Box, Tab } from '@mui/material';
import ScreenToolbar from '../../../common/ScreenToolbar';
import ThemedBreadcrumb from '../../../common/Breadcrumb';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Loader from '../../../common/Loader/Loader';
import UploadFile from '../../../UploadFile';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Exchange() {
    // const location = useLocation();
    // const { id, type } = location.state;
    const nav = useNavigate();
    const type = "new";
    const id = 101;
    const [value, setValue] = React.useState(1);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { data: ChargeSettingsData } = useGetOptionsSettingsQuery("common_settings");
    const { data: CustomerSettingsData } = useGetOptionsSettingsQuery("customer_settings");
    const tabs = [
        { label: "Exchange Details", value: 1 },
        { label: "Document Details", value: 2 }
    ];
    Boolean(type == "copy" || type == "new") && tabs.splice(1, 1);
    const [getExahangeRate, { isLoading }] = useLazyGetExahangeRateQuery();
    const [addExahangeRate] = useAddExahangeRateMutation();
    const [updateExahangeRate] = useUpdateExahangeRateMutation();

    const onSubmit = async (values) => {
        if (type == "copy" || type == "new") {
            delete values.id;
            try {
                let res = await addExahangeRate(values).unwrap();
                if (res.success) {
                    toast.success(res.message);
                    nav(-1);
                }
            } catch (error) {
                toast.error(error.data.message)
            }
        } else {
            try {
                let res = await updateExahangeRate(values).unwrap();
                console.log(res.success, "res.success")
                if (res.success) {
                    toast.success(res.message);
                    nav(-1);
                }
            } catch (error) {
                toast.error(error.data.message)
            }
        }
    };
    const handleFetchExchangeRate = async () => {
        try {
            const response = await getExahangeRate({ id });
            if (response?.data) {
                if (type === "copy" || type === "new") {
                    formik.setValues({
                        ...response.data.body,
                        status: "New",
                    });
                } else {
                    formik.setValues(response.data.body);
                }
            } else {
                toast.error("Failed to fetch Charge data");
            }
        } catch (error) {
            console.error("Error fetching ExchangeRate data:", error);
            toast.error("Error fetching ExchangeRate data");
        }
    };
    useEffect(() => {
        if (id && ChargeSettingsData) {
            handleFetchExchangeRate();
        }
    }, [ChargeSettingsData]);

    const initialValues = {
        fromDate: "2024-12-30T05:27:31.793Z",
        toDate: "2024-12-30T05:27:31.793Z",
        currency: "string",
        usdExchange: 0,
        ugxExchange: 0
    };

    const validationSchema = Yup.object({
        fromDate: Yup.date().required('Required'),
        toDate: Yup.date().required('Required'),
        currency: Yup.string().required('Required'),
        usdExchange: Yup.number().required('Required'),
        ugxExchange: Yup.number().required('Required')
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
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
                <TabPanel value={1}>{isLoading ? <Loader /> : <ExchangeInputs formik={formik} ChargeSettingsData={ChargeSettingsData} nav={nav} type={type} />}</TabPanel>
                <TabPanel value={2}><UploadFile customer_id={id} sourceType="EXCHANGE" disabled={false} dropdownData={CustomerSettingsData?.body?.documentType} /></TabPanel>
            </TabContext>
        </Box>
        </>
    );
}
