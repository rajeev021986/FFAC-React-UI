import { Tooltip } from "@mui/material";
import { ExtractDate } from "../../components/utils/utils";
import dayjs from "dayjs";

export const ACCOUNTS_PENDING_PAYABLE = [
  {
    flex: 1,
    field: "status",
    headerName: "Status",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "invoiceType",
    headerName: "Invoice Type",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  // {
  //   flex: 1,
  //   field: "paybleRefNum",
  //   headerName: "Payable Ref No.",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //   editable: false,
  // },
  {
    flex: 1,
    field: "paybleCreatedDate",
    headerName: "Payble Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return (
        <Tooltip title={`${dayjs(params?.value)?.format("DD/MM/YYYY")}`} arrow>
          <div>{dayjs(params?.value)?.format("DD/MM/YYYY")}</div>
        </Tooltip>
      );
    },
  },
  {
    flex: 1,
    field: "vendorInvDate",
    headerName: "Vendor InvDate",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return (
        <Tooltip title={`${dayjs(params?.value)?.format("DD/MM/YYYY")}`} arrow>
          <div>{dayjs(params?.value)?.format("DD/MM/YYYY")}</div>
        </Tooltip>
      );
    },
  },
  {
    flex: 1,
    field: "jobNo",
    headerName: "Job No",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "vendorName",
    headerName: "Vendor Name",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "jobCreatedDate",
    headerName: "Job Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
    renderCell: (params) => {
      return (
        <Tooltip title={`${dayjs(params?.value)?.format("DD/MM/YYYY")}`} arrow>
          <div>{dayjs(params?.value)?.format("DD/MM/YYYY")}</div>
        </Tooltip>
      );
    },
  },
  {
    flex: 1,
    field: "customerName",
    headerName: "Customer Name",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "vendorInvNo",
    headerName: "Vendor InvNo.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "currency",
    headerName: "Currency",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "totalAmount",
    headerName: "Total Amount",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1,
    field: "action",
    headerName: "Action",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
];
