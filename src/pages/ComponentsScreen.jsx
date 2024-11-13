import { Box, Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import React from 'react'
import InputBox from '../components/common/InputBox'
import { OutlinedButton, ThemeButton } from '../components/common/Button'
import ThemeTabs from '../components/common/Tab/ThemeTab'
import VerticalTimeline from '../components/common/Timeline/VerticalTimeline'


export default function ComponentsScreen() {
    return (
        <Box>



            <Box mb={2} >
                <Typography variant="title"  >Card & Inputs</Typography>
            </Box>
            <Card>
                <CardHeader title="Agent Details" />
                <CardContent>
                    <Stack spacing={2} direction="column" useFlexGap flexWrap="wrap" mt={2} >
                        <Stack direction="row" spacing={2} >
                            <InputBox label="Name" id="name" />
                            <InputBox label="Email" id="email" />
                            <InputBox label="Phone" id="phone" />
                            <InputBox label="Address" id="address" />
                        </Stack>
                        <Stack direction="row" spacing={2} >
                            <InputBox label="City" id="city" />
                            <InputBox label="State" id="state" />
                            <InputBox label="Country" id="country" />
                            <InputBox label="Pincode" id="pincode" />
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>


            {/* <Box my={2} >
                <Typography variant="title" >Buttons</Typography>
            </Box>
            <Card>
                <Stack p={2} spacing={2} direction="row" >
                    <Box>
                        <ThemeButton
                            color="primary"
                            onClick={() => alert("Primary Button Clicked")}
                        >
                            Contained Button
                        </ThemeButton>
                    </Box>
                    <Box>
                        <OutlinedButton
                            color="primary"
                            onClick={() => alert("Primary Button Clicked")}
                        >
                            Outlined Button
                        </OutlinedButton>
                    </Box>
                    <Box>
                        <ThemeButton

                            color="secondary"
                            onClick={() => alert("secondary Button Clicked")}
                        >
                            Contained Button
                        </ThemeButton>

                    </Box>
                    <Box>
                        <OutlinedButton

                            color="secondary"
                            onClick={() => alert("secondary Button Clicked")}
                        >
                            Outlined Button
                        </OutlinedButton>
                    </Box>


                </Stack>

            </Card> */}



            <Box my={2} >
                <Typography variant="title" >Small Buttons</Typography>
            </Box>
            <Card>
                <Stack p={2} spacing={2} direction="row" >

                    <Box>
                        <ThemeButton
                            size="small"
                            color="primary"
                            onClick={() => alert("primary Button Clicked")}
                        >
                            Small Button
                        </ThemeButton>

                    </Box>
                    <Box>
                        <OutlinedButton
                            size="small"
                            color="primary"
                            onClick={() => alert("primary Button Clicked")}
                        >
                            Small Button
                        </OutlinedButton>
                    </Box>
                    <Box>
                        <ThemeButton
                            size="small"
                            color="secondary"
                            onClick={() => alert("secondary Button Clicked")}
                        >
                            Small Button
                        </ThemeButton>

                    </Box>
                    <Box>
                        <OutlinedButton
                            size="small"
                            color="secondary"
                            onClick={() => alert("secondary Button Clicked")}
                        >
                            Small Button
                        </OutlinedButton>
                    </Box>
                </Stack>
            </Card>



            <Box my={2} >
                <Typography variant="title" >Tab View</Typography>
            </Box>
            <Card>
                <ThemeTabs tabData={[{ label: 'Tab 1', value: '1' }, { label: 'Tab 2', value: '2' }, { label: 'Tab 3', value: '3' }]}>
                    <Box>
                        <Typography variant="title" >Tab 1</Typography>
                        <Typography variant="subtitle1" >Tab 1 Content</Typography>
                    </Box>
                    <Box>
                        <Typography variant="title" >Tab 2</Typography>
                        <Typography variant="subtitle1" >Tab 2 Content</Typography>
                    </Box>
                    <Box>
                        <Typography variant="title" >Tab 3</Typography>
                        <Typography variant="subtitle1" >Tab 3 Content</Typography>
                    </Box>
                </ThemeTabs>
            </Card>

          <VerticalTimeline />


        </Box>
    )
}
