// Breadcrumbs.js
import React from "react";
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home"; // Icon import
import NavigateNextIcon from "@mui/icons-material/NavigateNext"; // Optional: custom separator

const Routes = {
  home: { label: "Home", disabled: false },
  user_management: { label: "User Management", disabled: false },
  entity: { label: "Entity", disabled: true },
  master: { label: "Master", disabled: true },
  newcustomer: { label: "Create Customer", disabled: false },
  editcustomer: { label: "Edit Customer", disabled: false },
  approve: { label: "Approve Customer", disabled: false },
  admin_master: { label: "Admin Master", disabled: true },
  form: { label: "Form", disabled: false },
  packing_list: { label: "Packing List", disabled: false },
  spr: { label: "SPR", disabled: true },
  service_invoice: { label: "Service Invoice", disabled: false },
  expense_code: { label: "Expense Code", disabled: false },
  destination: { label: "Destination", disabled: false },
  vendor: { label: "Vendor", disabled: false },
  new_shipper: { label: "Create Shipper", disabled: false },
  new_consignee: { label: "Create Consignee", disabled: false },
  new_icd: { label: "Create Icd", disabled: false },
  bol: { label: "BOL", disabled: false },
  po_orders: { label: "PO Orders", disabled: false },
  dso_orders: { label: "DSO Orders", disabled: false },
  registered_users: { label: "Registered Users", disabled: false },
  settings: { label: "Settings", disabled: false },
  admin: { label: "Admin", disabled: true },
  otm_bol: { label: "OTM BOL", disabled: false },
  add: { label: "Add", disabled: false },
  edit: { label: "Edit", disabled: false },
  approveRequest: { label: "ApproveRequest", disabled: false },
  code: { label: "Code", disabled: true },
  customer: { label: "Customer", disabled: false },
  vessel: { label: "Vessel", disabled: false },
  consignee: { label: "Consignee", disabled: false },
  icd: { label: "Icd", disabled: false },
  editvessel: { label: "Edit Vessel", disabled: false },
  editshipper: { label: "Edit Shipper", disabled: false },
  editconsignee: { label: "Edit Consignee", disabled: false },
  editicd: { label: "Edit Icd", disabled: false },
  newvessel: { label: "Create Vessel", disabled: false },
  vesselVoyage: { label: "Vessel Voyage", disabled: false },
  newvoyage: { label: "Create Voyage", disabled: false },
  editvoyage: { label: "Edit Voyage", disabled: false },
  port: { label: "Port", disabled: false },
  newport: { label: "Create Port", disabled: false },
  editport: { label: "Edit Port", disabled: false },
  party: { label: "Party", disabled: false },
  agent: { label: "Agent", disabled: false },
  roles: { label: "Roles", disabled: false },
  vendorApproval: { label: "Vendor Approval", disabled: false },
  editVendorApprove: { label: "Edit Vendor Approval", disabled: false },
  addVendor: { label: "Add Vendor", disabled: false },
  editVendor: { label: "Edit Vendor", disabled: false },
  shipper: { label: "Shipper", disabled: false },
  users: { label: "Users", disabled: false },
  charges: { label: "Charges", disabled: false },
  newcharges: { label: "Create Charges", disabled: false },
  editcharges: { label: "Edit Charges", disabled: false },
  exchangeRate: { label: "Exchange Rate", disabled: false },
  newexchangerate: { label: "New Exchange Rate", disabled: false },
  editrexchangerate: { label: "Edit Exchange Rate", disabled: false },
  bond: { label: "Bond", disabled: false },
  bondAdd: { label: "Add Bond", disabled: false },
  editBond: { label: "Edit Bond", disabled: false },
  documentation: { label: "Documentation", disabled: true },
  jobEntry: { label: "Job Entries", disabled: false },
  newEntry: { label: "Add New Entry", disabled: true },
  editJobEntry: { label: "Edit Job Entry", disabled: false },
  approveJobfile: { label: "Approve New File", disabled: false },
  updateJob: { label: "Update Job", disabled: false },
  paybleEntry: { label: "Payable Entry", disabled: false },
  addpayable: { label: "Add Payable Entry", disabled: false },
  approvePayable: { label: "Approve Payable", disabled: false },
  editpayable: { label: "Edit Payable Entry", disabled: false },
  approvePayableRequest: { label: "Approve Payable Request", disabled: false },
  accounts: { label: "Accounts (Operations)", disabled: true },
  pendingPayble: { label: "Pending Payable", disabled: true },
};

const ThemedBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      sx={{ paddingBottom: "5px" }}
      separator={<NavigateNextIcon fontSize="small" />}
    >
      <Link
        key="home"
        component={RouterLink}
        to="/"
        underline="hover"
        color="primary.main"
        sx={{ display: "flex", alignItems: "center", fontSize: "14px" }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {pathnames.map((value, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames?.length - 1;
        if (!Routes[value]?.label) return null;
        return isLast || Routes[value]?.disabled ? (
          <Typography
            key={routeTo}
            sx={{ display: "flex", alignItems: "center", fontSize: "14px" }}
            color="text.primary"
          >
            {Routes[value]?.label}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            to={routeTo}
            underline="hover"
            color="primary.main"
            key={routeTo}
            sx={{ display: "flex", alignItems: "center", fontSize: "16px" }}
          >
            <Typography>{Routes[value]?.label}</Typography>
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default ThemedBreadcrumb;
