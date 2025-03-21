import {
  Box,
  Card,
  CardHeader,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScreenToolbar from "../../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../../components/common/Breadcrumb";
import GridSearchInput from "../../../components/common/Filter/GridSearchInput";
import DeleteDialog from "../../../components/common/DeleteDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  customerSetSortModel,
  setPagination,
  setSortBy,
  updateInput,
} from "../../../store/freatures/CustomerSlice";
import { jobEntrySetView } from "../../../store/freatures/JobEntrySlice";
import SelectBox from "../../../components/common/SelectBox";
import { CUSTOMER_SORT_OPTIONS } from "../../../data/options";
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import { useEffect } from "react";

import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import toast, { LoaderIcon } from "react-hot-toast";
import AuditTimeLine from "../../../components/AuditTimeLine";
import CustomToast from "../../../components/common/Toast/CustomToast";
import FilterForm from "../FilterForm";
import { menuConfigUrl } from "../../../store/menuConfigUrl";

// Custom API Manager
import {
  useFetchJobEntriesQuery,
  useDeleteJobEntryMutation,
} from "../../../store/api/jobEntryApi";

// Tables Columns
import { JOB_ENTRY_COLUMNS } from "../../../data/columns/jobEntry";
import GridActions from "../../../components/common/Grid/GridActions";
import { getJobUpdateListGridActions } from "./action";

export default function UpdateJobListingScreen({ page }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const codeJobEntryrSelector = useSelector((s) => s?.jobEntries);
  const [exportLoader, setExportLoader] = useState(false);
  const [seletectBox, setSelectedBox] = useState("");
  const [modal, setModal] = useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = useState(false);

  const actions = seletectBox
    ? [
        { name: "New Job Entry" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : page === "entry-approve"
    ? [{ name: exportLoader ? <LoaderIcon /> : "Export" }]
    : [
        { name: "New Job Entry" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ];

  const query = {
    page: codeJobEntryrSelector?.pagination?.page + 1,
    size: codeJobEntryrSelector?.pagination?.pageSize,
    sortBy:
      codeJobEntryrSelector.sortModel.length > 0
        ? codeJobEntryrSelector.sortModel[0].field
        : codeJobEntryrSelector?.sortBy?.split("*")[0],
    sortOrder:
      codeJobEntryrSelector.sortModel.length > 0
        ? codeJobEntryrSelector?.sortModel[0]?.sort
        : codeJobEntryrSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      codeJobEntryrSelector.sortModel.length > 0
        ? codeJobEntryrSelector.sortModel[0].field === "cname"
        : codeJobEntryrSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "customerName";
  }
  const payload = Object.entries(codeJobEntryrSelector?.formData)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "cname") && (fieldname = "customerName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });
  const [deleteJobEntry] = useDeleteJobEntryMutation();
  const {
    data: jobEntriesData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchJobEntriesQuery({
    params: query,
    payload,
    page: page == "update-jobs" ? "job-detail/filter" : "",
  });

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  JOB_ENTRY_COLUMNS[JOB_ENTRY_COLUMNS.length - 1].renderCell = GridActions({
    actions:
      page == "update-jobs" ? getJobUpdateListGridActions(nav, setModal) : "",
  });

  useEffect(() => {
    if (!codeJobEntryrSelector.view) {
      dispatch(jobEntrySetView("card"));
    }
  }, [codeJobEntryrSelector.view, dispatch]);


  useEffect(() => {
    dispatch(jobEntrySetView("grid"));
  }, []);

  return (
    <Box sx={{ backgroundColor: "white.main", padding: 3 }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
          </>
        }
      />

      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          sx={{ padding: "8px" }}
          title={
            <Stack direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={codeJobEntryrSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <FilterForm />
                </GridSearchInput>
              </Box>
            </Stack>
          }
        />

        {codeJobEntryrSelector.view === "grid" && (
          <ThemedGrid
            uniqueId="id"
            columns={JOB_ENTRY_COLUMNS}
            count={jobEntriesData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={jobEntriesData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={codeJobEntryrSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={codeJobEntryrSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(customerSetSortModel(sortModel))
            }
          />
        )}
      </Card>
    </Box>
  );
}
