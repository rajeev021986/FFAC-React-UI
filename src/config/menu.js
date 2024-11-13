import {
    SpaceDashboardOutlined,
    AutoFixHighOutlined,
    CorporateFareOutlined,
    AdminPanelSettingsOutlined,
    ManageAccountsOutlined,
    ChecklistOutlined,
    ReceiptOutlined,
    ExplicitOutlined,
    AddLocationOutlined,
    StoreOutlined,
    ApiOutlined,
    KeyboardOutlined,
    AddCardOutlined,
    InventoryOutlined,
    PieChartOutlineOutlined,
    PersonAddOutlined,
    ViewInArOutlined,
    HandshakeOutlined,
    SupportAgentOutlined
} from '@mui/icons-material';

export const iconsMap = {
    dashboard: <SpaceDashboardOutlined />,
    code: <AutoFixHighOutlined />,
    adminPanel: <AdminPanelSettingsOutlined />,
    userManagement: <ManageAccountsOutlined />,
    packingList: <ChecklistOutlined />,
    serviceInvoice: <ReceiptOutlined />,
    expenseCode: <ExplicitOutlined />,
    destination: <AddLocationOutlined />,
    vendor: <StoreOutlined />,
    components: <ApiOutlined />,
    corporate: <CorporateFareOutlined />,
    masterIcon: <KeyboardOutlined />,
    addBolIcon : <AddCardOutlined />,
    poOrders : <InventoryOutlined />,
    dsoOrders : <PieChartOutlineOutlined />,
    new_user : <PersonAddOutlined/>,
    customer : <ViewInArOutlined/>,
    party : <HandshakeOutlined/>,
    agent : <SupportAgentOutlined/>
};

// example menu json
export const menuItems = [
    {
        label: "Dashboard",
        path: "/app",
        iconKey: "dashboard",
    },
    {
        label: "Admin Master",
        iconKey: "adminPanel",
        items: [
            { label: "User Management", path: "/app/admin_master/user_management", iconKey: "userManagement" },
            { label: "Document Type", path: "/app/admin_master/document_type" },
            { label: "Sales Report", path: "/app/admin_master/sales_report" },
            { label: "Mail Tracker", path: "/app/admin_master/mail_tracker" },
        ],
    },
    {
        label: "SPR",
        iconKey: "corporate",
        items: [
            { label: "Packing List", path: "/app/spr/packing_list", iconKey: "packingList" },
            { label: "Add BOL", path: '/app/spr/packing_list/add_bol', iconKey: "addBolIcon" },
            { label: "Service Invoice", path: "/app/spr/service_invoice", iconKey: "serviceInvoice" },
            {
                label: "Master",
                iconKey: "adminPanel",
                items: [
                    { label: "Expense Code", path: "/app/spr/expense_code", iconKey: "expenseCode" },
                    { label: "Destination", path: "/app/spr/destination", iconKey: "destination" },
                    { label: "Vendor", path: "/app/entity/vendor", iconKey: "vendor" },
                ],
            },
        ],
    },
    {
        label: "entity",
        iconKey: "entity",
        items: [
            { label: "Customer", path: "/app/entity/customer", iconKey: "customer" },
            { label: "Party", path: '/app/code/party', iconKey: "party" },
            { label: "Agent", path: "/app/code/agent", iconKey: "agent" },

        ],
    },
    {
        label: "Components",
        path: "/app/component",
        iconKey: "components",
    },
    
];