import * as React from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function DateTimeField({
  sx,
  value,
  disabled = false,
  onChange,
  inputRef,
  label,
  id,
  error,
  isDisabled,
  ...props
}) {
  const validValue = value ? dayjs(value) : null;

  const handleDateChange = (date) => {
    console.log(date);
    const timeAsDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
    console.log(timeAsDate);
    // .toDate();
    onChange(id, timeAsDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        id={id}
        label={label}
        value={validValue}
        onChange={handleDateChange}
        error={error ? true : false}
        helperText={error}
        inputRef={inputRef}
        sx={{
          "& .MuiInputBase-root": {
            fontSize: "14px",
            borderRadius: "10px",
            width: "100%",
            height: "44px",
            border: error ? "1px solid #f54336" : "",
          },
        }}
        slotProps={{
          textField: { size: "small", fullWidth: true },
        }}
        disabled={disabled}
      />
      <span style={{ fontSize: "12px", color: "#f54336" }}>{error}</span>
    </LocalizationProvider>
  );
}
