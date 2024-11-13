import * as Yup from 'yup';

export const UserValidationSchema = (formAction) => Yup.object({
    userid: Yup.string().required("User ID is required"),
    emailid: Yup.string().email("Invalid email address").required("Email ID is required"),
    firstname: Yup.string().required("First Name is required"),
    password: formAction === 'edit' || formAction === 'verify' ? Yup.string() : Yup.string().required("Password is required"),
    confirm_password: formAction === 'edit' || formAction === 'verify'  ? 
        Yup.string() :
        Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required("Confirm Password is required"),
    status: Yup.string().required("Status is required"),
    role: Yup.string().required("Role is required"),
    companyname: Yup.string().required("Company Name is required"),
});