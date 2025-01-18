import {
  Backdrop,
  Box,
  Card,
  CardHeader,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
} from "@mui/material";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useFetchChargesDatasQuery } from "../../store/api/chargesDataApi";
import {
  chargesSetSortModel,
  chargesSetView,
  setPagination,
  setSortBy,
  updateInput,
} from "../../store/freatures/ChargesSlice";
import { CARD_CHARGES_COLUMNS } from "../../data/columns/charges";
import { getChargesListGridActions } from "../../components/screen/code/charge/action";
import GridActions from "../../components/common/Grid/GridActions";
import SelectBox from "../../components/common/SelectBox";
import { CHARGES_SORT_OPTIONS } from "../../data/options";
import {
  FormatListBulletedOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import ChargesFilters from "../../components/screen/code/charge/ChargesFilters";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import CardsView from "../../components/common/Cards/CardsView";

export function ChargesScreen({ page }) {
  const chargesSelector = useSelector((state) => state.chargesStore);
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
  const actions = [{ name: "New Charges" }, { name: "Export" }];

  const query = {
    page: chargesSelector?.pagination?.page + 1,
    size: chargesSelector?.pagination?.pageSize,
    sortBy:
      chargesSelector.sortModel.length > 0
        ? chargesSelector.sortModel[0].field
        : chargesSelector?.sortBy?.split("*")[0],
    sortOrder:
      chargesSelector.sortModel.length > 0
        ? chargesSelector?.sortModel[0]?.sort
        : chargesSelector?.sortBy?.split("*")[1] || "",
  };
  if (
    Boolean(
      chargesSelector.sortModel.length > 0
        ? chargesSelector.sortModel[0].field === "cname"
        : chargesSelector?.sortBy?.split("*")[0] === "cname"
    )
  ) {
    query.sortBy = "chargeName";
  }
  const payload = Object.entries(chargesSelector?.formData)
    .filter(([key, value]) => value)
    .map(([key, value]) => {
      let fieldname = key;
      Boolean(key == "cname") && (fieldname = "chargeName");
      return {
        fieldName: fieldname,
        operator: "=",
        value: value,
        logicalOperator: "and",
      };
    });

  const {
    data: ChargesData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useFetchChargesDatasQuery({
    params: query,
    payload,
    page: "charge/filter",
  });
  useEffect(() => {
    refetch();
  }, [location.pathname]);

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setPagination({ page, pageSize }));
  };

  CARD_CHARGES_COLUMNS[CARD_CHARGES_COLUMNS.length - 1].renderCell =
    GridActions({
      actions: getChargesListGridActions(nav, setModal),
    });

  useEffect(() => {
    if (!chargesSelector.view) {
      dispatch(chargesSetView("card"));
    }
  }, [chargesSelector.view, dispatch]);

  const handleActionClick = async (actionName) => {
    if (actionName === "New Charges") {
      nav("newcharges", {
        replace: true,
        state: { type: "new", id: null },
      });
    }
    // if (actionName === "Export") {
    //   try {
    //     const blob = await ApiManager.fetchCustomerDatasExcel(
    //       query,
    //       payload,
    //       "customer"
    //     );
    //     const url = window.URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.setAttribute("download", "customer-data.xlsx"); // or whatever filename you want
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
    //     window.URL.revokeObjectURL(url);
    //   } catch (error) {
    //   }
    // }
  };

  //   const [deleteCustomer] = useDeleteCustomerMutation();

  //   const handleClose = () => {
  //     setModal({
  //       open: false,
  //       type: "",
  //       data: {},
  //     });
  //   };

  //   const handleDelete = async () => {
  //     try {
  //       await deleteCustomer(modal.data.id).unwrap();
  //       toast.success("Customer deleted successfully!");
  //       handleClose();
  //     } catch (error) {
  //       toast.error("Failed to delete customer.");
  //     }
  //   };

  return (
    <Box sx={{ backgroundColor: "white.main" }}>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <Backdrop open={open} />
            {page == "charges" && (
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
            )}
          </>
        }
      />
      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          sx={{ margin: 0, padding: 1 }}
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={chargesSelector?.formData}
                  setFilters={(filters) => dispatch(updateInput(filters))}
                  width="650px"
                >
                  <ChargesFilters filterInfo={ChargesData?.counts || []} />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={CHARGES_SORT_OPTIONS}
                  value={chargesSelector.sortBy}
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
                <IconButton onClick={() => dispatch(chargesSetView("card"))}>
                  <FormatListBulletedOutlined
                    color={
                      chargesSelector.view === "card" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
                <IconButton onClick={() => dispatch(chargesSetView("grid"))}>
                  <GridOnOutlined
                    color={
                      chargesSelector.view === "grid" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />
        {chargesSelector.view === "grid" ? (
          <ThemedGrid
            uniqueId="id"
            columns={CARD_CHARGES_COLUMNS}
            count={ChargesData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={ChargesData?.body?.data}
            columnVisibility={{}}
            columnVisibilityHandler={() => {}}
            paginationModel={chargesSelector.pagination}
            loading={isLoading || isFetching}
            sortModel={chargesSelector.sortModel}
            onSortModelChange={(sortModel) =>
              dispatch(chargesSetSortModel(sortModel))
            }
          />
        ) : (
          <CardsView
            uniqueId="id"
            columns={CARD_CHARGES_COLUMNS}
            count={ChargesData?.body?.totalElements || 0}
            handlePage={handlePage}
            data={ChargesData?.body?.data}
            paginationModel={chargesSelector?.pagination}
            loading={isLoading || isFetching}
            actions={getChargesListGridActions(nav, setModal)}
            // actions={getCustomerListGridActions(nav, setModal)}
            setSelectedBox={setSelectedBox}
            seletectBox={seletectBox}
            page={"customer"}
          />
        )}
      </Card>
      {/* <DeleteDialog
        modal={modal}
        handleClose={handleClose}
        handleDelete={handleDelete}
      /> */}
    </Box>
  );
}
