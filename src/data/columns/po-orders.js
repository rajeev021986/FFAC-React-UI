import { appDateFormat } from "../../components/utils/date";


export const PO_ORDER_LIST_COLUMNS = (displayFormat) =>{
  return [
    {
      field: "order_no",
      headerName: "Order No",
      width: 120,
      headerAlign: "center",
      align: "center",
      cellType : "number",
    },
    {
      field: "profoma_po",
      headerName: "Proforma PO",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "order_date",
      headerName: "Order Date",
      width: 150,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {     
        return <div>{appDateFormat(value)}</div>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "buyer",
      headerName: "Buyer",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "supplier",
      headerName: "Supplier",
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "carrier",
      headerName: "Carrier",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "delivery_terms",
      headerName: "Delivery Terms",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fob_point",
      headerName: "FOB Point",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "payment_type",
      headerName: "Payment Type",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "payment_terms",
      headerName: "Payment Terms",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "origin_cntry",
      headerName: "Origin Country",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "first_ship_date",
      headerName: "First Ship Date",
      width: 160,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {
        return <div>{appDateFormat(value)}</div>;
      },
    },
    {
      field: "last_ship_date",
      headerName: "Last Ship Date",
      width: 160,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {
        return <div>{appDateFormat(value)}</div>;
      },
    },
    {
      field: "final_dest",
      headerName: "Final Destination",
      width: 170,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tot_grs_value",
      headerName: "Total Gross Value",
      width: 190,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_grs_value", value)}</>
      }
  
    },
    {
      field: "tot_adj_val",
      headerName: "Total Adj Value",
      width: 170,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_adj_val", value)}</>
      }
    },
    {
      field: "tot_net_value",
      headerName: "Total Net Value",
      width: 170,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_net_value", value)}</>
      }
    },
    {
      field: "tot_calc_cost",
      headerName: "Total Calc Cost",
      width: 170,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_calc_cost", value)}</>
      }
    },
    {
      field: "tot_resell_value",
      headerName: "Total Resell Value",
      width: 180,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_resell_value", value)}</>
      }
    },
    {
      field: "po_profit_pct",
      headerName: "PO Profit %",
      width: 150,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("po_profit_pct", value)}</>
      }
    },
    {
      field: "tot_qty",
      headerName: "Total Quantity",
      width: 160,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_qty", value)}</>
      }
    },
    {
      field: "tot_packs",
      headerName: "Total Packs",
      width: 150,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_packs", value)}</>
      }
    },
    {
      field: "tot_grs_wgt",
      headerName: "Total Gross Weight",
      width: 190,
      cellType : "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cont_size",
      headerName: "Container Size",
      width: 160,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("cont_size", value)}</>
      }
    },
    {
      field: "um_cont_size",
      headerName: "UM Container Size",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tot_po_cont",
      headerName: "Total PO Cont.",
      width: 170,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_po_cont", value)}</>
      }
    },
    {
      field: "memo1",
      headerName: "Memo 1",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email_status",
      headerName: "Email Status",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email_date",
      headerName: "Email Date",
      width: 150,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {
        return <div>{appDateFormat(value)}</div>;
      },
    },
    {
      field: "ref_no",
      headerName: "Ref No",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "remit_to",
      headerName: "Remit To",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status_01",
      headerName: "Status 01",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status_03",
      headerName: "Status 03",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tot_owned_value",
      headerName: "Total Owned Value",
      width: 200,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_owned_value", value)}</>
      }
    },
    {
      field: "memo2",
      headerName: "Memo 2",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "memo3",
      headerName: "Memo 3",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "memo4",
      headerName: "Memo 4",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "tot_pack_meas",
      headerName: "Total Pack Meas",
      width: 170,
      cellType : "number",
      headerAlign: "center",
      align: "center",
      renderCell : (value) =>{
        return <>{displayFormat("tot_pack_meas", value)}</>
      }
    },
    {
      field: "numbr1",
      headerName: "Number 1",
      width: 130,
      cellType : "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "date1",
      headerName: "Date 1",
      width: 150,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {
        return <div>{appDateFormat(value)}</div>;
      },
    },
    {
      field: "date2",
      headerName: "Date 2",
      width: 150,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {
        return <div>{appDateFormat(value)}</div>;
      },
    },
    {
      field: "date3",
      headerName: "Date 3",
      width: 150,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {
        return <div>{appDateFormat(value)}</div>;
      },
    },
    {
      field: "date4",
      headerName: "Date 4",
      width: 150,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {
        return <div>{appDateFormat(value)}</div>;
      },
    },
    {
      field: "memo8",
      headerName: "Memo 8",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "logical_key",
      headerName: "Logical Key",
      width: 350,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "batch_run_date",
      headerName: "Batch Run Date",
      width: 180,
      cellType: "date",
      headerAlign: "center",
      align: "center",
      renderCell: (value) => {
        return <div>{appDateFormat(value)}</div>;
      },
    },
  ];
  
} 
export const PO_ORDER_DETAILS_COLUMNS = (displayFormat) =>{
  return [
    {
      field: "owner",
      headerName: "Owner",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "order_no",
      headerName: "Order No",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "item_no",
      headerName: "Item No",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "line_no",
      headerName: "Line No",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "profoma_po",
      headerName: "Profoma PO",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "offer_no",
      headerName: "Offer No",
      width: 130,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "qty",
      headerName: "Quantity",
      width: 120,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "no_packages",
      headerName: "No. of Packages",
      width: 150,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "qty_per_pack",
      headerName: "Quantity per Pack",
      width: 150,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "item_ext_price",
      headerName: "Item Extended Price",
      width: 180,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "calc_cost_cur",
      headerName: "Currency",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "origin_cntry",
      headerName: "Origin Country",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "manufacturer",
      headerName: "Manufacturer",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "grs_wgt_pack",
      headerName: "Gross Weight per Pack",
      width: 180,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "um_grs_wgt_pack",
      headerName: "Weight Unit",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pack_meas",
      headerName: "Package Measurement",
      width: 180,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "um_pack_meas",
      headerName: "Measurement Unit",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "memo2",
      headerName: "Memo 2",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "memo6",
      headerName: "Memo 6",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "request_no",
      headerName: "Request No",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "row_no",
      headerName: "Row No",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "length",
      headerName: "Length",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "um_length",
      headerName: "Length Unit",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "width",
      headerName: "Width",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "um_width",
      headerName: "Width Unit",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "height",
      headerName: "Height",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "um_height",
      headerName: "Height Unit",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "model_no",
      headerName: "Model No",
      width: 120,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hts_no",
      headerName: "HTS No",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "ship_pack",
      headerName: "Shipping Pack",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "um_shipped_qty",
      headerName: "Shipped Quantity Unit",
      width: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "numbr1",
      headerName: "Number 1",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "numbr6",
      headerName: "Number 6",
      width: 100,
      type: "number",
      headerAlign: "center",
      align: "center",
    },
  ];
}
