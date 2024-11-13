import React, { useEffect } from 'react'
import TrackerDetails from './TrackerDetails'
import TrackerStepper from './TrackerStepper'
import { Grid } from '@mui/material'
import Loader from '../../../common/Loader/Loader';
import db from "../../../../data/table-data/db.json"
import { useFetchShipmentTrackingQuery } from '../../../../store/api/dashbaordDataApi';

export default function TrackerContainer({ data }) {

  const {
    data: trackingData,
    isLoading,
    isFetching
  } = useFetchShipmentTrackingQuery({
    mblno: data.mblno
  });

  console.log("trackingData", trackingData)

  return (
    <Grid container spacing={2} width={'60vw'} >
      {(!isLoading || !isFetching) && trackingData ? (<>
        <TrackerDetails trackingData={trackingData.data} />
        <TrackerStepper trackingData={trackingData.data} />
      </>) : <Loader screen="container" />}
    </Grid>
  )
}
