import { UserRoleEnum, UserStatusEnum } from "./enums";

export const USER_ROLE_OPTIONS = [
  { value: UserRoleEnum.ADMIN, label: "Admin" },
  { value: UserRoleEnum.AGENT, label: "Agent" },
  { value: UserRoleEnum.BACKOFFICE, label: "Back Office" },
  { value: UserRoleEnum.CUSTOMER, label: "Customer" },
  { value: UserRoleEnum.FRONTOFFICE, label: "Front Office" },
  { value: UserRoleEnum.SALES, label: "Sales" },
];

export const USER_STATUS_OPTIONS = [
  { value: UserStatusEnum.ACTIVE, label: "Active" },
  { value: UserStatusEnum.INACTIVE, label: "Inactive" },
];


 export const PAYMENTTYPE_OPTIONS = [
  { label: "cash", value: "Cash" },
  { label: "credit", value: "Credit" },
];

 export const ACCOUNT_TYPE_OPTIONS = [
  { value: "local", label: "Local" },
  { value: "transit", label: "Transit" }
];

export const USER_SORT_OPTIONS = [
  { value: "companyname*asc", label: "Company Name Ascending" },
  { value: "companyname*desc", label: "Company Name Descending" },
  { value: "firstname*asc", label: "Name Ascending" },
  { value: "firstname*desc", label: "Name Descending" },
  { value: "role*asc", label: "Role Ascending" },
  { value: "role*desc", label: "Role Descending" },
  { value: "userid*asc", label: "User ID Ascending" },
  { value: "userid*desc", label: "User ID Descending" },
];


export const NEW_USER_SORT_OPTIONS = [
  { value: "firstname*asc", label: "First Name Ascending" },
  { value: "firstname*desc", label: "First Name Descending" },
  { value: "lastname*asc", label: "Last Name Ascending" },
  { value: "lastname*desc", label: "Last Name Descending" },
  { value: "emailid*asc", label: "Email Id Ascending" },
  { value: "emailid*desc", label: "Email Id Descending" },
];

export const PACKING_LIST_SORT_OPTIONS = [
  { value: "packing_list_no*asc", label: "Packing List No. Ascending" },
  { value: "packing_list_no*desc", label: "Packing List No. Descending" },
  { value: "shipper_vendor_name*asc", label: "Vendor Ascending" },
  { value: "shipper_vendor_name*desc", label: "Vendor Descending" },
  { value: "pl_no*asc", label: "PL No Ascending" },
  { value: "pl_no*desc", label: "PL No Descending" },
  { value: "fob_port*asc", label: "FOB Port Ascending" },
  { value: "fob_port*desc", label: "FOB Port Descending" },
  { value: "pl_status*asc", label: "PL Status Ascending" },
  { value: "pl_status*desc", label: "PL Status Descending" },
];

export const SERVICE_INVOICE_SORT_OPTIONS = [
  { value: "invoice_no*asc", label: "Invoice No. Ascending" },
  { value: "invoice_no*desc", label: "Invoice No. Descending" },
  { value: "invoice_date*asc", label: "Invoice Date Ascending" },
  { value: "invoice_date*desc", label: "Invoice Date Descending" },
  { value: "mbl_no*asc", label: "MBL Ascending" },
  { value: "mbl_no*desc", label: "MBL Descending" },
  { value: "hbl*asc", label: "HBL Ascending" },
  { value: "hbl*desc", label: "HBL Descending" },
];

export const Console_BL_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const PO_ORDERS_SORT_OPTIONS = [
  { value: "order_no*asc", label: "Order No. Ascending" },
  { value: "order_no*desc", label: "Order No. Descending" },
  { value: "order_date*asc", label: "Order Date Ascending" },
  { value: "order_date*desc", label: "Order Date Descending" },
  { value: "supplier*asc", label: "Supplier Ascending" },
  { value: "supplier*desc", label: "Supplier Descending" },
  { value: "vendor_name*asc", label: "Vendor Ascending" },
  { value: "vendor_name*desc", label: "Vendor Descending" },
  { value: "batch_run_date*asc", label: "Batch Run Date Ascending" },
  { value: "batch_run_date*desc", label: "Batch Run Date Descending" },
];

export const DSO_ORDERS_SORT_OPTIONS = [
  { value: "order_no*asc", label: "Order No. Ascending" },
  { value: "order_no*desc", label: "Order No. Descending" },
  { value: "order_date*asc", label: "Order Date Ascending" },
  { value: "order_date*desc", label: "Order Date Descending" },
  { value: "supplier*asc", label: "Supplier Ascending" },
  { value: "supplier*desc", label: "Supplier Descending" },
  { value: "vendor_name*asc", label: "Vendor Ascending" },
  { value: "vendor_name*desc", label: "Vendor Descending" },
  { value: "batch_run_date*asc", label: "Batch Run Date Ascending" },
  { value: "batch_run_date*desc", label: "Batch Run Date Descending" },
];

export const DASHBAORD_SORT_OPTIONS = [
  { value: "pod*asc", label: "POD Ascending" },
  { value: "pod*desc", label: "POD Descending" },
  { value: "pol*asc", label: "POL Ascending" },
  { value: "pol*desc", label: "POL Descending" },
  { value: "shipper*asc", label: "Shipper Ascending" },
  { value: "shipper*desc", label: "Shipper Descending" },
]


export const OTM_BOL_SORT_OPTIONS = [
  { value: "bol*asc", label: "BOL No. Ascending" },
  { value: "bol*desc", label: "BOL No. Descending" },
  { value: "supplier_name*asc", label: "Supplier Name Ascending" },
  { value: "supplier_name*desc", label: "Supplier Name Descending" },
  { value: "pol*asc", label: "POL Ascending" },
  { value: "pol*desc", label: "POL Descending" },
  { value: "pod*asc", label: "POD Ascending" },
  { value: "pod*desc", label: "POD Descending" },
];


export const CUSTOMER_SORT_OPTIONS = [
  // { value: "acode*asc", label: "Code Ascending" },
  // { value: "acode*desc", label: "Code Descending" },
  { value: "cname*asc", label: "Customer Ascending" },
  { value: "cname*desc", label: "Customer Descending" },
  { value: "country*asc", label: "Country Ascending" },
  { value: "country*desc", label: "Country Descending" },
];
export const SHIPPER_SORT_OPTIONS = [
  // { value: "acode*asc", label: "Code Ascending" },
  // { value: "acode*desc", label: "Code Descending" },
  { value: "name*asc", label: "Shipper Ascending" },
  { value: "name*desc", label: "Shipper Descending" },
  { value: "country*asc", label: "Country Ascending" },
  { value: "country*desc", label: "Country Descending" },
];

export const PARTY_SORT_OPTIONS = [
  { value: "acode*asc", label: "Code Ascending" },
  { value: "acode*desc", label: "Code Descending" },
  { value: "cname*asc", label: "Party Ascending" },
  { value: "cname*desc", label: "Party Descending" },
  { value: "country*asc", label: "Country Ascending" },
  { value: "country*desc", label: "Country Descending" },
];

export const AGENT_SORT_OPTIONS = [
  { value: "acode*asc", label: "Code Ascending" },
  { value: "acode*desc", label: "Code Descending" },
  { value: "cname*asc", label: "Agent Ascending" },
  { value: "cname*desc", label: "Agent Descending" },
  { value: "country*asc", label: "Country Ascending" },
  { value: "country*desc", label: "Country Descending" },
];