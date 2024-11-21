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
import SettingsPage from "./pages/setting/Setting"
function App() {
  // const { menuItems } = useMenuSetting(); 
  return (
    <div className="App">
      <ThemeProvider theme={getTheme()}>
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
          {/* customer Routes */}
           <Route path="entity/customer" element={<Component />} />
           <Route path="entity/customer/new" element={<CustomerFormScreen />} />
          <Route path="entity/vendor" element={<VendorScreen />} />
          <Route path="admin/settings" element={<SettingsPage/>} />
          <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
		