import EditIcon from "@mui/icons-material/Edit";
import BiotechIcon from '@mui/icons-material/Biotech';
import { GridDeleteIcon } from '@mui/x-data-grid';

export const getShipperListGridActions = (nav, setModal) => {
  return [
    {
      label: "Edit",
      onClick: (params) => {
        console.log("Edit clicked for", params.row);
        nav(`editshipper`, {state: {formAction: "edit", initialValues: params.row},
  
        });
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
  ];
};
