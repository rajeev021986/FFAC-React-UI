import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  Drawer,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CardsView from "../../components/common/Cards/CardsView";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { useLazyGetIcdAuditQuery } from "../../store/api/icdDataApi";
import { useLocation, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import {
  useFetchIcdDatasQuery,
  useDeleteIcdMutation,
} from "../../store/api/icdDataApi";
import IcdFilters from "../../components/screen/code/icd/IcdFilters";
import { useDispatch, useSelector } from "react-redux";
import AuditTimeLine from "../../components/AuditTimeLine";
import {
  setPagination,
  setSortBy,
  icdSetView,
  icdSetSortModel,
  updateInput,
} from "../../store/freatures/icdSlice";
import SelectBox from "../../components/common/SelectBox";
import { ICD_SORT_OPTIONS } from "../../data/options";
import GridActions from "../../components/common/Grid/GridActions";

import { ICD_COLUMNS } from "../../data/columns/icd";
import { getIcdListGridActions } from "../../components/screen/code/icd/action";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { useEffect } from "react";

import Backdrop from "@mui/material/Backdrop";
import ApiManager from "../../services/ApiManager";
import toast, { LoaderIcon } from "react-hot-toast";
import CustomToast from "../../components/common/Toast/CustomToast";
import DeleteDialog from "../../components/common/DeleteDialog";
import IcdFilterForm from "../../components/screen/code/icd/FilterForm";

const ADD_NEW_ICD_PATH = "new_icd";

export default function IcdScreen({ page }) {
  const icdSelector = useSelector((state) => state.icd);
  const location = useLocation();
  const nav = useNavigate();
  const [exportLoader, setExportLoader] = useState(false);
  const dispatch = useDispatch();
  const [seletectBox, setSelectedBox] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [
        { name: "New Icd" },
        { name: "Copy" },
        { name: exportLoader ? <LoaderIcon /> : "Export" },
      ]
    : [{ name: "New Icd" }, { name: exportLoader ? <LoaderIcon /> : "Export" }];
  const query = {
    page: icdSelector?.pagination?.page + 1,
    size: icdSelector?.pagination?.pageSize,
    sortBy:
      icdSelector.sortModel.length > 0
        ? icdSelector.sortModel[0].field
        : icdSelector?.sortBy?.split("*")[0],
    sortOrder:
      icdSelector.sortModel.length > 0
        ? icdSelector?.sortModel[0]?.sort
        : icdSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      icdSelector.sortModel.length > 0
        ? icdSelector.sortModel[0].field === "iname"
        : icdSelector?.sortBy?.split("*")[0] === "iname"
    )
  ) {
    query.sortBy = "icdName";
  }
  const payload = Object.entries(icdSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "iname") && (fieldname = "icdName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "or",
      };
    });

  const {
    data: IcdData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchIcdDatasQuery({
    params: query,
    payload,
    page: "icd/filter",
  });
  useEffect(() => {
    refetch();
  }, [location.pathname]);
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  ICD_COLUMNS[ICD_COLUMNS.length - 1].renderCell = GridActions({
    actions: getIcdListGridActions(nav, setModal),
  });

  useEffect(() => {
    if (!icdSelector.view) {
      dispatch(icdSetView("card"));
    }
  }, [icdSelector.view, dispatch]);

  const handleActionClick = async (actionName) => {
    // }
    if (actionName === "New Icd") {
      nav(ADD_NEW_ICD_PATH, {
        replace: true,
        state: { formAction: "add", type: "new" },
      });
    }
    if (actionName === "Copy") {
      nav(`editicd`, {
        state: {
          formAction: "edit",
          initialValues: { id: seletectBox },
          type: "copy",
        },
      });
    }

    if (actionName === "Export") {
      setExportLoader(true);
      try {
        const blob = await ApiManager.fetchDatasExcel({
          query: query,
          payload: payload,
          service: "master-service",
          page: "icd",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "icd-data.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        toast.custom(
          <CustomToast message="Something went wrong" toast="error" />,
          {
            closeButton: false,
          }
        );
      }
      setExportLoader(false);
    }
  };
  const [getIcdAudit, { data: AuditData, isLoading: isLoadingAudit }] =
    useLazyGetIcdAuditQuery();
  const fetchAuditData = () => {
    getIcdAudit({
      id: modal.data.id,
    });
  };
  const [deleteIcd] = useDeleteIcdMutation();

  const handleClose = () => {
    setModal({
      open: false,
      type: "",
      data: {},
    });
  };

  const handleDelete = async () => {
    try {
      await deleteIcd(modal.data.id)
        .unwrap()
        .then(() => refetch());
      toast.custom(
        <CustomToast message="Icd deleted successfully!" toast="success" />,
        {
          closeButton: false,
        }
      );
      handleClose();
    } catch (error) {
      toast.custom(
        <CustomToast message="Failed to delete icd." toast="error" />,
        {
          closeButton: false,
        }
      );
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
                    // width: "150px",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 2,
                    borderRadius: 1,
                    boxShadow: 3,
                    borderRadius: "20px 19px 19px 20px",
                    // "&:hover": {
                    //   backgroundColor: "#e0e0e0",
                    // },
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
        <CardHeader
          sx={{ padding: "8px" }}
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={icdSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <IcdFilterForm />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={ICD_SORT_OPTIONS}
                  value={icdSelector.sortBy}
                  onChange={(event) => {
                    dispatch(setSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>
              <Box>
                <IconButton onClick={() => dispatch(icdSetView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      icdSelector.view === "card" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(icdSetView("grid"))}>
                  <GridOnOutlined
                    color={
                      icdSelector.view === "grid" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />
        {icdSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={ICD_COLUMNS}
            count={IcdData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={IcdData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={icdSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={icdSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(icdSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={ICD_COLUMNS}
            count={IcdData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={IcdData?.body?.data}
            paginationModel={icdSelector?.pagination}
            loading={isLoading || isFetching}
            actions={getIcdListGridActions(nav, setModal)}
            // actions={getCustomerListGridActions(nav, setModal)}
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
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
            // maxWidth: "50vw",
            display: "flex",
            flexDirection: "column",
            // zIndex: isFrontmost ? 1301 : 1300, // Adjust z-index based on isFrontmost,
            zIndex: 1301,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div" sx={{ mb: 2 }}>
              ICD Audit Logs
            </Typography>
            <AuditTimeLine
              auditDetails={AuditData}
              reloadDataHandler={fetchAuditData}
              loading={isLoadingAudit}
            />
          </Box>
        </Drawer>
      )}
      <DeleteDialog
        source="icd"
        sourceName={modal?.data?.deleteName}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleOpen={modal.open && modal.type === "delete"}
      />
    </Box>
  );
}
