import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { USER_MANAGEMENT_COLUMNS } from "../../../data/columns/user";
import { appDateFormat } from "../../utils/date";

export const exportUserManagement = async (data) => {
    let headers = [];
    const worksheetData = [];

    headers = USER_MANAGEMENT_COLUMNS
        .map((item) => item.headerName)
        .filter((item) => item !== 'Action');
    worksheetData.push(headers);

    data.forEach((item) => {
        const row = [];
        USER_MANAGEMENT_COLUMNS.forEach((column) => {
            if(column?.cellType === 'date'){
                row.push(appDateFormat(item[column.field]));
            }else{
                row.push(item[column.field]);
            }
        });
        worksheetData.push(row);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Management");
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
        if(columnIndex+1 === 5 || columnIndex+1 === 6){
            column.width = 30
            column.alignment = { horizontal: "center" }
        }else{
            column.width = 20
            column.alignment = { horizontal: "center"}
        }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.ms-excel" }), "UserManagement.xlsx");
}