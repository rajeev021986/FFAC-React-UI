import {
    AddCircleOutlineOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Card,
    CardHeader,
    Stack,
  } from "@mui/material";
  import React, { useState } from "react";
  import CardsView from "../../components/common/Cards/CardsView";
  import ScreenToolbar from "../../components/common/ScreenToolbar";
  import { OutlinedButton } from "../../components/common/Button";
  import { useNavigate } from "react-router-dom";
  import ThemedBreadcrumb from "../../components/common/Breadcrumb";
  import GridSearchInput from "../../components/common/Filter/GridSearchInput";
  import { useFetchPartyQuery } from "../../store/api/codeDataApi";
  import { useDispatch, useSelector } from "react-redux";
  import {
    setPagination,
    setSortBy,
    updateInput,
  } from "../../store/freatures/PartySlice";
  import SelectBox from "../../components/common/SelectBox";
  import { PARTY_SORT_OPTIONS } from "../../data/options";
  import GridActions from "../../components/common/Grid/GridActions";
import { CODE_PARTY_COLUMNS } from "../../data/columns/code";
import { getPartyListGridActions } from "../../components/screen/code/party/action";
import PartyFilters from "../../components/screen/code/party/PartyFilters";
  
  const ADD_NEW_PARTY_PATH = "/app/code/party/form";
  
  export default function PartyScreen() {
    const codePartySelector = useSelector((state) => state.codeParty);
    
    
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [modal, setModal] = React.useState({
      open: false,
      type: "",
      data: {},
    });
    
  
    const {
      data: PartyData,
      isError,
      isLoading,
      error,
      isFetching,
    } = useFetchPartyQuery({
      page: codePartySelector?.pagination?.page + 1,
      perPage: codePartySelector?.pagination?.pageSize,
      orderBy:
      codePartySelector.sortModel.length > 0
          ? codePartySelector.sortModel[0].field +
            "*" +
            codePartySelector.sortModel[0].sort
          : codePartySelector.sortBy,
          ...codePartySelector.formData,
    });
  
    const handlePage = (params) => {
      let { page, pageSize } = params;
      dispatch(setPagination({ page, pageSize }));
    };
  
    CODE_PARTY_COLUMNS[CODE_PARTY_COLUMNS.length - 1].renderCell =
      GridActions({
        actions: getPartyListGridActions(nav, setModal),
      });
  
    return (
      <Box>
        <ScreenToolbar
          leftComps={<ThemedBreadcrumb />}
          rightComps={
            <>
              <OutlinedButton
                color="primary"
                size="small"
                onClick={() =>
                  nav(ADD_NEW_PARTY_PATH, { state: { formAction: "add" } })
                }
              >
                <AddCircleOutlineOutlined fontSize="small" /> New Party
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
                    filters={codePartySelector.formData}
                    setFilters={(filters) => dispatch(updateInput(filters))}
                    width="650px"
                  >
                    <PartyFilters filterInfo={PartyData?.counts || []} />
                  </GridSearchInput>
                  <SelectBox
                    label="Sort By"
                    options={PARTY_SORT_OPTIONS}
                    value={codePartySelector.sortBy}
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
              </Stack>
            }
          />
            <CardsView
              uniqueId="acode"
              columns={CODE_PARTY_COLUMNS}
              count={PartyData?.totalRecords}
              handlePage={handlePage}
              data={PartyData?.data}
              paginationModel={codePartySelector.pagination}
              loading={isLoading || isFetching}
              actions={getPartyListGridActions(nav,setModal)}
            />
        </Card>
      </Box>
    );
  }
  