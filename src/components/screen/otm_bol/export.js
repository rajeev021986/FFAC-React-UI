import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { appDateFormat } from "../../utils/date";
import { OTM_BOL_COLUMNS } from "../../../data/columns/otm_bol";

export const exportOtmBol = async (data) => {
    let headers = [];
    const worksheetData = [];

    headers = OTM_BOL_COLUMNS
        .map((item) => item.headerName)
        .filter((item) => item !== 'Action');
    worksheetData.push(headers);

    data.forEach((item) => {
        const row = [];
        OTM_BOL_COLUMNS.forEach((column) => {
            if(column?.cellType === 'date'){
                row.push(appDateFormat(item[column.field]));
            }else{
                row.push(item[column.field]);
            }
        });
        worksheetData.push(row);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("OTM BOL");
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
        if(columnIndex+1 === 3){
            column.width = 45
            column.alignment = { horizontal: "center" }
        }else{
            column.width = 20
            column.alignment = { horizontal: "center"}
        }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.ms-excel" }), "OTM_BOL.xlsx");
}