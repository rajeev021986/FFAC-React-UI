import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { appDateFormat } from "../../utils/date";
import { SHIPMENT_COLUMNS } from "../../../data/columns/dashbaord.shipment";

export const exportDashboardData = async (data) => {
    let headers = [];
    const worksheetData = [];

    headers = SHIPMENT_COLUMNS
        .map((item) => item.headerName)
        .filter((item) => item !== 'Action');
    worksheetData.push(headers);

    data.forEach((item) => {
        const row = [];
        SHIPMENT_COLUMNS.forEach((column) => {
            if(column?.cellType === 'date'){
                row.push(appDateFormat(item[column.field]));
            }else if(column?.field === 'status'){
                row.push(`${item[column.field]?.key} ${item[column.field]?.value ? `(${item[column.field]?.value})` : ''}`);
            }else{
                row.push(item[column.field]);
            }
        });
        worksheetData.push(row);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shipment Data");
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
        if(columnIndex+1 === 5){
            column.width = 40
            column.alignment = { wrapText: true, horizontal: "center" };
        }
        else if(columnIndex+1 === 1){
            column.width = 11
            column.alignment = { wrapText: true, horizontal: "center" };
        }
        else{
            column.width = 20
            column.alignment = { horizontal: "center"}
        }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.ms-excel" }), "ShipmentData.xlsx");
}