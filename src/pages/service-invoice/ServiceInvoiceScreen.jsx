import { Box, Card, CardHeader, IconButton, Stack } from "@mui/material";
import React, { useState } from "react";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import { OutlinedButton } from "../../components/common/Button";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import {
  FileDownloadOutlined,
  FormatListBulletedOutlined,
} from "@mui/icons-material";
import SelectBox from "../../components/common/SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { SERVICE_INVOICE_SORT_OPTIONS } from "../../data/options";
// import { getPackingListGridActions } from "../../components/screen/packing-list/actions";
import GridSearchInput from "../../components/common/Filter/GridSearchInput";
import { useNavigate } from "react-router-dom";
import {
  setServiceInvoicePagination,
  setServiceInvoiceSortBy,
  updateServiceInvoiceInput,
} from "../../store/freatures/serviceInvoiceSlice";
import { useFetchServiceInvoiceQuery } from "../../store/api/serviceInvoiceApi";
import SICard from "../../components/screen/service-invoice/SICard";
import { exportServiceInvoiceList } from "../../components/screen/service-invoice/export";
import SIFilters from "../../components/screen/service-invoice/SIFilters";


export default function ServiceInvoiceScreen() {
  const serviceInvoiceSelector = useSelector((state) => state.serviceInvoice);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const {
    data: ServoiceInvoiceData,
    isError,
    isLoading,
    error,
    isFetching,
  } = useFetchServiceInvoiceQuery({
    page: serviceInvoiceSelector?.pagination?.page + 1,
    perPage: serviceInvoiceSelector?.pagination?.pageSize,
    orderBy:
      serviceInvoiceSelector.sortModel.length > 0
        ? serviceInvoiceSelector.sortModel[0].field +
        "*" +
        serviceInvoiceSelector.sortModel[0].sort
        : serviceInvoiceSelector.sortBy,
    filter: serviceInvoiceSelector?.status,
    ...serviceInvoiceSelector?.formData,
  });

  const handlePage = (params) => {
    let { page, pageSize } = params;
    dispatch(setServiceInvoicePagination({ page, pageSize }));
  };

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
                exportServiceInvoiceList(ServoiceInvoiceData?.data);
              }}
            >
              <FileDownloadOutlined fontSize="small" /> Export
            </OutlinedButton>
          </>
        }
      />

      <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
        <CardHeader
          title={
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <Box sx={{ display: "flex", gap: 2 }}>
                <GridSearchInput
                  filters={serviceInvoiceSelector.formData}
                  setFilters={(filters) => {
                    dispatch(updateServiceInvoiceInput(filters));
                  }}
                  width="500px"
                >
                  <SIFilters filterInfo={ServoiceInvoiceData?.counts} />
                </GridSearchInput>
                <SelectBox
                  label="Sort By"
                  options={SERVICE_INVOICE_SORT_OPTIONS}
                  value={serviceInvoiceSelector.sortBy}
                  onChange={(event) => {
                    dispatch(setServiceInvoiceSortBy(event.target.value));
                  }}
                  sx={{
                    borderRadius: "20px",
                    width: "150px",
                  }}
                />
              </Box>
              <Box>
                <IconButton>
                  <FormatListBulletedOutlined color={"primary"} />
                </IconButton>
              </Box>
            </Stack>
          }
        />

        <SICard
          uniqueId="serial_id"
          count={ServoiceInvoiceData?.totalRecord || 0}
          handlePage={handlePage}
          data={ServoiceInvoiceData?.data}
          paginationModel={serviceInvoiceSelector.pagination}
          loading={isLoading || isFetching}
        />
      </Card>
    </Box>
  );
}
