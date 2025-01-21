import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BiotechIcon from '@mui/icons-material/Biotech';
import { GridDeleteIcon } from '@mui/x-data-grid';
import CustomToast from '../../common/Toast/CustomToast';
import toast from 'react-hot-toast';


export const getVendorGridActions = (nav, setModal) => {

  return [
    {
      label: 'Edit',
      onClick: (params) => {
        nav("editVendor", { state: { id: params.row.id, type: "Edit" } })
      },
      icon: <EditIcon />,
    },
    {
      label: 'Audit',
      onClick: (params) => {
        setModal(
          { open: true, type: 'audit', data: params.row }
        )
      },
      icon: <BiotechIcon />,
    },
    {
      label: 'Delete',
      onClick: (params) => {
        if (params.row.isApproved == -2 || params.row.isApproved == -1) {
          setModal(
            { open: true, type: 'delete', data: { who: "Vendor", deleteName: params.row.vendorName, id: params.row.id } }
          )
        } else {
          toast.custom(
            <CustomToast
              message="Only for Inactive and Rejected Vendor"
              toast="error"
            />,
            {
              closeButton: false,
            }
          );
          return;
        }
      },
      icon: <GridDeleteIcon />,
    },
  ]
}
export const getVendorApproveGridActions = (nav, setModal) => {

  return [
    {
      label: 'Edit',
      onClick: (params) => {
        nav("editVendorApprove", { state: { id: params.row.id, type: "Approve" } })
      },
      icon: <EditIcon />,
    },
    {
      label: 'Audit',
      onClick: (params) => {
        setModal(
          { open: true, type: 'audit', data: params.row }
        )
      },
      icon: <BiotechIcon />,
    }
  ]
}