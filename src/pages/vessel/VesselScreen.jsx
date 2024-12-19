import {
  Backdrop,
  Box,
  Card,
  CardHeader,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";

import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { VesselHeader } from "./VesselHeader";
import { VesselBody } from "./VesselBody";
import ApiManager from "../../services/ApiManager";
import { useSelector } from "react-redux";

const ADD_NEW_VESSEL_PATH = "newvessel";

export function VesselScreen() {
  const [selectBox, setSelectBox] = useState("");
  const actions = selectBox
    ? [{ name: "New Vessel" }, { name: "Copy" }, { name: "Export" }]
    : [{ name: "New Vessel" }, { name: "Export" }];

  const [open, setOpen] = React.useState(false);
  const nav = useNavigate();
  const vesselSelector = useSelector((state) => state.vesselStore);

  const query = {
    page: vesselSelector?.pagination?.page + 1,
    size: vesselSelector?.pagination?.pageSize,
    sortBy:
      vesselSelector.sortModel.length > 0
        ? vesselSelector.sortModel[0].field
        : vesselSelector?.sortBy?.split("*")[0],
    sortOrder:
      vesselSelector.sortModel.length > 0
        ? vesselSelector?.sortModel[0]?.sort
        : vesselSelector?.sortBy?.split("*")[1] || "",
  };

  const payload = Object.entries(vesselSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "vname") && (fieldname = "vesselName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "or",
      };
    });

  if (
    Boolean(
      vesselSelector.sortModel.length > 0
        ? vesselSelector.sortModel[0].field === "vname"
        : vesselSelector?.sortBy?.split("*")[0] === "vname"
    )
  ) {
    query.sortBy = "vesselName";
  }

  if (
    Boolean(
      vesselSelector.sortModel.length > 0
        ? vesselSelector.sortModel[0].field === "lname"
        : vesselSelector?.sortBy?.split("*")[0] === "lname"
    )
  ) {
    query.sortBy = "lineName";
  }

  const handleActionClick = async (actionName) => {
    if (actionName === "New Vessel") {
      nav(ADD_NEW_VESSEL_PATH, {
        replace: true,
        state: { formAction: "add" },
      });
    }
    if (actionName === "Copy") {
      nav(`editVessel`, {
        state: {
          formAction: "copy",
          initialValues: { id: selectBox },
          type: "copy",
        },
      });
    }
    if (actionName === "Export") {
      try {
        const blob = await ApiManager.fetchVesselDatasExcel(query, payload);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "vessel-data.xlsx"); // or whatever filename you want
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download failed:", error);
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            <SpeedDial
              ariaLabel="Text-only  SpeedDial"
              sx={{
                "& .MuiFab-root": {
                  width: 50, // Adjust main button width
                  height: 50, // Adjust main button height
                  minHeight: 50, // Set minimum height
                },
              }}
              icon={<SpeedDialIcon sx={{ fontSize: 20 }} />}
              direction="left"
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  tooltipTitle=""
                  sx={{
                    display: "flex",
                    // width: "150px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 1,
                    backgroundColor: "#f0f0f0",
                    color: "black",
                    boxShadow: 3,
                    borderRadius: "20px 19px 19px 20px",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                    width: 72,
                    minWidth: 92,
                    "& .MuiSvgIcon-root": {
                      fontSize: 16,
                    },
                  }}
                  icon={
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {action.name}
                    </span>
                  }
                  onClick={() => handleActionClick(action.name)}
                ></SpeedDialAction>
              ))}
            </SpeedDial>
          </>
        }
      />
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader title={<VesselHeader></VesselHeader>} />
        <VesselBody
          selectBox={selectBox}
          setSelectBox={setSelectBox}
        ></VesselBody>
      </Card>
    </Box>
  );
}
