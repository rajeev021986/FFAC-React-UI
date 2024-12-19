import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Card,
} from "@mui/material";
import {
  Edit as EditIcon,
  Add as AddIcon,
  FileCopy as CopyIcon,
  Search as SearchIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Height,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import { CommonApiCall, fetchSidebarData } from '@Api/Api';
// import { ApiEndPoints } from '@CommonFile/endPoints';
import moment from "moment";
import { toast } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ScreenToolbar from "../../components/common/ScreenToolbar";
import ThemedBreadcrumb from "../../components/common/Breadcrumb";
import { useFetchuserQuery } from "../../store/api/userDataApi";
import ApiManager from "../../services/ApiManager";

const Role = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useFetchuserQuery();
  const [roles, setRoles] = useState([
    {
      role: {
        roleId: 1005,
        roleName: "Admin",
        createdBy: "admin",
        modifiedBy: "admin",
        isDeleted: false,
        createdDate: 1727474356707,
        modifiedDate: 1727474356707,
      },
      userEntities: [
        {
          id: 112,
          userId: "Balachander",
          firstName: "Balachander",
          lastName: "Radakrishnan",
          email: "",
          phone: "",
          companyCode: null,
          address: null,
          status: null,
          image: null,
          createdBy: null,
          modifiedBy: "admin",
          createdDate: 0,
          modifiedDate: 1732355695155,
          location: null,
          finYear: null,
          dbName: null,
          internalCode: null,
          curYear: null,
          cssType: null,
          currency: null,
          isDeleted: false,
          roles: null,
          isNotificationApiCalling: null,
          notificationTimeIntervalSec: null,
          locationInfo: null,
        },
        {
          id: 129,
          userId: "Ramarathinam",
          firstName: "Ramarathinam",
          lastName: "Gopalakrishnan",
          email: "",
          phone: "",
          companyCode: null,
          address: null,
          status: null,
          image: null,
          createdBy: "admin",
          modifiedBy: "admin",
          createdDate: 1728662992917,
          modifiedDate: 1728662992917,
          location: null,
          finYear: null,
          dbName: null,
          internalCode: null,
          curYear: null,
          cssType: null,
          currency: null,
          isDeleted: false,
          roles: null,
          isNotificationApiCalling: null,
          notificationTimeIntervalSec: null,
          locationInfo: null,
        },
        {
          id: 1,
          userId: "admin",
          firstName: "admin",
          lastName: "admin",
          email: "admin@gmail.com",
          phone: "9039443937",
          companyCode: null,
          address: null,
          status: null,
          image: null,
          createdBy: null,
          modifiedBy: "admin",
          createdDate: 0,
          modifiedDate: 1732876802762,
          location: null,
          finYear: null,
          dbName: null,
          internalCode: null,
          curYear: null,
          cssType: null,
          currency: null,
          isDeleted: false,
          roles: null,
          isNotificationApiCalling: null,
          notificationTimeIntervalSec: null,
          locationInfo: null,
        },
      ],
    },
    {
      role: {
        roleId: 1065,
        roleName: "Operations_Admin",
        createdBy: "admin",
        modifiedBy: "admin",
        isDeleted: false,
        createdDate: 1728923796558,
        modifiedDate: 1729158153754,
      },
      userEntities: [
        {
          id: 120,
          userId: "Kumar",
          firstName: "Kumar",
          lastName: "Pradeep",
          email: "",
          phone: "",
          companyCode: null,
          address: null,
          status: null,
          image: null,
          createdBy: null,
          modifiedBy: "admin",
          createdDate: 0,
          modifiedDate: 1728974779745,
          location: null,
          finYear: null,
          dbName: null,
          internalCode: null,
          curYear: null,
          cssType: null,
          currency: null,
          isDeleted: false,
          roles: null,
          isNotificationApiCalling: null,
          notificationTimeIntervalSec: null,
          locationInfo: null,
        },
        {
          id: 125,
          userId: "Shabbir",
          firstName: "Shabbir",
          lastName: "Kassamali",
          email: "",
          phone: "",
          companyCode: null,
          address: null,
          status: null,
          image: null,
          createdBy: null,
          modifiedBy: "admin",
          createdDate: 0,
          modifiedDate: 1728974800965,
          location: null,
          finYear: null,
          dbName: null,
          internalCode: null,
          curYear: null,
          cssType: null,
          currency: null,
          isDeleted: false,
          roles: null,
          isNotificationApiCalling: null,
          notificationTimeIntervalSec: null,
          locationInfo: null,
        },
      ],
    },
  ]);
  useEffect(() => {
    setRoles(data?.body || []);
    setFilteredRoles(data?.body || []);
  }, [data]);
  const [filteredRoles, setFilteredRoles] = useState(roles);
  console.log(filteredRoles,"filteredRoles")
  const [refresh, setRefresh] = useState(false);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminMenuData, setAdminMenuData] = useState([
    {
      subMenu: "Role",
      add: "yes",
      update: "yes",
      delete: "yes",
      view: "yes",
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    roleId: null,
    userId: null,
    type: null,
  });

  // Replace the commented useEffect with this dummy data version

  // Handle removing user from role
  const handleRemoveUser = async (roleId, userId) => {
    const hasDeletePermission = adminMenuData.some(
      (item) => item.subMenu === "Role" && item.delete === "yes"
    );

    if (!hasDeletePermission) {
      toast.error("You do not have permission to delete Role.");
      return;
    }

    setDialogConfig({ roleId, userId });
    setOpenDialog(true);
  };

  // Add this new function to handle the confirmation
  const handleConfirmRemove = async () => {
    try {
      const queryParams = `role/${dialogConfig.roleId}/user/${dialogConfig.userId}`;
      await ApiManager.removeAssignedUser(queryParams).then(() => toast.success("User Removed successfully!")).then(() => refetch()).catch(() => toast.error("Failed to Remove User"))
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error removing user:", error);
      toast.error("Failed to remove user");
    }
    setOpenDialog(false);
  };

  const handleRoleDelete = async (roleId) => {
    const hasDeletePermission = adminMenuData.some(
      (item) => item.subMenu === "Role" && item.delete === "yes"
    );

    if (!hasDeletePermission) {
      toast.error("You do not have permission to delete this role.");
      return;
    }

    if (
      roles.find((role) => role.role.roleId === roleId)?.userEntities.length > 0
    ) {
      toast.error("Cannot delete role with assigned users.");
      return;
    } else {
      setDialogConfig({ roleId, type: "role" });
      setOpenDialog(true);
    }
  };
  const handleAddRole = () => {
    const userPermission = adminMenuData.find(
      (item) => item.subMenu === "Role"
    );
    if (userPermission && userPermission.add === "yes") {
      navigate("add");
    } else {
      toast.error("You don't have permission to add users.");
    }
  };

  // Search functionality to filter roles based on role name or user names
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = roles.filter((roleData) => {
      const matchesRole = roleData.role.roleName.toLowerCase().includes(query);
      const matchesUsers = roleData.userEntities.some(
        (user) =>
          user.userId.toLowerCase().includes(query) ||
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query)
      );
      return matchesRole || matchesUsers;
    });

    setFilteredRoles(filtered);
  };

  // Add this function to handle both role and user deletion confirmations
  const handleConfirmDelete = async () => {
    try {
      if (dialogConfig.type === "role") {
        const updatedRoles = roles.filter(
          (role) => role.role.roleId !== dialogConfig.roleId
        );
        setRoles(updatedRoles);
        setFilteredRoles(updatedRoles);
        const result = await ApiManager.deleteRole(dialogConfig.roleId).then((res) => {
          console.log(res);
          toast.success("Role deleted successfully!");
        }).then((res) => {
          setRefresh((prev) => !prev);
        }).catch((error) => {
          console.log(error);
          toast.error("Failed to delete role");
        });
      } else {
        setRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Failed to ${dialogConfig.type === "role" ? "delete role" : "remove user"
        }`
      );
    }
    setOpenDialog(false);
  };

  // Table Columns
  const columns = [
    {
      id: "role",
      label: "Role",
      width: "15%",
      render: (record) => record.role.roleName,
    },
    {
      id: "users",
      label: "Assigned Users",
      width: "55%",
      render: (record) => (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {record.userEntities.map((user) => (
            <Grid
              key={user.id}
              container
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                width: "auto",
              }}
            >
              <Button
                variant="outlined"
                color="warning"
                size="small"
                onClick={() =>
                  handleRemoveUser(record.role.roleId, user.id)
                }
                sx={{
                  borderColor: "#f47123",
                  backgroundColor: "white",
                  color: "#f47123",
                  m: 0.5,
                  position: "relative",
                  pr: 3,
                  minWidth: "auto",
                  "&:hover": {
                    borderColor: "#f47123",
                    backgroundColor: "white",
                  },
                }}
              >
                {user.userId}
                <CancelIcon
                  sx={{
                    position: "absolute",
                    top: -8.5,
                    right: -8,
                    color: "white",
                    borderRadius: "50%",
                    padding: "0",
                    fontSize: "20px",
                    backgroundColor: "antiquewhite",
                  }}
                  
                />
              </Button>
            </Grid>
          ))}
        </div>
      ),
    },
    {
      id: "created",
      label: "Created",
      width: "15%",
      render: (record) => (
        <>
          <div>By: {record.role.createdBy}</div>
          <div>
            Date: {moment(record.role.createdDate).format("DD/MM/YYYY")}
          </div>
        </>
      ),
    },
    {
      id: "requested",
      label: "Requested",
      width: "15%",
      render: (record) => {
        console.log(record, "record");
        // Check for update permission
        const userPermission = adminMenuData.find(
          (item) => item.subMenu === "Role"
        );

        return (
          <>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                variant="contained"
                onClick={() => {
                  if (userPermission?.update === "yes") {
                    navigate(`edit/${record.role.roleId}`, {
                      state: { adminMenuData },
                    });
                  } else {
                    toast.error("You don't have permission to edit this role.");
                  }
                }}
                color="primary"
                sx={{
                  borderRadius: "50%",
                  padding: "9px",
                  minWidth: "40px", // Ensures a consistent circular size
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <EditIcon size="small" />
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  if (record.userEntities.length === 0) {
                    handleRoleDelete(record.role.roleId);
                  } else {
                    toast.error("Cannot delete role with assigned users.");
                  }
                }}
                color="primary"
                sx={{
                  borderRadius: "50%",
                  padding: "9px",
                  minWidth: "40px", // Ensures a consistent circular size
                  minHeight: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DeleteIcon />
              </Button>
            </Box>
          </>
        );
      },
    },
  ];

  return (
    <>
      {!loader ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          className={{ backgroundColor: "white.main" }}
          sx={{ height: "100vh" }}
        >
          <ScreenToolbar
            leftComps={<ThemedBreadcrumb />}
            rightComps={
              <>
                <Box style={{ display: "flex", gap: "10px" }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddRole}
                    color="primary"
                    sx={{ borderRadius: "22px 20px 20px 22px" }}
                  >
                    Add
                  </Button>
                  {/* <Button
                    variant="contained"
                    startIcon={<CopyIcon />}
                    color="primary"
                    sx={{ borderRadius: "22px 20px 20px 22px" }}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: "22px 20px 20px 22px" }}
                  >
                    Export
                  </Button> */}
                </Box>
              </>
            }
          />
          <TextField
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon color="primary" />,
            }}
            sx={{
              width: "500px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
              },
            }}
          />

          <Box className={{ backgroundColor: "white.main" }}>
            <Card
              sx={{ borderWidth: 1, borderColor: "border.main", marginTop: 5 }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#ebf8ff" }}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          style={{ width: column.width }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRoles.map((row) => (
                      <TableRow key={row.role.roleId}>
                        {columns.map((column) => (
                          <TableCell key={column.id}>
                            {column.render
                              ? column.render(row)
                              : row[column.id]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogConfig.type === "role"
              ? "You will not be able to recover this role!"
              : "Are you sure you want to remove this user?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={
              dialogConfig.type === "role"
                ? handleConfirmDelete
                : handleConfirmRemove
            }
            color="error"
            autoFocus
          >
            {dialogConfig.type === "role" ? "Delete" : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Role;
