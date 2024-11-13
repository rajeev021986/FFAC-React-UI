import { TRM_STATUS } from "../../../../data/enums";
import { appDateFormat } from "../../../utils/date";


export const getPLTrackingDetails = (item) => {
    function labelFormatter(label,date){
        return `${label} ${
            date ? appDateFormat(date) : ""
        }`;
    }
    if (true) {
        // book = book sent date
        // si = invoice sent date
        const steps = [
            { label: labelFormatter('PL SUBMIT', item?.submit_date), isCompleted: item.pl_status === 'SUBMIT' || item.pl_status === 'BOOKED' || item.pl_status === 'FINAL' || item.invoice_status === "Sent to SPR" },
            { label: labelFormatter('PL BOOKED',item?.booking_date), isCompleted: item.pl_status === 'BOOKED' || item.pl_status === 'FINAL' }, // + 
            { label: labelFormatter('PL FINAL',item?.final_batch_run_date), isCompleted: item.pl_status === 'FINAL' },
            { label: labelFormatter('BOL ISSUE',item?.bl_batch_run_date), isCompleted: item.bl_no !== "NA" },
            { label: labelFormatter('OTM SENT'), isCompleted: true },
            { label: labelFormatter('SI RAISED',item?.invoice_date), isCompleted: item.invoice_status === "Sent to SPR" },
        ];
        return steps;
    }
    return null;
}


export const getBLTrackingDetails = (item) => {
    return item.bl_count > 0 ?  [
        { info: `${item?.bl_pol} ${appDateFormat(item?.bl_pol_date)}`},
        { info: `${item?.bl_pod} ${appDateFormat(item?.bl_pod_date)}` },
        { info: `${item?.bl_fpd} ${appDateFormat(item?.bl_fpd_date)}` },
    ] : null;
}
