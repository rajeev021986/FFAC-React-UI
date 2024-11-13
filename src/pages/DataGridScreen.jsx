import { Box, Card, Typography, CardHeader, IconButton, Stack } from '@mui/material'
import React from 'react'
import ThemedGrid from '../components/common/Grid/ThemedGrid'

import USER_NAMAGEMENT_DATA from '../data/table-data/user-management.json'
import CardsView from '../components/common/Cards/CardsView'
import { FormatListBulletedOutlined, GridOnOutlined } from '@mui/icons-material';
import { USER_MANAGEMENT_COLUMNS } from '../data/columns/user'

export default function DataGridScreen() {
    const [view, setView] = React.useState('card')


    return (
        <Box>
            <Box my={2} >
                <Typography variant="title" >Themed Datagrid</Typography>
            </Box>
            <Card>
                <CardHeader title={<Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                >
                    <Typography variant="h6" >User Management</Typography>
                    <Box>
                        <IconButton onClick={() => setView('card')} >
                            <FormatListBulletedOutlined color={view === "card" ? "primary" : "secondary"} /></IconButton>
                        <IconButton onClick={() => setView('grid')} >
                            <GridOnOutlined color={view === "grid" ? "primary" : "secondary"} /></IconButton>
                    </Box>
                </Stack>} />
                {view === "grid" ? (<ThemedGrid
                    columns={USER_MANAGEMENT_COLUMNS}
                    count={10}
                    handlePage={() => { }}
                    data={USER_NAMAGEMENT_DATA}
                    columnVisibility={{}}
                    columnVisibilityHandler={() => { }}
                    paginationModel={{}}
                    loading={false}
                />) : (
                    <CardsView
                        columns={USER_MANAGEMENT_COLUMNS}
                        count={10}
                        handlePage={() => { }}
                        data={USER_NAMAGEMENT_DATA}
                        paginationModel={{}}
                        loading={false}
                    />)}
            </Card>
        </Box>
    )
}
