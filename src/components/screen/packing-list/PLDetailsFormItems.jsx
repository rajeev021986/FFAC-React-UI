import React, { useState } from "react";
import { Grid, IconButton, Divider, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PLDeatilsTableList from "./PLDeatilsTableList";
import InputBox from "../../common/InputBox";
import AppDatePicker from "../../common/AppDatePicker";

export default function PLDetailsFormItem({
  item,
  onChange,
  sprBLIteamDetails,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => setIsOpen(!isOpen); // Toggle open/close

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginBottom: "16px",
        backgroundColor: isOpen ? "#f0f0f0" : "#fff", // Gray when expanded, white otherwise
      }}
    >
      <div
        onClick={toggleCollapse}
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          justifyContent: "space-between",
          backgroundColor: isOpen ? "#f0f0f0" : "#fff",
        }}
      >
        <span>
          {" "}
        </span>
        <IconButton
          onClick={toggleCollapse}
          size="small"
          style={{ marginLeft: "auto" }}
        >
          <ExpandMoreIcon
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
          />
        </IconButton>
      </div>

      <div style={{ padding: "16px" }}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="PL"
              id="pl"
              value={item?.pl}
              disabled={true}
              onClick={stopPropagation}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="PO"
              id="po"
              value={item?.po}
              disabled={true}
              onClick={stopPropagation}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Container #"
              id="container"
              value={item?.container}
              disabled={false}
              onClick={stopPropagation}
              onChange={(e) => onChange("container", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <InputBox
              label="Seal #"
              id="seal"
              value={item?.seal}
              error={error?.seal}
              disabled={false}
              onClick={stopPropagation}
              onChange={(e) => onChange("seal", e.target.value)}
            />
          </Grid>
          {/* DatePickers */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <AppDatePicker
              id="ship_shedule_date"
              label="Ship Schedule Date"
              value={item?.ship_shedule_date}
              onClick={stopPropagation}
              onChange={(value) => onChange("ship_shedule_date", value)}
              disabled={false}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <AppDatePicker
              id="ship_actual_date"
              label="Ship Actual Date"
              value={item?.ship_actual_date}
              error={error?.ship_actual_date}
              onClick={stopPropagation}
              onChange={(value) => onChange("ship_actual_date", value)}
              disabled={false}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <AppDatePicker
              id="arrival_schedule_date"
              label="Arrival Schedule Date"
              value={item?.arrival_schedule_date}
              onClick={stopPropagation}
              onChange={(value) => onChange("arrival_schedule_date", value)}
              disabled={false}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <AppDatePicker
              id="entry_schedule_date"
              label="Entry Schedule Date"
              value={item?.entry_schedule_date}
              onClick={stopPropagation}
              onChange={(value) => onChange("entry_schedule_date", value)}
              disabled={false}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <AppDatePicker
              id="discharge_schedule_date"
              label="Discharge Schedule Date"
              value={item?.discharge_schedule_date}
              onClick={stopPropagation}
              onChange={(value) => onChange("discharge_schedule_date", value)}
              disabled={false}
              sx={{ marginTop: "16px", marginBottom: "8px" }}
            />
          </Grid>
        </Grid>
      </div>

      {isOpen && (
        <Box style={{ padding: "16px" }}>
          <Divider />
          <PLDeatilsTableList item={sprBLIteamDetails} />
        </Box>
      )}
    </div>
  );
}
