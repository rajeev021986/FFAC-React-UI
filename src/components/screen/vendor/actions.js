import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BiotechIcon from '@mui/icons-material/Biotech';
import { GridDeleteIcon } from '@mui/x-data-grid';


export const getVendorGridActions = ( nav, setModal ) => {

  return [
    {
      label: 'Edit',
      onClick: (params) => {
        console.log('PL clicked for', params.row.id);
        nav("editVendor", { state: { id: params.row.id, type: "Edit" } })
      },
      icon: <EditIcon />,
    },
    {
      label: 'Audit',
      onClick: (params) => {
        console.log('Audit clicked for', params.row);
        setModal(
          { open: true, type: 'audit', data: params.row }
        )
      },
      icon: <BiotechIcon />,
    },
    {
      label: 'Delete Vendor',
      onClick: (params) => {
        console.log('delete clicked for', params.row);
        setModal(
          { open: true, type: 'delete', data: {who:"Vendor",deleteName:params.row.vendorName,id:params.row.id} }
        )
      },
      icon: <GridDeleteIcon/>,
    },
  ]
}
export const getVendorApproveGridActions = ( nav, setModal ) => {

  return [
    {
      label: 'Edit',
      onClick: (params) => {
        console.log('PL clicked for', params.row.id);
        nav("editVendorApprove", { state: { id: params.row.id, type: "Approve" } })
      },
      icon: <EditIcon />,
    },
    {
      label: 'Audit',
      onClick: (params) => {
        console.log('Audit clicked for', params.row);
        setModal(
          { open: true, type: 'audit', data: params.row }
        )
      },
      icon: <BiotechIcon />,
    }
  ]
}