import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import ApiManager from '../../services/ApiManager';
import toast from 'react-hot-toast';
import { useMenuSubmenuQuery } from '../../store/api/userDataApi';

export default function AddEditRole() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useMenuSubmenuQuery();
    const [tableData, setTableData] = useState([]);
    const [checkedValues, setCheckedValues] = useState({});
    const [assigned, setAssigned] = useState([]);
    const handleSelectAllChange = (checked, subMenuId) => {
        const newPermissions = {
            view: checked,
            add: checked,
            copy: checked,
            update: checked,
            delete: checked,
            upload: checked,
            download: checked,
            audit: checked,
            docDelete: checked
        };

        setCheckedValues(prev => ({
            ...prev,
            [subMenuId]: newPermissions
        }));
    };
    useEffect(() => {
        const getRolePermissions = async () => {
            await ApiManager.getRolepermissions(id).then((res) => {
                setRoleName(res.body.role.roleName)
                {
                    const transformedData = res.body.menuPermissions.flatMap(menu => {
                        const menuItems = [];
                        if (menu.permissions) {
                            menuItems.push({
                                subMenuId: menu.menuId,
                                subMenuName: menu.menuName,
                                permissions: menu.permissions,
                                parentId: menu.parentId
                            });
                        }

                        if (menu.nestedMenus) {
                            menu.nestedMenus.forEach(subMenu => {
                                if (subMenu.permissions) {
                                    menuItems.push({
                                        subMenuId: subMenu.menuId,
                                        subMenuName: subMenu.menuName,
                                        permissions: subMenu.permissions,
                                        parentId: subMenu.parentId
                                    });
                                }
                            });
                        }

                        return menuItems;
                    });

                    setTableData(transformedData);
                    const initialCheckedValues = {};
                    transformedData.forEach(item => {
                        initialCheckedValues[item.subMenuId] = {
                            view: item.permissions?.view === "YES",
                            add: item.permissions?.add === "YES",
                            copy: item.permissions?.copy === "YES",
                            update: item.permissions?.update === "YES",
                            delete: item.permissions?.delete === "YES",
                            upload: item.permissions?.upload === "YES",
                            download: item.permissions?.download === "YES",
                            audit: item.permissions?.audit === "YES",
                            docDelete: item.permissions?.docDelete === "YES"
                        };
                    });
                    setCheckedValues(initialCheckedValues);
                    const initialCheckedItems = {};
                    transformedData.forEach(item => {
                        initialCheckedItems[item.subMenuId] = true;
                    });
                    setCheckedItems(initialCheckedItems);
                }
            }).catch((error) => toast.error(error.message))
        }
        if (id) {
            getRolePermissions();
        }

    }, []);
    const renderPermissionSwitch = (permission) => (_, record) => (
        <Switch
            checked={checkedValues[record.subMenuId]?.[permission] || false}
            onChange={(e) => handlePermissionChange(e.target.checked, record.subMenuId, permission)}
        />
    );
    const columns = [
        {
            title: 'Menu/Submenu',
            dataIndex: 'subMenuName',
            key: 'subMenuName',
        },
        {
            title: 'View',
            dataIndex: 'view',
            key: 'view',
            render: renderPermissionSwitch('view')
        },
        {
            title: 'Add/Copy',
            dataIndex: 'addCopy',
            key: 'addCopy',
            render: (_, record) => (
                <Switch
                    checked={checkedValues[record.subMenuId]?.add || false}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        handlePermissionChange(checked, record.subMenuId, 'add');
                        handlePermissionChange(checked, record.subMenuId, 'copy');
                    }}
                />
            )
        },
        {
            title: 'Update',
            dataIndex: 'update',
            key: 'update',
            render: renderPermissionSwitch('update')
        },
        {
            title: 'Delete',
            dataIndex: 'delete',
            key: 'delete',
            render: renderPermissionSwitch('delete')
        },
        {
            title: 'Download',
            dataIndex: 'download',
            key: 'download',
            render: renderPermissionSwitch('download')
        },
        {
            title: 'Audit view',
            dataIndex: 'auditView',
            key: 'auditView',
            render: renderPermissionSwitch('audit')
        },
        {
            title: 'Upload Doc.',
            dataIndex: 'uploadDoc',
            key: 'uploadDoc',
            render: renderPermissionSwitch('upload')
        },
        {
            title: 'Delete Doc.',
            dataIndex: 'docDelete',
            key: 'docDelete',
            render: renderPermissionSwitch('docDelete')
        },
        {
            title: 'Select All',
            dataIndex: 'selectAll',
            key: 'selectAll',
            render: (_, record) => {
                const rowPermissions = checkedValues[record.subMenuId] || {};
                const isAllChecked = Object.values(rowPermissions).every(Boolean);

                return (
                    <Switch
                        checked={isAllChecked}
                        onChange={(e) => handleSelectAllChange(e.target.checked, record.subMenuId)}
                    />
                );
            },
        },
        {
            title: '',
            dataIndex: 'remove',
            key: 'remove',
            render: (_, record) => (
                <IconButton
                    color="error"
                    onClick={() => handleRemoveSubmenu(record.subMenuId)}
                    size="small"
                >
                    <RemoveCircleIcon />
                </IconButton>
            ),
        },
    ];

    const [checkedItems, setCheckedItems] = useState({});
    const handlePermissionChange = (checked, subMenuId, permission) => {
        setCheckedValues(prev => ({
            ...prev,
            [subMenuId]: {
                ...(prev[subMenuId] || {}),
                [permission]: checked
            }
        }));
    };
    const handleRemoveSubmenu = (subMenuId) => {
        setTableData((prev) => prev.filter((item) => item.subMenuId !== subMenuId));
        setCheckedValues((prev) => {
            const newValues = { ...prev };
            delete newValues[subMenuId];
            return newValues;
        });
        setCheckedItems(prev => ({
            ...prev,
            [subMenuId]: false
        }));
        setAssigned((prev) => prev.filter((item) => item.subMenuId !== subMenuId));
    };
    const handleCheckboxChange = (menuId, menuName, parentId) => {
        const isInTable = tableData.some(item => item.subMenuId === menuId);

        if (isInTable) {
            setTableData(prev => prev.filter(item => item.subMenuId !== menuId));
            setCheckedItems(prev => ({
                ...prev,
                [menuId]: false
            }));
            setCheckedValues(prev => {
                const newValues = { ...prev };
                delete newValues[menuId];
                return newValues;
            });
        } else {
            if (parentId) {
                const newTableItem = {
                    subMenuId: menuId,
                    subMenuName: menuName,
                    parentId: parentId,
                    permissions: {
                        view: false,
                        add: false,
                        copy: false,
                        update: false,
                        delete: false,
                        upload: false,
                        download: false,
                        audit: false,
                        docDelete: false
                    }
                };
                setTableData(prev => [...prev, newTableItem]);
                setCheckedItems(prev => ({
                    ...prev,
                    [menuId]: true
                }));
                setCheckedValues(prev => ({
                    ...prev,
                    [menuId]: {
                        view: false,
                        add: false,
                        copy: false,
                        update: false,
                        delete: false,
                        upload: false,
                        download: false,
                        audit: false,
                        docDelete: false
                    }
                }));
            } else if (parentId === null) {
                if (data.body.find(menu => menu.menuId === menuId).nestedMenuEntities.length <= 0) {
                    const newTableItem = {
                        subMenuId: menuId,
                        subMenuName: menuName,
                        parentId: parentId,
                        permissions: {
                            view: false,
                            add: false,
                            copy: false,
                            update: false,
                            delete: false,
                            upload: false,
                            download: false,
                            audit: false,
                            docDelete: false
                        }
                    };
                    setTableData(prev => [...prev, newTableItem]);
                    setCheckedItems(prev => ({
                        ...prev,
                        [menuId]: true
                    }));
                    setCheckedValues(prev => ({
                        ...prev,
                        [menuId]: {
                            view: false,
                            add: false,
                            copy: false,
                            update: false,
                            delete: false,
                            upload: false,
                            download: false,
                            audit: false,
                            docDelete: false
                        }
                    }));
                    return
                }
                const newTableItem = data.body.find(menu => menu.menuId === menuId).nestedMenuEntities.map(item => {
                    return {
                        subMenuId: item.menuId,
                        subMenuName: item.menuName,
                        parentId: item.parentId,
                        permissions: {
                            view: false,
                            add: false,
                            copy: false,
                            update: false,
                            delete: false,
                            upload: false,
                            download: false,
                            audit: false,
                            docDelete: false
                        }
                    }
                }).filter((items) => !tableData.find(item => item.subMenuId === items.subMenuId))
                if (newTableItem.length <= 0) {
                    let menuIds = tableData.filter((menu) => menu.parentId === menuId).map((menu) => menu.subMenuId)
                    setTableData(prev => [...prev.filter(item => !menuIds.includes(item.subMenuId))])
                    setCheckedItems(prev => {
                        console.log("gana1")
                        const newValues = { ...prev };
                        delete newValues[menuId];
                        menuIds.forEach((id) => {
                            delete newValues[id];
                        });
                        return newValues;
                    });
                    setCheckedValues(prev => {
                        const newValues = { ...prev };
                        menuIds.forEach((id) => {
                            delete newValues[id];
                        });
                        return newValues;
                    });
                    setAssigned(prev => prev.filter(item => item.parentId !== menuId))
                    return;
                }
                setTableData(prev => [...prev, ...newTableItem])
                setCheckedItems(prev => {
                    return {
                        ...prev,
                        ...Object.assign({}, ...newTableItem.map(item => ({ [item.subMenuId]: true }))),
                        ...{ [newTableItem[0].parentId]: true }
                    }
                });
                setCheckedValues(prev => ({
                    ...prev,
                    ...Object.assign({}, ...newTableItem.map(item => ({
                        [item.subMenuId]: {
                            view: false,
                            add: false,
                            copy: false,
                            update: false,
                            delete: false,
                            upload: false,
                            download: false,
                            audit: false,
                            docDelete: false
                        }
                    })))
                }));
            }
        }
    };

    // Add new state for role name
    const [roleName, setRoleName] = useState('');
    const handleAddRole = async () => {
        const formattedData = {
            role: {
                roleId: id || null,
                roleName: roleName,
                isDeleted: false
            },
            menuPermissions: tableData.map(item => ({
                menuId: item.subMenuId,
                menuName: item.subMenuName,
                image: "",
                parentId: item.parentId,
                level: item.parentId ? 1 : 0,
                url: "",
                sequence: 0,
                roleId: 0,
                permissions: {
                    view: checkedValues[item.subMenuId]?.view ? "YES" : "NO",
                    add: checkedValues[item.subMenuId]?.add ? "YES" : "NO",
                    copy: checkedValues[item.subMenuId]?.copy ? "YES" : "NO",
                    update: checkedValues[item.subMenuId]?.update ? "YES" : "NO",
                    delete: checkedValues[item.subMenuId]?.delete ? "YES" : "NO",
                    upload: checkedValues[item.subMenuId]?.upload ? "YES" : "NO",
                    download: checkedValues[item.subMenuId]?.download ? "YES" : "NO",
                    audit: checkedValues[item.subMenuId]?.audit ? "YES" : "NO",
                    docDelete: checkedValues[item.subMenuId]?.docDelete ? "YES" : "NO",
                    createdBy: "system",
                    modifiedBy: "system",
                    createdDate: new Date().toISOString(),
                    modifiedDate: new Date().toISOString()
                }
            })).reduce((acc, curr) => {
                if (curr.parentId === null) {
                    acc.push({ ...curr, nestedMenus: [] });
                    return acc;
                }

                let parentMenu = data?.body.find(menu => menu.menuId === curr.parentId);
                if (acc.find(menu => menu.menuId === curr.parentId)) {
                    let preAcc = acc.map(menu => menu.menuId === curr.parentId ? { ...menu, nestedMenus: [...menu.nestedMenus, curr] } : menu);
                    return preAcc;
                } else {
                    acc.push({ ...parentMenu, nestedMenus: [curr] });
                }
                return acc;
            }, [])
        };
        if (id) {
            await ApiManager.updateRolePermissions(formattedData).then((res) => {
                toast.success(res.message)
                navigate(-1);
            }).catch((err) => {
                toast.error(err.message)
            })
        } else {
            const response = await ApiManager.addRole(formattedData).then((res) => {
                toast.success(res.message);
                navigate(-1);
            }).catch((err) => {
                toast.error(err.message);
            })
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px', width: '100%', flexWrap: 'wrap' }}>
            <div style={{
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                width: '100%'
            }}>
                <TextField
                    label="Role Name"
                    variant="outlined"
                    size="small"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    sx={{ minWidth: '200px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddRole}
                >
                    {id ? "Update Role" : "Add Role"}
                </Button>
            </div>
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <div style={{ width: '250px', backgroundColor: '#f5f5f5', borderRight: '1px solid #ddd', minHeight: '100vh' }}>
                    {data?.body.map((menu) => (
                        <Accordion
                            key={menu.menuId}
                            sx={{
                                width: '100%',
                                boxShadow: 'none',
                                '&:before': { display: 'none' },
                                backgroundColor: 'transparent',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${menu.menuId}-content`}
                                id={`panel${menu.menuId}-header`}
                                sx={{
                                    minHeight: '48px',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Checkbox
                                        edge="start"
                                        checked={checkedItems[menu.menuId] || (tableData.filter((items) => items.parentId === menu.menuId).length == data.body.find(menus => menus.menuId === menu.menuId).nestedMenuEntities.length && data.body.find(menus => menus.menuId === menu.menuId).nestedMenuEntities.length > 0) || false}
                                        onChange={() => handleCheckboxChange(
                                            menu.menuId,
                                            menu.menuName,
                                            null
                                        )}
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <Typography sx={{ fontSize: '0.95rem' }}>{menu.menuName}</Typography>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails sx={{ padding: 0 }}>
                                <List sx={{ padding: 0 }}>
                                    {menu.nestedMenuEntities.map((subMenu) => (
                                        <ListItem
                                            key={subMenu.menuId}
                                            dense
                                            sx={{
                                                pl: 4,
                                                '&:hover': {
                                                    backgroundColor: '#e0e0e0',
                                                }
                                            }}
                                        >
                                            <Checkbox
                                                edge="start"
                                                checked={checkedItems[subMenu.menuId] || false}
                                                onChange={() => handleCheckboxChange(
                                                    subMenu.menuId,
                                                    subMenu.menuName,
                                                    subMenu.parentId
                                                )}
                                                size="small"
                                            />
                                            <ListItemText
                                                primary={subMenu.menuName}
                                                primaryTypographyProps={{
                                                    fontSize: '0.9rem',
                                                    sx: { ml: 1 }
                                                }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </div>

                {/* Right side table */}
                <div style={{ flex: 1 }}>
                    <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                        <Table size="small" aria-label="permissions table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.key}
                                            align="center"
                                            sx={{
                                                fontWeight: 'bold',
                                                whiteSpace: 'nowrap',
                                                padding: '8px'
                                            }}
                                        >
                                            {column.title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow key={row.subMenuId}>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={`${row.subMenuId}-${column.key}`}
                                                align={column.key === 'subMenuName' ? 'left' : 'center'}
                                                sx={{ padding: '8px' }}
                                            >
                                                {column.render ?
                                                    column.render(null, row) :
                                                    row[column.dataIndex]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}
