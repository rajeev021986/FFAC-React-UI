import { List, Toolbar } from "@mui/material";
import { useState } from "react";
import { ExpandableListItems, TListItem } from "./list-items";
import { iconsMap } from "../../config/menu";
import { useMenuSetting } from "../../hooks/useMenuItems";

const DrawerContainer = ({ hover }) => {
    const { menuItems } = useMenuSetting();
    const [openItem, setOpenItem] = useState(null);


    return (
        <div>
            <Toolbar />
            <List>
                {menuItems?.map((item) =>
                    item.items?.length > 0 ? (
                       
                        <ExpandableListItems
                            key={item.label}
                            label={item.label}
                            // icon={iconsMap[item.iconKey]}
                            icon={item.iconKey}
                            hover={hover}
                            items={item.items}
                            openItem={openItem}
                            setOpenItem={setOpenItem}
                        />
                    ) : (
                        <TListItem
                            key={item.label}
                            label={item.label}
                            to={item.path}
                            icon={item.iconKey}
                        />
                    )
                )}
            </List>
        </div>
    );
};

export default DrawerContainer;
