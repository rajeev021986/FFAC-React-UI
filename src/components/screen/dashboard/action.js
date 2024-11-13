import { DeleteOutlined, EditOutlined, VisibilityOutlined } from "@mui/icons-material";


export const getDashboardActions=(nav,setModal)=>{
    return [
        {
            label: "Audit",
            icon: <VisibilityOutlined />,
            onClick: (row) => {
                alert("Audit is not implemented yet")
            },
        }
        
    ]
}