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
  import { useFetchAgentQuery } from "../../store/api/codeDataApi";
  import { useDispatch, useSelector } from "react-redux";
  import {
    setPagination,
    setSortBy,
    updateInput,
  } from "../../store/freatures/AgentSlice";
  import SelectBox from "../../components/common/SelectBox";
  import { AGENT_SORT_OPTIONS } from "../../data/options";
  import GridActions from "../../components/common/Grid/GridActions";
import { AGENT_PARTY_COLUMNS } from "../../data/columns/code";
import AgentFilters from "../../components/screen/code/agent/AgentFilters";
import { getAgentListGridActions } from "../../components/screen/code/agent/action";
  
  const ADD_NEW_AGENT_PATH = "/app/code/agent/form";
  
  export default function AgentScreen() {
    
    const codeAgentSelector = useSelector((state) => state.codeAgent);
    
    
    const nav = useNavigate();
    const dispatch = useDispatch();
    const [modal, setModal] = React.useState({
      open: false,
      type: "",
      data: {},
    });
    
  
    const {
      data: AgentData,
      isError,
      isLoading,
      error,
      isFetching,
    } = useFetchAgentQuery({
      page: codeAgentSelector?.pagination?.page + 1,
      perPage: codeAgentSelector?.pagination?.pageSize,
      orderBy:
      codeAgentSelector.sortModel.length > 0
          ? codeAgentSelector.sortModel[0].field +
            "*" +
            codeAgentSelector.sortModel[0].sort
          : codeAgentSelector.sortBy,
          ...codeAgentSelector.formData,
    });
  
    const handlePage = (params) => {
      let { page, pageSize } = params;
      dispatch(setPagination({ page, pageSize }));
    };
  
    AGENT_PARTY_COLUMNS[AGENT_PARTY_COLUMNS.length - 1].renderCell =
      GridActions({
        actions: getAgentListGridActions(nav, setModal),
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
                  nav(ADD_NEW_AGENT_PATH, { state: { formAction: "add" } })
                }
              >
                <AddCircleOutlineOutlined fontSize="small" /> New Agent
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
                    filters={codeAgentSelector.formData}
                    setFilters={(filters) => dispatch(updateInput(filters))}
                    width="650px"
                  >
                    <AgentFilters filterInfo={AgentData?.counts || []} />
                  </GridSearchInput>
                  <SelectBox
                    label="Sort By"
                    options={AGENT_SORT_OPTIONS}
                    value={codeAgentSelector.sortBy}
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
              columns={AGENT_PARTY_COLUMNS}
              count={AgentData?.totalRecords}
              handlePage={handlePage}
              data={AgentData?.data}
              paginationModel={codeAgentSelector.pagination}
              loading={isLoading || isFetching}
              actions={getAgentListGridActions(nav,setModal)}
            />
        </Card>
      </Box>
    );
  }
  