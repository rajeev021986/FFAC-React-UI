import * as Yup from "yup";

export const ConsigneeValidationSchema = () =>
    Yup.object({
        consigneeName: Yup.string().required("Name is required"),
        address1: Yup.string().required("Address is required"),
        city: Yup.string().matches(
            /^[A-Za-z\s]+$/,
            "City must only contain letters"
        ),
    });
