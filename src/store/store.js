import { configureStore } from "@reduxjs/toolkit";
import { userDataApi } from "./api/userDataApi";
import { packingListDataApi } from "./api/packingListDataApi";
import { serviceInvoiceDataApi } from "./api/serviceInvoiceApi";
import { expenseCodeDataApi } from "./api/expenseCodeDataApi";
import { destinationDataApi } from "./api/destinationDataApi";
import { vendorDataApi } from "./api/vendorDataApi";
import { shipperDataApi } from "./api/shipperDataApi";
import { consigneeDataApi } from "./api/consigneeDataApi";
import { auditDataApi } from "./api/common";
import { dashboardDataApi } from "./api/dashbaordDataApi";
import { settingsApi } from "./api/settingsApi";
import { codeDataApi } from "./api/codeDataApi";
import { portDataAPI } from "./api/portDataApi";
import { icdDataApi } from "./api/icdDataApi";
import { bondDataAPI } from "./api/bondDataApi";
import { vesselDataApi } from "./api/vesselDataApi";
import { vesselVoyageDataApi } from "./api/vesselVoyageDataApi";
import { chargesDataApi } from "./api/chargesDataApi";
import { exchangeRateDataApi } from "./api/exchangeRateDataApi";
import { otmBolDataApi } from "./api/otmBolDataApi";
import { jobEntry } from "./api/jobEntryApi";
import { containerAPI } from "./api/containerApi";

import userManagementReducer from "./freatures/userManagementSlice";
import authReducer from "./freatures/authSlice";
import packingListReducer from "./freatures/packingListSlice";
import serviceInvoiceReducer from "./freatures/serviceInvoiceSlice";
import expenseCodeReducer from "./freatures/expenseCodeSlice";
import destinationReducer from "./freatures/destinationSlice";
import vendorReducer from "./freatures/vendorSlice";
import shipperReducer from "./freatures/shipperSlice";
import consigneeReducer from "./freatures/consigneeSlice";
import icdReducer from "./freatures/icdSlice";
import sprblDetailsReducer from "./freatures/sprblDataSlice";
import PoOrderListSlice from "./freatures/PoOrderListSlice";
import DsoOrderListSlice from "./freatures/DsoOrderListSlice";
import dashboardSlice from "./freatures/dashboardSlice";
import newRegisteredUserReducer from "./freatures/newRegisteredUserSlice";
import settingsSlice from "./freatures/settingsSlice";
import otmBolListSlice from "./freatures/otmBolListSlice";
import codeCustomerReducer from "./freatures/CustomerSlice";
import vesselReducer from "./freatures/VesselSlice";
import codePartyReducer from "./freatures/PartySlice";
import codeAgentReducer from "./freatures/AgentSlice";
import portReducer from "./freatures/portSlice";
import bondReducer from "./freatures/bondSlice";
import vesselVoyagaReducer from "./freatures/VesselVoyageSlice";
import chargesReducer from "./freatures/ChargesSlice";
import exchangeRateReducer from "./freatures/ExchangeRateSlice";
import jonEntryReducer from "./freatures/JobEntrySlice";
import containerReducer from "./freatures/containersSlice";
import vehicleReducer from "./freatures/vehicleSlice";
import looseCargoReducer from "./freatures/LoseCargoSlice";
import payableReducer from "./freatures/payableEntrySlice";

const store = configureStore({
  reducer: {
    // api
    [userDataApi.reducerPath]: userDataApi.reducer,
    [packingListDataApi.reducerPath]: packingListDataApi.reducer,
    [serviceInvoiceDataApi.reducerPath]: serviceInvoiceDataApi.reducer,
    [expenseCodeDataApi.reducerPath]: expenseCodeDataApi.reducer,
    [destinationDataApi.reducerPath]: destinationDataApi.reducer,
    [vendorDataApi.reducerPath]: vendorDataApi.reducer,
    [shipperDataApi.reducerPath]: shipperDataApi.reducer,
    [consigneeDataApi.reducerPath]: consigneeDataApi.reducer,
    [icdDataApi.reducerPath]: icdDataApi.reducer,
    [auditDataApi.reducerPath]: auditDataApi.reducer,
    [dashboardDataApi.reducerPath]: dashboardDataApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [otmBolDataApi.reducerPath]: otmBolDataApi.reducer,
    [codeDataApi.reducerPath]: codeDataApi.reducer,
    [vesselDataApi.reducerPath]: vesselDataApi.reducer,
    [portDataAPI.reducerPath]: portDataAPI.reducer,
    [bondDataAPI.reducerPath]: bondDataAPI.reducer,
    [vesselVoyageDataApi.reducerPath]: vesselVoyageDataApi.reducer,
    [chargesDataApi.reducerPath]: chargesDataApi.reducer,
    [exchangeRateDataApi.reducerPath]: exchangeRateDataApi.reducer,
    [jobEntry.reducerPath]: jobEntry.reducer,
    [containerAPI.reducerPath]: containerAPI.reducer,

    // slice
    userManagement: userManagementReducer,
    auth: authReducer,
    packingList: packingListReducer,
    shipper: shipperReducer,
    consignee: consigneeReducer,
    serviceInvoice: serviceInvoiceReducer,
    expenseCode: expenseCodeReducer,
    destination: destinationReducer,
    vendor: vendorReducer,
    icd: icdReducer,
    sprblDetails: sprblDetailsReducer,
    poOrderList: PoOrderListSlice,
    dsoOrderList: DsoOrderListSlice,
    dashboard: dashboardSlice,
    newRegisteredUser: newRegisteredUserReducer,
    settings: settingsSlice,
    otmBolList: otmBolListSlice,
    dashboard: dashboardSlice,
    codeCustomer: codeCustomerReducer,
    vesselStore: vesselReducer,
    codeParty: codePartyReducer,
    codeAgent: codeAgentReducer,
    port: portReducer,
    bond: bondReducer,
    vesselVoyageStore: vesselVoyagaReducer,
    chargesStore: chargesReducer,
    exchangeRateStore: exchangeRateReducer,
    jobEntries: jonEntryReducer,
    containers: containerReducer,
    vehicle: vehicleReducer,
    looseCargo: looseCargoReducer,
    payableAction: payableReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userDataApi.middleware,
      packingListDataApi.middleware,
      serviceInvoiceDataApi.middleware,
      expenseCodeDataApi.middleware,
      destinationDataApi.middleware,
      vendorDataApi.middleware,
      shipperDataApi.middleware,
      consigneeDataApi.middleware,
      auditDataApi.middleware,
      dashboardDataApi.middleware,
      settingsApi.middleware,
      otmBolDataApi.middleware,
      codeDataApi.middleware,
      vesselDataApi.middleware,
      portDataAPI.middleware,
      icdDataApi.middleware,
      bondDataAPI.middleware,
      vesselVoyageDataApi.middleware,
      chargesDataApi.middleware,
      exchangeRateDataApi.middleware,
      jobEntry.middleware,
      containerAPI.middleware
    ),
});

export default store;
