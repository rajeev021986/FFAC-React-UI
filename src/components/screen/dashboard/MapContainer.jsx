import {
    Box,

} from '@mui/material'
import React from 'react'
import Map from '../../common/Map'
import { useDispatch } from 'react-redux';
import { dashboardToggleFilter } from '../../../store/freatures/dashboardSlice';

export default function MapContainer({ data }) {
    const [locations, setLocations] = React.useState([]);
    const dispatch = useDispatch();


    React.useEffect(() => { locationHandler() }, [data])
    function locationHandler() {
        if (!data || data?.length === 0) return;
        let distinctLocation = {}
        data.forEach((item, index) => {
            if (item?.pod) {
                if (
                    distinctLocation[item.pod] === undefined
                ) {
                    distinctLocation[item.pod] = 1;
                } else {
                    distinctLocation[item.pod] += 1;
                }
            }
        })
        let filterdLocation =
            Object.keys(distinctLocation).map((key) => {
                return { address: key, label: distinctLocation[key] }
            })
        setLocations(filterdLocation);
    }

    function handleMarkerClick(event) {
        const pod = event.address;
        dispatch(dashboardToggleFilter({
            category: 'pod',
            value: pod,
            type: 'radio'
        }))
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '400px',
                borderRadius: '10px',
                backgroundColor: 'primary.light',
                border: 'border.main',
                mb: 2,
                mt: 2
            }}
        >
            <Map
                locations={locations}
                zoom={3}
                onClick={handleMarkerClick}
            />
        </Box>
    )
}
