import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ThemedGrid from "../../components/common/Grid/ThemedGrid";
import { PORT_COLUMNS } from '../../data/columns/port';
import { useFetchPortQuery, useLazyGetPortAuditQuery } from '../../store/api/portDataApi';
import { setPortPagination, setSortBy, setSortModel, setView, updatePortInput } from '../../store/freatures/portSlice';
import { Box, Card, CardHeader, Drawer, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Typography } from '@mui/material';
import CardsView from '../../components/common/Cards/CardsView';
import GridSearchInput from '../../components/common/Filter/GridSearchInput';
import SelectBox from '../../components/common/SelectBox';
import { PORT_SORT_OPTIONS } from '../../data/options';
import { FormatListBulletedOutlined, GridOnOutlined } from '@mui/icons-material';
import PortFilterForm from '../../components/screen/code/port/PortFilter';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import { getPortGridActions } from '../../components/screen/code/port/port';
import { useNavigate } from 'react-router-dom';
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ApiManager from '../../services/ApiManager';
import GridActions from '../../components/common/Grid/GridActions';
import AuditTimeLine from '../../components/AuditTimeLine';
export default function PortScreen() {
    const portSelector = useSelector((state) => state.port);
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
        dispatch(setPortPagination({ page, pageSize }));
    };
    const payload = Object.entries(portSelector?.formData)
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
        page: portSelector?.pagination?.page + 1,
        size: portSelector?.pagination?.pageSize,
        sortBy:
            portSelector.sortModel.length > 0
                ? portSelector.sortModel[0].field
                : portSelector?.sortBy?.split("*")[0],
        sortOrder:
            portSelector.sortModel.length > 0
                ? portSelector?.sortModel[0]?.sort
                : portSelector?.sortBy?.split("*")[1] || "",
    }

    const {
        data: PortData,
        isError,
        isLoading,
        error,
        isFetching,
    } = useFetchPortQuery({
        params: query,
        payload,
    }
    );
    PORT_COLUMNS[PORT_COLUMNS.length - 1].renderCell = GridActions({
        actions: getPortGridActions(nav, setModal)
    });
    const actions = seletectBox
        ? [{ name: "New Port" }, { name: "Copy" }, { name: "Export" }]
        : [{ name: "New Port" }, { name: "Export" }]
    const handleActionClick = async (actionName) => {
        if (actionName === "New Port") {
            nav("portAdd", {
                state: { id: null, type: "new" },
            });
        }
        if (actionName === "Copy") {
            nav("portAdd", { state: { id: seletectBox, type: "copy" } });
        }
        if (actionName === "Export") {
            try {
                const blob = await ApiManager.fetchCustomerDatasExcel(query, payload, "Port");
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'port-data.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Download failed:', error);
            }
        }
    };
    const [getPortAudit, { data: AuditData,
        isLoading: isLoadingAudit }] = useLazyGetPortAuditQuery();
    const fetchUserAudit = () => {
        getPortAudit({
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
                    </>
                }
            />
            <Card sx={{ borderWidth: 1, borderColor: "border.main" }}>
                <CardHeader
                    title={
                        <Stack spacing={2} direction="row" justifyContent="space-between">
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <GridSearchInput
                                    filters={portSelector?.formData}
                                    setFilters={(filters) => dispatch(updatePortInput(filters))}
                                    width="650px"
                                >
                                    <PortFilterForm />
                                </GridSearchInput>
                                <SelectBox
                                    label="Sort By"
                                    options={PORT_SORT_OPTIONS}
                                    value={portSelector.sortBy}
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
                                            portSelector.view === "card"
                                                ? "primary"
                                                : "secondary"
                                        }
                                    />
                                </IconButton>
                                <IconButton onClick={() => dispatch(setView("grid"))}>
                                    <GridOnOutlined
                                        color={
                                            portSelector.view === "grid"
                                                ? "primary"
                                                : "secondary"
                                        }
                                    />
                                </IconButton>
                            </Box>
                        </Stack>
                    }
                />
                {portSelector.view === "grid" ? (
                    <ThemedGrid
                        columns={PORT_COLUMNS}
                        uniqueId="id"
                        data={PortData?.body?.data}
                        count={PortData?.body?.totalElements}
                        handlePage={handlePage}
                        // columnVisibility={{}}
                        // columnVisibilityHandler={() => { }}
                        paginationModel={portSelector.pagination}
                        loading={isLoading || isFetching}
                        disableColumnMenu
                        disableColumnSorting
                        sortModel={portSelector.sortModel}
                        onSortModelChange={(sortModel) => dispatch(setSortModel(sortModel))}
                    />) : (<CardsView
                        uniqueId="id"
                        columns={PORT_COLUMNS}
                        count={PortData?.body?.totalElements || 0}
                        handlePage={handlePage}
                        data={PortData?.body?.data}
                        paginationModel={portSelector?.pagination}
                        loading={isLoading || isFetching}
                        actions={getPortGridActions(nav, setModal)}
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
                            Port Audit Logs
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
