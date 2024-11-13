import * as Yup from 'yup';

export const CustomerValidationSchema = () => Yup.object({
    // iesclientcode: Yup.string().required("Client Code is required"),
    customerName: Yup.string().required("Name is required"),
});