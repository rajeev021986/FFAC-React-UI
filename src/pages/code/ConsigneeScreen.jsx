import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import CardsView from "../../components/common/Cards/CardsView";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { useLocation, useNavigate } from "react-router-dom";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";

import {
  useFetchConsigneeDatasQuery,
} from "../../store/api/consigneeDataApi";
import ConsigneeFilters from "../../components/screen/code/consignee/ConsigneeFilters";
import { useDispatch, useSelector } from "react-redux";
import {
  setPagination,
  setSortBy,
  consigneeSetView,
  consigneeSetSortModel,
  updateInput,
} from "../../store/freatures/consigneeSlice";
import SelectBox from "../../components/common/SelectBox";
import { CONSIGNEE_SORT_OPTIONS } from "../../data/options";
import GridActions from "../../components/common/Grid/GridActions";

import { CONSIGNEE_COLUMNS} from "../../data/columns/consignee"
import { getConsigneeListGridActions } from "../../components/screen/code/consignee/action";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { useEffect } from "react";

import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { getConsigneeListGridActionsConsigneeApprovel } from "../../components/screen/code/consignee/action copy";
import ApiManager from "../../services/ApiManager";

const ADD_NEW_CONSIGNEE_PATH = "new_consignee";



export default function ConsigneeScreen({ page }) {
  const consigneeSelector = useSelector((state) => state.consignee);
  const location = useLocation();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [seletectBox, setSelectedBox] = useState("");
  const [modal, setModal] = React.useState({
    open: false,
    type: "",
    data: {},
  });
  const [open, setOpen] = React.useState(false);
  const actions = seletectBox
    ? [{ name: "New" }, { name: "Copy" }, { name: "Export" }]
    : [{ name: "New" }, { name: "Export" }];
  const query = {
    page: consigneeSelector?.pagination?.page + 1,
    size: consigneeSelector?.pagination?.pageSize,
    sortBy:
    consigneeSelector.sortModel.length > 0
        ? consigneeSelector.sortModel[0].field
        : consigneeSelector?.sortBy?.split("*")[0],
    sortOrder:
    consigneeSelector.sortModel.length > 0
        ? consigneeSelector?.sortModel[0]?.sort
        : consigneeSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      consigneeSelector.sortModel.length > 0
        ? consigneeSelector.sortModel[0].field === "cName"
        : consigneeSelector?.sortBy?.split("*")[0] === "cName"
    )
  ) {
    query.sortBy = "consigneeName";
  }
  const payload = Object.entries(consigneeSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "cName") && (fieldname = "consigneeName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "or",
      };
    });

  const {
    data: ConsigneeData,
    isLoading,
    isFetching,
    refetch,
  } = useFetchConsigneeDatasQuery({
    params: query,
    payload,
    page: page == "consignee" ? "consignee/filter" : "approval/filter/consignee",
  });
  useEffect(() => {
    refetch();
  }, [location.pathname]);
  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  CONSIGNEE_COLUMNS[CONSIGNEE_COLUMNS.length - 1].renderCell =
    GridActions({
      actions:
        page == "consignee"
          ? getConsigneeListGridActions(nav, setModal)
          : getConsigneeListGridActionsConsigneeApprovel((nav, setModal)),
    });
  
  useEffect(() => {
    if (!consigneeSelector.view) {
      dispatch(consigneeSetView("card"));
    }
  }, [consigneeSelector.view, dispatch]);

  const handleActionClick = async (actionName) => {
    console.log("action name:"+actionName);
    // }
    if (actionName === "New") {
      nav(ADD_NEW_CONSIGNEE_PATH, {
        replace: true,
        state: { formAction: "add" },
    });
  }
    if (actionName === "Copy") {
      nav(`editconsignee`, {
        state: {
          formAction: "edit",
          initialValues: { id: seletectBox },
          type: "copy",
        },
      });
    }
    
    if (actionName === "Export") {
      const response = await fetch("http://localhost:9083/entity-service/consignee/export?page=1&size=10&sortBy=&sortOrder=", {   
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
    }
  }
  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            {page == "consignee" && (
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
                      borderRadius: '20px 19px 19px 20px',
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
            )}
          </>
        }
      />
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={consigneeSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <ConsigneeFilters filterInfo={ConsigneeData?.counts || []} />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={CONSIGNEE_SORT_OPTIONS}
                  value={consigneeSelector.sortBy}
                  onChange={(event) => {
                    console.log(event);

                    dispatch(setSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>
              <Box>
                <IconButton onClick={() => dispatch(consigneeSetView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      consigneeSelector.view === "card"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(consigneeSetView("grid"))}>
                  <GridOnOutlined
                    color={
                      consigneeSelector.view === "grid"
                        ? "primary"
                        : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />
        {consigneeSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={CONSIGNEE_COLUMNS}
            count={ConsigneeData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={ConsigneeData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={consigneeSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={consigneeSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(consigneeSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={CONSIGNEE_COLUMNS}
            count={ConsigneeData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={ConsigneeData?.body?.data}
            paginationModel={consigneeSelector?.pagination}
            loading={isLoading || isFetching}
            actions={
              page == "consignee"
                ? getConsigneeListGridActions(nav, setModal)
                : getConsigneeListGridActionsConsigneeApprovel(nav, setModal)
            }
            // actions={getCustomerListGridActions(nav, setModal)}
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
            page={page}
          />
        )}
      </Card>

    </Box>
  );
}
