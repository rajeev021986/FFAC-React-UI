import * as React from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
export default function DateTimeField({
  sx,
  value,
  onChange,
  inputRef,
  label,
  id,
  error,
  disabled,
  disablePast,
  ...props
}) {
  const validValue = value ? dayjs(value) : null;
  const handleDateChange = (date) => {
    const timeAsDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    const timeAsUTC = dayjs(date).utc().format("YYYY-MM-DDTHH:mm:ss.SSS");;

    if(label =='From Date' || label == 'To Date'){
      onChange(id, timeAsUTC);
    }else{
      onChange(id, timeAsDate);

    }
    // .toDate();
  };

  
  //const now = dayjs()
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        id={id}
        label={label}
        value={validValue}
        onChange={handleDateChange}
        error={error ? true : false}
        // minDateTime={now}
        disabled={disabled}
        disablePast={disablePast}
        helperText={error}
        inputRef={inputRef}
        sx={{
          "& .MuiInputBase-input": {
            textTransform: "uppercase", // ✅ Capitalizes both placeholder & input
          },
          "& .MuiInputBase-root": {
            fontSize: "14px",
            borderRadius: "10px",
            width: "100%",
            height: "44px",
            border: error ? "1px solid #f54336" : "",
          },
        }}
        slotProps={{
          textField: {
            size: "small",
            fullWidth: true,
          },
        }}
      />

      <span style={{ fontSize: "12px", color: "#f54336" }}>{error}</span>
    </LocalizationProvider>
  );
}
