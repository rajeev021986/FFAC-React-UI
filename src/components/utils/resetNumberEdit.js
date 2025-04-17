import React from "react";
import { MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import { generatePattern } from "../utils/utils"; // Adjust the path if necessary

const ResetNumberEdit = ({ id, value, field, api, row }) => {
  const replaceVoucherCodes = (input) => {
    const currentDate = dayjs();
    const replacements = {
      "#4": String(1).padStart(4, "0"),
      "#5": String(1).padStart(5, "0"),
      "#6": String(1).padStart(6, "0"),
      "#7": String(1).padStart(7, "0"),
      "#8": String(1).padStart(8, "0"),
      $Z: String(currentDate.month() + 1).padStart(2, "0"),
      $N: currentDate.format("MMM"),
      $M: String(currentDate.month() + 1),
      $D: String(currentDate.date()).padStart(2, "0"),
      $Y: String(currentDate.year()),
    };
    return input.replace(
      /#4|#5|#6|#7|#8|\$Z|\$N|\$M|\$D|\$Y/g,
      (match) => replacements[match] || match
    );
  };

  const handleChange = async (e) => {
    const newValue = e.target.value;

    const shipmentType = row?.shipmentType || "GEN";
    const shipmentCode = shipmentType
      .replace(/[^a-zA-Z]/g, "")
      .substring(0, 3)
      .toUpperCase();

    const newPattern = generatePattern({
      shipmentType: shipmentCode,
      resetNumber: newValue,
      voucherDigits: 4,
    });

    const newSample = replaceVoucherCodes(newPattern);

    await api.setEditCellValue({ id, field: "resetNumber", value: newValue });
    await api.setEditCellValue({ id, field: "jobPattern", value: newPattern });
    await api.setEditCellValue({ id, field: "sampleJobNumber", value: newSample });

    api.stopCellEditMode({ id, field });
  };

  return (
    <Select size="small" value={value || ""} onChange={handleChange} fullWidth>
      <MenuItem value="Never">Never</MenuItem>
      <MenuItem value="Yearly">Yearly</MenuItem>
      <MenuItem value="Month">Month</MenuItem>
      <MenuItem value="Daily">Daily</MenuItem>
    </Select>
  );
};

export default ResetNumberEdit;
