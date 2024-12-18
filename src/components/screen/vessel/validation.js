import * as Yup from 'yup';

export const VesselValidation = () => Yup.object({
    status: Yup.string().required('Status is required'),
    vesselMaster: Yup.string().required('Vessel Master is required'),
    mode: Yup.string().required('Mode is required'),
    vesselName: Yup.string().required('Vessel Name is required'),
    lineName: Yup.string().required('Line Name is required'),
    vesselOwner: Yup.string().required('Vessel Owner is required'),
    vesselLineEntities: Yup.array().of(
        Yup.object().shape({
            shippingLine: Yup.string().required('Shipping Line is required'),
            vesselName: Yup.string().required('Vessel Name is required')
        })
    ).required("Vessel lines are required")
});