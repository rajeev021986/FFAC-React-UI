import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export const getExpenseCodeGridActions = (setModal) => {

    return [
        {
          label: 'Edit',
          onClick: (params) => {
            console.log('PL clicked for', params.row);
            setModal(
              { open: true, type: 'edit', data: params.row }
            )
          },
          icon: <EditIcon />,
        },
        {
          label: 'Aduit',
          onClick: (params) => {
            console.log('PL clicked for', params.row);
            setModal(
              { open: true, type: 'audit', data: params.row }
            )
          },
          icon: <EditIcon />,
        },
    ]
}