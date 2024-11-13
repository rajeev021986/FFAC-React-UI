import {
  Box,
  Card,
  // CardActions,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import {
  FileDownloadOutlined,
  GridOnOutlined,
} from "@mui/icons-material";
import SelectBox from "../../components/common/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import {  PO_ORDERS_SORT_OPTIONS } from "../../data/options";

import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import {
  useFetchPoOrderListQuery,
} from "../../store/api/packingListDataApi";
// import { useNavigate } from "react-router-dom";
import {
  PO_ORDER_DETAILS_COLUMNS,
  PO_ORDER_LIST_COLUMNS,
} from "../../data/columns/po-orders";
import CollapsibleTable from "../../components/common/CollapsibleTable";
import { setPoOrderListSortBy, setPoOrderPagination, updatePoOrderListInput } from "../../store/freatures/PoOrderListSlice";
import BasicTable from "../../components/common/BasicTable";
import PoOrderListFilters from "../../components/screen/po_orders/PoOrderListFilters";
import { exportPoOrderList } from "../../components/screen/po_orders/export";
import { useFormat } from "../../hooks/useFormat";

const PoOrderScreen = () => {
  const poOrderSelector = useSelector((state) => state.poOrderList);
  const { displayFormat } = useFormat()
  const dispatch = useDispatch();
  // const nav = useNavigate();
  const {
    data: poOrderData,
    // isError,
    // isLoading,
    // error,
    isFetching,
  } = useFetchPoOrderListQuery({
    page: poOrderSelector?.pagination?.page + 1,
    perPage: poOrderSelector?.pagination?.pageSize,
    filter: poOrderSelector.status,
    orderBy:
      poOrderSelector.sortModel.length > 0
        ? poOrderSelector.sortModel[0].field +
          "*" +
          poOrderSelector.sortModel[0].sort
        : poOrderSelector.sortBy,
    ...poOrderSelector.formData,
  });

  const getCollapsibleContent = (row) => {
    return (
      <Box sx={{mb : 3, backgroundColor : "background.extlight", px : 3, py : 2}}>
        <Typography sx={{mb : 1, fontWeight: "bold" }} component={"h2"}>
          Order Details
        </Typography>
        <BasicTable
          columns={PO_ORDER_DETAILS_COLUMNS(displayFormat)}
          rows={row.order_details}
        />
      </Box>
    );
  };

  const handleSortChange = async (column,order) => {
    dispatch(setPoOrderListSortBy(`${column}*${order}`));

  };
  return (
    <Box  >
      <ScreenToolbar
        leftComps={<ThemedBreadcrumb />}
        rightComps={
          <>
            <OutlinedButton
              color="primary"
              size="small"
              onClick={() => {
                exportPoOrderList(poOrderData?.data);
              }}
            >
              <FileDownloadOutlined fontSize="small" /> Export
            </OutlinedButton>
          </>
        }
      />

      <Card sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={poOrderSelector.formData}
                  setFilters={(filters) =>
                    dispatch(updatePoOrderListInput(filters))
                  }
                  width="500px"
                >
                  {/* filterInfo={poOrderData?.counts} */}
                  <PoOrderListFilters  />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={PO_ORDERS_SORT_OPTIONS}
                  value={poOrderSelector.sortBy}
                  onChange={(event) => {
                    dispatch(setPoOrderListSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>
              <Box>
                {/* <IconButton
                  onClick={() => dispatch(setPackingListView("card"))}
                >
                  <FormatListBulletedOutlined
                    color={
                      poOrderSelector.view === "card" ? "primary" : "secondary"
                    }
                  />
                </IconButton> */}
                <IconButton
                  // onClick={() => dispatch(setPackingListView("grid"))}
                >
                  <GridOnOutlined
                    color={
                      poOrderSelector.view === "grid" ? "primary" : "secondary"
                    }
                  />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        <CollapsibleTable
          count={poOrderData?.totalRecords || 0}
          columns={PO_ORDER_LIST_COLUMNS(displayFormat)}
          rows={poOrderData?.data}
          getCollapsibleContent={getCollapsibleContent}
          loading={isFetching}
          pagination={{
            page: poOrderSelector?.pagination?.page,
            perPage: poOrderSelector?.pagination?.pageSize,
            onPageChange: (x, page) => {
              dispatch(
                setPoOrderPagination({
                  page,
                  pageSize: poOrderSelector?.pagination?.pageSize,
                })
              );
            },
            onRowPerPageChange: (e) => {
              dispatch(
                setPoOrderPagination({
                  page: poOrderSelector?.pagination?.page,
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
export default PoOrderScreen;
