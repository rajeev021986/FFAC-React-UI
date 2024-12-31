import React, { useEffect } from 'react';
import { Formik, Form, Field, FieldArray, useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ScreenToolbar from '../../../common/ScreenToolbar';
import ThemedBreadcrumb from '../../../common/Breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatgeInputs from './ChatgeInputs';
import UploadFile from '../../../UploadFile';
import { useGetOptionsSettingsQuery } from '../../../../store/api/settingsApi';
import { useAddChargeMutation, useLazyGetChargeQuery, useUpdateChargeMutation } from '../../../../store/api/chargesDataApi';
import toast from 'react-hot-toast';
import Loader from '../../../common/Loader/Loader';

const AddEditCharge = () => {
    const location = useLocation();
    const { id, type } = location.state;
    const nav = useNavigate();
    const [value, setValue] = React.useState(1);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { data: ChargeSettingsData } = useGetOptionsSettingsQuery("common_settings");
    const { data: CustomerSettingsData } = useGetOptionsSettingsQuery("customer_settings");
    const tabs = [
        { label: "Charge Details", value: 1 },
        { label: "Document Details", value: 2 }
    ];
    Boolean(type == "copy" || type == "new") && tabs.splice(1, 1);
    const [getCharge, { isLoading }] = useLazyGetChargeQuery();
    const [addCharge] = useAddChargeMutation();
    const [updateCharge] = useUpdateChargeMutation();
    const initialValues = {
        id: 0,
        status: '',
        chargeDetails: '',
        chargeFor: '',
        chargeName: '',
        mappedCharge: '',
        vatApplicable: '',
        chargeCode: '',
        mappingDetails: [
            {
                id: new Date().getTime(),
                directIncome: '',
                directExpense: ''
            }
        ]
    };

    const validationSchema = Yup.object({
        status: Yup.string(),
        chargeDetails: Yup.string().required('Required'),
        chargeFor: Yup.string().required('Required'),
        chargeName: Yup.string().required('Required'),
        mappedCharge: Yup.string().required('Required'),
        vatApplicable: Yup.string().required('Required'),
        chargeCode: Yup.string().required('Required'),
        mappingDetails: Yup.array().of(
            Yup.object({
                id: Yup.number().required(),
                directIncome: Yup.string().required('Required'),
                directExpense: Yup.string().required('Required')
            })
        )
    });

    const onSubmit = async (values) => {
        let updatedValue = {
            ...values,
            mappingDetails: values.mappingDetails.map((s) =>
                s.new ? { ...s, new: null, id: null } : s
            ),
        };
        if (type == "copy" || type == "new") {
            delete updatedValue.id;
            try {
                let res = await addCharge(updatedValue).unwrap();
                if (res.success) {
                    toast.success(res.message);
                    nav(-1);
                }
            } catch (error) {
                toast.error(error.data.message)
            }
        } else {
            console.log(updatedValue, "updatedValue")
            try {
                let res = await updateCharge(updatedValue).unwrap();
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

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit
    });
    const handleFetchCharge = async () => {
        try {
            const response = await getCharge({ id });
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
            console.error("Error fetching vendor data:", error);
            toast.error("Error fetching vendor data");
        }
    };
    useEffect(() => {
        if (id && ChargeSettingsData) {
            handleFetchCharge();
        }
    }, [ChargeSettingsData]);
    return (
        <><Box sx={{ width: '100%', typography: 'body1' }}>
            <ScreenToolbar leftComps={<ThemedBreadcrumb />} />
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        {tabs.map((a) => <Tab label={a.label} value={a.value} />)}
                    </TabList>
                </Box>
                <TabPanel value={1}>{isLoading ? <Loader /> : <ChatgeInputs formik={formik} ChargeSettingsData={ChargeSettingsData} nav={nav} type={type} />}</TabPanel>
                <TabPanel value={2}><UploadFile customer_id={id} sourceType="CHARGE" disabled={false} dropdownData={CustomerSettingsData?.body?.documentType} /></TabPanel>
            </TabContext>
        </Box>
        </>
    );
};

export default AddEditCharge;