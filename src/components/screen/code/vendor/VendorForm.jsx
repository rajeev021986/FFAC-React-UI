import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import VendorFormInput from './VendorFormInput';
import { useAddVendorMutation, useLazyGetVendorQuery, useUpdateVendorMutation } from '../../../../store/api/vendorDataApi';
import toast from 'react-hot-toast';
import Loader from '../../../common/Loader/Loader';
import { useLocation } from 'react-router-dom';
import UploadFile from '../../../UploadFile';
import { Box, Grid, Stack, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { OutlinedButton, ThemeButton } from '../../../common/Button';
import ScreenToolbar from '../../../common/ScreenToolbar';
import ThemedBreadcrumb from '../../../common/Breadcrumb';
import { useGetOptionsSettingsQuery } from '../../../../store/api/settingsApi';

export default function VendorForm({ page = "vendor" }) {
    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const tabs = [{ label: "Vendor Details", value: 1 },
    { label: "Document Details", value: 2 }
    ];
    const location = useLocation();
    const { id, type } = location.state;
    const [addVendor] = useAddVendorMutation();
    const [updateVendor] = useUpdateVendorMutation();
    const [getVendor, { isLoading }] = useLazyGetVendorQuery();
    const validationSchema = Yup.object({
        vendorName: Yup.string()
            .required('Vendor Name is required'),
        vendorCode: Yup.string()
            .required('Vendor Code is required'),
        vendorNo: Yup.string()
            .required('Vendor Number is required'),
        mlo: Yup.string()
            .required('MLO is required'),
        status: Yup.string()
            .required('Status is required'),
        type: Yup.string()
            .required('Type is required'),
        vendorCreation: Yup.string()
            .required('Vendor Creation is required'),
        mode: Yup.string()
            .required('Mode is required'),
        address: Yup.string()
            .required('Address is required'),
        alia: Yup.string()
            .required('Alia is required'),
        bankName: Yup.string()
            .required('Bank Name is required'),
        bankAddress: Yup.string()
            .required('Bank Address is required'),
        usdAccountNo: Yup.string()
            .required('USD Account No is required'),
        kshAccountNo: Yup.string()
            .required('KSH Account No is required'),
        swiftCode: Yup.string()
            .required('Swift Code is required'),
        telephone1: Yup.string()
            .required('Telephone1 is required'),
        telephone2: Yup.string()
            .optional(),
        fax: Yup.string()
            .optional(),
        emailId: Yup.string()
            .email('Invalid email format')
            .required('Email ID is required'),
        pinNo: Yup.string()
            .required('PIN Number is required'),
        vrnNo: Yup.string()
            .required('VRN Number is required'),
        city: Yup.string()
            .required('City is required'),
        country: Yup.string()
            .required('Country is required'),
        creditDays: Yup.number()
            .required('Credit Days is required').min(0, 'Credit Days cannot be negative'),
        vendorEntityTariffs: Yup.array(
            Yup.object({
                id: Yup.number().required('ID is required'),
                chargeName: Yup.string().required('Charge Name is required'),
                type: Yup.string().required('Type is required'),
                finalDestination: Yup.string().required('Final Destination is required'),
                unitType: Yup.string().required('Unit Type is required'),
                currency: Yup.string().required('Currency is required'),
                unitRate: Yup.number().required('Unit Rate is required').min(0, 'Unit Rate cannot be negative'),
            })
        ).required('Vendor Entity Tariffs are required'),
        vendorEntityDemurageTariffs: Yup.array(
            Yup.object({
                id: Yup.number().required('ID is required'),
                country: Yup.string().required('Country is required'),
                containerType: Yup.string().required('Container Type is required'),
                firstWeek: Yup.string().required('First Week is required'),
                secondWeek: Yup.string().required('Second Week is required'),
                thirdWeek: Yup.string().required('Third Week is required'),
            })
        ).required('Vendor Entity Demurage Tariffs are required'),
        vendorEntityFreeDays: Yup.array(
            Yup.object({
                id: Yup.number().required('ID is required'),
                country: Yup.string().required('Country is required'),
                noOfFreeDays: Yup.number().required('Number of Free Days is required').min(0, 'Number of Free Days cannot be negative'),
            })
        ).required('Vendor Entity Free Days are required'),
        vendorEntityEmails: Yup.array(
            Yup.object({
                id: Yup.number().required('ID is required'),
                designation: Yup.string().required('Designation is required'),
                emailId: Yup.string().email('Invalid email format').required('Email ID is required'),
            })
        ).required('Vendor Entity Emails are required'),
    });
    const { data: optionsSettingsData } = useGetOptionsSettingsQuery("common_settings");
    const { data: vendorSettingsData } = useGetOptionsSettingsQuery("vendor_settings");
    const { data: customerSettingsData } = useGetOptionsSettingsQuery("customer_settings");

    useEffect(() => {
        const handleFetchVendor = async () => {
            try {
                const response = await getVendor({ id });
                if (response?.data) {
                    if (type === "copy" || type === "new") {
                        formik.setValues({
                            ...response.data.body,
                            status: "New",
                            isApproved: !customerSettingsData?.approvalRequest,
                        });
                    } else {
                        formik.setValues(response.data.body);
                    }
                } else {
                    toast.error("Failed to fetch vendor data");
                }
            } catch (error) {
                console.error("Error fetching vendor data:", error);
                toast.error("Error fetching vendor data");
            }
        };

        if (id) {
            handleFetchVendor();
        }

    }, [optionsSettingsData]);


    const initialValues = {
        vendorName: '',
        vendorCode: '',
        vendorNo: '',
        mlo: '',
        status: "New",
        type: '',
        vendorCreation: '',
        mode: '',
        address: '',
        alia: '',
        bankName: '',
        bankAddress: '',
        usdAccountNo: '',
        kshAccountNo: '',
        swiftCode: '',
        telephone1: '',
        telephone2: '',
        fax: '',
        emailId: '',
        pinNo: '',
        vrnNo: '',
        city: '',
        country: '',
        creditDays: 0,
        vendorEntityTariffs: [
            {
                id: Date.now(),
                chargeName: '',
                type: '',
                finalDestination: '',
                unitType: '',
                currency: '',
                unitRate: 0,
                new: true
            },
        ],
        vendorEntityDemurageTariffs: [
            {
                id: Date.now(),
                country: '',
                containerType: '',
                firstWeek: '',
                secondWeek: '',
                thirdWeek: '',
                new: true
            },
        ],
        vendorEntityFreeDays: [
            {
                id: Date.now(),
                country: '',
                noOfFreeDays: 0,
                new: true
            },
        ],
        vendorEntityEmails: [
            {
                id: Date.now(),
                designation: '',
                emailId: '',
                new: true
            },
        ],
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            console.log(type, "type")
            let updatedValue = {
                ...values,
                vendorEntityTariffs: values.vendorEntityTariffs.map((s) =>
                    s.new ? { ...s, new: null, id: null } : s
                ),
                vendorEntityDemurageTariffs: values.vendorEntityDemurageTariffs.map((s) =>
                    s.new ? { ...s, new: null, id: null } : s
                ),
                vendorEntityFreeDays: values.vendorEntityFreeDays.map((s) =>
                    s.new ? { ...s, new: null, id: null } : s
                ),
                vendorEntityEmails: values.vendorEntityEmails.map((s) =>
                    s.new ? { ...s, new: null, id: null } : s
                )
            };
            if (type == "copy" || type == "new") {
                await addVendor({ ...updatedValue, id: null }).then(() => toast.success("Added successfully")).catch((error) => toast.error(error.msg));
            } else {
                await updateVendor(updatedValue).then(() => toast.success("Updated successfully")).catch((error) => toast.error(error.msg))
            }

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
                <TabPanel value={1}>{isLoading ? <Loader /> : <VendorFormInput formik={formik} type={type} disabled={page == "vendorApproval"} optionsSettingsData={optionsSettingsData} />}</TabPanel>
                <TabPanel value={2}><UploadFile customer_id={id} sourceType="VENDOR" page={page} disabled={page == "vendorApproval"} dropdownData={vendorSettingsData?.body?.documentType} /></TabPanel>
            </TabContext>
        </Box></>
    );
}
