import { useEffect, useState } from "react";
import ApiManager from "../services/ApiManager";

const transformMenuData = (menuEntities) => {
    return menuEntities.map(entity => ({
        label: entity?.menuName,
        path: `${entity?.url || `/${entity?.menuName.toLowerCase()}`}`,
        iconKey: entity?.image, 
        items: entity?.nestedMenus?.length > 0 ? transformMenuData(entity?.nestedMenus) : [],
        
    }));
};

export const useMenuSetting = () => {
    const [menuItems, setMenuItems] = useState([]);
   
    const role = JSON.parse(localStorage.getItem('user')).role;
    console.log(">>>>>>>>>>>role>>>>>>>>>>>>",role);
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await ApiManager.getMenu(role);
 const transformedData = transformMenuData(response?.body);
            setMenuItems(transformedData);
          
        };
        fetchData();
    }, []);
    return {
        menuItems,
    };
};
