import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  jobEntrySetView,
  setPagination,
  setSortBy,
  jobEntrySetSortModel,
  updateInput,
} from "../../store/freatures/JobEntrySlice";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import CustomToast from "../../components/common/Toast/CustomToast";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import SelectBox from "../../components/common/SelectBox";
import AuditTimeLine from "../../components/AuditTimeLine";

import DeleteDialog from "../../components/common/DeleteDialog";
import toast, { LoaderIcon } from "react-hot-toast";
import FilterForm from "./FilterForm";
import { menuConfigUrl } from "../../store/menuConfigUrl";

// Custom API Manager
import {
  useFetchJobEntriesQuery,
  useDeleteJobEntryMutation,
} from "../../store/api/jobEntryApi";

// Tables Columns
import { JOB_SORT_OPTIONS } from "../../data/options";
import { JOB_ENTRY_COLUMNS } from "../../data/columns/jobEntry";
import GridActions from "../../components/common/Grid/GridActions";
import { getJobEntryListGridActions } from "../../components/screen/jobsEntry/action";
import { getJobEntryListGridActionsApprovel } from "../../components/screen/jobsEntry/actioncopy";

import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDial from "@mui/material/SpeedDial";
import Backdrop from "@mui/material/Backdrop";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { Box, Stack, Typography } from "@mui/material";
import { Card, CardHeader, Drawer } from "@mui/material";
import ApiManager from "../../services/ApiManager";
import { JOB_ENTRY_NEW_COLUMNS } from "../../data/columns/jobEntry(New)";
import DocumentDialog from "../../components/common/DocumentDialog";
import AddRateModalApprove from "./AddRateModalApprove";
import AddRejectedRemarks from "./RejectedRemarks";
import CancelModalApprove from "./CancelModalApprove";

export default function JobEntryScreen({ page }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const codeJobEntryrSelector = useSelector((s) => s?.jobEntries);
  const [exportLoader, setExportLoader] = useState(false);
  const [seletectBox, setSelectedBox] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [toggleRate, settoggleRate] = useState(false);

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
    page:
      page == "job-entry" ? "job-detail/filter" : "approval/filter/JOB_DETAIL",
  });

  useEffect(() => {
    refetch();
    setSelectedIds([]);
  }, [location.pathname]);
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };
  const activeColumns =
    page === "job-entry" ? JOB_ENTRY_NEW_COLUMNS : JOB_ENTRY_COLUMNS;
  activeColumns[activeColumns.length - 1].renderCell = GridActions({
    actions:
      page == "job-entry"
        ? getJobEntryListGridActions(nav, setModal)
        : getJobEntryListGridActionsApprovel(nav, setModal),
  });

  useEffect(() => {
    if (!codeJobEntryrSelector.view) {
      dispatch(jobEntrySetView("card"));
    }
  }, [codeJobEntryrSelector.view, dispatch]);

  const handleActionClick = async (actionName) => {
    if (actionName === "New Job Entry") {
      nav("newEntry", {
        replace: true,
        state: { formAction: "add" },
      });
    }
  };

  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deleteJobEntry(modal?.data?.id)
        .unwrap()
        .then(() => refetch());
      toast.custom(
        <CustomToast
          message="Job Entry deleted successfully!"
          toast="success"
        />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to delete job entry." toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };
  const handleCancel = async () => {
    try {
      const response = await ApiManager.canceljobEntryApprove(
        modal?.data?.id,
        "JOB_DETAIL"
      )
      const message = response.message;
      toast.custom(<CustomToast message={message} toast="success" />, {
        closeButton: false,
      });
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to cancel." toast="error" />,
        {
          closeButton: false,
        }
      );
    }
  };
  useEffect(() => {
    dispatch(jobEntrySetView("grid"));
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  const handleApproveAllRequest = async () => {
    if (selectedIds.length === 0) {
      toast.custom(
        <CustomToast message="No job entries selected!" toast="error" />
      );
      return;
    }
    try {
      const response = await ApiManager.approveAllJobEntryRequest(
        "JOB_DETAIL",
        selectedIds
      ); // Send selected IDs in the request);
      refetch();
      toast.custom(<CustomToast message={response.message} toast="success" />);
      setSelectedIds([]); // Clear selection after approval
    } catch (error) {
      toast.custom(
        <CustomToast
          message="Error occurred while approving entries"
          toast="error"
        />
      );
    } finally {
      setSelectedIds([]);
    }
  };
  const jobEntryColumns = [
    ...(page === "jobApprove"
      ? [
          {
            field: "Approve",
            headerName: "Approve",
            width: 80,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
              <input
                type="checkbox"
                style={{ cursor: "pointer" }}
                checked={selectedIds.includes(params.row.id)}
                onChange={() => handleCheckboxChange(params.row.id)}
              />
            ),
          },
          ...JOB_ENTRY_COLUMNS, // Use the new columns when on "job-entry" page
        ]
      : [...JOB_ENTRY_NEW_COLUMNS]), // Use the default columns otherwise
  ];
  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            {page == "job-entry" && (
              <SpeedDial
                ariaLabel="Text-only  SpeedDial"
                sx={{
                  "& .MuiFab-root": {
                    width: 50,
                    height: 50,
                    minHeight: 50,
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
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                      borderRadius: 1,
                      boxShadow: 3,
                      borderRadius: "20px 19px 19px 20px",
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
            )}
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
                  selectedIds={selectedIds} // Pass selected IDs
                  setSelectedIds={setSelectedIds}
                  handleApproveAllRequest={handleApproveAllRequest} // Pass function
                  page={page}
                >
                  <FilterForm />
                </GridSearchInput>

                {codeJobEntryrSelector.view === "card" && (
                  <SelectBox
                    label="Sort By"
                    options={JOB_SORT_OPTIONS}
                    value={codeJobEntryrSelector.sortBy}
                    onChange={(event) => {
                      dispatch(setSortBy(event.target.value));
                    }}
                    sx={{
                      borderRadius: "20px",
                      width: "150px",
                    }}
                  />
                )}
              </Box>
            </Stack>
          }
        />

        {codeJobEntryrSelector.view === "grid" && (
          <ThemedGrid
            uniqueId="id"
            columns={jobEntryColumns}
            count={jobEntriesData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={jobEntriesData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={codeJobEntryrSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={codeJobEntryrSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(jobEntrySetSortModel(sortModel))
            }
          />
        )}
      </Card>

      {modal.type === "audit" && (
        <Drawer
          anchor="right"
          open={modal?.open}
          onClose={() => setModal({ open: false, type: "", data: {} })}
          sx={{
            width: "50vw",
            display: "flex",
            flexDirection: "column",
            zIndex: 1301,
          }}
        >
          <Box>
            <Typography variant="h6" component="div" margin="8px">
              Job Entry Audit Logs
            </Typography>
            <AuditTimeLine
              id={modal.data.id}
              page="job-detail"
              service={menuConfigUrl.document}
            />
          </Box>
        </Drawer>
      )}
      <DocumentDialog
        // source="jobApprove"
        sourceId={modal?.data?.id}
        customerRefNo={modal?.data?.customerRefNo}
        job_No={modal?.data?.jobNo}
        handleClose={handleClose}
        handleOpen={modal.open && modal.type === "document"}
      />
      <AddRateModalApprove
        // source="jobApprove"
        sourceId={modal?.data?.id}
        handleOpen={modal.open && modal.type === "addRate"}
        handleClose={handleClose}
      />

      <AddRejectedRemarks
        rowId={modal?.data?.id}
        handleOpen={modal.open && modal.type === "reject"}
        handleClose={handleClose}
      />
      <CancelModalApprove
         rowId={modal?.data?.id}
        sourceName={modal?.data?.customerName}
         handleOpen={modal.open && modal.type === "cancel"}
         handleClose={handleClose}
         handleCancel={handleCancel}
      />

      <DeleteDialog
        source="job-entry"
        sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
    </Box>
  );
}
