import * as React from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Height } from "@mui/icons-material";

export default function DateTimeField({
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
    const timeAsDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSSSSS");
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
            height: "42px",
            borderColor: error ? "red" : "",
          },
        }}
        slotProps={{
          textField: { size: "small", fullWidth: true },
        }}
      />
    </LocalizationProvider>
  );
}
