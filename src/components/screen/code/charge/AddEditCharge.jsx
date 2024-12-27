import React from 'react';
import { Formik, Form, Field, FieldArray, useFormik } from 'formik';
import * as Yup from 'yup';
import { Box } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import ScreenToolbar from '../../../common/ScreenToolbar';
import ThemedBreadcrumb from '../../../common/Breadcrumb';
import { useLocation } from 'react-router-dom';

const AddEditCharge = () => {
    // const location = useLocation();
    // const { id, type } = location.state;
    const tabs = [{ label: "Charge Details", value: 1 },
        { label: "Document Details", value: 2 }
        ];
    const initialValues = {
        id: 0,
        status: '',
        chargeDetails: '',
        mode: '',
        chargeFor: '',
        chargeName: '',
        mappedCharge: '',
        vatApplicable: '',
        chargeCode: '',
        mappingDetails: [
            {
                id: 0,
                directIncome: '',
                directExpense: ''
            }
        ]
    };

    const validationSchema = Yup.object({
        status: Yup.string(),
        chargeDetails: Yup.string().required('Required'),
        mode: Yup.string().required('Required'),
        chargeFor: Yup.string().required('Required'),
        chargeName: Yup.string().required('Required'),
        mappedCharge: Yup.string().required('Required'),
        vatApplicable: Yup.string().required('Required'),
        chargeCode: Yup.string().required('Required'),
        mappingDetails: Yup.array().of(
            Yup.object({
                id: new Date().getTime(),
                directIncome: Yup.string().required('Required'),
                directExpense: Yup.string().required('Required')
            })
        )
    });

    const onSubmit = (values) => {
        console.log('Form data', values);
    };

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
                {/* <TabPanel value={1}>{isLoading ? <Loader /> : <VendorFormInput formik={formik} type={type} disabled={page == "vendorApproval"} optionsSettingsData={optionsSettingsData} vendorSettingsData={vendorSettingsData} />}</TabPanel> */}
                {/* <TabPanel value={2}><UploadFile customer_id={id} sourceType="VENDOR" page={page} disabled={page == "vendorApproval"} dropdownData={vendorSettingsData?.body?.documentType} /></TabPanel> */}
            </TabContext>
        </Box></>
    );
};

export default AddEditCharge;