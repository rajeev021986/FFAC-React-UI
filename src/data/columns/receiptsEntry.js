import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
export const RECEIPTS_ENTRY_COLUMNS = [
  {
    flex: 3,
    field: "receiptRefNo",
    headerName: "Ref.No.",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
    {
    flex: 1,
    field: "receivablePartyName",
    headerName: "Customer Name",
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
    field: "exchangeRate",
    headerName: "exchangeRate",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  {
    flex: 1.5,
    field: "date",
    headerName: "Date",
    width: 110,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
  // {
  //   flex: 1,
  //   field: "receivableAmount",
  //   headerName: "Receivable Amount.",
  //   width: 110,
  //   headerAlign: "center",
  //   align: "center",
  //   minWidth: 100,

  //   editable: false,
  // },
  {
    flex: 1,
    field: "recAmount",
    headerName: "Rec Amount.",
    width: 110,
    headerAlign: "center",
    align: "center",
    minWidth: 100,

    editable: true,
  },
    {
    flex: 1,
    field: "createdBy",
    headerName: "Created By.",
    width: 110,
    headerAlign: "center",
    align: "center",
    minWidth: 100,

    editable: true,
  },
    {
    flex: 1,
    field: "createdDate",
    headerName: "Created Date.",
    width: 110,
    headerAlign: "center",
    align: "center",
    minWidth: 100,

    editable: true,
  },
    {
    flex: 1,
    field: "modifiedBy",
    headerName: "modified By.",
    width: 110,
    headerAlign: "center",
    align: "center",
    minWidth: 100,

    editable: true,
  },
    {
    flex: 1,
    field: "modifiedDate",
    headerName: "modified Date.",
    width: 110,
    headerAlign: "center",
    align: "center",
    minWidth: 100,

    editable: true,
  },

  // {
  //   flex: 1,
  //   field: "withHoldingAmount",
  //   headerName: "W.Tax.Recov.",
  //   width: 110,
  //   minWidth: 100,

  //   headerAlign: "center",
  //   align: "center",
  //   editable: true,
  //   // renderCell: (params) => (
  //   //   <div className="word-wrap-cell">{params?.value || ""}</div>
  //   // ),
  // },

  {
    flex: 1,
    field: "action",
    headerName: "Action",
    width: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
  },
];
