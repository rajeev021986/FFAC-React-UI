import toast from "react-hot-toast";
import { TRM_STATUS } from "../../../data/enums";
import moment from "moment";


export const SIActions = {
    viewPdf: (params) => {
        const { pdf_path } = params;
        // ** implementation pending **
    },
    submitVerify: async (params, verifyStatus, isVerified, reason = '') => {
        // ** for verified & not verified button **
        const { serial_id } = params;
        const payload = {
            serial_id,
            isVerified,
            reason,
            type: "new"
        }
        try {
            const resp = await verifyStatus(payload).unwrap();
            console.log(resp);
            if (resp.status === 'success') {
                toast.success(resp.message);
            }
        } catch (error) {
            toast.error(error.data.message);
        }
    },
    save: async (params, saveServiceInvoice) => {
        // ** to save the data in 'save' button click **
        console.log('save : ', params);
        if (!validation(params)) {
            return;
        }

        let payload = {
            serial_id: params.serial_id, 
            volume: params.numbr1,
            pieces: params.numbr2,
            grosswt: params.numbr3,
            chargeablewt: params.numbr4,
            trm_received_date: moment(params.batch_run_date).format("MM/DD/YYYY"),
            invoice_date: moment(params.invoice_date).format("MM/DD/YYYY"),
            charges: params.serviceInvoiceDetails.map((item) => { 
                return {
                    serial_id: item.serial_id,
                    amount: Number(item.extended_price),
                }
            })
        };
        try {
            const resp = await saveServiceInvoice(payload).unwrap();
            console.log(resp);
            if (resp.status === 'success') {
                toast.success(resp.message);
            }
        } catch (error) {
            toast.error(error.data.message);
        }

    },
    handleVerify: (params, verifyStatus, isVerified, alertConfig, setAlertConfig,) => {
        // ** validation before varify **
        if (!validation(params)) {
            return;
        }

        if (params.trm_status === TRM_STATUS.Duplicate) {
            setAlertConfig({
                open: true,
                title: "Are you sure?",
                message: "This is Duplicate Invoice. Do you want to verify this invoice?",
                severity: "warning",
                onConfirm: () => {
                    SIActions.submitVerify(params, verifyStatus, isVerified);
                    setAlertConfig({ ...alertConfig, open: false })
                },
                onClose: () => setAlertConfig({ ...alertConfig, open: false })
            })
        } else {
            SIActions.submitVerify(params, verifyStatus, isVerified);
        }
    },
    isEditable: (trm_status, setEditable) => {
        // ** to give premission to edit the form **
        if (
            trm_status === TRM_STATUS.NotVerified ||
            trm_status === TRM_STATUS.Duplicate
        ) {
            setEditable(true);
        } else if (trm_status === TRM_STATUS.SentToSPR) {
            setEditable(false);
        } else {
            setEditable(false);
        }
    }
}




// **** This function is used to validate the invoice date ****
function validation(params) {
    const invoice_date = moment(params.invoice_date);
    const today = moment();
    const diff = today.diff(invoice_date, 'days');
    console.log({diff,today,invoice_date})
    /*
    Invoice date should not be greater than 15 days in future 
    &
    Invoice date should not be greater than 90 days in past
    */
    if (diff < -15 || diff > 90) {
        toast.error("Invoice date should not be greater than 15 days in future and 90 days in past");
        return false;
    }
    return true;
}