import EditIcon from '@mui/icons-material/Edit';
import BiotechIcon from '@mui/icons-material/Biotech';
import { GridDeleteIcon } from '@mui/x-data-grid';


export const getBondGridActions = (nav, setModal) => {

    return [
        {
            label: 'Edit',
            onClick: (params) => {
                console.log('PL clicked for', params.row.id);
                nav("editBond", { state: { id: params.row.id, type: "Edit" } })
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
    ]
};