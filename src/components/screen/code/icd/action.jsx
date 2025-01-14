import EditIcon from "@mui/icons-material/Edit";
import BiotechIcon from '@mui/icons-material/Biotech';
import { GridDeleteIcon } from '@mui/x-data-grid';

export const getIcdListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        nav(`editicd`, {state: {formAction: "edit", initialValues: params.row},
  
        });
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
  ];
};
