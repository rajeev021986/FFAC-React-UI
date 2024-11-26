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
import CustomerFormScreen from "./pages/code/CustomerFormScreen";
import Component from "./pages/code/Component";
import { useSelector } from 'react-redux';
import SettingsPage from "./pages/setting/Setting"
function App() {
  // const { menuItems } = useMenuSetting();
  const theme = getTheme(useSelector((state) => state.dashboard.theme), useSelector((state) => state.dashboard.mode));
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
          <Route path="/app" element={<Layout />} >
            <Route index element={<DashboardScreen />} />
            <Route path="entity/customer" element={<Component  page="customer" />} />
            <Route path="entity/approve" element={<Component page="customerApprove" />} />
            <Route path="entity/customer/new" element={<CustomerFormScreen />} />
            <Route path="entity/customer/editcustomer" element={<CustomerFormScreen page="customer" />} />
            <Route path="entity/vendor" element={<VendorScreen />} />
            <Route path="entity/approve/approveRequest" element={<CustomerFormScreen page="customerApprove" />} />
            <Route path="admin/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
