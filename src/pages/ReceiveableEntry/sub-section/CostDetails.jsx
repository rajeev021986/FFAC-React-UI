import React, { useState, useEffect } from "react";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import { ContainerNumberForm } from "../../UpdateJob/ContainerShipmentTables/ShipmentContainer/ContainerForm";
import {
  Box,
  IconButton,
  Stack,
  Dialog,
  DialogContent,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Card, CardHeader } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoaderIcon } from "react-hot-toast";
import ClearIcon from "@mui/icons-material/Clear";

// import {
//   setPagination,
//   containerView,
//   containerSetSortModel,
//   // updateInput,
// } from "../../../../store/freatures/containersSlice";
import { setPagination, containerView, containerSetSortModel } from "../../../store/freatures/containersSlice";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

// Components
import CardsView from "../../../components/common/Cards/CardsView"
import ScreenToolbar from "../../../components/common/ScreenToolbar";
import GridAction from "../../../components/common/Grid/GridActions"
import ThemedGrid from "../../../components/common/Grid/ThemedGrid";
import { useFetchContainerQuery } from "../../../store/api/containerApi";

// import { getContaienrListGridActions } from "./containerAction";
import { CONTAINER_COLUMNS } from "../../../data/columns/jobEntry";
// import { CONTAINER_COLUMNS } from "../../../../data/columns/jobEntry";
import muiTextFieldStyles from "../../../components/muiTextFieldStyles";
import useDebounce from "../../../hooks/useDebounce"
export default function CostDetails({
  page,
  customer_id,
  bondDetails,
}) {
  const containerSelector = useSelector((state) => state?.containers);
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [exportLoader, setExportLoader] = useState(false);
  const [seletectBox, setSelectedBox] = useState("");

  const [searchValue, setsearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const debounceValue = useDebounce(searchValue, 500);

  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [
        { name: "New Customer" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : "";

  const query = {
    page: containerSelector?.pagination?.page + 1,
    size: containerSelector?.pagination?.pageSize,
    // id: customer_id,
    sortBy:
      containerSelector.sortModel.length > 0
        ? containerSelector.sortModel[0].field
        : containerSelector?.sortBy?.split("*")[0],
    sortOrder:
      containerSelector.sortModel.length > 0
        ? containerSelector?.sortModel[0]?.sort
        : containerSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      containerSelector.sortModel.length > 0
        ? containerSelector.sortModel[0].field === "cname"
        : containerSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "containerNo";
  }

  const payload = Object.entries(containerSelector?.formData)
    .filter(([key, value]) => value !== "")
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key === "cname") && (fieldname = "containerNo");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });
  const containerColumns = CONTAINER_COLUMNS((rowData) => {
    setModal({
      open: true,
      type: "edit", // or "view" or whatever your types are
      data: rowData,
    });
  });
  const costDetailsColumns = [
    {
      field: "containerNo",
      headerName: "Container No",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span>{params.value || "No Value"}</span>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "oldValue",
      headerName: "Old Value",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span>{params.value || "No Value"}</span>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "newValue",
      headerName: "New Value",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span>{params.value || "No Value"}</span>
      ),
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span>{params.value || "No Value"}</span>
      ),
      headerAlign: "center",
      align: "center",
    },
  ]
  const {
    data: containerListData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchContainerQuery({
    params: query,
    payload,
    page:
      page === "containerNo"
        ? `job-update/container/filter/${customer_id}`
        : "",
  });

  const handleActionClick = async (actionName) => {
    if (actionName === "New Customer") {
      nav("newcustomer", {
        replace: true,
        state: { formAction: "add" },
      });
    }
    if (actionName === "Export") {
      setExportLoader(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  const handleSearchBar = (e) => {
    setsearchValue(e.target.value);
  };

  // CONTAINER_COLUMNS[CONTAINER_COLUMNS.length - 1].renderCell = GridActions({
  //   actions: getContaienrListGridActions(setModal),
  // });

  useEffect(() => {
    if (!containerSelector.view) {
      dispatch(containerView("card"));
    }
  }, [containerSelector.view, dispatch]);

  useEffect(() => {
    if (debounceValue.trim()) {
      const lowerSearch = debounceValue.toLowerCase();
      const filtered = containerListData?.body?.data?.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(containerListData?.body?.data);
    }
  }, [debounceValue, containerListData]);
  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        rightComps={
          <>
            <Backdrop open={open} />
            {(page === "customer" || page === "customerApprove") && (
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
                      // borderRadius: 1,
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
              <Box sx={{ display: "flex", gap: 2, marginTop: "10px" }}>
                <TextField
                  hiddenLabel
                  id="search"
                  name="search"
                  label="Search container"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={searchValue}
                  onChange={handleSearchBar}
                  sx={{ ...muiTextFieldStyles.root }}
                  InputProps={{
                    endAdornment: searchValue && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setsearchValue("")}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {/* <Box>
                <IconButton onClick={() => dispatch(containerView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      containerSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(containerView("grid"))}>
                  <GridOnOutlined
                    color={
                      containerSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box> */}
            </Stack>
          }
        />
        {containerSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={containerColumns}
            count={containerListData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={filteredData}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={containerSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={containerSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(containerSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={containerColumns}
            count={containerListData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={filteredData}
            paginationModel={containerSelector?.pagination}
            loading={isLoading || isFetching}
            // actions={
            //   containerSelector.view === "card"
            //     ? getContaienrListGridActions(setModal).filter(
            //         (action) => action.type !== "hyperlink"
            //       )
            //     : getContaienrListGridActions(setModal)
            // }
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
          />
        )}
      </Card>
      {/* <Dialog
        open={modal.open}
        onClose={() => setModal({ open: false, type: "", data: {} })}
        maxWidth="md"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            m: 4,
            borderRadius: 2,
          },
        }}
      >
        <DialogContent>
          {modal.open && modal.type === "edit" && (
            <ContainerNumberForm
              containerId={modal.data?.id}
              bondDetails={bondDetails}
              type={modal.type}
              page={page}
              onCancel={() => setModal({ open: false, type: "", data: {} })}
              onSubmit={() => {
                setModal({ open: false, type: "", data: {} });
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog> */}
    </Box>
  );
}
