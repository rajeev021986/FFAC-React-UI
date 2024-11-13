import React from 'react'
import { Alert, Box, Stack } from '@mui/material';
import AppList from '../../../common/List/AppList';
import FormatForm from './FormatForm';
import { useFetchFormatQuery } from '../../../../store/api/settingsApi';
import Loader from '../../../common/Loader/Loader';


export default function FormatSetting() {
    const [selectedListItem, setSelectedListItem] = React.useState({});
    const { data: formatData, isLoading } = useFetchFormatQuery();

    if(isLoading){
        return (<Loader/>)
    }

    return (
        <Box p={2} >
            <Stack direction="row" sx={styles.root}>
                <Stack width="15%" sx={styles.leftPanel} >
                    <AppList
                        listData={formatData?.data}
                        onClick={(index) => setSelectedListItem(index)}
                    />
                </Stack>
                <Stack width="85%" sx={styles.rightPanel}>
                    {
                        Object.keys(selectedListItem).length === 0 ? (
                            <Alert severity="info">Select an item from the list to view or edit the format settings.</Alert>
                        ) :
                        (<FormatForm selectedListItem={selectedListItem} />)
                    }
                </Stack>
            </Stack>
        </Box>
    )
}

const styles = {
    root: {
        height: 'calc(100vh - 300px)',
    },
    leftPanel: {
        borderRight: '1px solid #e0e0e0',
        height: '100%',
        overflowY: 'auto',
    },
    rightPanel: {
        height: '100%',
        paddingLeft: '10px'

    }
}