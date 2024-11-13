import React from 'react'
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import {TabContext,TabList,TabPanel} from '@mui/lab';



const ThemeTabs = ({ tabData,tabCounts, children }) => {
  const [value, setValue] = React.useState('1');


  const handleChange = (event, newValue) => {
    setValue(newValue);
   
  };

  return (
    <Box className="ThemeTabBox" sx={{ typography: 'body1', background: '#fff', position: 'relative', borderRadius: '10px', ...tabStyle.tabPanel }}>
      <TabContext value={value} >
        <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom: 4,}}>
          <Box sx={tabStyle.container}>
            <TabList onChange={handleChange} aria-label="generic tab">
              {
                tabData.length > 0 && tabData.map((tab, index) => (
                  <Tab sx={tabStyle.tab} label={tab.label} value={tab.value} key={index} 
                  disabled={tab.disable}
                  iconPosition='end'
                  />
                ))
              }
            </TabList>
          </Box>
        </Box>
        {
          tabData.length > 0 && tabData.map((tab, index) => (
            <TabPanel value={tab.value} key={index+99} >
              {children[index]}
            </TabPanel>
          ))
        }
      </TabContext>
    </Box>
  )
}





const tabStyle = {
    container: {
      width: 'fit-content',
      fontWeight: 'bold',
      fontSize: '20px',
    },
    tab: {
      textTransform: 'capitalize',
    },
    tabPanel: {
       width : '100%',
      '& .MuiTabPanel-root': {
        padding: '0px !important',
        width : '100%',
      }
    },
    tabHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      width: '100%',
    }
  }
  

export default ThemeTabs