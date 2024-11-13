import React from 'react'
import { GoogleMap, MarkerF, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";


const centerConfig = {
    lat: 34.052235, lng: -118.243683
}
const lineConfig = {
    strokeColor: "#1FCE15",
    strokeOpacity: 0,
    icons: [{
        icon: {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 2
        },
        offset: '0',
        repeat: '10px'
    }],
}
/*
 description: type of map can be point or route
*/
export default function Map({
    locations,
    center = centerConfig,
    zoom = 2,
    type = "point",
    theme = [],
    onClick
}) {
    const [geoLocations, setGeoLocations] = React.useState([]);
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.REACT_APP_GMAP_API_KEY,
    });


    React.useEffect(() => {
        getGeoLocation(locations, setGeoLocations)
    }, [locations, type]);

    console.log('geoLocations', geoLocations);
    return (
        <>
            {isLoaded ? (<GoogleMap
                mapContainerStyle={{ height: "100%", width: "100%", borderRadius: "10px" }}
                center={geoLocations.length > 0 ? geoLocations[0] : center}
                zoom={zoom}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }],
                        },
                        ...theme
                    ],
                }}

            >
                {type === 'route' && <Polyline path={geoLocations} options={lineConfig} />}
                {geoLocations.length > 0 && geoLocations?.map((location, idx) => (
                    
                        <Marker
                            position={{ lat: location.lat, lng: location.lng }}
                            key={idx}
                            label={{
                                text: location.label?.toString(),
                                color: "#fff",
                                fontSize: "16px",
                                fontWeight: "700",
                            }}
                            icon={location?.icon || ""}
                            onClick={(event) => {
                                if (onClick) {
                                    onClick(location);
                                }
                            }}
                            title={location.address}
                        />
                    
                ))}

            </GoogleMap>) : null}
        </>
    )
}




// internal function :

const getGeoLocation = async (locations, setGeoLocations) => {
    try {
        let geocodeDataArr = [];
        for (const location of locations) {
            if (!location.address) continue;
            if (location.lat && location.lng) {
                geocodeDataArr.push(location);
            } else {
                const geocode = await fetch(
                    `${process.env.REACT_APP_GEOLOCATION_URL}?address=${location.address}&key=${process.env.REACT_APP_GMAP_API_KEY}`
                );

                if (!geocode.ok) {
                    throw new Error(`Failed to fetch geocode data for ${location.address}`);
                }

                const geocodeData = await geocode.json();
                let locInfo = geocodeData.results[0].geometry.location;
                locInfo.address = location.address;
                locInfo.label = location.label;
                locInfo.icon = location.icon;
                geocodeDataArr.push(locInfo);
            }
        }
        setGeoLocations(
            geocodeDataArr
        );
    } catch (error) {
        console.error("Error fetching geocode data:", error.message);
    }
}