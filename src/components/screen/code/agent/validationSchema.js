import * as Yup from 'yup';

export const AgentValidationSchema = () =>
    Yup.object({
      iesclientcode: Yup.string().required("Client Code is required"),
      cname: Yup.string().required("Name is required"),
      atype: Yup.array()
        .min(1, "At least one option must be selected") // At least one checkbox required
        .required("This field is required"),
    });