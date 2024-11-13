import * as Yup from 'yup';


export const AddBOLValidationSchema = Yup.object({
    blno: Yup.string().required("Please enter BOL No."),
    pod: Yup.string().required("Please enter pod"),
    finalDest: Yup.string().required("Please enter Final Destination"),
    etaFinalDest: Yup.string().required("Please enter ETA Final Destination"),
    sealNo: Yup.string().required("Please enter Seal"),
});



export const validateBOLForm = (values)=>{
    const errors = {};
    if(!values.blno) errors.blno = "Please enter BOL No.";
    if(!values.vessel) errors.vessel = "Please enter Vessel";
    if(!values.voyage) errors.voyage = "Please enter Voyage";
    if(!values.pol) errors.pol = "Please enter POL";
    if(!values.pod) errors.pod = "Please enter POD";
    if(!values.finalDest) errors.finalDest = "Please enter Final Destination";
    if(!values.shipper) errors.shipper = "Please enter Shipper";
    if(!values.polDate) errors.polDate = "Please enter POL Date";
    if(!values.podDate) errors.podDate = "Please enter POD Date";
    if(!values.etaFinalDest) errors.etaFinalDest = "Please enter ETA Final Destination";
    if(!values.dateForClearance) errors.dateForClearance = "Please enter Date for Clearance";
    if(!values.bookingNo) errors.bookingNo = "Please enter Booking No";


    // Validate plData
    const plDataErrors = values.plData.map((item, index) => {
        let plErrors = {};
        if (!item?.seal || item?.seal.trim() === '') {
        plErrors.seal = 'Seal is required';
        plErrors.ship_actual_date = 'Ship Actual Date is required';
        }
        return plErrors;
    });
    if (plDataErrors.some(plError => Object.keys(plError).length > 0)) {
        errors.plData = plDataErrors;
    }

    return errors;
}