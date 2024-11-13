
import { 
    FileDownloadDone,
    HourglassEmpty
} from '@mui/icons-material';

/*
 Description: This file contains all the enums used in the application
*/


export const UserRoleEnum = {
    ADMIN : "ADMIN",
    AGENT : "AGENT",
    BACKOFFICE : "BACKOFFICE",
    CUSTOMER : "CUSTOMER",
    FRONTOFFICE : "FRONTOFFICE",
    SALES : "SALES",
}

export const UserStatusEnum = {
    ACTIVE : "ACTIVE",
    INACTIVE : "INACTIVE",
}

export const PL_STATUS = {
    FINAL : 'FINAL',
    BOOKED : 'BOOKED',
    SUBMIT : 'SUBMIT',
}

export const TRM_STATUS = {
    Verified : 'Verified',
    NotVerified : 'Not Verified',
    SentToSPR : 'Sent to SPR',
    Duplicate : 'Duplicate',
}

export const SHIPMENT_STATUS_OBJ = {
    'Departure delayed' : { color : 'error', icon : <HourglassEmpty/> , value : '-1d'},
    'Departure on time' : { color : 'success', icon : <HourglassEmpty/> },
    'Arrival delayed' : { color : 'error', icon : <HourglassEmpty/> },
    'Arrival on time' : { color : 'success', icon : <HourglassEmpty/> },
    'Ready for pickup' : { color : 'warning', icon : <HourglassEmpty/> },
    'Picked up' : { color : 'success', icon : <FileDownloadDone/> },
    'Empty returned' : { color : 'success', icon : <HourglassEmpty/> },
    'On Hold' : { color : 'info', icon : <HourglassEmpty/> },
}