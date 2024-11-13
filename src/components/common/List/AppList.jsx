import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';


// prepare data for the list
const defaultData = [
  {
    label: 'Total Gross Weight (34,500.67)',
    id: 0,
  },
  {
    label: 'CBM',
    id: 1,
  },
];

export default function AppList({
    listData = [],
    onClick = () => {},
}) {
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleListItemClick = (event, index,item) => {
    setSelectedIndex(index);
    onClick(item);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main mailbox folders" sx={{paddingTop : 1}} >
        {Array.isArray(listData) && listData.map((item,idx) => (
            <ListItemButton
                key={idx}
                selected={selectedIndex === item.id}
                onClick={(event) => handleListItemClick(event, item.id,item)}
                sx={{
                  borderRadius : '10px',
                  mx : 1,
                  boxShadow : 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;',
                  mb : 1
                 }}
            >
                
                <ListItemText primary={item.label} />
            </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
