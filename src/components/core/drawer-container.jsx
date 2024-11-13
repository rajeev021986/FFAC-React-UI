import { List, Toolbar } from "@mui/material";
import { ExpandableListItems, TListItem } from "./list-items";
import { iconsMap } from "../../config/menu";
import { useMenuSetting } from "../../hooks/useMenuItems";

const DrawerContainer = ({ hover }) => {
    const { menuItems } = useMenuSetting();

   
    
    return (
        <div>
            <Toolbar />
            <List>
                {menuItems?.map((item) =>
                    item.items?.length > 0 ? (
                        <ExpandableListItems
                            key={item.label}
                            label={item.label}
                            icon={iconsMap[item.iconKey]}
                            hover={hover}
                            items={item.items}
                        />
                    ) : (
                        <TListItem
                            key={item.label}
                            label={item.label}
                            to={item.path}
                            icon={iconsMap[item.iconKey]}
                        />
                    )
                )}
            </List>
        </div>
    );
};

export default DrawerContainer;
