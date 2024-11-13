import { Alert, Box } from '@mui/material'
import React from 'react'
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import ThemeTabs from '../../components/common/Tab/ThemeTab';
import FormatSetting from '../../components/screen/settings/format/FormatSetting';

const settingTabs = [
    {
        label: 'General',
        value: '1'
    },
    {
        label: 'Format',
        value: '2'
    }
]

export default function SettingsScreen() {
    return (
        <Box>
            <ScreenToolbar leftComps={<ThemedBreadcrumb />}/>
            <ThemeTabs 
                tabData={settingTabs}
            >
                <Box p={2} ><Alert severity="info">There are no general settings available at the moment.</Alert></Box>
                <FormatSetting />
            </ThemeTabs>
        </Box>
    )
}
