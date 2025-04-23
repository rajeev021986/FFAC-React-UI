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
import IcdScreen from "./pages/icd/IcdScreen";
import Component from "./pages/code/Component";
import { useSelector } from "react-redux";
import SettingsPage from "./pages/setting/Setting";
import AddCard from "./components/common/Cards/AddCard";
import CustomerFormScreen from "./pages/code/CustomerFormScreen";
import ShipperComponent from "./pages/code/ShipperComponent";
import ConsigneeComponent from "./pages/code/ConsigneeComponent";
import Role from "./pages/code/Role";
import AddEditRole from "./pages/code/AddEditRole";
import UserManagementScreen from "./pages/users/UserManagementScreen";
import ProfileScreen from "./pages/ProfileScreen";
import VendorForm from "./components/screen/code/vendor/VendorForm";
import { VesselScreen } from "./pages/vessel/VesselScreen";
import { VesselFormScreen } from "./pages/vessel/VesselFormScreen";
import PortScreen from "./pages/port/PortScreen";
import PortForm from "./components/screen/code/port/PortForm";
import BondScreen from "./pages/Bond/Bondscreen";
import BondForm from "./components/screen/code/bond/BondForm";
import "./App.css";
import { VesselVoyageScreen } from "./pages/vessel_voyage/VesselVoyageScreen";
import { VesselVoyageFormScreen } from "./pages/vessel_voyage/VesselVoyageFormScreen";
import { ChargesScreen } from "./pages/charges/ChargesScreen";
import AddEditCharge from "./components/screen/code/charge/AddEditCharge";
import { ExchangeRate } from "./pages/exchange_rate/ExchangeRateScreen";
import Exchange from "./components/screen/code/exchange/Exchange";
import ShipperFormScreen from "./pages/code/ShipperFormScreen";
import ConsigneeFormScreen from "./pages/code/ConsigneeFormScreen";
import IcdFormScreen from "./pages/icd/IcdFormScreen";

// Job Entry
import JobEntryScreen from "./pages/JobEntry/JobEntryListing";
import AddJobEntry from "./pages/JobEntry/AddJobEntry";

// Update Job Page
import UpdateJobDetails from "./pages/UpdateJob/UpdateJob";
import UpdateJobListingScreen from "./pages/JobEntry/UpdateJob/updateJobListing";
import PayableList from "./pages/payable";
import AddPayableEntry from "./pages/payable/AddPayableForm";

function App() {
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
            <Route path="profile" element={<ProfileScreen />} />
            <Route index element={<DashboardScreen />} />
            <Route
              path="entity/customer"
              element={<Component page="customer" />}
            />
            <Route
              path="entity/customer/newcustomer"
              element={<CustomerFormScreen page="customer" />}
            />
            <Route
              path="entity/customer/editcustomer"
              element={<CustomerFormScreen page="customer" />}
            />
            <Route
              path="entity/approve"
              element={<Component page="customerApprove" />}
            />
            <Route
              path="entity/approve/approveRequest"
              element={<CustomerFormScreen page="customerApprove" />}
            />
            <Route
              path="entity/vendor"
              element={<VendorScreen page="vendor" />}
            />
            <Route path="entity/vendor/addVendor" element={<VendorForm />} />
            <Route path="entity/vendor/editVendor" element={<VendorForm />} />
            <Route
              path="entity/vendorApproval"
              element={<VendorScreen page="vendorApprove" />}
            />
            <Route
              path="entity/vendorApproval/editVendorApprove"
              element={<VendorForm page="vendorApproval" />}
            />
            <Route
              path="entity/shipper"
              element={<ShipperComponent page="shipper" />}
            />
            <Route
              path="entity/shipper/new_shipper"
              element={<ShipperFormScreen page="shipper" />}
            />
            <Route
              path="entity/shipper/editshipper"
              element={<ShipperFormScreen page="shipper" />}
            />
            <Route
              path="entity/consignee"
              element={<ConsigneeComponent page="consignee" />}
            />
            <Route
              path="entity/consignee/new_consignee"
              element={<ConsigneeFormScreen page="consignee" />}
            />
            <Route
              path="entity/consignee/editconsignee"
              element={<ConsigneeFormScreen page="consignee" />}
            />
            <Route
              path="documentation/jobEntry"
              element={<JobEntryScreen page="job-entry" />}
            />
            <Route
              path="documentation/approveJobfile"
              element={<JobEntryScreen page="jobApprove" />}
            />
            <Route
              path="documentation/jobEntry/newEntry"
              element={<AddJobEntry page="job-entry" />}
            />
            <Route
              path="documentation/jobEntry/editJobEntry"
              element={<AddJobEntry page="job-entry" />}
            />
            <Route
              path="documentation/approveJobfile/approveJobRequest"
              element={<AddJobEntry page="jobApprove" />}
            />
            <Route
              path="documentation/updateJob"
              element={<UpdateJobListingScreen page="update-jobs" />}
            />
            <Route
              path="documentation/updateJob/edit-job"
              element={<UpdateJobDetails page="update-job" />}
            />
            <Route
              path="documentation/paybleEntry"
              element={<PayableList page="payable_list" />}
            />
            <Route
              path="documentation/paybleEntry/addpayable"
              element={<AddPayableEntry page="payable" />}
            />

            <Route path="admin/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="admin/users" element={<UserManagementScreen />} />
            <Route path="admin/users/addUser" element={<AddCard />} />
            <Route path="admin/users/editUser/:id" element={<AddCard />} />
            <Route path="admin/roles" element={<Role />} />
            <Route path="admin/roles/add" element={<AddEditRole />} />
            <Route path="admin/roles/edit/:id" element={<AddEditRole />} />
            <Route
              path="admin/charges"
              element={<ChargesScreen page={"charges"} />}
            />
            <Route
              path="admin/charges/newcharges"
              element={<AddEditCharge />}
            />
            <Route
              path="admin/charges/editcharges"
              element={<AddEditCharge />}
            />
            <Route
              path="admin/exchangeRate"
              element={<ExchangeRate page={"exchangeRate"} />}
            />
            <Route
              path="admin/exchangeRate/editexchangerate"
              element={<Exchange />}
            />
            <Route
              path="admin/exchangeRate/newexchangerate"
              element={<Exchange />}
            />
            <Route path="master/vessel" element={<VesselScreen />} />
            <Route
              path="master/vessel/newvessel"
              element={<VesselFormScreen />}
            />
            <Route
              path="master/vessel/editvessel"
              element={<VesselFormScreen />}
            />
            <Route
              path="master/vesselVoyage"
              element={<VesselVoyageScreen />}
            />
            <Route
              path="master/vesselVoyage/newvoyage"
              element={<VesselVoyageFormScreen />}
            />
            <Route
              path="master/vesselVoyage/editvoyage"
              element={<VesselVoyageFormScreen />}
            />
            <Route path="master/port" element={<PortScreen />} />
            <Route path="master/port/newport" element={<PortForm />} />
            <Route path="master/port/editport" element={<PortForm />} />
            <Route path="master/bond" element={<BondScreen />} />
            <Route path="master/bond/bondAdd" element={<BondForm />} />
            <Route path="master/bond/editBond" element={<BondForm />} />
            <Route path="master/icd" element={<IcdScreen page="icd" />} />
            <Route
              path="master/icd/new_icd"
              element={<IcdFormScreen page="icd" />}
            />
            <Route
              path="master/icd/editIcd"
              element={<IcdFormScreen page="icd" />}
            />
          </Route>
        </Routes>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
