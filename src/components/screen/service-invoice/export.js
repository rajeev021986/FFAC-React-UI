import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { appDateFormat } from "../../utils/date";
import { SERVICE_INVOICE_COLUMNS } from "../../../data/columns/service-invoice";

export const exportServiceInvoiceList = async (data) => {
    let headers = [];
    const worksheetData = [];

    headers = SERVICE_INVOICE_COLUMNS
        .map((item) => item.headerName)
        .filter((item) => item !== 'Action');
    worksheetData.push(headers);

    data.forEach((item) => {
        const row = [];
        SERVICE_INVOICE_COLUMNS.forEach((column) => {
            if(column?.cellType === 'date'){
                row.push(appDateFormat(item[column.field]));
            }else if (column.field === 'total_amount'){
                let total = item['serviceInvoiceDetails']?.reduce((acc, curr) => {
                    return acc + Number(curr.extended_price);
                }, 0);
                row.push(total);
            }else{
                row.push(item[column.field]);
            }
        });
        worksheetData.push(row);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Service Invoice");
    worksheet.addRows(worksheetData);
    worksheet.getRow(1).font = { 
        bold: true,
        horizontal: "center",
        vertical: "middle" 
    };
    worksheet.views = [
        { state: "frozen", xSplit: 0, ySplit: 1, topLeftCell: "A2" },
    ];
    worksheet.getRow(1).height = 25;
    worksheet.columns.forEach((column,columnIndex) => {
        if(columnIndex+1 === 16){
            column.width = 40
            column.alignment = { wrapText: true, horizontal: "center" };
        }
        else if(columnIndex+1 === 1){
            column.width = 11
            column.alignment = { wrapText: true, horizontal: "center" };
        }
        else if(
            columnIndex+1 === 8 ||
            columnIndex+1 === 9 ||
            columnIndex+1 === 10 ||
            columnIndex+1 === 11
        ){
            column.numFmt = "#,##0.00";
        }
        else{
            column.width = 20
            column.alignment = { horizontal: "center"}
        }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.ms-excel" }), "ServiceInvoice.xlsx");
}