import {
  Box,
  Card,
  // CardActions,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import {
  FileDownloadOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import SelectBox from "../../components/common/SelectBox";

import { useDispatch, useSelector } from "react-redux";

import { DSO_ORDERS_SORT_OPTIONS } from "../../data/options";

import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import { useFetchDsoOrderListQuery } from "../../store/api/packingListDataApi";
// import { exportPackingList } from "../../components/screen/packing-list/export";
// import { useNavigate } from "react-router-dom";
import CollapsibleTable from "../../components/common/CollapsibleTable";
// import { setPoOrderListSortBy } from "../../store/freatures/PoOrderListSlice";

import BasicTable from "../../components/common/BasicTable";
import {
  DSO_ORDER_DETAILS_COLUMNS,
  DSO_ORDER_LIST_COLUMNS,
} from "../../data/columns/dso_orders";
import DsoOrderListFilters from "../../components/screen/dso_orders/DsoOrderListFilters";
import { setDsoOrderListSortBy, setDsoOrderPagination, updateDsoOrderListInput } from "../../store/freatures/DsoOrderListSlice";
import { exportDsoOrderList } from "../../components/screen/dso_orders/export";

const DsoOrderScreen = () => {
  const dsoOrderSelector = useSelector((state) => state.dsoOrderList);

  const dispatch = useDispatch();
  // const nav = useNavigate();
  console.log("dsoOrderSelector.sortBy : ",dsoOrderSelector.sortBy);
  
  const {
    data: DsoOrderData,
    // isError,
    // isLoading,
    // error,
    isFetching,
  } = useFetchDsoOrderListQuery({
    page: dsoOrderSelector?.pagination?.page + 1,
    perPage: dsoOrderSelector?.pagination?.pageSize,
    filter: dsoOrderSelector.status,
    orderBy:
      dsoOrderSelector.sortModel.length > 0
        ? dsoOrderSelector.sortModel[0].field +
          "*" +
          dsoOrderSelector.sortModel[0].sort
        : dsoOrderSelector.sortBy,
    ...dsoOrderSelector.formData,
  });

  const getCollapsibleContent = (row) => {
    return (
      <Box sx={{ mb: 3, backgroundColor: "background.extlight", px: 3, py: 2 }}>
        <Typography sx={{ mb: 1, fontWeight: "bold" }} component={"h2"}>
          Order Details
        </Typography>
        <BasicTable
          columns={DSO_ORDER_DETAILS_COLUMNS}
          rows={row.orderdetails}
        />
      </Box>
    );
  };
  const handleSortChange = async (column,order) => {
    dispatch(setDsoOrderListSortBy(`${column}*${order}`));

  };

  useEffect(()=>{

  },[])
console.log("isFetching : ",isFetching);

  return (
    <Box>
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <OutlinedButton
              color="primary"
              size="small"
              onClick={() => {
                exportDsoOrderList(DsoOrderData?.data);
              }}
            >
              <FileDownloadOutlined fontSize="small" /> Export
            </OutlinedButton>
          </>
        }
      />

      <Card  sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={dsoOrderSelector.formData}
                  setFilters={(filters) =>
                    dispatch(updateDsoOrderListInput(filters))
                  }
                  width="500px"
                >
                  {/* filterInfo={DsoOrderData?.counts} */}
                  <DsoOrderListFilters />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={DSO_ORDERS_SORT_OPTIONS}
                  value={dsoOrderSelector.sortBy}
                  onChange={(event) => {                   
                    dispatch(setDsoOrderListSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>
              <Box>
                <IconButton
                // onClick={() => dispatch(setPackingListView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      dsoOrderSelector.view === "grid" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        <CollapsibleTable
          count={DsoOrderData?.totalRecords || 0}
          columns={DSO_ORDER_LIST_COLUMNS}
          rows={DsoOrderData?.data}
          getCollapsibleContent={getCollapsibleContent}
          loading={isFetching}
          pagination={{
            page: dsoOrderSelector?.pagination?.page,
            perPage: dsoOrderSelector?.pagination?.pageSize,
            onPageChange: (_, page) => {
              dispatch(
                setDsoOrderPagination({
                  page,
                  pageSize: dsoOrderSelector?.pagination?.pageSize,
                })
              );
            },
            onRowPerPageChange: (e) => {
              dispatch(
                setDsoOrderPagination({
                  page: dsoOrderSelector?.pagination?.page,
                  pageSize: e.target.value,
                })
              );
            },
          }}
          onSortChange={handleSortChange}
        />
      </Card>
    </Box>
  );
};
export default DsoOrderScreen;
