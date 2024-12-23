import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { BOND_COLUMNS } from '../../data/columns/bond';
import { useFetchbondQuery, useLazyGetbondAuditQuery } from '../../store/api/bondDataApi';
import { setBondPagination, setSortBy, setSortModel, setView, updateBondInput } from '../../store/freatures/bondSlice';
import { Box, Card, CardHeader, Drawer, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Typography } from '@mui/material';
import CardsView from '../../components/common/Cards/CardsView';
import GridSearchInput from '../../components/common/Filter/GridSearchInput';
import SelectBox from '../../components/common/SelectBox';
import { BOND_SORT_OPTIONS } from '../../data/options';
import { FormatListBulletedOutlined, GridOnOutlined } from '@mui/icons-material';
import BondFilterForm from '../../components/screen/code/bond/BondFilterForm';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import { getBondGridActions } from '../../components/screen/code/bond/bond';
import { useNavigate } from 'react-router-dom';
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ApiManager from '../../services/ApiManager';
import GridActions from '../../components/common/Grid/GridActions';
import AuditTimeLine from '../../components/AuditTimeLine';
export default function BondScreen() {
    const bondSelector = useSelector((state) => state.bond);
    const nav = useNavigate();
    const [modal, setModal] = React.useState({
        open: false,
        type: "",
        data: {},
    });
    const [seletectBox, setSelectedBox] = useState();
    const dispatch = useDispatch();
    const handlePage = (params) => {
        let { page, pageSize } = params;
        dispatch(setBondPagination({ page, pageSize }));
    };
    const payload = Object.entries(bondSelector?.formData)
        .filter(([key, value]) => value)
        .map(([key, value]) => {
            return {
                fieldName: key,
                operator: "=",
                value: value,
                logicalOperator: "and",
            };
        });
    const query = {
        page: bondSelector?.pagination?.page + 1,
        size: bondSelector?.pagination?.pageSize,
        sortBy:
            bondSelector.sortModel.length > 0
                ? bondSelector.sortModel[0].field
                : bondSelector?.sortBy?.split("*")[0],
        sortOrder:
            bondSelector.sortModel.length > 0
                ? bondSelector?.sortModel[0]?.sort
                : bondSelector?.sortBy?.split("*")[1] || "",
    }

    const {
        data: BondData,
        isError,
        isLoading,
        error,
        isFetching,
    } = useFetchbondQuery({
        params: query,
        payload,
    }
    );
    BOND_COLUMNS[BOND_COLUMNS.length - 1].renderCell = GridActions({
        actions: getBondGridActions(nav, setModal)
    });
    const actions = seletectBox
        ? [{ name: "New Bond" }, { name: "Copy" }, { name: "Export" }]
        : [{ name: "New Bond" }, { name: "Export" }]
    const handleActionClick = async (actionName) => {
        if (actionName === "New Bond") {
            nav("bondAdd", {
                state: { id: null, type: "new" },
            });
        }
        if (actionName === "Copy") {
            nav("bondAdd", { state: { id: seletectBox, type: "copy" } });
        }
        if (actionName === "Export") {
            try {
                const blob = await ApiManager.fetchCustomerDatasExcelPort(query, payload, "bond");
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'bond-data.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);
            }
        }
    };
    const [getbondAudit, { data: AuditData,
        isLoading: isLoadingAudit }] = useLazyGetbondAuditQuery();
    const fetchUserAudit = () => {
        getbondAudit({
            id: modal.data.id,
        });
    }
    return (
        <Box>
            <ScreenToolbar
                leftComps={<ThemedBreadcrumb />}
                rightComps={
                    <>
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
                    </>
                }
            />
            <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
                <CardHeader
                    title={
                        <Stack spacing={2} direction="row" justifyContent="space-between">
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <GridSearchInput
                                    filters={bondSelector?.formData}
                                    setFilters={(filters) => dispatch(updateBondInput(filters))}
                                    width="650px"
                                >
                                    <BondFilterForm/>
                                </GridSearchInput>
                                <SelectBox
                                    label="Sort By"
                                    options={BOND_SORT_OPTIONS}
                                    value={bondSelector.sortBy}
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
                                <IconButton onClick={() => dispatch(setView("card"))}>
                                    <FormatListBulletedOutlined
                                        color={
                                            bondSelector.view === "card"
                                                ? "primary"
                                                : "secondary"
                                        }
                                    />
                                </IconButton>
                                <IconButton onClick={() => dispatch(setView("grid"))}>
                                    <GridOnOutlined
                                        color={
                                            bondSelector.view === "grid"
                                                ? "primary"
                                                : "secondary"
                                        }
                                    />
                                </IconButton>
                            </Box>
                        </Stack>
                    }
                />
                {bondSelector.view === "grid" ? (
                    <ThemedGrid
                        columns={BOND_COLUMNS}
                        uniqueId="id"
                        data={BondData?.body?.data}
                        count={BondData?.body?.totalElements}
                        handlePage={handlePage}
                        columnVisibility={{}}
                        columnVisibilityHandler={() => { }}
                        paginationModel={bondSelector.pagination}
                        loading={isLoading || isFetching}
                        disableColumnMenu
                        disableColumnSorting
                        sortModel={bondSelector.sortModel}
                        onSortModelChange={(sortModel) => dispatch(setSortModel(sortModel))}
                    />) : (<CardsView
                        uniqueId="id"
                        columns={BOND_COLUMNS}
                        count={BondData?.body?.totalElements || 0}
                        handlePage={handlePage}
                        data={BondData?.body?.data}
                        paginationModel={bondSelector?.pagination}
                        loading={isLoading || isFetching}
                        actions={getBondGridActions(nav, setModal)}
                        setSelectedBox={setSelectedBox}
                        seletectBox={seletectBox}
                        page="customer"
                    />)}


            </Card>
            {modal.type === 'audit' && (
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
                        zIndex: 1301
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                            Bond Audit Logs
                        </Typography>
                        <AuditTimeLine auditDetails={AuditData} reloadDataHandler={fetchUserAudit} loading={isLoadingAudit} />
                    </Box>
                </Drawer>
            )}
            {/* <DeleteDialog
                modal={modal}
                handleClose={handleClose}
                handleDelete={handleDelete}
            /> */}
        </Box>
    )
}
