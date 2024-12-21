import * as Yup from 'yup';

export const VesselVoyageValidation = () => Yup.object({
    status: Yup.string().required('Status is required'),
    vesselVoyage: Yup.string().required('Voyage is required'),
    mode: Yup.string().required('Mode is required'),
    voyageInBound: Yup.string().required('InBound is required'),
    voyageOutBound: Yup.string().required('OutBound is required'),
    gateStatus: Yup.string().required('Gate Status is required'),
    portOperator: Yup.string().required('Port Operator is required'),
});
