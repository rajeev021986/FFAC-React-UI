import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as React from "react";
import dayjs from "dayjs";

export default function DateField({
  sx,
  value,
  disabled = false,
  onChange,
  inputRef,
  label,
  id,
  error,
  ...props
}) {
  const validValue = value ? dayjs(value) : null;

  const handleDateChange = (date) => {
    const timeAsDate = dayjs(date).format("YYYY-MM-DD");
    onChange(id, timeAsDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
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
          },
        }}
        slotProps={{
          textField: { size: "small", fullWidth: true },
        }}
      />
    </LocalizationProvider>
  );
}
