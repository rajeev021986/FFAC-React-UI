import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Exchange() {
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
        onSubmit: (values) => {
            console.log(values, "values");
        }
    });

    return (
        <>

        </>
    );
}
