import { configureStore } from "@reduxjs/toolkit";
import { userDataApi } from "./api/userDataApi";
import { packingListDataApi } from "./api/packingListDataApi";
import { serviceInvoiceDataApi } from "./api/serviceInvoiceApi";
import { expenseCodeDataApi } from "./api/expenseCodeDataApi";
import { destinationDataApi } from "./api/destinationDataApi";
import { vendorDataApi } from "./api/vendorDataApi";
import { auditDataApi } from "./api/common";
import { dashboardDataApi } from "./api/dashbaordDataApi";
import { settingsApi } from "./api/settingsApi";
import { codeDataApi } from "./api/codeDataApi";
import { portDataAPI } from "./api/portDataApi";
import { bondDataAPI } from "./api/bondDataApi";
import userManagementReducer from "./freatures/userManagementSlice";
import authReducer from "./freatures/authSlice";
import packingListReducer from "./freatures/packingListSlice";
import serviceInvoiceReducer from "./freatures/serviceInvoiceSlice";
import expenseCodeReducer from "./freatures/expenseCodeSlice";
import destinationReducer from "./freatures/destinationSlice";
import vendorReducer from "./freatures/vendorSlice";
import sprblDetailsReducer from "./freatures/sprblDataSlice";
import PoOrderListSlice from "./freatures/PoOrderListSlice";
import DsoOrderListSlice from "./freatures/DsoOrderListSlice";
import dashboardSlice from "./freatures/dashboardSlice";
import newRegisteredUserReducer from "./freatures/newRegisteredUserSlice";
import settingsSlice from "./freatures/settingsSlice"
import { otmBolDataApi } from "./api/otmBolDataApi";
import otmBolListSlice from "./freatures/otmBolListSlice";
import codeCustomerReducer from "./freatures/CustomerSlice";
import vesselReducer from "./freatures/VesselSlice";
import codePartyReducer from "./freatures/PartySlice";
import codeAgentReducer from "./freatures/AgentSlice";
import portReducer from "./freatures/portSlice"
import bondReducer from "./freatures/bondSlice"
import { vesselDataApi } from "./api/vesselDataApi";
import { vesselVoyageDataApi } from "./api/vesselVoyageDataApi";
import vesselVoyagaReducer from "./freatures/VesselVoyageSlice";

const store = configureStore({
        reducer: {
                // api
                [userDataApi.reducerPath]: userDataApi.reducer,
                [packingListDataApi.reducerPath]: packingListDataApi.reducer,
                [serviceInvoiceDataApi.reducerPath]: serviceInvoiceDataApi.reducer,
                [expenseCodeDataApi.reducerPath]: expenseCodeDataApi.reducer,
                [destinationDataApi.reducerPath]: destinationDataApi.reducer,
                [vendorDataApi.reducerPath]: vendorDataApi.reducer,
                [auditDataApi.reducerPath]: auditDataApi.reducer,
                [dashboardDataApi.reducerPath]: dashboardDataApi.reducer,
                [settingsApi.reducerPath]: settingsApi.reducer,
                [otmBolDataApi.reducerPath]: otmBolDataApi.reducer,
                [codeDataApi.reducerPath]: codeDataApi.reducer,
                [vesselDataApi.reducerPath]: vesselDataApi.reducer,
                [portDataAPI.reducerPath]: portDataAPI.reducer,
                [bondDataAPI.reducerPath]: bondDataAPI.reducer,
                [vesselVoyageDataApi.reducerPath]: vesselVoyageDataApi.reducer,
                // slice
                userManagement: userManagementReducer,
                auth: authReducer,
                packingList: packingListReducer,
                serviceInvoice: serviceInvoiceReducer,
                expenseCode: expenseCodeReducer,
                destination: destinationReducer,
                vendor: vendorReducer,
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
        },
        middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(
                        userDataApi.middleware,
                        packingListDataApi.middleware,
                        serviceInvoiceDataApi.middleware,
                        expenseCodeDataApi.middleware,
                        destinationDataApi.middleware,
                        vendorDataApi.middleware,
                        auditDataApi.middleware,
                        dashboardDataApi.middleware,
                        settingsApi.middleware,
                        otmBolDataApi.middleware,
                        codeDataApi.middleware,
                        vesselDataApi.middleware,
                        portDataAPI.middleware,
                        bondDataAPI.middleware,
                        vesselVoyageDataApi.middleware,
                ),
});


export default store;