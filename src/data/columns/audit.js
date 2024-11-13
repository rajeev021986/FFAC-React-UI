import { appDateFormat } from "../../components/utils/date";

export const COMMON = [
  {
    field: "field_name",
    headerName: "Field Name",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "old_value",
    headerName: "Old Value",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "new_value",
    headerName: "New Value",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "created_by",
    headerName: "Created By",
    width: 130,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "created_at",
    headerName: "Created At",
    width: 130,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return <div>{appDateFormat(params.value)}</div>;
    },
  },
];

export const PACKING_LIST = [
  {
    field: "label_text",
    headerName: "Field Name",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "prev_value",
    headerName: "Previous Value",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "current_value",
    headerName: "Current Value",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "created_date",
    headerName: "Created Date",
    width: 180,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return <div>{appDateFormat(params.value)}</div>;
    },
  },
  {
    field: "created_by",
    headerName: "Created By",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
];

export const SERVICE_INVOICE = [
  {
    field: "label_text",
    headerName: "Field Name",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "prev_value",
    headerName: "Previous Value",
    width: 250,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "current_value",
    headerName: "Current Value",
    width: 250,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "lastmodifieddate",
    headerName: "Last Modified Date",
    width: 200,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return <div>{appDateFormat(params.value)}</div>;
    },
  },
  {
    field: "lastmodifiedby",
    headerName: "Last Modified By",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
];
