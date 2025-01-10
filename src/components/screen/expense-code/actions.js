import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export const getExpenseCodeGridActions = (setModal) => {

    return [
        {
          label: 'Edit',
          onClick: (params) => {
            setModal(
              { open: true, type: 'edit', data: params.row }
            )
          },
          icon: <EditIcon />,
        },
        {
          label: 'Aduit',
          onClick: (params) => {
            setModal(
              { open: true, type: 'audit', data: params.row }
            )
          },
          icon: <EditIcon />,
        },
    ]
}