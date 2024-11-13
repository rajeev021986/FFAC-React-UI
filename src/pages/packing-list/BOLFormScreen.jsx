import { Box, Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router-dom'
import ScreenToolbar from '../../components/common/ScreenToolbar';
import ThemedBreadcrumb from '../../components/common/Breadcrumb';
import BOLForm from '../../components/screen/packing-list/BOLForm';
import { useFetchSPRBLPackingListQuery } from '../../store/api/packingListDataApi';
import { OutlinedButton } from '../../components/common/Button';


export default function BOLFormScreen() {
    
  const [openVesselModal, setOpenVesselModal] = React.useState(false);
  const { state } = useLocation();

  const {
    data: PLDeatils,
    isLoading,
    error,
    isError,
    isSuccess
  } = useFetchSPRBLPackingListQuery({
    mode:state?.mode,
    packinglistno:state?.packinglistno,
    id:state?.id
});

  return (
    <Box>
      <ScreenToolbar leftComps={<div><ThemedBreadcrumb /></div>} rightComps={<div></div>} />
      <Card  sx={{borderWidth : 1,borderColor : "border.main"}}>
        <CardHeader title={
          <Box display="flex" justifyContent={"space-between"}>
            <Typography variant='subtitle3' component='div'>BOL</Typography>
            <Box sx={styles.right}>
            <OutlinedButton color="primary" size="small" onClick={()=>{setOpenVesselModal(true)}}>Add Vessel</OutlinedButton>
            </Box>
          </Box>
        } />
        <CardContent>
            { isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
                    <CircularProgress />  
              </Box>
            ) : (<BOLForm
            initialValues={PLDeatils}
            tableData={PLDeatils?.sprBLPLDetails}
            loading={isLoading}
            openVesselModal={openVesselModal}
            setOpenVesselModal={setOpenVesselModal}/>)}
        </CardContent>
      </Card>
    </Box>
  )
}


const styles = {
  right : {
    display: 'flex',
    alignItems: 'center',
    gap : '10px',
  }
}