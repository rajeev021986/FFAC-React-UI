import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ExcelViewer = ({ base64Data, mimeType }) => {
    const [excelData, setExcelData] = useState([]);

    const parseExcelData = () => {
        const binaryString = atob(base64Data);
        const byteNumbers = new Array(binaryString.length)
            .fill(0)
            .map((_, i) => binaryString.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setExcelData(jsonData);
        };
        reader.readAsArrayBuffer(blob);
    };
    useEffect(() => { parseExcelData() }, [base64Data]);

    return (
        <div>
            {excelData.length > 0 && (
                <table border="1">
                    <thead>
                        <tr>
                            {Object.keys(excelData[0]).map((key, index) => (
                                <th key={index}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {excelData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.values(row).map((value, colIndex) => (
                                    <td key={colIndex}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExcelViewer;
