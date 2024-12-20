import React, { useState } from 'react';
import { Box, Tabs, Tab, Grid, Typography } from '@mui/material';
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import GlobalSetting from './GloabalSettingTab';
import CustomerSetting from './CustomerSetting';
import VendorSetting from './VendorSetting';
import PortSetting from './PortSetting';
import VesselSetting from './Vessel';
import VesselVoyageSetting from './VesselVoyageSetting';
import ShipperSetting from './ShipperSettings';
const settingTabs = [
    {
        label: 'Global',
        value: '1'
    },
    {
        label: 'Customer',
        value: '2'
    },
    {
        label: 'Vendor',
        value: '3'
    },
    {
        label: 'Port',
        value: '4'
    },
    {
        label: 'Vessel',
        value: '5'
    },
    {
        label: 'Vessel Voyage',
        value: '6'
    },
    {
        label: 'Shipper',
        value: '7'
    }
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Grid container sx={{ height: '100vh', backgroundColor: 'white.main', p: 2 }}>
            <Grid item xs={12} >
                <ScreenToolbar leftComps={<ThemedBreadcrumb />} />
            </Grid>
            <Grid item sx={{ flex: 1, mt: 2 }}>
                <Box sx={{ display: 'flex', height: '100%', backgroundColor: "white.lightDark", borderRadius: '20px', overflow: 'auto' }}>
                    <Box sx={{ borderRight: 1, borderColor: 'divider', minWidth: 150 }}>
                        <Tabs
                            orientation="vertical"
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{ width: '100%', padding: 2 }}
                        >
                            {settingTabs.map((tab) => (
                                <Tab key={tab.value} label={tab.label} value={tab.value} />
                            ))}
                        </Tabs>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        {activeTab === '1' && (
                            <GlobalSetting />
                        )}
                        {activeTab === '2' && (
                            <CustomerSetting />
                        )}
                        {activeTab === '3' && (
                            <VendorSetting />
                        )}
                        {activeTab === '4' && (
                            <PortSetting />
                        )}
                        {activeTab === '5' && (
                            <VesselSetting />
                        )}
                        {activeTab === '6' && (
                            <VesselVoyageSetting />
                        )}
                        {activeTab === '7' && (
                            <ShipperSetting />
                        )}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
