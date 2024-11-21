// Breadcrumbs.js
import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Routes = {
  user_management: { label: 'User Management', disabled: false },
  entity: { label: 'Entity', disabled: true },
  new: { label: 'Create Customer', disabled: false },
  editcustomer: { label: 'Edit Customer', disabled: false },
  admin_master: { label: 'Admin Master', disabled: true },
  form: { label: 'Form', disabled: false },
  packing_list: { label: 'Packing List', disabled: false },
  spr: { label: 'SPR', disabled: true },
  service_invoice: { label: 'Service Invoice', disabled: false },
  expense_code: { label: 'Expense Code', disabled: false },
  destination: { label: 'Destination', disabled: false },
  vendor: { label: 'Vendor', disabled: false },
  bol: { label: 'BOL', disabled: false },
  po_orders: { label: 'PO Orders', disabled: false },
  dso_orders: { label: 'DSO Orders', disabled: false },
  registered_users: { label: "Registered Users", disabled: false },
  settings: { label: 'Settings', disabled: false },
  admin: { label: 'Admin', disabled: true },
  otm_bol: { label: 'OTM BOL', disabled: false },
  add: { label: 'Add', disabled: false },
  edit: { label: 'Edit', disabled: false },
  code: { label: 'Code', disabled: true },
  customer: { label: 'Customer', disabled: false },
  party: { label: 'Party', disabled: false },
  agent: { label: 'Agent', disabled: false },
}

const ThemedBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb">
      {/* <Link
        component={RouterLink}
        to="/app"
        underline="hover"
        color="inherit"
      >
        Home
      </Link> */}
      {pathnames.map((value, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames?.length - 1;
        if (!Routes[value]?.label) return null;

        return isLast || Routes[value]?.disabled ? (
          <Typography key={routeTo}>
            {Routes[value]?.label}
          </Typography>
        ) : (
          <Link
            component={RouterLink}
            to={routeTo}
            underline="hover"
            color="primary.main"
            key={routeTo}
          >
            {Routes[value]?.label}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default ThemedBreadcrumb;
