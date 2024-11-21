import React, { useState } from 'react';
import { Box, Tabs, Tab, Grid, Typography } from '@mui/material';
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import GlobalSetting from './GloabalSettingTab';
import CustomerSetting from './CustomerSetting';
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
    }
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Grid container direction="column" sx={{ height: '100vh', backgroundColor: '#f5f5f5', p: 2 }}>
            {/* <Grid item>
                <ScreenToolbar leftComps={<ThemedBreadcrumb />} />
            </Grid> */}
            <Grid item sx={{ flex: 1, mt: 2 }}>
                <Box sx={{ display: 'flex', height: '100%', backgroundColor: '#ffffff', borderRadius: '20px', overflow: 'auto' }}>
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
                           <GlobalSetting/>
                        )}
                        {activeTab === '2' && (
                            <CustomerSetting/>
                        )}
                        {activeTab === '3' && (
                           <Typography>CommingSoon</Typography>
                        )}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
