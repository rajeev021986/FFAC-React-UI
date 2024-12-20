import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "./config/theme";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";
import LoginScreen from "./pages/LoginScreen";
import VendorScreen from "./pages/vendor/VendorScreen";
import AuthGuard from "./components/Providers/AuthGuard";
import DashboardScreen from "./pages/dashboard/DashboardScreen";
import HandleAuthCallback from "./HandleAuthCallback";
import FormScreen from "./pages/code/CustomerFormScreen";
import CustomerApproveScreen from "./pages/code/CustomerApproveScreen";
import Component from "./pages/code/Component";
import { useSelector } from "react-redux";
import SettingsPage from "./pages/setting/Setting";
import AddCard from "./components/common/Cards/AddCard";
import CustomerFormScreen from "./pages/code/CustomerFormScreen";
import Role from "./pages/code/Role";
import AddEditRole from "./pages/code/AddEditRole";
import UserManagementScreen from "./pages/users/UserManagementScreen";
import UserFormScreen from "./pages/users/UserFormScreen";
import ProfileScreen from "./pages/ProfileScreen";
import VendorForm from "./components/screen/code/vendor/VendorForm";
import { VesselScreen } from "./pages/vessel/VesselScreen";
import { VesselFormScreen } from "./pages/vessel/VesselFormScreen";
import PortScreen from "./pages/port/PortScreen";
import PortForm from "./components/screen/code/port/PortForm";
function App() {
  // const { menuItems } = useMenuSetting();
  const theme = getTheme(
    useSelector((state) => state.dashboard.theme),
    useSelector((state) => state.dashboard.mode)
  );
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              <AuthGuard>
                <LoginScreen />
              </AuthGuard>
            }
          />
          <Route
            path="/callback"
            element={
              <AuthGuard>
                <HandleAuthCallback />
              </AuthGuard>
            }
          />
          <Route path="/app" element={<Layout />}>
            <Route index element={<DashboardScreen />} />
            <Route
              path="entity/customer"
              element={<Component page="customer" />}
            />
            <Route
              path="entity/approve"
              element={<Component page="customerApprove" />}
            />
            <Route
              path="entity/customer/new"
              element={<CustomerFormScreen page="customer" />}
            />
            <Route
              path="entity/customer/editcustomer"
              element={<CustomerFormScreen page="customer" />}
            />
            <Route path="entity/vendor" element={<VendorScreen page="vendor" />} />
            <Route path="entity/vendorApproval" element={<VendorScreen page="vendorApprove" />} />
            <Route
              path="entity/approve/approveRequest"
              element={<CustomerFormScreen page="customerApprove" />}
            />
            <Route path="admin/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="admin/users" element={<UserManagementScreen />} />
            <Route path="admin/users/addUser" element={<AddCard />} />
            <Route path="admin/users/editUser/:id" element={<AddCard />} />
            <Route path="admin/roles" element={<Role />} />
            <Route path="admin/roles/add" element={<AddEditRole />} />
            <Route path="admin/roles/edit/:id" element={<AddEditRole />} />
            <Route path="entity/vendor/addVendor" element={<VendorForm />} />
            <Route path="entity/vendor/editVendor" element={<VendorForm />} />
            <Route path="entity/vendorApproval/editVendorApprove" element={<VendorForm page="vendorApproval" />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route
              path="master/vessel/editvessel"
              element={<VesselFormScreen />}
            />
            <Route
              path="master/vessel/newvessel"
              element={<VesselFormScreen />}
            />
            <Route
              path="master/vessel"
              element={<VesselScreen />}
            />
            <Route path="master/port" element={<PortScreen />} />
            <Route path="master/port/portAdd" element={<PortForm />} />
            <Route path="master/port/editPort" element={<PortForm />} />
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
