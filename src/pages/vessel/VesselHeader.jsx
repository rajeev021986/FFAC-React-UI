import { Box, Card, CardHeader, IconButton, Stack } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setSortBy,
  updateInput,
  vesselSetView,
} from "../../store/freatures/VesselSlice";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import SelectBox from "../../components/common/SelectBox";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import { VESSEL_SORT_OPTIONS } from "../../data/options";
import { VesselFilters } from "./VesselFilters";
import { useEffect } from "react";

export function VesselHeader() {
  const dispatch = useDispatch();
  const vesselSelector = useSelector((state) => state.vesselStore);
  console.log(vesselSelector, "vesselSelector");
  useEffect(() => {
    if (!vesselSelector.view) {
      dispatch(vesselSetView("card"));
    }
  }, [vesselSelector.view, dispatch]);

  return (
    <CardHeader
      title={
        <Stack>
          <Box sx={{ display: "flex", gap: 2 }}>
            <GridSearchInput
              filters={vesselSelector?.formData}
              setFilters={(filters) => dispatch(updateInput(filters))}
              width="650px"
            >
              <VesselFilters />
            </GridSearchInput>
            <SelectBox
              label="Sort By"
              options={VESSEL_SORT_OPTIONS}
              value={vesselSelector.sortBy}
              onChange={(event) => {
                console.log(event);
                dispatch(setSortBy(event.target.value));
              }}
              sx={{
                borderRadius: "20px",
                width: "150px",
              }}
            />
            <IconButton onClick={() => dispatch(vesselSetView("card"))}>
              <FormatListBulletedOutlined
                color={vesselSelector.view === "card" ? "primary" : "secondary"}
              />
            </IconButton>
            <IconButton onClick={() => dispatch(vesselSetView("grid"))}>
              <GridOnOutlined
                color={vesselSelector.view === "grid" ? "primary" : "secondary"}
              />
            </IconButton>
          </Box>
        </Stack>
      }
    />
  );
}
