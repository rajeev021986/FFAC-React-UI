import * as Yup from 'yup';

export const destinationValidation = Yup.object({
    code: Yup.string().required("Code is required"),
    description: Yup.string().required("Description is required"),
    address1: Yup.string().required("Address1 is required"),
    address2: Yup.string().required("Address2 is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalcode: Yup.string().required("Postal Code is required"),
    country: Yup.string().required("Country is required"),
});