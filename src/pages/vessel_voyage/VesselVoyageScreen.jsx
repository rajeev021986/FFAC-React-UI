import {
  Backdrop,
  Box,
  Card,
  CardHeader,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VesselVoyageHeader } from "./VesselVoyageHeader";
import { VesselVoyageBody } from "./VesselVoyageBody";
import ApiManager from "../../services/ApiManager";
import { useSelector } from "react-redux";
const ADD_NEW_VOYAGE_PATH = "newvoyage";

export function VesselVoyageScreen() {
  const [selectBox, setSelectBox] = useState("");
  const actions = selectBox
    ? [{ name: "New Voyage" }, { name: "Copy" }, { name: "Export" }]
    : [{ name: "New Voyage" }, { name: "Export" }];
  const [open, setOpen] = React.useState(false);

  const voyageSelector = useSelector((state) => state.vesselVoyageStore);
  const nav = useNavigate();

  const query = {
    page: voyageSelector?.pagination?.page + 1,
    size: voyageSelector?.pagination?.pageSize,
    sortBy:
      voyageSelector.sortModel.length > 0
        ? voyageSelector.sortModel[0].field
        : voyageSelector?.sortBy?.split("*")[0],
    sortOrder:
      voyageSelector.sortModel.length > 0
        ? voyageSelector?.sortModel[0]?.sort
        : voyageSelector?.sortBy?.split("*")[1] || "",
  };

  const payload = Object.entries(voyageSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "vvoyage") && (fieldname = "vesselVoyage");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "or",
      };
    });

  if (
    Boolean(
      voyageSelector.sortModel.length > 0
        ? voyageSelector.sortModel[0].field === "vvoyage"
        : voyageSelector?.sortBy?.split("*")[0] === "vvoyage"
    )
  ) {
    query.sortBy = "vesselVoyage";
  }

  const handleActionClick = async (actionName) => {
    if (actionName === "New Voyage") {
      nav(ADD_NEW_VOYAGE_PATH, {
        replace: true,
        state: { formAction: "add" },
      });
    }

    if (actionName === "Copy") {
      nav(`editvoyage`, {
        state: {
          formAction: "copy",
          initialValues: { id: selectBox },
          type: "copy",
        },
      });
    }
    if (actionName === "Export") {
      try {
        const blob = await ApiManager.fetchVoyageDatasExcel(query, payload);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "voyage-data.xlsx"); // or whatever filename you want
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
        <CardHeader title={<VesselVoyageHeader></VesselVoyageHeader>} />
        <VesselVoyageBody
          selectBox={selectBox}
          setSelectBox={setSelectBox}
        ></VesselVoyageBody>
      </Card>
    </Box>
  );
}
