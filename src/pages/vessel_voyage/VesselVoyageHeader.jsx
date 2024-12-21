import { Box, CardHeader, IconButton, Stack } from "@mui/material";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import SelectBox from "../../components/common/SelectBox";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import { VOYAGE_SORT_OPTIONS } from "../../data/options";
import { useEffect } from "react";
import { VesselVoyageFilters } from "./VesselVoyageFilters";
import {
  setSortBy,
  updateInput,
  voyageSetView,
} from "../../store/freatures/VesselVoyageSlice";

export function VesselVoyageHeader() {
  const dispatch = useDispatch();
  const voyageSelector = useSelector((state) => state.vesselVoyageStore);
  console.log(voyageSelector, "voyageSelector");
  useEffect(() => {
    if (!voyageSelector.view) {
      dispatch(voyageSetView("card"));
    }
  }, [voyageSelector.view, dispatch]);

  return (
    <CardHeader
      title={
        <Stack>
          <Box sx={{ display: "flex", gap: 2 }}>
            <GridSearchInput
              filters={voyageSelector?.formData}
              setFilters={(filters) => dispatch(updateInput(filters))}
              width="650px"
            >
              <VesselVoyageFilters />
            </GridSearchInput>
            <SelectBox
              label="Sort By"
              options={VOYAGE_SORT_OPTIONS}
              value={voyageSelector.sortBy}
              onChange={(event) => {
                console.log(event);
                dispatch(setSortBy(event.target.value));
              }}
              sx={{
                borderRadius: "20px",
                width: "150px",
              }}
            />
            <IconButton onClick={() => dispatch(voyageSetView("card"))}>
              <FormatListBulletedOutlined
                color={voyageSelector.view === "card" ? "primary" : "secondary"}
              />
            </IconButton>
            <IconButton onClick={() => dispatch(voyageSetView("grid"))}>
              <GridOnOutlined
                color={voyageSelector.view === "grid" ? "primary" : "secondary"}
              />
            </IconButton>
          </Box>
        </Stack>
      }
    />
  );
}
